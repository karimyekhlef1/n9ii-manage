<template>
  <custom-page :loading="loading" :error="error" :onRefresh="refreshServices">
    <custom-header-table 
    title="complaints"
     :isSearch="true" 
  :isStatus="true" 
      v-model:search="searchText"
         
      v-model:SelectedStatus="SelectedStatus" 
      v-model:SelectedDate="SelectedStatus"
      :status-options="statusOptions"
        :status-colors="statusColors"

    />
    <custom-table  
    :items="filteredData"
    :form-fields="formFields"
    :headers="tableHeaders"

    />

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
const statusColors = ref({
  'Active': 'success',
  'Blocked': 'error',
  'Processing': 'warning'
})
const actionButtons = ref({
  view: true,
  edit: true,
  delete: false
})

const searchText = ref("")
const SelectedDate = ref("")
const SelectedStatus = ref("")
const statusOptions=[

  { text: 'Dismissed', value: 'Dismissed', color: 'red' },
  { text: 'Resolved', value: 'Resolved', color: 'green' },
  { text: 'Pending	', value: 'Pending', color: '#fbc531' }

]
const tableHeaders = ref([
  { title: 'ID', key: 'complaintId' },
  { title: 'Reporter Id', key: 'reporterId' },

  { title: 'reportedUserId', key: 'reportedUserId' },
  { title: 'reservation Id', key: 'reservationId' },
  { title: 'category', key: 'category' },
  { title: 'description', key: 'description' },
  { title: 'Status', key: 'complaintStatus' },
  { title: 'attachments', key: 'attachments' },
  
  { title: 'createdAt', key: 'createdAt' , sortable: true, align: 'center' },

  { title: 'resolvedAt', key: 'resolvedAt' , sortable: true, align: 'center' ,type:"date" },
  { title: 'actions', key: 'actions', sortable: false },
  
])
const filteredData = computed(() => {
  return complaints.value.filter((ele) => {

    const search = searchText.value.toLowerCase();
    const matchesSearch =
      !search ||
      ele.category.toLowerCase().includes(search) ||
      ele.description.toLowerCase().includes(search) 
  
    const matchesStatus = !SelectedStatus.value || ele.complaintStatus === SelectedStatus.value;
    return matchesSearch && matchesStatus
  });
});



</script>

<style scoped>
.services-page {

}
</style>