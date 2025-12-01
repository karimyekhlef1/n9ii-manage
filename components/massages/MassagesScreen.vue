<template>
  <v-card class="chat-container">
    <v-alert
      v-if="messagesError"
      type="error"
      class="ma-4"
      closable
    >
      <div class="d-flex align-center justify-space-between">
        <span>Failed to load messages</span>
        <v-btn
          color="white"
          variant="text"
          @click="getMessages"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Messages Container -->
    <v-card-text
      ref="messageContainer"
      class="messages-scroll"
    >
      <!-- Loading State -->
      <div v-if="messagesLoading && localMessages.length === 0" class="text-center mt-10">
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
        <p class="text-grey mt-4">Loading messages...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedMessages.length === 0" class="text-center mt-10">
        <v-icon size="80" color="grey-lighten-2">
          mdi-message-outline
        </v-icon>
        <p class="text-grey mt-4">No messages yet. Start the conversation!</p>
      </div>

      <!-- Messages List -->
      <div v-else class="messages-list">
        <div
          v-for="message in sortedMessages"
          :key="message.messageId"
          :class="[
            'message-bubble',
            isMyMessage(message) ? 'my-message' : 'other-message'
          ]"
        >
          <!-- Sender Name (only for other user's messages) -->
          <div
            v-if="!isMyMessage(message)"
            class="sender-name text-caption text-grey-darken-1 mb-1"
          >
            {{ getMessageSenderName(message) }}
          </div>

          <!-- Message Content -->
          <div
            :class="[
              'message-content',
              isMyMessage(message) ? 'my-message-content' : 'other-message-content'
            ]"
          >
            <p class="message-text mb-1">{{ message.content }}</p>

            <!-- Message Footer -->
            <div class="message-footer d-flex align-center justify-end">
              <span
                :class="[
                  'timestamp text-caption',
                  isMyMessage(message) ? 'text-white' : 'text-grey'
                ]"
              >
                {{ formatTime(message.timeStamp) }}
              </span>

              <!-- Read Status (only for my messages) -->
              <span
                v-if="isMyMessage(message)"
                class="read-status ml-2"
              >
                {{ message.isRead ? '✓✓' : '✓' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <!-- Message Input - Fixed at Bottom -->
    <v-card-actions class="input-container">
      <v-textarea
        v-model="content"
        placeholder="Type your message..."
        variant="outlined"
        density="comfortable"
        rows="1"
        auto-grow
        max-rows="4"
        hide-details
        :disabled="sendLoading"
        @keydown.enter.exact.prevent="handleSend"
        class="flex-grow-1 mr-2"
      />

      <v-btn
        icon
        color="primary"
        size="large"
        :disabled="!content.trim() || sendLoading"
        :loading="sendLoading"
        @click="handleSend"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// Define interfaces
interface User {
  userId: number;
  userName: string;
  email: string;
  emailConfirmed: boolean | null;
  passwordConfirmed: boolean | null;
  userRole: 'Client' | 'Provider';
  accountStatus: 'Active' | 'Inactive';
}

interface Message {
  messageId: number;
  senderId: number;
  sender: User;
  recieverId: number;
  receiver: User;
  content: string;
  timeStamp: string;
  isRead: boolean;
}

interface Props {
  receiverId: string | number;
  senderId: string | number;
}

const props = defineProps<Props>();

// Refs
const content = ref('');
const localMessages = ref<Message[]>([]);
const messageContainer = ref<HTMLElement | null>(null);
const messagesError = ref(false);
const messagesLoading = ref(false);
const sendLoading = ref(false);

// Convert props to numbers
const currentUserId = computed(() => Number(props.senderId));
const otherUserId = computed(() => Number(props.receiverId));

// Fetch messages function (replace with your API)
const getMessages = async () => {
  try {
    messagesLoading.value = true;
    messagesError.value = false;

    const { fetch } = useApi();
    const response = await fetch('/Message/otherUserId', {
      params: { otherUserId: props.receiverId }
    });
    console.log(response);

    localMessages.value = response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    messagesError.value = true;
  } finally {
    messagesLoading.value = false;
  }
};

// Send message function
const sendMessage = async (messageContent: string) => {
  try {
    sendLoading.value = true;

    const { post } = useApi();
    await post('/Message', { content: messageContent }, {
      method: 'POST',
      params: { receiverId: props.receiverId },
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Optimistically add message
    const optimisticMessage: Message = {
      messageId: Date.now(),
      senderId: currentUserId.value,
      sender: {
        userId: currentUserId.value,
        userName: 'You',
        email: '',
        emailConfirmed: null,
        passwordConfirmed: null,
        userRole: 'Client',
        accountStatus: 'Active'
      },
      recieverId: otherUserId.value,
      receiver: {
        userId: otherUserId.value,
        userName: '',
        email: '',
        emailConfirmed: null,
        passwordConfirmed: null,
        userRole: 'Provider',
        accountStatus: 'Active'
      },
      content: messageContent,
      timeStamp: new Date().toISOString(),
      isRead: false
    };

    localMessages.value.push(optimisticMessage);
    
    setTimeout(() => getMessages(), 500);
  } catch (error) {
    console.error('Send message error:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    sendLoading.value = false;
  }
};

// Handle send
const handleSend = async () => {
  if (!content.value.trim() || sendLoading.value) return;

  const messageToSend = content.value.trim();
  content.value = '';

  await sendMessage(messageToSend);
};

// Sorted messages
const sortedMessages = computed(() => {
  return [...localMessages.value].sort((a, b) =>
    new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
  );
});

// Check if message is from current user
const isMyMessage = (message: Message): boolean => {
  return message.senderId !== otherUserId.value;
};

// Get message sender name
const getMessageSenderName = (message: Message): string => {
  if (message.senderId === currentUserId.value) {
    return 'You';
  }
  return message.sender.userName || 'Other User';
};

// Format timestamp
const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// Watch for new messages and scroll
watch(() => localMessages.value.length, () => {
  scrollToBottom();
});

// Initial load
onMounted(() => {
  getMessages();
});
</script>

<style scoped>
/* Make the chat container take full height */
.chat-container {
  height: 96vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Messages scroll area - takes remaining space */
.messages-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f7f7f7;
  padding: 16px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.my-message {
  align-self: flex-end;
  margin-left: 25%;
}

.other-message {
  align-self: flex-start;
  margin-right: 25%;
}

.message-content {
  padding: 12px 16px;
  border-radius: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.my-message-content {
  background-color: #007AFF;
  color: white;
  border-bottom-right-radius: 4px;
}

.other-message-content {
  background-color: white;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  word-wrap: break-word;
}

.message-footer {
  gap: 8px;
}

.timestamp {
  font-size: 11px;
}

.my-message-content .timestamp {
  color: rgba(255, 255, 255, 0.8);
}

.read-status {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.sender-name {
  font-weight: 600;
  margin-left: 4px;
}

/* Input container - fixed at bottom */
.input-container {
  flex-shrink: 0;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: white !important;
}
</style>