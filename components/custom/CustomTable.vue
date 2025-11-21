<template>
  <v-card 
  class = "mt-4">
    <v-data-table
      :headers="tableHeaders"
      :items="filteredItems"
      :search="search"
      :loading="loading"
      item-value="id"
      class="elevation-1"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
    >
      
      <template v-slot:item.accountStatus="{ item }">
        <v-chip
          :color="getStatusColor(item.accountStatus)"
          size="small"
          variant="flat"
        >
          {{ item.accountStatus }}
        </v-chip>
      </template>
          <!-- Custom slot for identity piece image -->
      <template v-slot:item.identityPiece="{ item }">
        <div class="image-container">
          <v-avatar
            v-if="item.identityPiece?.imagePath"
            :size="40"
            class="ma-1"
            style="cursor: pointer;"
            @click="openImagePreview(item.identityPiece.imagePath, 'Identity Document')"
          >
            <v-img
              :src="item.identityPiece.imagePath"
              :alt="`${item.firstName} ${item.lastName} identity document`"
              cover
              @error="onImageError"
            />
          </v-avatar>
          <v-avatar
            v-else
            :size="40"
            color="grey-lighten-2"
            class="ma-1"
          >
            <v-icon color="grey-darken-1">mdi-card-account-details</v-icon>
          </v-avatar>
        </div>
      </template>
<template #item.averageRating="{ item }">
  <div class="d-flex align-center">
    <v-rating
      v-if="item.averageRating !== null && item.averageRating !== undefined"
      :model-value="item.averageRating"
      half-increments
      readonly
      size="18"
      color="amber"
      empty-icon="mdi-star-outline"
      full-icon="mdi-star"
      half-icon="mdi-star-half-full"
    />
    
    <v-chip
      v-else
      size="small"
      color="grey"
      variant="flat"
    >
      No Rating
    </v-chip>
  </div>
</template>

      <!-- Custom slot for selfie image -->
      <template v-slot:item.selfieImage="{ item }">
        <div class="image-container">
          <v-avatar
            v-if="item.selfieImage?.imagePath"
            :size="40"
            class="ma-1"
            style="cursor: pointer;"
            @click="openImagePreview(item.selfieImage.imagePath, 'Selfie Image')"
          >
            <v-img
              :src="item.selfieImage.imagePath"
              :alt="`${item.firstName} ${item.lastName} selfie`"
              cover
              @error="onImageError"
            />
          </v-avatar>
          <v-avatar
            v-else
            :size="40"
            color="grey-lighten-2"
            class="ma-1"
          >
            <v-icon color="grey-darken-1">mdi-camera</v-icon>
          </v-avatar>
        </div>
      </template>
      
      <!-- Custom slot for type -->
      <template v-slot:item.type="{ item }">
        <v-chip
          :color="getTypeColor(item.type)"
          size="small"
          variant="outlined"
        >
          {{ item.type }}
        </v-chip>
 
      </template>
       <template v-slot:item.createdAt="{ item }">
    <v-chip
      color="primary"
      size="small"
      variant="outlined"
      prepend-icon="mdi-calendar"
    >
      {{ $date.format(item.createdAt, 'medium') }}
    </v-chip>
  </template>
  
         <template v-slot:item.resolvedAt="{ item }">
    <v-chip
      color="primary"
      size="small"
      variant="outlined"
      prepend-icon="mdi-calendar"
    >
      {{ $date.format(item.createdAt, 'larg') }}
    </v-chip>
  </template>
           <template v-slot:item.birthDate="{ item }">
    <v-chip
      color="primary"
      size="small"
      variant="outlined"
      prepend-icon="mdi-calendar"
    >
      {{ $date.format(item.birthDate, 'larg') }}
    </v-chip>
  </template>
  
<template v-slot:item.sex="{ item }">
  <v-chip
    v-if="item.sex"
    :color="item.sex === 'Male' ? 'blue' : 'pink'"
    size="small"
    variant="tonal"
    :prepend-icon="item.sex === 'Male' ? 'mdi-gender-male' : 'mdi-gender-female'"
  >
    {{ item.sex }}
  </v-chip>

  <v-chip
    v-else
    color="grey"
    size="small"
    variant="outlined"
    prepend-icon="mdi-help-circle-outline"
  >
    Unknown
  </v-chip>
</template>



       <template v-slot:item.profileImage="{ item }">
        <div class="image-container">
          <v-avatar
            v-if="item.profileImage?.imagePath"
            :size="40"
            class="ma-1"
          >
            <v-img
              :src="item.profileImage.imagePath"
              :alt="`${item.firstName} ${item.lastName} profile`"
              cover
              @error="onImageError"
            />
          </v-avatar>
          <v-avatar
            v-else
            :size="40"
            color="grey-lighten-2"
            class="ma-1"
          >
            <v-icon color="grey-darken-1">mdi-account</v-icon>
          </v-avatar>
        </div>
      </template>


      <!-- Custom slot for contact -->
      <template v-slot:item.contact="{ item }">
        <div>
          <div class="text-body-2">{{ item.email }}</div>
          <div class="text-caption text-grey">{{ item.phone }}</div>
        </div>
      </template>
<template #item.phoneNumber="{ item }">
  <div class="d-flex align-center">
    <v-chip
      v-if="item.phoneNumber"
      size="small"
      color="green"
      variant="tonal"
      prepend-icon="mdi-phone"
    >
      {{ item.phoneNumber }}
    </v-chip>

    <v-chip
      v-else
      size="small"
      color="green"
      variant="flat"
      prepend-icon="mdi-phone-off"
    >
      No Phone
    </v-chip>
  </div>
</template>
<template #item.email="{ item }">
  <div class="d-flex align-center">
    <v-chip
      v-if="item.email"
      size="small"
      color="blue"
      variant="tonal"
      prepend-icon="mdi-email"
    >
      {{ item.email }}
    </v-chip>

    <v-chip
      v-else
      size="small"
      color="grey"
      variant="flat"
      prepend-icon="mdi-email-off"
    >
      No Email
    </v-chip>
  </div>
</template>



      <!-- Custom slot for actions -->
      <template v-slot:item.actions="{ item }">
       <div class="d-flex align-center ga-2">
    <v-btn
      v-if="showActions.view"
      icon="mdi-eye"
      size="small"
      variant="text"
      @click="viewItem(item)"
    />
    <v-btn
      v-if="showActions.edit"
      icon="mdi-pencil"
      size="small"
      variant="text"
      @click="editItem(item)"
    />
    <v-btn
      v-if="showActions.delete"
      icon="mdi-delete"
      size="small"
      variant="text"
      color="error"
      @click="deleteItem(item)"
    />
  </div>
      </template>

      <!-- Custom slot for no data -->
      <template v-slot:no-data>
        <v-container class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">{{ config.noDataIcon }}</v-icon>
          <div class="text-h6 mt-4">{{ config.noDataTitle }}</div>
          <div class="text-body-2 text-grey">{{ config.noDataSubtitle }}</div>
        </v-container>
      </template>
    </v-data-table>
  </v-card>

  <!-- Details Dialog -->
  <v-dialog v-model="detailsDialog" :max-width="detailsDialogConfig.maxWidth" scrollable>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon class="mr-3" color="primary">{{ detailsDialogConfig.icon }}</v-icon>
        {{ detailsDialogConfig.title }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDetailsDialog"
        />
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="pa-0">
        <v-container class="py-4">
          <!-- Profile Section -->
          <v-row v-if="viewedItem.profileImage || viewedItem.firstName || viewedItem.lastName">
            <v-col cols="12">
              <div class="d-flex align-center mb-4">
                <v-avatar
                  :size="80"
                  class="mr-4"
                  color="grey-lighten-2"
                >
                  <v-img
                    v-if="viewedItem.profileImage?.imagePath"
                    :src="viewedItem.profileImage.imagePath"
                    :alt="getFullName(viewedItem)"
                    cover
                  />
                  <v-icon v-else color="grey-darken-1" size="40">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 mb-1">{{ getFullName(viewedItem)  }}</h3>
                  <v-chip
                    v-if="viewedItem.accountStatus"
                    :color="getStatusColor(viewedItem.accountStatus)"
                    size="small"
                    variant="flat"
                    class="mr-2"
                  >
                    {{ viewedItem.accountStatus }}
                  </v-chip>
                  <v-chip
                    v-if="viewedItem.type"
                    :color="getTypeColor(viewedItem.type)"
                    size="small"
                    variant="outlined"
                  >
                    {{ viewedItem.type }}
                  </v-chip>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="mb-4" />

          <!-- Details Sections -->
          <v-row>
            <!-- Basic Information -->
            <v-col cols="12" md="6">
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-account-details</v-icon>
                Basic Information
              </h4>
              <v-list class="bg-transparent">
                <template v-for="field in basicInfoFields" :key="field.key">
                  <v-list-item v-if="viewedItem[field.key]" class="px-0">
                    <template v-slot:prepend>
                      <v-icon :icon="field.icon" size="20" class="mr-3" />
                    </template>
                    <v-list-item-title class="text-caption text-grey-darken-1">
                      {{ field.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-black">
                      {{ formatFieldValue(viewedItem[field.key], field.type) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-list>
            </v-col>

            <!-- Contact Information -->
            <v-col cols="12" md="6">
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-contact-mail</v-icon>
                Contact Information
              </h4>
              <v-list class="bg-transparent">
                <template v-for="field in contactInfoFields" :key="field.key">
                  <v-list-item v-if="viewedItem[field.key]" class="px-0">
                    <template v-slot:prepend>
                      <v-icon :icon="field.icon" size="20" class="mr-3" />
                    </template>
                    <v-list-item-title class="text-caption text-grey-darken-1">
                      {{ field.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-black">
                      {{ formatFieldValue(viewedItem[field.key], field.type) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-list>
            </v-col>

            <!-- Documents Section -->
            <v-col cols="12" v-if="viewedItem.identityPiece || viewedItem.selfieImage">
              <v-divider class="mb-4" />
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
                Documents
              </h4>
              <v-row>
                <v-col cols="6" md="3" v-if="viewedItem.identityPiece?.imagePath">
                  <v-card class="text-center pa-3" variant="outlined">
                    <v-avatar
                      :size="80"
                      class="mb-2"
                      style="cursor: pointer;"
                      @click="openImagePreview(viewedItem.identityPiece.imagePath, 'Identity Document')"
                    >
                      <v-img
                        :src="viewedItem.identityPiece.imagePath"
                        cover
                      />
                    </v-avatar>
                    <div class="text-caption">Identity Document</div>
                  </v-card>
                </v-col>
                <v-col cols="6" md="3" v-if="viewedItem.selfieImage?.imagePath">
                  <v-card class="text-center pa-3" variant="outlined">
                    <v-avatar
                      :size="80"
                      class="mb-2"
                      style="cursor: pointer;"
                      @click="openImagePreview(viewedItem.selfieImage.imagePath, 'Selfie Image')"
                    >
                      <v-img
                        :src="viewedItem.selfieImage.imagePath"
                        cover
                      />
                    </v-avatar>
                    <div class="text-caption">Selfie Image</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Additional Fields -->
            <v-col cols="12" v-if="additionalFields.length > 0">
              <v-divider class="mb-4" />
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                Additional Information
              </h4>
              <v-list class="bg-transparent">
                <template v-for="field in additionalFields" :key="field.key">
                  <v-list-item v-if="viewedItem[field.key]" class="px-0">
                    <template v-slot:prepend>
                      <v-icon :icon="field.icon || 'mdi-circle-small'" size="20" class="mr-3" />
                    </template>
                    <v-list-item-title class="text-caption text-grey-darken-1">
                      {{ field.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-black">
                      {{ formatFieldValue(viewedItem[field.key], field.type) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="closeDetailsDialog"
        >
          {{ detailsDialogConfig.closeText }}
        </v-btn>
        <v-btn
          v-if="showActions.edit"
          color="primary"
          variant="flat"
          @click="editFromDetails"
        >
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="dialog" :max-width="dialogConfig.maxWidth" persistent>
    <v-card>
      <v-card-title class="text-h5">
      {{ editedItem.use }}
      
        {{ editedIndex === -1 ? dialogConfig.addTitle : `${dialogConfig.editTitle} - ${editedItem.userName || editedItem.username  || editedItem.userId || 'Item'}` }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col 
              v-for="field in formFields" 
              :key="field.key"
              :cols="field.cols || 12" 
              :md="field.md || 6"
            >
              <v-text-field
                v-if="field.type === 'text'"
                v-model="editedItem[field.key]"
                :label="field.label"
                :rules="field.rules || []"
                variant="outlined"
                :required="field.required"
              />
              <v-textarea
                v-else-if="field.type === 'textarea'"
                v-model="editedItem[field.key]"
                :label="field.label"
                :rules="field.rules || []"
                variant="outlined"
                :rows="field.rows || 3"
                :required="field.required"
              />
              <v-select
                v-else-if="field.type === 'select'"
                v-model="editedItem[field.key]"
                :items="field.options"
                :label="field.label"
                :rules="field.rules || []"
                variant="outlined"
                :required="field.required"
              />

              
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          {{ dialogConfig.cancelText }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!valid"
          @click="saveItem"
        >
          {{ dialogConfig.saveText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" :max-width="deleteDialogConfig.maxWidth">
    <v-card>
      <v-card-title class="text-h5">{{ deleteDialogConfig.title }}</v-card-title>
      <v-card-text>
        {{ deleteDialogConfig.message.replace('{name}', itemToDelete?.name || '') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          variant="text"
          @click="deleteDialog = false"
        >
          {{ deleteDialogConfig.cancelText }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirmDelete"
        >
          {{ deleteDialogConfig.deleteText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Image Preview Dialog -->
  <v-dialog v-model="imagePreviewDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h6">
        {{ imagePreviewTitle }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="imagePreviewDialog = false"
        />
      </v-card-title>
      <v-card-text class="pa-0">
        <v-img
          :src="imagePreviewSrc"
          max-height="400"
          contain
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useDate } from 'vuetify'

const $date = useDate()
// Props
const props = defineProps({
  // Data props
  items: {
    type: Array,
    default: () => []
  },
  
  // Table configuration
  headers: {
    type: Array,
    default: () => [
      { title: 'Name', key: 'name', sortable: true },
      { title: 'Company', key: 'company', sortable: true },
      { title: 'Contact', key: 'contact', sortable: false },
      { title: 'Type', key: 'type', sortable: true },
      { title: 'Status', key: 'status', sortable: true },
      { title: 'Created', key: 'createdAt', sortable: true },
      { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
    ]
  },
  
  itemsPerPage: {
    type: Number,
    default: 10
  },
  
  itemsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50]
  },
  
  // Form fields configuration
  formFields: {
    type: Array,
    default: () => []
  },
  
  // Details fields configuration
  detailsFields: {
    type: Array,
    default: () => [
      { key: 'firstName', label: 'First Name', icon: 'mdi-account', type: 'text', section: 'basic' },
      { key: 'lastName', label: 'Last Name', icon: 'mdi-account', type: 'text', section: 'basic' },
      { key: 'userName', label: 'Username', icon: 'mdi-at', type: 'text', section: 'basic' },
      { key: 'email', label: 'Email', icon: 'mdi-email', type: 'email', section: 'contact' },
      { key: 'phone', label: 'Phone', icon: 'mdi-phone', type: 'phone', section: 'contact' },
      { key: 'address', label: 'Address', icon: 'mdi-map-marker', type: 'text', section: 'contact' },
      { key: 'company', label: 'Company', icon: 'mdi-domain', type: 'text', section: 'basic' },
      { key: 'createdAt', label: 'Created Date', icon: 'mdi-calendar', type: 'date', section: 'additional' }
    ]
  },
  
  // Default item structure
  defaultItem: {
    type: Object,
    default: () => ({})
  },
  
  // Color configurations
  statusColors: {
    type: Object,
    default: () => ({
      'Active': 'success',
      'Inactive': 'grey',
      'Pending': 'warning',
      'Suspended': 'error'
    })
  },
  
  typeColors: {
    type: Object,
    default: () => ({
      'Individual': 'blue',
      'Corporate': 'purple',
      'Government': 'teal',
      'Non-profit': 'orange',
      'Supplier': 'indigo',
      'Vendor': 'cyan',
      'Contractor': 'lime',
      'Partner': 'pink'
    })
  },
  
  // Action buttons configuration
  showActions: {
    type: Object,
    default: () => ({
      view: true,
      edit: true,
      delete: true
    })
  },
  
  // Dialog configurations
  dialogConfig: {
    type: Object,
    default: () => ({
      maxWidth: '80%',
      addTitle: 'Add Item',
      editTitle: 'Edit Item',
      cancelText: 'Cancel',
      saveText: 'Save'
    })
  },
  
  detailsDialogConfig: {
    type: Object,
    default: () => ({
      maxWidth: '800px',
      title: 'Item Details',
      icon: 'mdi-information',
      closeText: 'Close'
    })
  },
  
  deleteDialogConfig: {
    type: Object,
    default: () => ({
      maxWidth: '400px',
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete {name}?',
      cancelText: 'Cancel',
      deleteText: 'Delete'
    })
  },
  
  // No data configuration
  config: {
    type: Object,
    default: () => ({
      noDataIcon: 'mdi-database-off',
      noDataTitle: 'No items found',
      noDataSubtitle: 'Try adjusting your search or filters'
    })
  },
  
  // Filter options
  statusFilter: {
    type: String,
    default: null
  },
  
  typeFilter: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'view-item',
  'edit-item', 
  'delete-item',
  'save-item',
  'items-changed'
])

// Reactive data
const internalItems = ref([])
const search = ref('')
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const imagePreviewDialog = ref(false)
const valid = ref(false)
const editedIndex = ref(-1)
const itemToDelete = ref(null)
const editedItem = ref({})
const viewedItem = ref({})
const imagePreviewSrc = ref('')
const imagePreviewTitle = ref('')

// Computed properties
const tableHeaders = computed(() => props.headers)

const filteredItems = computed(() => {
  console.log("formFields",props.formFields)
  let filtered = internalItems.value

  if (props.statusFilter) {
    filtered = filtered.filter(item => item.status ||item.complaintStatus  === props.statusFilter)
  }

  if (props.typeFilter) {
    filtered = filtered.filter(item => item.type === props.typeFilter)
  }

  return filtered
})

const basicInfoFields = computed(() => {
  return props.detailsFields.filter(field => field.section === 'basic' || !field.section)
})

const contactInfoFields = computed(() => {
  return props.detailsFields.filter(field => field.section === 'contact')
})

const additionalFields = computed(() => {
  return props.detailsFields.filter(field => field.section === 'additional')
})

// Methods
const getStatusColor = (status) => {
  return props.statusColors[status] || 'grey'
}

const getTypeColor = (type) => {
  return props.typeColors[type] || 'grey'
}

const getFullName = (item) => {
  if (item.firstName && item.lastName) {
    return `${item.firstName} ${item.lastName}`
  } else if (item.name) {
    return item.name
  } else if (item.userName) {
    return item.userName
  }else{
     return item.username
  }
  return 'Unknown'
}

const formatFieldValue = (value, type) => {
  if (!value) return '-'
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'email':
      return value
    case 'phone':
      return value
    case 'currency':
      return `$${value.toLocaleString()}`
    case 'boolean':
      return value ? 'Yes' : 'No'
    default:
      return value
  }
}

const viewItem = (item) => {
  viewedItem.value = { ...item }
  detailsDialog.value = true
  emit('view-item', item)
}

const editItem = async (item) => {
  editedIndex.value = internalItems.value.indexOf(item)
  // Deep copy the item to avoid modifying the original
  editedItem.value = JSON.parse(JSON.stringify(item))
  
  await nextTick() // Wait for Vue to update the DOM
  dialog.value = true
  emit('edit-item', item)
}

const editFromDetails = () => {
  closeDetailsDialog()
  editItem(viewedItem.value)
}

const deleteItem = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
  emit('delete-item', item)
}

const closeDialog = () => {
  dialog.value = false
  setTimeout(() => {
    editedItem.value = { ...props.defaultItem }
    editedIndex.value = -1
    valid.value = false
  }, 300)
}

const closeDetailsDialog = () => {
  detailsDialog.value = false
  setTimeout(() => {
    viewedItem.value = {}
  }, 300)
}

const openImagePreview = (imagePath, title) => {
  imagePreviewSrc.value = imagePath
  imagePreviewTitle.value = title
  imagePreviewDialog.value = true
}

const onImageError = (event) => {
  console.warn('Image failed to load:', event)
}

const saveItem = () => {
  const itemData = { ...editedItem.value }
  
  if (editedIndex.value > -1) {
    Object.assign(internalItems.value[editedIndex.value], itemData)
    emit('save-item', { action: 'edit', item: itemData, index: editedIndex.value })
  } else {
    // Add new item
    const newItem = {
      ...itemData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    console.log("newItem---->",newItem)
    internalItems.value.push(newItem)
    emit('save-item', { action: 'add', item: newItem })
  }
  
  emit('items-changed', [...internalItems.value])
  closeDialog()
}

const confirmDelete = () => {
  const index = internalItems.value.indexOf(itemToDelete.value)
  if (index > -1) {
    internalItems.value.splice(index, 1)
    emit('items-changed', [...internalItems.value])
  }
  deleteDialog.value = false
  itemToDelete.value = null
}

// Expose methods for parent component
const openAddDialog = () => {
  editedIndex.value = -1
  editedItem.value = { ...props.defaultItem }
  dialog.value = true
}

const openDetailsDialog = (item) => {
  viewItem(item)
}

// Watch for prop changes
watch(() => props.items, (newItems) => {
  internalItems.value = [...newItems]
}, { immediate: true, deep: true })

// Initialize editedItem with defaultItem
watch(() => props.defaultItem, (newDefault) => {
  if (editedIndex.value === -1) {
    editedItem.value = { ...newDefault }
  }
}, { immediate: true })

// Expose methods to parent
defineExpose({
  openAddDialog,
  closeDialog,
  openDetailsDialog
})

onMounted(() => {
  internalItems.value = [...props.items]
  editedItem.value = { ...props.defaultItem }
})
</script>

<style scoped>
.v-data-table {
  background-color: transparent;
}

.text-caption {
  font-size: 0.75rem !important;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>