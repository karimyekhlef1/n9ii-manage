<template>
  <custom-page :loading="loading">

    <CustomHeaderTable :isSearch="true" :isStatus="true" :isDate="true" title="Clients Page" v-model:search="searchText"
      v-model:SelectedStatus="SelectedStatus"
      :status-options="statusOptions"
       v-model:SelectedDate="SelectedStatus" />



    <CustomTable 
    :items="filteredData" 
    :headers="tableHeaders" 
    :status-colors="statusColors"
    :form-fields="formFields"
    :show-actions="actionButtons"
    @save-item="handleSave"

     />
  

  </custom-page>

</template>

<script setup>
const { fetch, data: Data, loading, error } = useApi();
const { patch:changeStauts,  loading:loadingChangeStauts, } = useApi();

const entityType = ref('client')
const searchText = ref("")
const SelectedDate = ref("")
const SelectedStatus = ref("")
const data = ref([])


const tableRef = ref(null)




onMounted(async () => {
  await fetch("/Client");
  data.value = Data.value?.data || [];

});

const filteredData = computed(() => {
  return data.value.filter((ele) => {

    const search = searchText.value.toLowerCase();
    const matchesSearch =
      !search ||
      ele.username.toLowerCase().includes(search) ||
      ele.userId.toString().includes(search);
    const matchesStatus = !SelectedStatus.value || ele.accountStatus === SelectedStatus.value;
    return matchesSearch && matchesStatus
  });
});


const tableHeaders = ref([
  { title: 'image', key: 'profileImage'  },

  { title: 'ID', key: 'userId' },

  { title: 'Username', key: 'username' },

  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phoneNumber' },
  { title: 'Birth Date', key: 'birthDate' },
  { title: 'Sex', key: 'sex' },

  { title : 'createdAt',key: 'createdAt', label: 'Created Date', icon: 'mdi-calendar', type: 'date', section: 'additional' },

  // { title: 'Service Description', key: 'serviceDescription' },
  // { title: 'Location (City)', key: 'location.ville' },
  // { title: 'Location (Wilaya)', key: 'location.wilaya' },
  { title: 'Status', key: 'accountStatus', sortable: true, align: 'center'},
    // { title: 'Created At', key: 'createdAt', sortable: true },
    { title: 'actions', key: 'actions', sortable: true },


])
const statusOptions=[

  { text: 'Blocked', value: 'Blocked', color: 'red' },
  { text: 'Active', value: 'Active', color: 'green' }
]
const formFields=[

  {label:"Status" ,name:"accountStatus", key:"accountStatus",type: "select" , required:true , options:["Active","Blocked"],cols:"12"}
]


// Color configurations
const statusColors = ref({
  'Active': 'success',
  'Blocked': 'error'
})







// Action buttons configuration
const actionButtons = ref({
  view: false,
  edit: true,
  delete: true
})

const handleSave=(data)=>{
 
  if (data.item.accountStatus==="Blocked"){
    changeStauts(`/User/${data.item.userId}/block`)

  }
  if(data.item.accountStatus=== "Active"){
    changeStauts(`/User/${data.item.userId}/activate`)

  }




}
// Dialog settings
const dialogSettings = ref({
  maxWidth: '700px',
  addTitle: `Add New ${entityType.value.charAt(0).toUpperCase() + entityType.value.slice(1)}`,
  editTitle: `Edit ${entityType.value.charAt(0).toUpperCase() + entityType.value.slice(1)}`,
  cancelText: 'Cancel',
  saveText: 'Save Changes'
})

const deleteDialogSettings = ref({
  maxWidth: '450px',
  title: 'Confirm Deletion',
  message: 'Are you sure you want to delete {name}? This action cannot be undone.',
  cancelText: 'Cancel',
  deleteText: 'Delete'
})

// Table configuration
const tableConfig = ref({
  noDataIcon: 'mdi-account-off',
  noDataTitle: `No ${entityType.value}s found`,
  noDataSubtitle: 'Try adjusting your search criteria or add a new entry'
})



// Switch between client and provider modes


</script>
