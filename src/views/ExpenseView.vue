<script setup lang="ts">
import CustomNavbar from "../components/CustomNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { getAllSalaries } from "../services/salary_service";
import { getAllTransactions } from "../services/transaction_service";
import { getAllExpenses } from "../services/expense_service";
import { getAllSavings } from "../services/piggyBank_service";

const salaries = ref([]);
const transactions = ref([]);
const expenses = ref([]);
const totalSavings = ref([]);

const currentDate = new Date();
const selectedMonthYear = ref<string>(
  `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`
);

const months = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  const endYear = currentYear + 5;

  const generatedYears = [];
  for (let year = startYear; year <= endYear; year++) {
    generatedYears.push(year);
  }
  return generatedYears.sort((a, b) => b - a);
});

onMounted(async () => {
  try {
    salaries.value = await getAllSalaries();
    transactions.value = await getAllTransactions();
    expenses.value = await getAllExpenses();
    totalSavings.value = await getAllSavings();
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
});

const filteredSalaries = computed(() => {
  return salaries.value.filter((salary) => {
    const salaryDate = new Date(salary.date);
    const selectedDate = new Date(`${selectedMonthYear.value}-01`);

    return (
      salaryDate.getMonth() === selectedDate.getMonth() &&
      salaryDate.getFullYear() === selectedDate.getFullYear()
    );
  });
});

const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const selectedDate = new Date(`${selectedMonthYear.value}-01`);

    return (
      transactionDate.getMonth() === selectedDate.getMonth() &&
      transactionDate.getFullYear() === selectedDate.getFullYear()
    );
  });
});

// Filtered expenses based on selected month and year
const filteredExpenses = computed(() => {
  return expenses.value.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const selectedDate = new Date(`${selectedMonthYear.value}-01`);

    return (
      expenseDate.getMonth() === selectedDate.getMonth() &&
      expenseDate.getFullYear() === selectedDate.getFullYear()
    );
  });
});

const filteredSavings = computed(() => {
  return totalSavings.value.filter((saving) => {
    const savingDate = new Date(saving.date);
    const selectedDate = new Date(`${selectedMonthYear.value}-01`);

    return (
      savingDate.getMonth() === selectedDate.getMonth() &&
      savingDate.getFullYear() === selectedDate.getFullYear()
    );
  });
});

const totalSalary = computed(() => {
  return filteredSalaries.value.length
    ? filteredSalaries.value[0].totalSalary
    : 0;
});

const remainingSalary = computed(() => {
  const remaining = filteredSalaries.value.length
    ? filteredSalaries.value[0].remainingSalary
    : 0;
  return remaining.toFixed(2);
});

const totalTransactionAmount = computed(() => {
  return filteredTransactions.value.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
});

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
});

const totalSaves = computed(() => {
  return filteredSavings.value.reduce((acc, saving) => acc + saving.amount, 0);
});
</script>

<template>
  <CustomNavbar />
  <div class="page-container">
    <div class="selection-card">
      <div class="dropdown-container">
        <label for="yearSelect" class="dropdown-label">Select Year</label>
        <select v-model="selectedMonthYear" id="yearSelect" class="dropdown">
          <option
            v-for="year in years"
            :key="year"
            :value="`${year}-${selectedMonthYear.split('-')[1]}`"
          >
            {{ year }}
          </option>
        </select>
      </div>

      <div class="dropdown-container">
        <label for="monthSelect" class="dropdown-label">Select Month</label>
        <select v-model="selectedMonthYear" id="monthSelect" class="dropdown">
          <option
            v-for="month in months"
            :key="month.value"
            :value="`${selectedMonthYear.split('-')[0]}-${month.value}`"
          >
            {{ month.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="info-cards-container">
      <div class="info-card">
        <p><strong>Total Salary:</strong> {{ totalSalary }} RON</p>
        <p><strong>Remaining Salary:</strong> {{ remainingSalary }} RON</p>
      </div>

      <router-link to="/transactions" class="clickable-card">
        <div class="info-card">
          <p>
            <strong>Total Transactions:</strong>
            {{ totalTransactionAmount }} RON
          </p>
        </div>
      </router-link>

      <router-link to="/all-expenses" class="clickable-card">
        <div class="info-card">
          <p><strong>Total Expenses:</strong> {{ totalExpenses }} RON</p>
        </div>
      </router-link>

      <router-link to="/all-savings" class="clickable-card">
        <div class="info-card">
          <p><strong>Total Savings:</strong> {{ totalSaves }} RON</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 30px;
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px;
    flex-direction: column;
    align-items: center;
  }
}

/* Dropdown Container */
.dropdown-container {
  width: 100%;
  margin-bottom: 15px;
}

.dropdown-label {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.dropdown {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selection-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  gap: 20px;
  align-items: flex-start;
}

.info-cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.info-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 250px;
  height: 75px;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-card p {
  font-size: 16px;
  margin: 10px 0;
}

.info-card strong {
  color: #007bff;
}

.info-card:hover {
  transform: translateY(-5px);
}

.clickable-card {
  text-decoration: none;
  color: inherit;
  display: block;
}

.clickable-card:hover .info-card {
  cursor: pointer;
  opacity: 0.9;
}

.clickable-card:active .info-card {
  transform: scale(0.98);
}
</style>
