<template>
  <custom-page :loading="loading" :error="error" :onRefresh="refreshServices">
    <div class="services-page">
      <div class="services-header">
        <div class="services-title">
          <h1>Services</h1>
          <div class="services-count">{{ services.length }} services found</div>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            variant="elevated"
            class="action-btn new-service-btn"
            prepend-icon="mdi-plus"
            rounded="lg"
            elevation="2"
            @click="handelingService('create')"
          >
            New Service
          </v-btn>
          <v-badge
            :content="servicesRequest.length"
            color="error"
            overlap
            :model-value="servicesRequest.length > 0"
            class="requests-badge"
          >
            <v-btn
              color="secondary"
              variant="elevated"
              class="action-btn requests-btn"
              prepend-icon="mdi-bell-outline"
              rounded="lg"
              elevation="2"
              @click="handelingService('requests')"
            >
              Service Requests
            </v-btn>
          </v-badge>
        </div>
      </div>
      <div class="service-header">
        <v-text-field 
         prepend-inner-icon="mdi-magnify"
          class="modern-input" 
           clearable 
           v-model="searchText"
           
        
        />

 

      </div>

      <ServiceForm
        v-if="openServiceDialog"
        v-model="openServiceDialog"
        :actionType="formType"
        :initialData="selectedService"
        :setService="setService"
        @on-action="setService"
      />

      <!-- Service Requests Dialog -->
 <v-dialog
    v-model="openServiceRequestDialog"
    max-width="900px"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4 bg-primary">
        <div class="d-flex align-center gap-2">
          <v-icon color="white">mdi-clipboard-list-outline</v-icon>
          <span class="text-white">Service Requests</span>
          <v-chip 
            v-if="servicesRequest.length > 0"
            color="white"
            size="small"
            variant="flat"
          >
            {{ servicesRequest.length }}
          </v-chip>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          size="small"
          @click="openServiceRequestDialog = false"
        />
      </v-card-title>

      <v-card-text class="pa-4" style="max-height: 70vh;">
        <!-- Empty State -->
        <div 
          v-if="servicesRequest.length === 0" 
          class="text-center py-12"
        >
          <v-icon size="80" color="grey-lighten-1">
            mdi-inbox-outline
          </v-icon>
          <p class="text-h6 text-grey mt-4">No service requests found</p>
          <p class="text-body-2 text-grey-darken-1">
            New requests will appear here
          </p>
        </div>

        <!-- Service Request Cards -->
        <div v-else>
          <ServiceRequestCard
            v-for="request in servicesRequest"
            :key="request.serviceRequestId"
            :request="request"
            :monster-url="monsterUrl"
            @accepted="handleAccepted"
            @refused="handleRefused"
            @error="handleError"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          prepend-icon="mdi-close"
          @click="openServiceRequestDialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

      <v-card class="services-container" variant="flat" v-if="services.length">
        <v-list class="services-list">
          <service-card
            v-for="service in filteredServices"
            :key="service.serviceId"
            :service="service"
            @action="handelingService"
            @on-action="setService"
          />
        </v-list>
      </v-card>

    </div>
  </custom-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { fetch, data: servicesData, loading, error } = useApi();
const { fetch: fetchServiceRequest, data: ServiceRequestData, loading: ServiceRequestLoading, error: ServiceRequestError } = useApi();
import ServiceForm from "../../components/service/ServiceForm.vue";

const services = ref([]);
const servicesRequest = ref([]);
const selectedService = ref(null);
const openServiceDialog = ref(false);
const openServiceRequestDialog = ref(false);
const formType = ref("create");
const searchText= ref('')  

onMounted(async () => {
  await fetch("/Service");
  services.value = servicesData.value?.data || [];

  await fetchServiceRequest("/ServiceRequest");
  servicesRequest.value = ServiceRequestData.value?.data || [];
});

const refreshServices = async () => {
  await fetch("/Service");
  services.value = servicesData.value?.data || [];
};
const  filteredServices = computed(() => {
  return services.value.filter((ele) => {

  const search = (searchText.value || "").toLowerCase();
    const matchesSearch =
      !search ||
      ele.nameEn.toLowerCase().includes(search) ||
      ele.nameFr.toLowerCase().includes(search) ||
      ele.nameAr.toLowerCase().includes(search) 

    return matchesSearch 
  });
});

const refreshServiceRequests = async () => {
  await fetchServiceRequest("/ServiceRequest");
  servicesRequest.value = ServiceRequestData.value?.data || [];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const handelingService = (type, service) => {
  if (type === "create" && !service) {
    formType.value = "create";
    selectedService.value = null;
    openServiceDialog.value = true; 
  }
  else if (type === "edit") {
    selectedService.value = service;
    formType.value = "edit";
    openServiceDialog.value = true;
  }
  else if (type === "requests") {
    openServiceRequestDialog.value = true;
  }
};

const setService = (service, type) => {
  if (type === 'create') {
    services.value.push(service);
  } 
  else if (type === 'edit') {
    const index = services.value.findIndex(s => s.serviceId === service.serviceId);
    if (index !== -1) {
      services.value[index] = { ...service };
    }
  } 
  else if (type === 'remove') {
    services.value = services.value.filter(s => s.serviceId !== service.serviceId);
  }
};
</script>

<style scoped>
.services-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.services-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  padding: 0 24px;
  height: 44px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.new-service-btn {
  /* background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); */
}

.requests-btn {
  /* background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%); */
}

.requests-badge .v-badge__badge {
  font-weight: 700;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Dialog Styles */
.requests-dialog .v-overlay__content {
  margin: 24px;
}

.requests-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.requests-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
  border-bottom: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  background: rgba(25, 118, 210, 0.1);
  padding: 12px;
  border-radius: 50%;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.close-btn {
  color: #666 !important;
}

.requests-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.empty-requests {
  text-align: center;
  padding: 48px 24px;
}

.empty-requests h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.empty-requests p {
  color: #666;
  font-size: 16px;
}

.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

.request-card {
  border-radius: 16px !important;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.request-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
}

.request-content {
  padding: 20px;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.request-id {
  font-family: 'Roboto Mono', monospace;
  font-weight: 600;
}

.status-chip {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
}

.request-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.request-description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.request-actions {
  padding: 16px 20px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.dialog-actions {
  padding: 20px 24px;
  background-color: #fafafa;
}

.close-dialog-btn {
  font-weight: 600;
  text-transform: none;
  padding: 0 32px;
}

.services-title h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.services-count {
  margin-top: 6px;
  font-size: 14px;
  color: #666;
}



.services-container {
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.empty-state {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  padding: 48px 24px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.empty-content h3 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin: 16px 0 8px;
}

.empty-content p {
  font-size: 16px;
  color: #666;
  margin: 0;
}
.item-Request {
  border: 1.5px solid #e0e0e0; /* Softer border color for a modern look */
  border-radius: 12px !important; /* Slightly larger radius for smoother corners */
  padding: 16px; /* Increased padding for better spacing */
  margin-bottom: 12px; /* Space between list items */
  background-color: #ffffff; /* Explicit white background for consistency */
  transition: all 0.2s ease; /* Smooth hover and focus transitions */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
}

/* Hover and focus states for interactivity */
.item-Request:hover,
.item-Request:focus-within {
  transform: translateY(-2px); /* Subtle lift effect */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
  border-color: #1976d2; /* Accent border color on hover */
}

/* List item content styling */
.item-Request .v-list-item-title {
  font-size: 16px; /* Slightly smaller for better hierarchy */
  font-weight: 600; /* Bold for emphasis */
  color: #1a1a1a; /* Darker text for contrast */
  margin-bottom: 8px; /* Space below title */
}

.item-Request .v-list-item-subtitle {
  font-size: 14px; /* Smaller subtitle for clarity */
  color: #555; /* Softer gray for secondary text */
  line-height: 1.5; /* Improved readability */
  margin-bottom: 4px; /* Consistent spacing */
}

/* Button styling within item-Request */
.item-Request .v-btn {
  text-transform: none; /* Avoid uppercase for a modern look */
  font-weight: 500; /* Medium weight for balance */
  padding: 6px 16px; /* Compact padding */
  border-radius: 8px; /* Consistent with item border */
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); /* Primary gradient */
  color: #ffffff; /* White text for contrast */
  transition: background 0.3s ease; /* Smooth button transition */
}

.item-Request .v-btn:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%); /* Darker gradient on hover */
}
@media (max-width: 768px) {
  .services-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    min-width: 0;
  }

  .services-page {
    padding: 16px;
  }

  .requests-grid {
    grid-template-columns: 1fr;
  }

  .requests-dialog .v-overlay__content {
    margin: 12px;
  }

  .requests-content {
    max-height: 50vh;
  }

}
</style>