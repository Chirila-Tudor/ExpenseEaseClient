<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getSalaryById, updateSalary } from "../services/salary_service";
import CustomButton from "../components/CustomButton.vue";
import { decryptData } from "../services/encrypt";

const router = useRouter();
const route = useRoute();

const salaryId = ref<number | null>(null);
const totalSalary = ref<number | null>(null);
const remainingSalary = ref<number | null>(null);
const salaryDate = ref<string>("");
const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

const username = ref(decryptData(localStorage.getItem("username") || ""));
const userRole = ref(decryptData(localStorage.getItem("role") || ""));
const userId = ref<number | null>(
  Number(decryptData(localStorage.getItem("userId") || ""))
);

onMounted(async () => {
  const encryptedId = route.params.id as string;
  const decryptedId = decryptData(encryptedId);
  salaryId.value = decryptedId ? Number(decryptedId) : null;

  if (salaryId.value !== null) {
    try {
      const salaryData = await getSalaryById(salaryId.value);
      totalSalary.value = salaryData.totalSalary;
      remainingSalary.value = salaryData.remainingSalary;

      if (salaryData.date) {
        salaryDate.value = salaryData.date.split("T")[0];
      }
    } catch (error) {
      console.error("Failed to fetch salary data", error);
    }
  }
});

const handleUpdate = async () => {
  isLoading.value = true; // Show loading message
  isSuccess.value = false; // Hide success message
  isError.value = false; // Hide error message

  if (
    salaryId.value !== null &&
    totalSalary.value !== null &&
    remainingSalary.value !== null &&
    userId.value !== null &&
    salaryDate.value !== ""
  ) {
    try {
      const salaryUpdateRequest = {
        userId: userId.value,
        totalSalary: totalSalary.value,
        date: salaryDate.value,
      };

      await updateSalary(salaryId.value, salaryUpdateRequest);

      isLoading.value = false;
      isSuccess.value = true;

      setTimeout(() => {
        router.push("/expenses");
      }, 2000);
    } catch (error) {
      isLoading.value = false;
      isError.value = true;
      console.error("Failed to update salary", error);
    }
  }
};

const cancel = (): void => {
  router.push("/salaries");
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Update Salary</h2>
      <form @submit.prevent="handleUpdate">
        <div class="input-group">
          <label for="totalSalary">Total Salary</label>
          <input
            v-model="totalSalary"
            type="number"
            id="totalSalary"
            placeholder="Enter Total Salary"
            required
          />
        </div>
        <div class="input-group">
          <label for="remainingSalary">Remaining Salary</label>
          <input
            v-model="remainingSalary"
            type="number"
            id="remainingSalary"
            placeholder="Enter Remaining Salary"
            required
            readonly
          />
        </div>
        <div class="input-group">
          <label for="date">Date</label>
          <input v-model="salaryDate" type="date" id="date" required />
        </div>
        <div class="submit-btn-container">
          <button type="submit" class="submit-button">Update Salary</button>
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
  transition: transform 0.2s ease;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: bold;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  padding-right: 5px;
  color: #333;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

input[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.submit-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.submit-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.submit-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.submit-button:active {
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
</style>
