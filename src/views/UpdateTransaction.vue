<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  updateTransaction,
  getTransactionById,
} from "../services/transaction_service";
import { decryptData } from "../services/encrypt";

interface Transaction {
  description: string;
  amount: number;
  date: string;
  userId: number;
}

const router = useRouter();
const route = useRoute();

const transactionId = parseInt(decryptData(route.params.id as string), 10);
const transaction = ref<Transaction>({
  description: "",
  amount: 0,
  date: "",
  userId: parseInt(decryptData(localStorage.getItem("userId") || ""), 10),
});

const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

onMounted(async () => {
  await loadTransaction();
});

const loadTransaction = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const data = await getTransactionById(transactionId);
    transaction.value = {
      description: data.description,
      amount: data.amount,
      date: data.date,
      userId: data.userId,
    };
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
    console.error("Error fetching transaction:", error);
  }
};

const submitUpdateTransaction = async (): Promise<void> => {
  isLoading.value = true;
  isSuccess.value = false;
  isError.value = false;

  try {
    await updateTransaction(transactionId, transaction.value);
    isLoading.value = false;
    isSuccess.value = true;
    setTimeout(() => {
      router.push("/transactions");
    }, 2000);
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
    console.error("Error updating transaction:", error);
  }
};

const cancel = (): void => {
  router.push("/transactions");
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Update Transaction</h1>

      <!-- Update Transaction Form -->
      <form @submit.prevent="submitUpdateTransaction">
        <div class="form-group">
          <label for="description">Description</label>
          <input
            v-model="transaction.description"
            type="text"
            id="description"
            placeholder="Enter description"
            required
          />
        </div>

        <div class="form-group">
          <label for="amount">Amount</label>
          <input
            v-model="transaction.amount"
            type="number"
            id="amount"
            placeholder="Enter amount"
            required
          />
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input v-model="transaction.date" type="date" id="date" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">
            Update Transaction
          </button>
          <button type="button" class="cancel-button" @click="cancel">
            Cancel
          </button>
        </div>
      </form>

      <!-- Loader while submitting -->
      <div v-if="isLoading" class="loader">Updating...</div>

      <!-- Success Message -->
      <div v-if="isSuccess" class="success-message">
        Transaction Updated Successfully!
      </div>

      <!-- Error Message -->
      <div v-if="isError" class="error-message">
        Failed to update transaction. Please try again.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  background: #f4f7fc;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  text-align: left;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-actions {
  margin-top: 20px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:active {
  transform: scale(0.98);
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.cancel-button:active {
  transform: scale(0.98);
}

.loader {
  font-size: 1.2rem;
  margin-top: 15px;
  color: #007bff;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-top: 15px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 15px;
}
</style>
