<template>
  <v-card :style="props.cardStyle" elevation="2" class="modern-card">
    <v-card-title class="d-flex align-center justify-space-between">
      <span class="text-h5 font-weight-medium">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="6" v-if="props.isSearch">
          <v-text-field 
          v-model="localSearch" prepend-inner-icon="mdi-magnify" label="Search" variant="outlined"
            density="compact" clearable class="modern-input" @input="handleInput"
            @click:clear="() => onClear('Search')"
           />
        </v-col>
        <v-col cols="12" md="3" v-if="props.isStatus">
            <v-select
  v-model="localStatusFilter"
  :items="statusOptions"
          @update:modelValue="onStatusChange" 

  label="Filter by Status"
  variant="outlined"
  item-title="text"
  item-value="value"
>
  <template v-slot:item="{ props, item }">
    <v-list-item v-bind="props"  :style="{ color: item.raw.color }"></v-list-item>
  </template>
</v-select>
          <!-- <v-select 
          v-model="localStatusFilter"
          @update:modelValue="onStatusChange" 
          :items="statusOptions" label="Filter by Status" variant="outlined"
             :color=
          density="compact" clearable
           class="modern-input" 
           @click:clear="() => onClear('Status')" /> -->
        </v-col>
        <v-col cols="12" md="3" v-if="props.isDate">
          <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition">
            <template v-slot:activator="{ props }">
              <v-text-field v-model="localSelectedDate" label="Filter by Date" prepend-inner-icon="mdi-calendar"
                variant="outlined" density="compact" clearable readonly class="modern-input" v-bind="props" />
            </template>
            <v-date-picker v-model="localSelectedDate" color="primary" :max="today"
              @update:modelValue="dateMenu = false" />
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
  isSearch: {
    type: Boolean,

  },
  isStatus: {
    type: Boolean,

  },
    isDate: {
    type: Boolean,

  },
  statusFilter: {
    type: Boolean,

  },
  search: {
    type: String,
  },
  statusFilter: {
    type: String,
  },
  selectedDate: {
    type: String, // 'YYYY-MM-DD' format
    default: null,
  },
  statusOptions: {
    type: Array,
    default: () => ['Active', 'Inactive', 'Pending'],
  },
  cardStyle: {
    type: Object,
    default: () => ({}),
  },
});

const localSearch = ref(props.search);
const localStatusFilter = ref(props.statusFilter);
const localSelectedDate = ref(props.selectedDate);
const dateMenu = ref(false); // Controls v-menu open/close

const today = computed(() => {
  return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
});

const emit = defineEmits(['update:search', 'update:SelectedStatus', 'update:SelectedDate']);

// Sync localSearch with props.search
watch(
  () => props.search,
  (val) => {
    localSearch.value = val;
  }
);

// Sync localStatusFilter with props.statusFilter
watch(
  () => props.statusFilter,
  (val) => {
    localStatusFilter.value = val;
  }
);

// Sync localSelectedDate with props.selectedDate
watch(
  () => props.selectedDate,
  (val) => {
    localSelectedDate.value = val;
  }
);
function onClear(field) {
  switch (field) {
    case "Search":
      console.log("filde", field)
      emit('update:search', '');
      break

    case "Status":
      console.log("filde", field)
      emit("update:statusFilter", "")
      break

    default:
      console.warn("Unknown field:", field)
  }


}

// Emit search updates
function handleInput() {
  emit('update:search', localSearch.value);
}
function onStatusChange (){
    emit('update:SelectedStatus', localStatusFilter.value);

}
// Emit status filter updates
watch(localStatusFilter, (val) => {
  emit('update:statusFilter', val);
});

// Emit date updates
watch(localSelectedDate, (val) => {
  console.log('Child selected date:', val);
  emit('update:selectedDate', val);
});
</script>

<style scoped>
.v-data-table {
  background-color: transparent;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>