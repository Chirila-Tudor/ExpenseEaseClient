<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import CustomButton from "../components/CustomButton.vue";
import CustomModal from "./CustomModal.vue";
import { getAllSalaries } from "../services/salary_service";

const router = useRouter();
const username = ref(localStorage.getItem("username") || "");
const userRole = ref(localStorage.getItem("role") || "");
const isModalVisible = ref(false);
const dateTime = ref(new Date().toLocaleString());

const checkSalary = async () => {
  try {
    const salaries = await getAllSalaries();
    if (salaries.length > 0) {
      router.push("/salaries");
    } else {
      router.push("/add-salary");
    }
  } catch (error) {
    console.error("Error fetching salaries:", error);
    router.push("/add-salary");
  }
};

onMounted(() => {
  setInterval(() => {
    dateTime.value = new Date().toLocaleString();
  }, 1000);
});

const buttonText = computed(() =>
  username.value ? `Hi, ${username.value}` : ""
);
const buttonId = computed(() => "logout");

function redirectToTransaction() {
  router.push("/transactions");
}

function redirectToExpense() {
  router.push("/all-expenses");
}

function redirectToPiggyBank() {
  router.push("/all-savings");
}

const redirectToSalary = () => {
  checkSalary();
};

const handleClick = () => {
  if (username.value) {
    isModalVisible.value = true;
  }
};

const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  username.value = "";
  userRole.value = "";
  router.push({ name: "default" });
};

const confirmLogout = () => {
  logout();
  isModalVisible.value = false;
};

const cancelLogout = () => {
  isModalVisible.value = false;
};
</script>

<template>
  <nav id="navbar">
    <div class="date-time"></div>
    <div class="options">
      <div class="buttons">
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectToSalary"
          >Salary</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectToExpense"
          >Expenses</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectToTransaction"
          >Transactions</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectToPiggyBank"
          >Savings</CustomButton
        >
      </div>
    </div>
    <div>
      <CustomButton class="nav-button" :id="buttonId" @click="handleClick">{{
        buttonText
      }}</CustomButton>
      <CustomModal
        v-if="isModalVisible"
        :title="'Log Out'"
        :message="'Are you sure?'"
        @confirm="confirmLogout"
        @cancel="cancelLogout"
      />
    </div>
  </nav>
</template>

<style scoped>
#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100px;
  height: auto;
  cursor: pointer;
}

.date-time {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
}

.buttons {
  display: flex;
  gap: 20px;
}

.nav-button {
  padding: 10px 20px;
  font-weight: bold;
  background-color: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-transform: uppercase;
}

.nav-button:hover {
  background-color: #007bff;
  color: white;
}

.nav-button:focus {
  outline: none;
}

@media (max-width: 768px) {
  .options {
    width: 100%;
  }
  .buttons {
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
}
</style>
