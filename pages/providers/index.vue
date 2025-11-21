<template>
    <custom-page  :loading="loading" :error="error" >
  <CustomHeaderTable 
  :isSearch="true" 
  :isStatus="true" 
  :isDate="true"
   title="Provider Page"
    v-model:search="searchText"
      v-model:SelectedStatus="SelectedStatus" 
      v-model:SelectedDate="SelectedStatus"
      :status-options="statusOptions"
       />
        {{ SelectedStatus }}
        <custom-table 

        :items="filteredData"
        :headers="tableHeaders"
        :status-colors="statusColors"
        :form-fields="formFields"
        :details-fields="detailsFields"
        :show-actions="actionButtons"
        @save-item="handleSave"



      
         />
    </custom-page>

</template>

<script setup>
import { ServiceCard } from "#components";
import { ref, onMounted } from "vue";
const { fetch, data: ProvidersData, loading, error } = useApi();
const { fetch:services, data: servicesData, loading:servicesLoading, error:servicesError } = useApi();
const { patch:update, data: provicerUpdated, loading:UpdatedLoading, error:UpdatedError } = useApi();


const { patch:changeStauts,  loading:loadingChangeStauts, } = useApi();

const AllProviders = ref([]);
const AllServices = ref([]);

const searchText = ref("")
const SelectedDate = ref("")
const SelectedStatus = ref("")
const statusOptions=[

  { text: 'Blocked', value: 'Blocked', color: 'red' },
  { text: 'Active', value: 'Active', color: 'green' },
  { text: 'Processing	', value: 'Processing', color: '#fbc531' }

]
const formFields = computed(() => [
  {
    label: "Status",
    name: "accountStatus",
    key: "accountStatus",
    type: "select",
    required: true,
    options: ["Active", "Blocked", "Processing"],
    cols: "6",
  },
  {
    label: "Service",
    name: "serviceId",
    key: "serviceId",
    type: "select",
    required: true,
    cols: "6",
    options: [0,...AllServices.value.map(service =>  service.serviceId)]
  }
]);


onMounted(async () => {
  await fetch("/Provider/providers");
  AllProviders.value = ProvidersData.value?.data || [];
  await services("/Service");
  AllServices.value = servicesData.value?.data || [];
});

const filteredData = computed(() => {
  return AllProviders.value.filter((ele) => {

    const search = searchText.value.toLowerCase();
    const matchesSearch =
      !search ||
      ele.userName.toLowerCase().includes(search) ||
      ele.lastName.toLowerCase().includes(search) ||
      ele.firstName.toLowerCase().includes(search) ||
      ele.userId.toString().includes(search);
    const matchesStatus = !SelectedStatus.value || ele.accountStatus === SelectedStatus.value;
    return matchesSearch && matchesStatus
  });
});

const tableHeaders = ref([
    { title: 'image', key: 'profileImage'  },

  { title: 'ID', key: 'userId' },
  { title: 'Service Id', key: 'serviceId' },

  { title: 'Username', key: 'userName' },
  { title: 'First Name', key: 'firstName' },
  { title: 'Last Name', key: 'lastName' },
  { title: 'Birth Date', key: 'birthDate' },
  { title: 'Sex', key: 'sex' },

  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phoneNumber' },

  // { title: 'Service Description', key: 'serviceDescription' },
  // { title: 'Location (City)', key: 'location.ville' },
  // { title: 'Location (Wilaya)', key: 'location.wilaya' },
  { title : 'createdAt',key: 'createdAt', label: 'Created Date', icon: 'mdi-calendar', type: 'date', section: 'additional' },

  { title: 'Rating', key: 'averageRating' , sortable: true, align: 'center' },

  //   { title: 'Created At', key: 'createdAt', sortable: true },

 
              

  { title: 'ID Document', key: 'identityPiece', sortable: false },
  { title: 'Selfie', key: 'selfieImage', sortable: false },
  { title: 'Status', key: 'accountStatus' , sortable: true, align: 'center' },

    { title: 'actions', key: 'actions', sortable: false },
  
])

const detailsFields=[
      { key: 'firstName', label: 'First Name', icon: 'mdi-account', type: 'text', section: 'basic' },
      { key: 'lastName', label: 'Last Name', icon: 'mdi-account', type: 'text', section: 'basic' },
      { key: 'userName', label: 'Username', icon: 'mdi-at', type: 'text', section: 'basic' },
      { key: 'email', label: 'Email', icon: 'mdi-email', type: 'email', section: 'contact' },
      { key: 'phoneNumber', label: 'Phone', icon: 'mdi-phone', type: 'phone', section: 'contact' },
      // { key: 'address', label: 'Address', icon: 'mdi-map-marker', type: 'text', section: 'contact' },
      // { key: 'company', label: 'Company', icon: 'mdi-domain', type: 'text', section: 'basic' },
      { key: 'createdAt', label: 'Created Date', icon: 'mdi-calendar', type: 'date', section: 'additional' }
]
const statusColors = ref({
  'Active': 'success',
  'Blocked': 'error',
  'Processing': 'warning'
})
const actionButtons = ref({
  view: true,
  edit: true,
  delete: true
})

const handleSave=async(data)=>{
await update(`/Provider/${data.item.userId}`,data.item)
  if (data.item.accountStatus==="Blocked"){
    changeStauts(`/User/${data.item.userId}/block`)

  }
  if(data.item.accountStatus=== "Active"){
    changeStauts(`/User/${data.item.userId}/activate`)

  }




}
</script>

<style scoped>
h1 {
    color: #333;
}

p {
    font-size: 16px;
}
</style>