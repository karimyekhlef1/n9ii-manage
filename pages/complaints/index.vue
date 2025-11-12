<template>
  <custom-page :loading="loading" :error="error" :onRefresh="refreshServices">
    <custom-header-table title="complaints"/>
    <custom-table  
    :items="complaints"
    :form-fields="formFields"
        :headers="tableHeaders"

    />
    <!-- <div class="services-page">
      <div class="services-header">
        <div class="services-title">
          <h1>  complaints
</h1>
          <div class="services-count">{{ complaints.length }} services found</div>
        </div>
      </div>



 
      <v-card class="services-container" variant="flat" v-if="complaints.length">
        <v-list class="services-list">

          <ComplaintCard
                      v-for="complaint in complaints"

           :key="complaint.complaintId"
           :complaint="complaint" 
           />
    
        </v-list>
      </v-card>

    </div> -->
  </custom-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { fetch, data: Complaints, loading, error } = useApi();

const complaints = ref([]); 
onMounted(async () => {
  await fetch("/Complaint");
  complaints.value = Complaints.value?.data || [];


});

const refreshServices = async () => {
  await fetch("/Complaint");
  complaints.value = Complaints.value?.data || [];
};
const tableHeaders = ref([


  { title: 'ID', key: 'complaintId' },
  { title: 'Reporter Id', key: 'reporterId' },

  { title: 'reportedUserId', key: 'reportedUserId' },
  { title: 'reservation Id', key: 'reservationId' },
  { title: 'category', key: 'category' },
  { title: 'description', key: 'description' },
  { title: 'Status', key: 'complaintStatus' },
  { title: 'attachments', key: 'attachments' },
  // { title: 'Location (City)', key: 'location.ville' },
  // { title: 'Location (Wilaya)', key: 'location.wilaya' },
  { title: 'resolvedAt', key: 'resolvedAt' , sortable: true, align: 'center' },

  //   { title: 'Created At', key: 'createdAt', sortable: true },
 
    { title: 'actions', key: 'actions', sortable: false },
  
])




</script>

<style scoped>
.services-page {

}
</style>