<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addSalary } from "../services/salary_service";
import { decryptData, encryptData } from "../services/encrypt";

interface SalaryData {
  totalSalary: number;
  remainingSalary: number;
  date: string;
  userId: number;
}

const router = useRouter();
const totalSalary = ref<string>("");
const date = ref<string>("");
const remainingSalary = ref<string>("");
const errorMessage = ref<string>("");

const userId = decryptData(localStorage.getItem("userId"));

const updateRemainingSalary = () => {
  if (totalSalary.value) {
    remainingSalary.value = totalSalary.value;
  }
};

const submitSalary = async () => {
  if (!userId) {
    errorMessage.value = "User ID not found. Please log in.";
    return;
  }

  try {
    const salaryData: SalaryData = {
      totalSalary: parseFloat(totalSalary.value),
      remainingSalary: parseFloat(remainingSalary.value),
      date: date.value,
      userId: parseInt(userId, 10),
    };

    const createdSalary = await addSalary(salaryData);

    const salaryId = createdSalary.id;

    localStorage.setItem("salaryId", encryptData(salaryId.toString()));

    router.push("/expenses");
  } catch (error) {
    errorMessage.value = "Failed to add salary. Please try again.";
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">Add Salary</h2>
      <form @submit.prevent="submitSalary">
        <div class="input-group">
          <label for="totalSalary">Total Salary</label>
          <input
            type="number"
            v-model="totalSalary"
            id="totalSalary"
            required
            @input="updateRemainingSalary"
            placeholder="Enter total salary"
          />
        </div>
        <div class="input-group">
          <label for="remainingSalary">Remaining Salary</label>
          <input
            type="number"
            v-model="remainingSalary"
            id="remainingSalary"
            required
            placeholder="Remaining salary will auto-fill"
            readonly
          />
        </div>
        <div class="input-group">
          <label for="date">Date</label>
          <input v-model="date" type="date" id="date" required />
        </div>
        <div class="submit-btn-container">
          <button type="submit" class="submit-btn">Submit</button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
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

.submit-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.submit-btn:active {
  transform: scale(0.98);
}

.error {
  color: red;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
