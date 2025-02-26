<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAllSalaries, deleteSalary } from "../services/salary_service";
import CustomButton from "../components/CustomButton.vue";
import CustomModal from "../components/CustomModal.vue";

const router = useRouter();
const salaries = ref([]);
const isDeleteModalVisible = ref(false);
const selectedSalaryId = ref<number | null>(null);
const username = ref(localStorage.getItem("username") || "");
const userRole = ref(localStorage.getItem("role") || "");

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

onMounted(async () => {
  try {
    const fetchedSalaries = await getAllSalaries();
    salaries.value = fetchedSalaries.map((salary) => ({
      ...salary,
      formattedDate: formatDate(salary.date),
    }));
  } catch (error) {
    console.error("Failed to fetch salaries", error);
  }
});

const showDeleteModal = (id: number) => {
  selectedSalaryId.value = id;
  isDeleteModalVisible.value = true;
};

const confirmDelete = async () => {
  if (selectedSalaryId.value !== null) {
    try {
      await deleteSalary(selectedSalaryId.value);
      salaries.value = salaries.value.filter(
        (salary) => salary.id !== selectedSalaryId.value
      );
      router.push("/expenses");
    } catch (error) {
      console.error("Failed to delete salary", error);
    }
  }
  isDeleteModalVisible.value = false;
  selectedSalaryId.value = null;
};

const cancelDelete = () => {
  isDeleteModalVisible.value = false;
  selectedSalaryId.value = null;
};

const redirectToUpdate = (id: number) => {
  router.push({ name: "updateSalary", params: { id } });
};

const goHome = (): void => {
  router.push("/expenses");
};
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <i class="fa fa-home home-icon" @click="goHome"></i>
        <h2 class="title">Salaries</h2>
      </div>

      <div class="salary-list" v-if="salaries.length">
        <div v-for="salary in salaries" :key="salary.id" class="salary-item">
          <div class="salary-info">
            <p class="total-salary">
              Total Salary: <span>{{ salary.totalSalary }}</span>
            </p>
            <p class="remaining-salary">
              Remaining Salary: <span>{{ salary.remainingSalary }}</span>
            </p>
            <p class="remaining-salary">
              Remaining Salary: <span>{{ salary.formattedDate }}</span>
            </p>
          </div>
          <div class="actions">
            <CustomButton
              class="update-button"
              @click="redirectToUpdate(salary.id)"
            >
              Update
            </CustomButton>
            <CustomButton
              class="delete-button"
              @click="showDeleteModal(salary.id)"
            >
              Delete
            </CustomButton>
          </div>
        </div>
      </div>
    </div>

    <CustomModal
      v-if="isDeleteModalVisible"
      :title="'Delete Salary'"
      :message="'Are you sure you want to delete this salary?'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
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
  margin-bottom: 1.5rem;
}

.home-icon {
  font-size: 2rem;
  cursor: pointer;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.home-icon:hover {
  color: #007bff;
}

.title {
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
}

.salary-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.salary-item {
  padding: 1rem;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.salary-item:hover {
  background: #eef3f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.salary-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.total-salary,
.remaining-salary {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.total-salary span,
.remaining-salary span {
  font-weight: 700;
  color: #007bff;
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
</style>
