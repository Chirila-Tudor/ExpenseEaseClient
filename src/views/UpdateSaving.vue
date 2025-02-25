<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  updatePiggyBankAmount,
  getPiggyBankById,
} from "../services/piggyBank_service"; // Assuming updateSaving service exists

interface Saving {
  amount: number;
  date: string;
  userId: number;
}

const router = useRouter();
const route = useRoute();

const savingId = parseInt(route.params.id as string, 10);
const saving = ref<Saving>({
  amount: 0,
  date: "",
  userId: parseInt(localStorage.getItem("userId") || "0", 10),
});

const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

onMounted(async () => {
  await loadSaving();
});

const formatAmount = (amount: string): number => {
  const formattedAmount = amount.replace(",", ".");
  return parseFloat(formattedAmount);
};

const loadSaving = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const data = await getPiggyBankById(savingId);
    saving.value = {
      amount: data.amount,
      date: data.date,
      userId: data.userId,
    };
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
    console.error("Error fetching saving:", error);
  }
};

const submitUpdateSaving = async (): Promise<void> => {
  isLoading.value = true;
  isSuccess.value = false;
  isError.value = false;
  saving.value.amount = formatAmount(saving.value.amount.toString());
  try {
    await updatePiggyBankAmount(savingId, saving.value);
    isLoading.value = false;
    isSuccess.value = true;
    setTimeout(() => {
      router.push("/all-savings");
    }, 2000);
  } catch (error) {
    isLoading.value = false;
    isError.value = true;
    console.error("Error updating saving:", error);
  }
};

const cancel = (): void => {
  router.push("/all-savings");
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Update Saving</h1>

      <form @submit.prevent="submitUpdateSaving">
        <div class="form-group">
          <label for="amount">Amount</label>
          <input
            v-model="saving.amount"
            type="text"
            id="amount"
            placeholder="Enter amount"
            required
          />
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input v-model="saving.date" type="date" id="date" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">Update Saving</button>
          <button type="button" class="cancel-button" @click="cancel">
            Cancel
          </button>
        </div>
      </form>

      <div v-if="isLoading" class="loader">Updating...</div>

      <div v-if="isSuccess" class="success-message">
        Saving Updated Successfully!
      </div>

      <div v-if="isError" class="error-message">
        Failed to update saving. Please try again.
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
