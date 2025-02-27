<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAllSalaries, deleteSalary } from "../services/salary_service";
import CustomButton from "../components/CustomButton.vue";
import CustomModal from "../components/CustomModal.vue";
import { decryptData, encryptData } from "../services/encrypt";

const router = useRouter();
const salaries = ref([]);
const isDeleteModalVisible = ref(false);
const selectedSalaryId = ref<number | null>(null);
const selectedMonthYear = ref<string>("");
const username = ref(decryptData(localStorage.getItem("username")));
const userRole = ref(decryptData(localStorage.getItem("role")));

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

const filteredSalaries = computed(() => {
  if (!selectedMonthYear.value) {
    return salaries.value;
  }

  const selectedMonth = parseInt(selectedMonthYear.value.split("-")[1], 10);
  const selectedYear = parseInt(selectedMonthYear.value.split("-")[0], 10);

  return salaries.value.filter((salary) => {
    const salaryDate = new Date(salary.date);
    return (
      salaryDate.getMonth() === selectedMonth - 1 &&
      salaryDate.getFullYear() === selectedYear
    );
  });
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
      router.push("/salaries");
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
  const encryptedId = encryptData(id.toString());
  router.push({ name: "updateSalary", params: { id: encryptedId } });
};

const goHome = (): void => {
  router.push("/expenses");
};

const noSalaries = computed(() => {
  return filteredSalaries.value.length === 0;
});
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <i class="fa fa-home home-icon" @click="goHome"></i>
        <h2 class="title">Salaries</h2>
      </div>

      <div v-if="noSalaries" class="add-salary-btn">
        <CustomButton
          class="add-salary-button"
          @click="router.push('/add-salary')"
        >
          Add Salary
        </CustomButton>
      </div>

      <div class="date-picker">
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

      <div class="salary-list" v-if="filteredSalaries.length">
        <div
          v-for="salary in filteredSalaries"
          :key="salary.id"
          class="salary-item"
        >
          <div class="salary-info">
            <p class="total-salary">
              Total Salary: <span>{{ salary.totalSalary }}</span>
            </p>
            <p class="remaining-salary">
              Remaining Salary: <span>{{ salary.remainingSalary }}</span>
            </p>
            <p class="remaining-salary">
              Date: <span>{{ salary.formattedDate }}</span>
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

.add-salary-btn {
  display: flex;
  justify-content: center; /* Center the button */
  margin-bottom: 20px;
}

.add-salary-button {
  padding: 0.3rem 1rem; /* Smaller padding */
  font-weight: bold;
  font-size: 0.8rem; /* Smaller font size */
  background: linear-gradient(135deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 200px; /* Adjusted smaller width */
  margin: 0 auto; /* Center the button */
}

.add-salary-button:hover {
  background: linear-gradient(135deg, #005bb5, #00a0ff);
}

.add-salary-button:active {
  transform: scale(0.98);
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
