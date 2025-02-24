<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getSalaryById, updateSalary } from "../services/salary_service";
import CustomButton from "../components/CustomButton.vue";

const router = useRouter();
const route = useRoute();

const salaryId = ref<number | null>(null);
const totalSalary = ref<number | null>(null);
const remainingSalary = ref<number | null>(null);

const username = ref(localStorage.getItem("username") || "");
const userRole = ref(localStorage.getItem("role") || "");
const userId = ref<number | null>(Number(localStorage.getItem("userId")));

onMounted(async () => {
  const id = route.params.id;
  salaryId.value = id ? Number(id) : null;

  if (salaryId.value !== null) {
    try {
      const salaryData = await getSalaryById(salaryId.value);
      totalSalary.value = salaryData.totalSalary;
      remainingSalary.value = salaryData.remainingSalary;
    } catch (error) {
      console.error("Failed to fetch salary data", error);
    }
  }
});

const handleUpdate = async () => {
  if (
    salaryId.value !== null &&
    totalSalary.value !== null &&
    remainingSalary.value !== null &&
    userId.value !== null
  ) {
    try {
      const salaryUpdateRequest = {
        userId: userId.value,
        totalSalary: totalSalary.value,
      };

      await updateSalary(salaryId.value, salaryUpdateRequest);

      // After successful update, navigate back to expenses
      router.push("/expenses");
    } catch (error) {
      console.error("Failed to update salary", error);
    }
  }
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
        <div class="submit-btn-container">
          <CustomButton class="submit-btn" type="submit"
            >Update Salary</CustomButton
          >
        </div>
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
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 250px;
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
