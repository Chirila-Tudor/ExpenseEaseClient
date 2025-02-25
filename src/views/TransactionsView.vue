<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getAllTransactions,
  deleteTransaction,
} from "../services/transaction_service";
import CustomModal from "../components/CustomModal.vue";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const router = useRouter();

const transactions = ref<Transaction[]>([]);
const currentPage = ref<number>(1);
const transactionsPerPage = 3;
const showConfirmModal = ref(false);
const currentTransactionId = ref<number | null>(null);

onMounted(async () => {
  await loadTransactions();
});

const loadTransactions = async (): Promise<void> => {
  try {
    transactions.value = await getAllTransactions();
  } catch (error) {
    console.error("Failed to fetch transactions", error);
  }
};

const currentTransactions = computed(() => {
  const startIndex = (currentPage.value - 1) * transactionsPerPage;
  return transactions.value.slice(startIndex, startIndex + transactionsPerPage);
});

const goToAddTransaction = (): void => {
  router.push("/add-transaction");
};

const redirectToUpdate = (id: number) => {
  router.push({ name: "updateTransactions", params: { id } });
};

const showDeleteModal = (id: number): void => {
  currentTransactionId.value = id;
  showConfirmModal.value = true;
};

const deleteTransactionConfirm = async (): Promise<void> => {
  if (currentTransactionId.value !== null) {
    try {
      await deleteTransaction(currentTransactionId.value);
      await loadTransactions();
      closeConfirmModal();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  }
};

const closeConfirmModal = (): void => {
  showConfirmModal.value = false;
  currentTransactionId.value = null;
};

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const goHome = (): void => {
  router.push("/expenses");
};

const nextPage = (): void => {
  if (currentPage.value * transactionsPerPage < transactions.value.length) {
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
        <h1 class="title">Transactions</h1>
      </div>

      <button class="add-button" @click="goToAddTransaction">
        Add Transaction
      </button>

      <div v-if="currentTransactions.length > 0" class="transaction-list">
        <div
          v-for="transaction in currentTransactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-info">
            <span
              ><strong>Description:</strong> {{ transaction.description }}</span
            >
            <span><strong>Amount:</strong> {{ transaction.amount }} RON</span>
            <span
              ><strong>Date:</strong> {{ formatDate(transaction.date) }}</span
            >
          </div>

          <div class="actions">
            <button
              class="update-button"
              @click="redirectToUpdate(transaction.id)"
            >
              Update
            </button>

            <button
              class="delete-button"
              @click="showDeleteModal(transaction.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="transactions.length > transactionsPerPage" class="pagination">
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
          :disabled="currentPage * transactionsPerPage >= transactions.length"
        >
          Next
        </button>
      </div>
    </div>

    <CustomModal
      v-if="showConfirmModal"
      :title="'Are you sure?'"
      :message="'Do you really want to delete this transaction?'"
      @confirm="deleteTransactionConfirm"
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

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.transaction-item {
  padding: 1rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-item:hover {
  background: #eef3f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.transaction-info {
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
</style>
