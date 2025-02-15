<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addUser } from "../services/user_service";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";

const router = useRouter();

const username = ref<string>("");
const email = ref<string>("");
const showErrorMessage = ref<boolean>(false);
const errorMessage = ref<string>("");

async function createUser(): Promise<void> {
  if (username.value && email.value) {
    try {
      const userRequestDTO = {
        username: username.value,
        email: email.value,
      };

      await addUser(userRequestDTO);
      localStorage.setItem("firstLogin", "true");

      router.push("/");
    } catch (error) {
      showErrorMessage.value = true;
      errorMessage.value = "User already exists or failed to create user.";
    }
  } else {
    showErrorMessage.value = true;
    errorMessage.value = "All fields are required.";
  }
}
</script>

<template>
  <div class="container">
    <div class="loginCard">
      <div class="header">
        <FormTitle label="Create New User" class="form-title" />
      </div>
      <div v-if="showErrorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div>
        <CustomInput
          type="text"
          id="username-input"
          placeholder="Username"
          v-model:model-value="username"
          :widthInPx="350"
        />
      </div>
      <div>
        <CustomInput
          type="email"
          id="email-input"
          placeholder="Email"
          v-model:model-value="email"
          :widthInPx="350"
        />
      </div>
      <div>
        <CustomButton id="create-user" @click="createUser" class="btn-primary">
          Create User
        </CustomButton>
      </div>
      <div class="links">
        <router-link to="/" class="existing-member-link">
          Already a member? Log in now!
        </router-link>
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
  background-color: #f5f7fa;
  margin: 0;
}

.loginCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 50px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.loginCard:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
}

.header {
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
  margin-left: 13vh;
}

.form-title {
  font-size: 24px;
  white-space: nowrap;
}

input {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 25px;
  width: 100%;
  max-width: 350px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.links {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 350px;
  margin-top: 20px;
}

.existing-member-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.existing-member-link:hover {
  color: #0056b3;
}

@media (max-width: 480px) {
  .loginCard {
    padding: 40px;
  }

  .form-title {
    font-size: 28px;
  }

  input {
    max-width: 100%;
  }
}
</style>
