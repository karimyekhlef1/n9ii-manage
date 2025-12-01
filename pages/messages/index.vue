<template>
  <template class="d-flex">
  <v-container fluid width="100%">
    <!-- Loading State -->
    <template v-if="loading">
      <v-card
        v-for="i in 6"
        :key="`skeleton-${i}`"
        class="mb-3"
        elevation="1"
      >
        <v-card-text class="d-flex align-center">
          <v-skeleton-loader
            type="avatar"
            class="mr-3"
          />
          <div class="flex-grow-1">
            <v-skeleton-loader type="heading" class="mb-2" />
            <v-skeleton-loader type="text" />
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Messages List -->
    <template v-else>
      <v-card
        v-for="item in data?.data"
        :key="item.userId"
        class="mb-3"
        elevation="1"
        hover
        @click="handleMessagePress(item)"
      >
        <v-card-text class="d-flex align-center pa-3">
          <!-- Avatar -->
          <v-avatar size="48" class="mr-3">
            <v-img
              :src="item.imagePath || 'https://karim-dev.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkarim.7b43a71d.jpg&w=640&q=95'"
              :alt="item.userName"
            />
          </v-avatar>

          <!-- Message Details -->
          <div class="flex-grow-1">
            <div class="d-flex justify-space-between align-center mb-1">
              <span class="text-h6 font-weight-medium text-truncate">
                {{ item.userName }}
              </span>
              <v-chip
                v-if="item.unreadCount > 0"
                color="error"
                size="small"
                class="ml-2"
              >
                {{ item.unreadCount }}
              </v-chip>
            </div>
            <div class="text-body-2 text-grey-darken-1">
              {{ item.phoneNumber }}
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Empty State -->
      <v-row v-if="!data?.data?.length" justify="center" class="mt-10">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="grey-lighten-1">
            mdi-message-outline
          </v-icon>
          <p class="text-h6 text-grey mt-4">No messages yet</p>
        </v-col>
      </v-row>
    </template>
  </v-container>

  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';


interface UserItem {
  userId: number;
  userName: string;
  email: string;
  unreadCount: number;
  phoneNumber: string;
  imagePath: string;
}

interface ApiResponse {
  data: UserItem[];
}

const router = useRouter();
const data = ref<ApiResponse | null>(null);
const loading = ref(true);
const senderId = ref<null | number>(null)
const error = ref<Error | null>(null);
const {fetch}=useApi()
// Fetch messages
const fetchMessages = async () => {
  try {
    loading.value = true;
    const response = await fetch('/Message/messaged_users');
console.log("response----",response.data)

    data.value = response;
  } catch (err) {
    error.value = err as Error;
    console.error('Error fetching messages:', err);
  } finally {
    loading.value = false;
  }
};

const handleMessagePress = (item: UserItem) => {
  router.push(`/messages/${item.userId}`)
  // senderId.value=item.userId

};

const handleBackPress = () => {
  router.push('/');
};

onMounted(() => {
  fetchMessages();
    window.addEventListener('popstate', handleBackPress);
});
watch(() => senderId, () => {
  fetchMessages();
});
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>