<script setup lang="ts">
import CustomNavbar from "../components/CustomNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { getAllSalaries } from "../services/salary_service";

const salaries = ref([]);

onMounted(async () => {
  try {
    salaries.value = await getAllSalaries();
  } catch (error) {
    console.error("Failed to fetch salaries", error);
  }
});

const totalSalary = computed(() => {
  return salaries.value.length ? salaries.value[0].totalSalary : 0;
});

const remainingSalary = computed(() => {
  return salaries.value.length ? salaries.value[0].remainingSalary : 0;
});
</script>

<template>
  <CustomNavbar />
  <div class="page-container">
    <div class="salary-card">
      <p><strong>Total Salary:</strong> {{ totalSalary }} RON</p>
      <p><strong>Remaining Salary:</strong> {{ remainingSalary }} RON</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 20px;
}

.salary-card {
  width: 250px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px; /* Adds space between the card and the rest of the content */
  position: sticky;
  top: 20px; /* Keeps the card fixed while scrolling */
}

.salary-card p {
  font-size: 14px;
  margin-bottom: 10px;
}

.salary-card strong {
  color: #007bff;
}
</style>
