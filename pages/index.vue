<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4">
    <!-- Header with Actions -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-bold mb-2">Dashboard Overview</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          <v-icon icon="mdi-calendar" size="small" class="mr-1"></v-icon>
          {{ currentDate }} • Last updated: {{ lastUpdate }}
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-center justify-end">
        <v-btn-toggle v-model="timeRange" mandatory color="primary" rounded="lg" class="mr-2">
          <!-- <v-btn value="week" size="small">Week</v-btn>
          <v-btn value="month" size="small">Month</v-btn>
          <v-btn value="year" size="small">Year</v-btn> -->
        </v-btn-toggle>
        <v-btn icon="mdi-refresh" variant="tonal" @click="refreshData"></v-btn>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col v-for="(stat, index) in statsCards" :key="index" cols="12" sm="6" lg="4">
        <v-card elevation="3" class="pa-5 h-100 rounded-lg" :class="`stat-card-${index}`">
          <div class="d-flex align-center justify-space-between mb-4">
            <v-avatar :color="stat.color" size="56" class="elevation-4">
              <v-icon :icon="stat.icon" color="white" size="28"></v-icon>
            </v-avatar>
            <div class="text-right">
              <v-chip
                :color="stat.trend === 'up' ? 'success' : 'error'"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                <v-icon
                  :icon="stat.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'"
                  start
                  size="small"
                ></v-icon>
                {{ stat.change }}
              </v-chip>
              <div class="text-caption text-grey-darken-1 mt-1">vs last {{ timeRange }}</div>
            </div>
          </div>
          <div class="text-subtitle-2 text-grey-darken-1 mb-2">{{ stat.title }}</div>
          <div class="text-h3 font-weight-bold mb-1">{{ stat.value }}</div>
          <v-progress-linear
            :model-value="stat.progress"
            :color="stat.color"
            height="6"
            rounded
            class="mt-2"
          ></v-progress-linear>
          <div class="text-caption text-grey mt-1">{{ stat.subtitle }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mb-6">
      <!-- Revenue & Bookings Chart -->
      <v-col cols="12" lg="8">
        <v-card elevation="3" class="pa-6 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h2 class="text-h5 font-weight-bold">Revenue & Bookings Trend</h2>
              <p class="text-caption text-grey-darken-1 mt-1">Monthly performance overview</p>
            </div>
            <v-chip color="primary" variant="tonal" prepend-icon="mdi-chart-line">
              Growth: +18.5%
            </v-chip>
          </div>
          <div style="height: 320px; position: relative;">
            <Line :data="revenueChartData" :options="revenueChartOptions" />
          </div>
          <v-row class="mt-4">
            <v-col cols="6" sm="3" v-for="metric in revenueMetrics" :key="metric.label">
              <div class="text-center pa-2 rounded" :style="`background: ${metric.bgColor}`">
                <div class="text-caption text-grey-darken-1">{{ metric.label }}</div>
                <div class="text-h6 font-weight-bold" :style="`color: ${metric.color}`">
                  {{ metric.value }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Service Distribution -->
      <v-col cols="12" lg="4">
        <v-card elevation="3" class="pa-6 rounded-lg h-100">
          <h2 class="text-h5 font-weight-bold mb-2">Service Categories</h2>
          <p class="text-caption text-grey-darken-1 mb-4">Total bookings by service type</p>
          <div style="height: 240px; position: relative;">
            <Doughnut :data="serviceChartData" :options="serviceChartOptions" />
          </div>
          <v-divider class="my-4"></v-divider>
          <v-list density="compact" class="bg-transparent">
            <v-list-item
              v-for="(service, index) in serviceDistribution"
              :key="index"
              class="px-2 mb-1 rounded"
            >
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-circle"
                  :color="service.color"
                  size="16"
                  class="mr-2"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-2">
                {{ service.name }}
              </v-list-item-title>
              <template v-slot:append>
                <div class="d-flex align-center">
                  <span class="text-body-2 font-weight-bold mr-2">{{ service.value }}%</span>
                  <v-chip size="x-small" :color="service.color" variant="flat">
                    {{ service.count }}
                  </v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Second Row -->
    <v-row class="mb-6">
      <!-- Booking Status -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="3" class="pa-5 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6 font-weight-bold">Booking Status</h3>
            <v-icon icon="mdi-calendar-clock" color="primary"></v-icon>
          </div>
          <div style="height: 200px; position: relative;">
            <Bar :data="bookingStatusChartData" :options="bookingStatusChartOptions" />
          </div>
        </v-card>
      </v-col>

      <!-- Provider Performance -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="3" class="pa-5 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6 font-weight-bold">Provider Ratings</h3>
            <v-icon icon="mdi-star" color="amber"></v-icon>
          </div>
          <div class="text-center mb-4">
            <div class="text-h2 font-weight-bold text-amber">4.8</div>
            <v-rating
              :model-value="4.8"
              color="amber"
              half-increments
              readonly
              size="small"
              density="compact"
            ></v-rating>
            <div class="text-caption text-grey mt-1">Based on 3,847 reviews</div>
          </div>
          <v-divider class="mb-3"></v-divider>
          <v-list density="compact" class="bg-transparent">
            <v-list-item v-for="rating in ratingsBreakdown" :key="rating.stars" class="px-0 mb-1">
              <template v-slot:prepend>
                <span class="text-body-2 mr-2">{{ rating.stars }}★</span>
              </template>
              <v-progress-linear
                :model-value="rating.percentage"
                color="amber"
                height="6"
                rounded
              ></v-progress-linear>
              <template v-slot:append>
                <span class="text-caption ml-2">{{ rating.count }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Revenue by Payment -->
      <!-- <v-col cols="12" md="6" lg="3"> -->
        <!-- <v-card elevation="3" class="pa-5 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6 font-weight-bold">Payment Methods</h3>
            <v-icon icon="mdi-credit-card" color="success"></v-icon>
          </div>
          <div style="height: 200px; position: relative;">
            <Pie :data="paymentChartData" :options="paymentChartOptions" />
          </div>
          <v-list density="compact" class="bg-transparent mt-3">
            <v-list-item
              v-for="payment in paymentMethods"
              :key="payment.method"
              class="px-0 mb-1"
            >
              <template v-slot:prepend>
                <v-icon :icon="payment.icon" :color="payment.color" size="20"></v-icon>
              </template>
              <v-list-item-title class="text-caption">
                {{ payment.method }}
              </v-list-item-title>
              <template v-slot:append>
                <span class="text-body-2 font-weight-bold">{{ payment.amount }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card> -->
      <!-- </v-col> -->

      <!-- Quick Stats -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="3" class="pa-5 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-h6 font-weight-bold">Quick Stats</h3>
            <v-icon icon="mdi-speedometer" color="info"></v-icon>
          </div>
          <v-list density="compact" class="bg-transparent">
            <v-list-item
              v-for="quick in quickStats"
              :key="quick.label"
              class="px-0 mb-3"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon :icon="quick.icon" :color="quick.color" size="20" class="mr-3"></v-icon>
                  <div>
                    <div class="text-body-2">{{ quick.label }}</div>
                    <div class="text-caption text-grey">{{ quick.subtitle }}</div>
                  </div>
                </div>
                <div class="text-h6 font-weight-bold" :style="`color: ${quick.color}`">
                  {{ quick.value }}
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Bottom Row -->
    <v-row>
      <!-- Top Providers -->
      <v-col cols="12" lg="6">
        <v-card elevation="3" class="pa-6 rounded-lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h2 class="text-h5 font-weight-bold">Top Providers</h2>
              <p class="text-caption text-grey-darken-1 mt-1">Best performing this month</p>
            </div>
            <v-btn variant="tonal" color="primary" size="small">View All</v-btn>
          </div>
          <v-list class="bg-transparent">
            <v-list-item
              v-for="(provider, index) in topProviders"
              :key="index"
              class="px-3 py-3 mb-2 rounded-lg provider-item"
              elevation="1"
            >
              <template v-slot:prepend>
                <v-badge
                  :content="index + 1"
                  :color="index === 0 ? 'amber' : index === 1 ? 'grey-lighten-1' : 'orange-lighten-1'"
                  overlap
                >
                  <v-avatar :color="getAvatarColor(index)" size="48">
                    <span class="text-white font-weight-bold text-h6">{{ getInitials(provider.name) }}</span>
                  </v-avatar>
                </v-badge>
              </template>
              <v-list-item-title class="font-weight-bold text-body-1 mb-1">
                {{ provider.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex align-center">
                <v-chip size="x-small" color="amber" variant="flat" class="mr-2">
                  <v-icon icon="mdi-star" size="12" class="mr-1"></v-icon>
                  {{ provider.rating }}
                </v-chip>
                <span class="text-caption">{{ provider.jobs }} jobs • {{ provider.completion }}% completion</span>
              </v-list-item-subtitle>
              <!-- <template v-slot:append>
                <div class="text-right">
                  <div class="text-h6 font-weight-bold text-success">{{ provider.earnings }}</div>
                  <div class="text-caption text-grey">Total earned</div>
                </div>
              </template> -->
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Recent Activity & Complaints -->
      <v-col cols="12" lg="6">
        <v-card elevation="3" class="pa-6 rounded-lg">
          <v-tabs v-model="activeTab" color="primary" align-tabs="start" class="mb-4">
            <v-tab value="complaints">
              <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
              Complaints ({{ recentComplaints.length }})
            </v-tab>
            <v-tab value="activity">
              <v-icon icon="mdi-history" class="mr-2"></v-icon>
              Recent Activity
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Complaints Tab -->
            <v-window-item value="complaints">
              <v-list class="bg-transparent">
                <v-list-item
                  v-for="complaint in recentComplaints"
                  :key="complaint.id"
                  class="px-3 py-3 mb-2 rounded-lg"
                  :style="`border-left: 4px solid ${getStatusBorderColor(complaint.status)}`"
                  elevation="1"
                >
                  <v-list-item-title class="font-weight-bold text-body-1 mb-1">
                    {{ complaint.client }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2 mb-2">
                    {{ complaint.issue }}
                  </v-list-item-subtitle>
                  <div class="d-flex align-center justify-space-between">
                    <v-chip size="small" variant="flat" prepend-icon="mdi-clock-outline">
                      {{ complaint.time }}
                    </v-chip>
                    <v-chip
                      :color="getStatusColor(complaint.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ complaint.status }}
                    </v-chip>
                  </div>
                </v-list-item>
              </v-list>
            </v-window-item>

            <!-- Activity Tab -->
            <v-window-item value="activity">
              <v-timeline density="compact" side="end" class="ml-n4">
                <v-timeline-item
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  :dot-color="activity.color"
                  size="small"
                >
                  <template v-slot:icon>
                    <v-icon :icon="activity.icon" size="16"></v-icon>
                  </template>
                  <div class="mb-3">
                    <div class="font-weight-bold text-body-2 mb-1">{{ activity.title }}</div>
                    <div class="text-caption text-grey-darken-1 mb-1">{{ activity.description }}</div>
                    <div class="text-caption text-grey">{{ activity.time }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line, Doughnut, Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler
)

// State
const timeRange = ref('month')
const activeTab = ref('complaints')

const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const lastUpdate = ref('2 minutes ago')

// Data
const statsCards = ref([
  {
    title: 'Total Clients',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: 'mdi-account-group',
    color: '#2196F3',
    progress: 75,
    subtitle: '324 new this month'
  },
  {
    title: 'Active Providers',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: 'mdi-briefcase',
    color: '#4CAF50',
    progress: 65,
    subtitle: '12 pending approval'
  },
  {
    title: 'Total Bookings',
    value: '4,231',
    change: '+23.1%',
    trend: 'up',
    icon: 'mdi-calendar-check',
    color: '#9C27B0',
    progress: 85,
    subtitle: '892 completed today'
  },
//   {
//     title: 'Monthly Revenue',
//     value: '$45,892',
//     change: '-3.2%',
//     trend: 'down',
//     icon: 'mdi-currency-usd',
//     color: '#FF9800',
//     progress: 58,
//     subtitle: '$1,523 avg per day'
//   }
])

const revenueMetrics = ref([
  { label: 'Total Revenue', value: '$124.5K', color: '#2196F3', bgColor: '#E3F2FD' },
  { label: 'Avg. Booking', value: '$108', color: '#4CAF50', bgColor: '#E8F5E9' },
  { label: 'Total Bookings', value: '2,746', color: '#9C27B0', bgColor: '#F3E5F5' },
  { label: 'Conversion', value: '68%', color: '#FF9800', bgColor: '#FFF3E0' }
])

const serviceDistribution = ref([
  { name: 'Cleaning', value: 35, color: '#2196F3', count: 1482 },
  { name: 'Plumbing', value: 25, color: '#4CAF50', count: 1058 },
  { name: 'Electrical', value: 20, color: '#FF9800', count: 846 },
  { name: 'Painting', value: 12, color: '#9C27B0', count: 508 },
  { name: 'Others', value: 8, color: '#757575', count: 337 }
])

const ratingsBreakdown = ref([
  { stars: 5, count: 2341, percentage: 78 },
  { stars: 4, count: 523, percentage: 17 },
  { stars: 3, count: 98, percentage: 3 },
  { stars: 2, count: 34, percentage: 1 },
  { stars: 1, count: 12, percentage: 1 }
])

const paymentMethods = ref([
  { method: 'Credit Card', amount: '$28,450', percentage: 62, icon: 'mdi-credit-card', color: '#2196F3' },
  { method: 'Cash', amount: '$12,890', percentage: 28, icon: 'mdi-cash', color: '#4CAF50' },
  { method: 'Wallet', amount: '$4,552', percentage: 10, icon: 'mdi-wallet', color: '#9C27B0' }
])

const quickStats = ref([
  { label: 'Avg Response', value: '12m', subtitle: 'Provider response time', icon: 'mdi-clock-fast', color: '#2196F3' },
  { label: 'Completion', value: '94%', subtitle: 'Job completion rate', icon: 'mdi-check-circle', color: '#4CAF50' },
  { label: 'Repeat Rate', value: '68%', subtitle: 'Returning customers', icon: 'mdi-repeat', color: '#9C27B0' },
  { label: 'Satisfaction', value: '4.8', subtitle: 'Customer rating', icon: 'mdi-heart', color: '#FF9800' }
])

const topProviders = ref([
  { name: 'John Smith', rating: 4.9, jobs: 145, earnings: '$8,450', completion: 98 },
  { name: 'Sarah Johnson', rating: 4.8, jobs: 132, earnings: '$7,920', completion: 96 },
  { name: 'Mike Wilson', rating: 4.7, jobs: 128, earnings: '$7,680', completion: 94 },
  { name: 'Emma Davis', rating: 4.8, jobs: 119, earnings: '$7,140', completion: 97 },
  { name: 'David Brown', rating: 4.6, jobs: 107, earnings: '$6,420', completion: 92 }
])

const recentComplaints = ref([
  { id: 1, client: 'Alex Turner', issue: 'Service delayed by 2 hours', status: 'Resolved', time: '2 hours ago' },
  { id: 2, client: 'Maria Garcia', issue: 'Poor quality work - needs rework', status: 'In Progress', time: '5 hours ago' },
  { id: 3, client: 'James Lee', issue: 'Payment refund requested', status: 'Pending', time: '1 day ago' },
  { id: 4, client: 'Sophie Chen', issue: 'Provider did not show up', status: 'Resolved', time: '2 days ago' }
])

const recentActivity = ref([
  { id: 1, title: 'New Booking Created', description: 'Cleaning service booked by John Doe', time: '5 min ago', icon: 'mdi-calendar-plus', color: 'success' },
  { id: 2, title: 'Payment Received', description: '$156 payment from Maria Garcia', time: '23 min ago', icon: 'mdi-cash-check', color: 'info' },
  { id: 3, title: 'Provider Approved', description: 'Michael Brown joined as Plumber', time: '1 hour ago', icon: 'mdi-account-check', color: 'primary' },
  { id: 4, title: 'Service Completed', description: 'Electrical work completed by Sarah', time: '2 hours ago', icon: 'mdi-check-circle', color: 'success' },
  { id: 5, title: 'New Review', description: '5-star review from Alex Turner', time: '3 hours ago', icon: 'mdi-star', color: 'amber' }
])

// Chart Data - Revenue Chart
const revenueChartData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [12400, 15600, 18900, 16200, 21500, 24300],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#2196F3',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    },
    {
      label: 'Bookings',
      data: [340, 398, 456, 421, 523, 589],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#4CAF50',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      yAxisID: 'y1'
    }
  ]
}))

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString()
        }
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// Service Distribution Chart
const serviceChartData = computed(() => ({
  labels: serviceDistribution.value.map(s => s.name),
  datasets: [{
    data: serviceDistribution.value.map(s => s.value),
    backgroundColor: serviceDistribution.value.map(s => s.color),
    borderWidth: 3,
    borderColor: '#fff',
    hoverOffset: 15
  }]
}))

const serviceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          return context.label + ': ' + context.parsed + '%'
        }
      }
    }
  },
  cutout: '65%'
}

// Booking Status Chart
const bookingStatusChartData = computed(() => ({
  labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
  datasets: [{
    label: 'Bookings',
    data: [2847, 892, 423, 69],
    backgroundColor: [
      'rgba(76, 175, 80, 0.8)',
      'rgba(33, 150, 243, 0.8)',
      'rgba(255, 152, 0, 0.8)',
      'rgba(244, 67, 54, 0.8)'
    ],
    borderColor: [
      '#4CAF50',
      '#2196F3',
      '#FF9800',
      '#F44336'
    ],
    borderWidth: 2,
    borderRadius: 8
  }]
}))

const bookingStatusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

// Payment Methods Chart
const paymentChartData = computed(() => ({
  labels: paymentMethods.value.map(p => p.method),
  datasets: [{
    data: paymentMethods.value.map(p => p.percentage),
    backgroundColor: paymentMethods.value.map(p => p.color),
    borderWidth: 3,
    borderColor: '#fff',
    hoverOffset: 10
  }]
}))

const paymentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          return context.label + ': ' + context.parsed + '%'
        }
      }
    }
  }
}

// Methods
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('')
}

const getAvatarColor = (index) => {
  const colors = ['#2196F3', '#4CAF50', '#9C27B0', '#FF9800', '#00BCD4']
  return colors[index % colors.length]
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Resolved':
      return 'success'
    case 'In Progress':
      return 'info'
    case 'Pending':
      return 'warning'
    default:
      return 'grey'
  }
}

const getStatusBorderColor = (status) => {
  switch (status) {
    case 'Resolved':
      return '#4CAF50'
    case 'In Progress':
      return '#2196F3'
    case 'Pending':
      return '#FF9800'
    default:
      return '#9E9E9E'
  }
}

const refreshData = () => {
  lastUpdate.value = 'Just now'
  // Add your refresh logic here
  console.log('Refreshing dashboard data...')
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.stat-card-0:hover {
  border-top: 3px solid #2196F3;
}

.stat-card-1:hover {
  border-top: 3px solid #4CAF50;
}

.stat-card-2:hover {
  border-top: 3px solid #9C27B0;
}

.stat-card-3:hover {
  border-top: 3px solid #FF9800;
}

.provider-item {
  transition: all 0.2s ease;
  background: #FAFAFA;
}

.provider-item:hover {
  background: #F5F5F5;
  transform: translateX(4px);
}

.rounded-lg {
  border-radius: 12px !important;
}

.bg-grey-lighten-4 {
  background-color: #F5F5F5;
}
</style>