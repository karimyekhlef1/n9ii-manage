<template>
  <v-card class="mx-auto" max-width="600" elevation="2" outlined>
    <v-card-title class="headline primary white--text">
      Complaint #{{ complaint.complaintId }}
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Category</v-list-item-title>
            <v-list-item-subtitle>{{ complaint.category }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Description</v-list-item-title>
            <v-list-item-subtitle>{{ complaint.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Status</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip :color="statusColor(complaint.complaintStatus)">
                {{ complaint.complaintStatus }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Reported User ID</v-list-item-title>
            <v-list-item-subtitle>{{ complaint.reportedUserId }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Created At</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(complaint.createdAt) }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Resolved At</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate(complaint.resolvedAt) || 'Not resolved' }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

  </v-card>
</template>

<script>
export default {
  name: 'ComplaintCard',
  props: {
    complaint: {
      type: Object,
      required: true,
      default: () => ({
        complaintId: 0,
        reporterId: 0,
        reportedUserId: 0,
        reservationId: null,
        reservation: null,
        category: '',
        description: '',
        complaintStatus: '',
        attachments: [],
        createdAt: '',
        resolvedAt: ''
      })
    }
  },
  methods: {
    statusColor(status) {
      switch (status) {
        case 'Dismissed':
          return 'red lighten-2';
        case 'Pending':
          return 'orange lighten-2';
        case 'Resolved':
          return 'green lighten-2';
        default:
          return 'grey lighten-2';
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

  }
}
</script>

<style scoped>
.headline {
  font-size: 1.5rem;
}
</style>