<template>
  <v-card 
    class="service-request-card mb-4" 
    elevation="2"
    rounded="lg"
  >
    <!-- Header with Status Badge -->
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <div class="d-flex align-center gap-2">
        <v-icon color="primary" size="24">mdi-file-document-outline</v-icon>
        <span class="text-h6">{{ localRequest.requestName || 'Service Request' }}</span>
      </div>
      <v-chip 
        :color="getStatusColor(localRequest.serviceRequestStatus)" 
        size="small"
        variant="flat"
      >
        {{ localRequest.serviceRequestStatus }}
      </v-chip>
    </v-card-title>

    <v-divider />

    <!-- Content Section -->
    <v-card-text class="pa-4">
      <!-- Description -->
      <div class="mb-4">
        <div class="text-subtitle-2 text-grey-darken-1 mb-1">Description</div>
        <p class="text-body-2">{{ localRequest.description || 'No description provided' }}</p>
      </div>

      <!-- Provider Information -->
      <div class="provider-section">
        <div class="text-subtitle-2 text-grey-darken-1 mb-2">Provider Details</div>
        <div class="d-flex align-center gap-3">
          <!-- Avatar -->
          <v-avatar size="48" color="grey-lighten-2">
            <v-img 
              v-if="localRequest.provider?.profileImage?.imagePath"
              :src="localRequest.provider.profileImage.imagePath"
              :alt="getProviderName()"
              cover
            />
            <v-icon v-else color="grey-darken-1">mdi-account</v-icon>
          </v-avatar>

          <!-- Provider Info -->
          <div class="flex-grow-1">
            <div class="d-flex align-center gap-2">
              <span class="text-subtitle-1 font-weight-medium">
                {{ getProviderName() }}
              </span>
              <v-icon 
                v-if="localRequest.provider?.isIdentityVerified"
                color="primary"
                size="18"
                title="Verified Provider"
              >
                mdi-check-decagram
              </v-icon>
            </div>
            
            <div class="d-flex align-center gap-3 mt-1">
              <!-- Username -->
              <span class="text-caption text-grey-darken-1">
                @{{ localRequest.provider?.userName || 'Unknown' }}
              </span>
              
              <!-- Rating -->
              <div v-if="localRequest.provider?.averageRating" class="d-flex align-center gap-1">
                <v-icon color="amber" size="16">mdi-star</v-icon>
                <span class="text-caption">{{ localRequest.provider.averageRating.toFixed(1) }}</span>
              </div>

              <!-- Contact -->
              <div v-if="localRequest.provider?.phoneNumber" class="d-flex align-center gap-1">
                <v-icon color="grey-darken-1" size="16">mdi-phone</v-icon>
                <span class="text-caption">{{ localRequest.provider.phoneNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <!-- Action Buttons - Only show for Pending status -->
    <v-card-actions 
      v-if="localRequest.serviceRequestStatus === 'Pending'" 
      class="pa-4 d-flex gap-2"
    >
      <v-btn
        color="success"
        variant="flat"
        prepend-icon="mdi-check-circle"
        rounded="lg"
        class="flex-grow-1"
        :loading="loadingAccept"
        :disabled="isLoading"
        @click="handleAccept"
      >
        Accept Request
      </v-btn>
      
      <v-btn
        color="error"
        variant="outlined"
        prepend-icon="mdi-close-circle"
        rounded="lg"
        class="flex-grow-1"
        :loading="loadingRefuse"
        :disabled="isLoading"
        @click="handleRefuse"
      >
        Refuse Request
      </v-btn>
    </v-card-actions>

    <!-- Status Message for Accepted/Refused -->
    <v-card-actions 
      v-else-if="localRequest.serviceRequestStatus === 'Accepted'" 
      class="pa-4"
    >
      <v-alert
        type="success"
        variant="tonal"
        class="w-100"
        density="compact"
        icon="mdi-check-circle"
      >
        This request has been accepted
      </v-alert>
    </v-card-actions>

    <v-card-actions 
      v-else-if="localRequest.serviceRequestStatus === 'Refused'" 
      class="pa-4"
    >
      <v-alert
        type="error"
        variant="tonal"
        class="w-100"
        density="compact"
        icon="mdi-close-circle"
      >
        This request has been refused
      </v-alert>
    </v-card-actions>

    <!-- Completed Status -->
    <v-card-actions 
      v-else-if="localRequest.serviceRequestStatus === 'Completed'" 
      class="pa-4"
    >
      <v-alert
        type="info"
        variant="tonal"
        class="w-100"
        density="compact"
        icon="mdi-checkbox-marked-circle"
      >
        This request has been completed
      </v-alert>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['accepted', 'refused', 'error'])

// Local state for the request
const localRequest = ref({ ...props.request })

// Watch for external changes to props
watch(() => props.request, (newRequest) => {
  localRequest.value = { ...newRequest }
}, { deep: true })

// API composables for accept and refuse
const { 
  patch: fetchAccept, 
  data: dataAccept, 
  loading: loadingAccept, 
  error: errorAccept 
} = useApi()

const { 
  patch: fetchRefuse, 
  data: dataRefuse, 
  loading: loadingRefuse, 
  error: errorRefuse 
} = useApi()

// Computed loading state
const isLoading = computed(() => loadingAccept.value || loadingRefuse.value)

const getProviderName = () => {
  const { provider } = localRequest.value
  if (!provider) return 'Unknown Provider'
  
  const firstName = provider.firstName || ''
  const lastName = provider.lastName || ''
  return `${firstName} ${lastName}`.trim() || provider.userName || 'Unknown'
}

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Accepted': 'success',
    'Refused': 'error',
    'Completed': 'info'
  }
  return colors[status] || 'grey'
}

const handleAccept = async () => {
  try {
    await fetchAccept(
      `/ServiceRequest/accept?id=${localRequest.value.serviceRequestId}`,
      { method: 'POST' }
    )
    
    if (errorAccept.value) {
      throw new Error('Failed to accept request')
    }
    
    // Update local state immediately
    localRequest.value.serviceRequestStatus = 'Accepted'
    
    emit('accepted', localRequest.value.serviceRequestId)
  } catch (error) {
    console.error('Error accepting request:', error)
    emit('error', { action: 'accept', error })
  }
}

const handleRefuse = async () => {
  try {
    await fetchRefuse(
      `/ServiceRequest/refuse?id=${localRequest.value.serviceRequestId}`,
      { method: 'POST' }
    )
    
    if (errorRefuse.value) {
      throw new Error('Failed to refuse request')
    }
    
    // Update local state immediately
    localRequest.value.serviceRequestStatus = 'Refused'
    
    emit('refused', localRequest.value.serviceRequestId)
  } catch (error) {
    console.error('Error refusing request:', error)
    emit('error', { action: 'refuse', error })
  }
}
</script>

<style scoped>
.service-request-card {
  transition: all 0.3s ease;
}

.service-request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.provider-section {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 12px;
  border-radius: 8px;
}
</style>