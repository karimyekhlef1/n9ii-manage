<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    :persistent="persistent"
    class="modern-dialog"
  >
    <v-card class="dialog-card">
      <!-- Header with gradient background -->
      <v-card-title class="dialog-title">
        {{ title }}
      </v-card-title>

      <!-- Content with smooth padding and typography -->
      <v-card-text class="dialog-text">
        {{ message }}
      </v-card-text>

      <!-- Actions with hover effects -->
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="onCancel"
          class="cancel-btn"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          @click="onConfirm"
          variant="elevated"
          class="confirm-btn"
          :loading="loading"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmColor: {
    type: String,
    default: 'primary'
  },
  persistent: {
    type: Boolean,
    default: false  
  },
  loading:{
      type: Boolean,
      default: false  
  }
})


const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onConfirm = () => {
  emit('confirm')
  // emit('update:modelValue', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modern-dialog :deep(.v-overlay__content) {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: scale(0.95);
  transition: transform 0.2s ease-out;
}

.modern-dialog :deep(.v-overlay--active .v-overlay__content) {
  transform: scale(1);
}

/* Card styling */
.dialog-card {
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  border-radius: 16px;
}

/* Title styling */
.dialog-title {
  background: linear-gradient( #3b82f6);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
  letter-spacing: 0.02em;
}

/* Text content styling */
.dialog-text {
  padding: 20px 24px;
  color: #374151;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
}

/* Actions styling */
.dialog-actions {
  padding: 12px 24px;
  background: #fafafa;
}

/* Button styling */
.cancel-btn {
  color: #6b7280;
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.confirm-btn {
  text-transform: none;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  align-items: center;
}

.confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .modern-dialog :deep(.v-overlay__content) {
    max-width: 90%;
  }

  .dialog-title {
    font-size: 1.125rem;
    padding: 12px 20px;
  }

  .dialog-text {
    padding: 16px 20px;
    font-size: 0.95rem;
  }

  .dialog-actions {
    padding: 10px 20px;
  }
}
</style>