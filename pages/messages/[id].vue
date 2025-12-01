<template>

  
    <massages-screen v-if="senderId" :receiver-id="senderId" sender-id="1" :receiverData="reciverData"/>
          <v-row v-else justify="center" class="mt-10">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="grey-lighten-1">
            mdi-message-outline
          </v-icon>
          <p class="text-h6 text-grey mt-4">No messages yet</p>
        </v-col>
      </v-row>

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
const reciverData=ref<any>(null)
const error = ref<Error | null>(null);
const {fetch}=useApi()
const route = useRoute()

// Fetch messages
const fetchMessages = async () => {
  try {
    loading.value = true;
    const response = await fetch('/Message/messaged_users');
    data.value = response;
  } catch (err) {
    error.value = err as Error;
    console.error('Error fetching messages:', err);
  } finally {
    loading.value = false;
  }
};

const handleBackPress = () => {
  router.push('/message');
};

onMounted(() => {
const item = JSON.parse(route.query.data || '{}');
reciverData.value =  item
console.log("````````````",reciverData.value)
  senderId.value=route.params.id
  fetchMessages();
  
  // Handle back button for mobile
  window.addEventListener('popstate', handleBackPress);
});
</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>