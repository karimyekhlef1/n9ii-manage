```vue
<template>
  <v-card
    class="mx-auto my-6 service-card"
    max-width="400"
    elevation="0"
    rounded="lg"
  >
  <v-img
  :width="300"
  :height="300"
  aspect-ratio="16/9"
  cover
  :src="service?.image?.imagePath"
></v-img>
  
    <!-- <div class="label-container">
      <v-chip
        size="x-small"
        class="service-label"
        :color="labelColor"
        variant="flat"
        :text="labelText"
      />
    </div> -->
    
    <v-card-title class="text-h6 font-weight-bold pb-2">
      {{ service.nameEn }}
    </v-card-title>
    <v-card-title class="text-h6 font-weight-bold pb-2">
      {{ service.nameFr }}
    </v-card-title>
        <v-card-title class="text-h6 font-weight-bold pb-2">
      {{ service.nameAr }}
    </v-card-title>
    
    <v-card-text class="pt-0">
      <!-- <div v-if="service.providers && service.providers.length > 0">
        <p class="text-subtitle-1 mb-3 providers-text">
          {{ service.providers.length }} {{ service.providers.length === 1 ? 'Provider' : 'Providers' }}
        </p>
      </div>
      <div v-else class="text-caption text-grey-lighten-1 mb-3">
        No providers available
      </div> -->
      
      <v-chip
        size="small"
        class="mt-2 chip-modern"
        :color="chipColor"
        variant="flat"
      >
        ID: {{ service.serviceId }}
      </v-chip>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
      prepend-icon="mdi-pencil-outline"
        color="primary"
        variant="flat"
        size="small"
        class="action-btn"
        @click="edit"
      >
        Update
      </v-btn>
      <v-btn
      prepend-icon="mdi-trash-can-outline"
        color="error"
        variant="outlined"
        size="small"
        class="action-btn"
        @click="remove"
      >
        Remove
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
  <custom-confirmation-dialog
      v-if="openDialogRemove"
      v-model="openDialogRemove"
      title="confirmation remove service "
      message="Are you sure you want to log out of your account?"
      confirm-text="Remove"
      cancel-text="Cancel"
      confirm-color="error"
      @confirm="removeService"
      :loading="loading"
      
      
    />
</template>

<script setup>
const openDialogRemove=ref(false)

const props = defineProps({
  service: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  setService: {
      type: Function,
      required: true
    },

})

const emit = defineEmits(['action','on-action'])

const remove=()=>{
emit('action', "remove", props.service)
openDialogRemove.value= true


}
const edit =()=>{
 emit('action', "edit", props.service)
}
const { showSuccess, showError } = useToast();
const { loading, error, delete:deleteService } = useApi();
 
const removeService=async()=>{
      try {
     const result = await deleteService(`/Service/${props.service.serviceId}`);
   console.log("result",result)
     if (result) {
      showSuccess("remove successfully")
      openDialogRemove.value= false
      emit('on-action',props.service,'remove');


    }
  } catch (err) {
    showError(err);
  }


  }


const chipColor = computed(() => {
  return props.service.providers?.length > 0 ? 'primary' : 'grey-lighten-2'
})

// Compute label text and color based on service status or type
const labelText = computed(() => {
  if (!props.service.providers || props.service.providers.length === 0) {
    return 'Inactive'
  }
  return props.service.isPremium ? 'Premium' : 'Active'
})

const labelColor = computed(() => {
  if (!props.service.providers || props.service.providers.length === 0) {
    return 'grey-darken-1'
  }
  return props.service.isPremium ? 'purple-darken-2' : 'green-lighten-1'
})
</script>




<style scoped>
.service-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.text-h6 {
  color: #1e293b;
  letter-spacing: 0.02em;
}

.providers-text {
  color: #475569;
  font-weight: 500;
  transition: color 0.2s ease;
}

.chip-modern {
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: all 0.2s ease;
}

.chip-modern:hover {
  transform: scale(1.05);
}

.label-container {
  position: absolute;
  top: 12px;
  right: 12px;
}

.service-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.service-label:hover {
  opacity: 0.9;
}

.action-btn {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .service-card {
    max-width: 100%;
    margin: 12px 16px;
  }
  
  .service-label {
    font-size: 0.6rem;
    padding: 3px 6px;
  }

  .action-btn {
    padding: 4px 12px;
  }
}
</style>
```