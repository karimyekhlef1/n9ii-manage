<template>
  <v-dialog v-model="isOpen" max-width="650px">
    <v-card class="pa-6" rounded="xl" elevation="3">
      <v-card-title class="text-h5 font-weight-bold pb-2 d-flex align-center">
        <v-icon size="28" color="primary" class="mr-2">
          {{ props.actionType === 'create' ? 'mdi-plus-circle' : 'mdi-pencil' }}
        </v-icon>
        {{ props.actionType === 'create' ? 'Create New Serive' : `Edit service ${props.initialData.serviceId}` }}
      </v-card-title>
      
      <v-divider class="mb-4"></v-divider>
      
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-row>
          <!-- Image Upload Section -->
          <v-col cols="12">
            <div class="image-upload-container">
              <v-card 
                class="image-upload-card d-flex flex-column justify-center align-center" 
                :class="{'has-image': formData.imagePreview}"
                flat 
                height="200"
              >
                <template v-if="formData.imagePreview">
                  <v-img
                    :src="formData.imagePreview"
                    cover
                    height="100%"
                    width="40%"
                    class="rounded-lg"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </div>
                    </template>
                    
                    <!-- Image Actions Overlay -->
                    <div class="image-actions-overlay">
                      <v-btn 
                        icon="mdi-pencil" 
                        size="small"
                        color="white" 
                        variant="flat"
                        @click.stop="triggerFileInput"
                        class="action-btn"
                      ></v-btn>
                      <v-btn 
                        icon="mdi-delete" 
                        size="small"
                        color="error" 
                        variant="flat"
                        @click.stop="removeImage"
                        class="action-btn"
                      ></v-btn>
                    </div>
                  </v-img>
                </template>
                
                <template v-else>
                  <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-image-plus</v-icon>
                  <p class="text-subtitle-1 text-grey-darken-1 mb-1">Upload Image</p>
                  <p class="text-caption text-grey mb-3">Drag and drop or click to browse</p>
                  <v-btn 
                    color="primary" 
                    variant="tonal" 
                    size="small"
                    @click="triggerFileInput"
                    prepend-icon="mdi-upload"
                  >
                    Select Image
                  </v-btn>
                </template>
                
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden-input"
                />
              </v-card>
              
              <div v-if="imageError" class="text-error text-caption mt-1">
                {{ imageError }}
              </div>
            </div>
          </v-col>
          
          <!-- Form Fields -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.nameEn"
              label="Name in English"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-alphabet-latin"
              class="mb-2"
              clearable
              bg-color="grey-lighten-5"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-text-field
              v-model="formData.nameFr"
              label="Name in French"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-alphabet-latin"
              class="mb-2"
              clearable
              bg-color="grey-lighten-5"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-text-field
              v-model="formData.nameAr"
              label="الاسم بالعربية"
              label-dir="rtl"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-alphabet-arabic"
              class="mb-2"
              clearable
              dir="rtl"
              bg-color="grey-lighten-5"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-card flat color="primary-lighten-5" class="pa-4 rounded-lg preview-card" elevation="0">
              <div class="d-flex align-center gap-3">
                <v-avatar size="48" color="grey-lighten-3" class="flex-shrink-0">
                  <v-img v-if="formData.image" :src="formData.imagePreview" cover></v-img>
                  <v-icon v-else size="24" color="grey">mdi-image</v-icon>
                </v-avatar>
                <div>
                  <v-card-subtitle class="text-body-1 font-weight-medium pa-0 mb-1">
                    {{ formData.nameEn || 'Enter English name' }}
                  </v-card-subtitle>
                  <div class="d-flex gap-2">
                    <v-chip size="small" color="primary" variant="flat" class="text-caption">
                      {{ formData.nameFr || 'French name' }}
                    </v-chip>
                    <v-chip size="small" color="primary" variant="flat" class="text-caption">
                      {{ formData.nameAr || 'Arabic name' }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          
          <!-- <v-col cols="12">
            <v-switch
              v-model="formData.active"
              color="primary"
              label="Active status"
              hide-details
              inset
            ></v-switch>
          </v-col> -->
        </v-row>

        <v-card-actions class="pt-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="outlined"
            @click="closeDialog"
            class="px-5 mr-2"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="elevated"
            class="px-6"
            :loading="loading"
            :disabled="!formData.nameEn || !formData.nameFr || !formData.nameAr"
          >
            <v-icon start class="mr-1">
              {{ props.actionType === 'create' ? 'mdi-plus' : 'mdi-content-save' }}
            </v-icon>
            {{ props.actionType === 'create' ? 'Create' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

const { post, put, loading, error,patch } = useApi();
const { showSuccess, showError } = useToast();
const form = ref(null);
const fileInput = ref(null);
const imageError = ref(null);

const props = defineProps({
  actionType: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  itemId: {
    type: [String, Number],
    default: null
  },
});

const isOpen = defineModel();
const emit = defineEmits(['close', 'submit', 'delete', 'update:modelValue','on-action']);

const formData = reactive({
  nameEn: '',
  nameFr: '',
  nameAr: '',
  image: '',
  imagePreview: null,
  active: true
});

const rules = {
  required: value => !!value || 'This field is required'
};

// Image handling functions
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImageUpload = (event) => {
  imageError.value = null;
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.match('image.*')) {
    imageError.value = 'Please select an image file';
    return;
  }
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    imageError.value = 'Image size should be less than 2MB';
    return;
  }
  
  // Create URL for preview
  formData.imagePreview = URL.createObjectURL(file);
  
  // Store file for upload
  formData.imageFile = file;
  
  // Reset file input for future uploads
  event.target.value = '';
};

const removeImage = () => {
  formData.imagePreview = null;
  formData.image = '';
  formData.imageFile = null;
};

const closeDialog = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
};

const editService = async () => {
  try {
     const form = new FormData()
    form.append('NameEn', formData.nameEn);
    form.append('Namefr', formData.nameFr);
    form.append('NameAr', formData.nameAr);
    form.append('image',  formData.imageFile); 
    console.log("form",form)

    const result = await patch(`/Service/${props.initialData.serviceId}`, form);
    if (result) {
      console.log("formData",formData)
emit('on-action', {
        ...formData,
        image: {
          imagePath: formData.imagePreview  // or result.image?.imagePath if returned from API
        },
        serviceId: props.initialData.serviceId
      }, 'edit');      // emit('submit', { action: 'edit', data: result });
      showSuccess("Edited successfully");
      closeDialog();
    }
  } catch (e) {
    console.error('Failed to update service:', e);
    showError("Failed to update service");
  }
};

const createService = async () => {
  try {

    const form = new FormData()
    form.append('NameEn', formData.nameEn);
    form.append('Namefr', formData.nameFr);
    form.append('NameAr', formData.nameAr);
    form.append('image', formData.imageFile);




    
 
    const result = await post('/Service', form);
    if (result) {
     
      // emit('submit', { action: 'create', data: result });
      emit('on-action',result.data,'create');
      showSuccess("Created successfully");
      closeDialog();
    }
  } catch (e) {
    console.error('Failed to create service:', e);
    showError("Failed to create service");
  }
};

const handleSubmit = async () => {
  const { valid } = await form.value?.validate() || { valid: true };
  
  if (!valid) return;
  
  if (props.actionType === 'edit') {
    await editService();
  } else {
    await createService();
  }
};

// Handle dialog state
watch(isOpen, (newVal) => {
  if (!newVal) {
    form.value?.reset();
    Object.keys(formData).forEach(key => {
      formData[key] = key === 'active' ? true : '';
    });
    formData.imagePreview = null;
    formData.imageFile = null;
    imageError.value = null;
  }
});

// Initialize form with existing data
onMounted(() => {
  if (props.actionType === 'edit' && props.initialData) {
    formData.nameEn = props.initialData.nameEn || '';
    formData.nameFr = props.initialData.nameFr || '';
    formData.nameAr = props.initialData.nameAr || '';
    formData.active = props.initialData.active !== undefined ? props.initialData.active : true;
    
    if (props.initialData.image) {
      formData.image = props.initialData.image.imagePath;
      formData.imagePreview = props.initialData.image.imagePath;
    }
  }
});
</script>

<style scoped>
:deep(.v-field__input) {
  font-size: 1rem;
}

.image-upload-container {
  width: 100%;
}

.image-upload-card {
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.image-upload-card:hover {
  border-color: var(--v-theme-primary);
  background-color: rgba(var(--v-theme-primary-rgb), 0.05);
}

.image-upload-card.has-image {
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.12);
}

.image-upload-card.has-image:hover .image-actions-overlay {
  opacity: 1;
}

.image-actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-btn {
  backdrop-filter: blur(4px);
}

.hidden-input {
  display: none;
}

.preview-card {
  border: 1px solid rgba(var(--v-theme-primary-rgb), 0.15);
  background-color: rgba(var(--v-theme-primary-rgb), 0.05) !important;
}
</style>