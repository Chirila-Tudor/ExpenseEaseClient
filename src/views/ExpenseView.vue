<script setup lang="ts">
import CustomNavbar from "../components/CustomNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { getAllSalaries } from "../services/salary_service";
import { getTotalTransactionAmount } from "../services/transaction_service";
import { getTotalExpensesAmount } from "../services/expense_service";

const salaries = ref([]);
const totalTransactionAmount = ref(0);
const totalExpenses = ref(0);

onMounted(async () => {
  try {
    salaries.value = await getAllSalaries();
    totalTransactionAmount.value = await getTotalTransactionAmount();
    totalExpenses.value = await getTotalExpensesAmount();
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
});

const totalSalary = computed(() => {
  return salaries.value.length ? salaries.value[0].totalSalary : 0;
});

const remainingSalary = computed(() => {
  const remaining = salaries.value.length
    ? salaries.value[0].remainingSalary
    : 0;
  return remaining.toFixed(2);
});
</script>

<template>
  <CustomNavbar />
  <div class="page-container">
    <div class="salary-card color-card">
      <p><strong>Total Salary:</strong> {{ totalSalary }} RON</p>
      <p><strong>Remaining Salary:</strong> {{ remainingSalary }} RON</p>
    </div>

    <div class="salary-card color-card">
      <p>
        <strong>Total Transactions:</strong> {{ totalTransactionAmount }} RON
      </p>
    </div>

    <div class="salary-card color-card">
      <!-- Expense card -->
      <p><strong>Total Expenses:</strong> {{ totalExpenses }} RON</p>
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
  margin-right: 20px;
  position: sticky;
  top: 20px;
}

.salary-card p {
  font-size: 14px;
  margin-bottom: 10px;
}

.salary-card strong {
  color: #007bff;
}

.color-card {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
}
</style>
