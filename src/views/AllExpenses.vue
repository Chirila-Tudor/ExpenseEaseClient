<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { getAllExpenses, deleteExpense } from "../services/expense_service";
import CustomModal from "../components/CustomModal.vue";
import { encryptData } from "../services/encrypt";

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

const router = useRouter();
const expenses = ref<Expense[]>([]);
const currentPage = ref<number>(1);
const expensesPerPage = 3;
const showConfirmModal = ref(false);
const currentExpenseId = ref<number | null>(null);

const selectedMonthYear = ref<string>("");

const currentDate = new Date();
selectedMonthYear.value = `${currentDate.getFullYear()}-${(
  currentDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}`;

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

watch(selectedMonthYear, () => {
  loadExpenses();
});

const loadExpenses = async (): Promise<void> => {
  try {
    const fetchedExpenses = await getAllExpenses();

    if (selectedMonthYear.value) {
      const selectedMonth = parseInt(selectedMonthYear.value.split("-")[1], 10);
      const selectedYear = parseInt(selectedMonthYear.value.split("-")[0], 10);

      expenses.value = fetchedExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === selectedMonth - 1 &&
          expenseDate.getFullYear() === selectedYear
        );
      });
    } else {
      expenses.value = fetchedExpenses;
    }
  } catch (error) {
    console.error("Failed to fetch expenses", error);
  }
};
onMounted(async () => {
  await loadExpenses();
});

const currentExpenses = computed(() => {
  const startIndex = (currentPage.value - 1) * expensesPerPage;
  return expenses.value.slice(startIndex, startIndex + expensesPerPage);
});

const goToAddExpense = (): void => {
  router.push("/add-expense");
};

const redirectToUpdate = (id: number) => {
  const encryptedId = encryptData(id.toString());
  router.push({ name: "updateExpense", params: { id: encryptedId } });
};

const showDeleteModal = (id: number): void => {
  currentExpenseId.value = id;
  showConfirmModal.value = true;
};

const deleteExpenseConfirm = async (): Promise<void> => {
  if (currentExpenseId.value !== null) {
    try {
      await deleteExpense(currentExpenseId.value);
      await loadExpenses();
      closeConfirmModal();
    } catch (error) {
      console.error("Failed to delete expense", error);
    }
  }
};

const closeConfirmModal = (): void => {
  showConfirmModal.value = false;
  currentExpenseId.value = null;
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const goHome = (): void => {
  router.push("/expenses");
};

const nextPage = (): void => {
  if (currentPage.value * expensesPerPage < expenses.value.length) {
    currentPage.value++;
  }
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <i class="fa fa-home home-icon" @click="goHome"></i>
        <h1 class="title">Expenses</h1>
      </div>

      <div class="date-picker">
        <div class="dropdown-container">
          <label for="yearSelect" class="dropdown-label">Select Year</label>
          <select v-model="selectedMonthYear" id="yearSelect" class="dropdown">
            <option
              v-for="year in years"
              :key="year"
              :value="`${year}-${selectedMonthYear.split('-')[1] || '01'}`"
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

      <button class="add-button" @click="goToAddExpense">Add Expense</button>

      <div v-if="currentExpenses.length > 0" class="expense-list">
        <div
          v-for="expense in currentExpenses"
          :key="expense.id"
          class="expense-item"
        >
          <div class="expense-info">
            <span><strong>Category:</strong> {{ expense.category }}</span>
            <span><strong>Amount:</strong> {{ expense.amount }} RON</span>
            <span><strong>Date:</strong> {{ formatDate(expense.date) }}</span>
          </div>

          <div class="actions">
            <button class="update-button" @click="redirectToUpdate(expense.id)">
              Update
            </button>
            <button class="delete-button" @click="showDeleteModal(expense.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="expenses.length > expensesPerPage" class="pagination">
        <button
          class="pagination-button"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Prev
        </button>
        <span
          ><strong>{{ currentPage }}</strong></span
        >
        <button
          class="pagination-button"
          @click="nextPage"
          :disabled="currentPage * expensesPerPage >= expenses.length"
        >
          Next
        </button>
      </div>
    </div>

    <CustomModal
      v-if="showConfirmModal"
      :title="'Are you sure?'"
      :message="'Do you really want to delete this expense?'"
      @confirm="deleteExpenseConfirm"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f7fc;
  font-family: "Arial", sans-serif;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-icon {
  font-size: 2rem;
  cursor: pointer;
  margin-right: 10px;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: bold;
}

.add-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.add-button:active {
  transform: scale(0.98);
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.expense-item {
  padding: 1rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.expense-item:hover {
  background: #eef3f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.expense-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.update-button,
.delete-button {
  padding: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 48%;
}

.update-button:hover,
.delete-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.update-button:active,
.delete-button:active {
  transform: scale(0.98);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 16px;
  font-weight: bold;
  margin-right: 5px;
  margin-left: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:hover {
  background-color: #0056b3;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.date-picker {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

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
</style>
