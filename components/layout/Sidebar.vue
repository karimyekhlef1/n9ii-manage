<template>
  <div class="sidebar">
    <!-- Toolbar with User Info -->
    <v-toolbar
      color="primary"
      class="flex-shrink-0"
      dark
      elevation="1"
    >    <v-toolbar-title class="">NJIIK</v-toolbar-title>
     
      
      <v-spacer></v-spacer>
     
      <div class="user-info">
        
        <v-chip
          v-if="user?.role"
          size="x-small"
          variant="outlined"
          class="ml-2"
        >
          {{ user?.userName }}
        </v-chip>
      </div>
    </v-toolbar>

    <!-- Navigation List -->
    <v-list
      density="compact"
      nav
    >
      <v-divider class="my-2"></v-divider>
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        value="home"
        to="/"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Services"
        value="services"
        to="/services"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-wrench"
        title="Clients"
        value="customers"
        to="/customers"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Providers"
        value="providers"
        to="/providers"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
        <v-list-item
        prepend-icon="mdi-message-alert"
        title="complaints"
        value="complaints"
        to="/complaints"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>

    </v-list>

    <!-- Bottom Navigation List for Settings and Logout -->
    <v-list
      density="compact"
      nav
      class="mt-auto" 
    >
      <v-divider class="my-2"></v-divider>
      
      <!-- User Info Section -->
      <v-list-item
        v-if="user"
        class="user-profile mx-2 mb-2"
        :subtitle="`ID: ${user.userId}`"
      >
        <template v-slot:prepend>
          <v-avatar
            color="primary"
            size="32"
          >
            <span class="text-white">{{ user.userName?.charAt(0)?.toUpperCase() }}</span>
          </v-avatar>
        </template>

        <v-list-item-title class="text-body-2">{{ user.userName }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption">{{ user.role }}</v-list-item-subtitle>
      </v-list-item>
      
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        value="settings"
        to="/settings"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        value="logout"
        @click="handleLogout"
        active-class="bg-primary/10 text-primary"
        class="rounded-md mx-2"
      ></v-list-item>
    </v-list>
    
    <custom-confirmation-dialog
      v-model="openDialog"
      title="Confirm Logout"
      message="Are you sure you want to log out of your account?"
      confirm-text="Logout"
      cancel-text="Cancel"
      confirm-color="error"
      @confirm="logout"
    />
  </div>
</template>

<script setup lang="ts">
const { logout, isAuthenticated } = useAuth()
const openDialog = ref(false)
const user = ref()

const handleLogout = () => {
  openDialog.value = true
}

// Function to check if token is expired
const isTokenExpired = (exp: number) => {
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime > exp
}

onMounted(() => {
  try {
    const authUser = useCookie('auth-user').value
    
    if (authUser) {
      user.value = authUser
    }
 
   
  } catch (error) {
    console.error('Error reading user cookie:', error)
  }
})

watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    user.value = null
  }
})
</script>

<style scoped>
.sidebar {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 250px;
  border-right: 1px solid #e0e0e0; 
}

.v-list-item {
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.user-profile {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 8px;
}

.user-profile:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>