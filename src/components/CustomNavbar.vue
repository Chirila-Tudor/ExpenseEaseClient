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
    router.push(salaries.length > 0 ? "/salaries" : "/add-salary");
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

const redirectTo = (path: string) => {
  router.push(path);
};

const handleClick = () => {
  if (username.value) isModalVisible.value = true;
};

const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  username.value = "";
  userRole.value = "";
  router.push({ name: "default" });
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
          @click="checkSalary"
          >Salary</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectTo('/all-expenses')"
          >Expenses</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectTo('/transactions')"
          >Transactions</CustomButton
        >
        <CustomButton
          v-if="userRole === 'User' || userRole === 'Admin'"
          class="nav-button"
          @click="redirectTo('/all-savings')"
          >Savings</CustomButton
        >
      </div>
    </div>

    <div>
      <CustomButton class="nav-button" :id="buttonId" @click="handleClick">
        {{ buttonText }}
      </CustomButton>
      <CustomModal
        v-if="isModalVisible"
        title="Log Out"
        message="Are you sure?"
        @confirm="logout"
        @cancel="isModalVisible = false"
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
  flex-wrap: wrap; /* Ensures elements wrap if necessary */
}

/* Date and Time */
.date-time {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Buttons Container */
.options {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
}

.buttons {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping when necessary */
  gap: 10px; /* Space between buttons */
  justify-content: center;
}

/* Buttons */
.nav-button {
  padding: 10px 15px;
  font-weight: bold;
  background-color: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-transform: uppercase;
  white-space: nowrap; /* Prevents buttons from breaking into two lines */
}

.nav-button:hover {
  background-color: #007bff;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  #navbar {
    flex-direction: row; /* Keeps everything in a row */
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px; /* Adds space between elements */
  }

  .date-time {
    margin-bottom: 0; /* Removes extra space */
    order: -1; /* Moves the date-time to the left on small screens */
  }

  .options {
    width: auto;
  }

  .buttons {
    flex-wrap: wrap; /* Allows wrapping if necessary but keeps in a row */
    justify-content: center;
  }

  .nav-button {
    width: auto; /* Allows buttons to stay next to each other */
    flex-grow: 1; /* Helps distribute space evenly */
  }
}
</style>
