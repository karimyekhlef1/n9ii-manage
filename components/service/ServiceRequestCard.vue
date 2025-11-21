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
        <span class="text-h6">{{ request.requestName || 'Service Request' }}</span>
      </div>
      <v-chip 
        :color="getStatusColor(request.serviceRequestStatus)" 
        size="small"
        variant="flat"
      >
        {{ request.serviceRequestStatus }}
      </v-chip>
    </v-card-title>

    <v-divider />

    <!-- Content Section -->
    <v-card-text class="pa-4">
      <!-- Description -->
      <div class="mb-4">
        <div class="text-subtitle-2 text-grey-darken-1 mb-1">Description</div>
        <p class="text-body-2">{{ request.description || 'No description provided' }}</p>
      </div>

      <!-- Provider Information -->
      <div class="provider-section">
        <div class="text-subtitle-2 text-grey-darken-1 mb-2">Provider Details</div>
        <div class="d-flex align-center gap-3">
          <!-- Avatar -->
          <v-avatar size="48" color="grey-lighten-2">
            <v-img 
              v-if="request.provider?.profileImage?.imagePath"
              :src="request.provider.profileImage.imagePath"
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
                v-if="request.provider?.isIdentityVerified"
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
                @{{ request.provider?.userName || 'Unknown' }}
              </span>
              
              <!-- Rating -->
              <div v-if="request.provider?.averageRating" class="d-flex align-center gap-1">
                <v-icon color="amber" size="16">mdi-star</v-icon>
                <span class="text-caption">{{ request.provider.averageRating.toFixed(1) }}</span>
              </div>

              <!-- Contact -->
              <div v-if="request.provider?.phoneNumber" class="d-flex align-center gap-1">
                <v-icon color="grey-darken-1" size="16">mdi-phone</v-icon>
                <span class="text-caption">{{ request.provider.phoneNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <!-- Action Buttons -->
    <v-card-actions class="pa-4 d-flex gap-2">
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
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['accepted', 'refused', 'error'])

// API composables for accept and refuse
const { 
  fetch: fetchAccept, 
  data: dataAccept, 
  loading: loadingAccept, 
  error: errorAccept 
} = useApi()

const { 
  fetch: fetchRefuse, 
  data: dataRefuse, 
  loading: loadingRefuse, 
  error: errorRefuse 
} = useApi()

// Computed loading state
const isLoading = computed(() => loadingAccept.value || loadingRefuse.value)

const getProviderName = () => {
  const { provider } = props.request
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
      `/ServiceRequest/accept?id=${props.request.serviceRequestId}`,
      { method: 'POST' }
    )
    
    if (errorAccept.value) {
      throw new Error('Failed to accept request')
    }
    
    emit('accepted', props.request.serviceRequestId)
  } catch (error) {
    console.error('Error accepting request:', error)
    emit('error', { action: 'accept', error })
  }
}

const handleRefuse = async () => {
  try {
    await fetchRefuse(
      `/ServiceRequest/refuse?id=${props.request.serviceRequestId}`,
      { method: 'POST' }
    )
    
    if (errorRefuse.value) {
      throw new Error('Failed to refuse request')
    }
    
    emit('refused', props.request.serviceRequestId)
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