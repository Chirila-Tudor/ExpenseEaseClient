<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { forgotPassword } from "../services/user_service";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";

const router = useRouter();
const username = ref<string>("");
const showErrorMessage = ref<boolean>(false);
const errorMessage = ref<string>("");

async function fetchForgotPassword() {
  if (!username.value) {
    showErrorMessage.value = true;
    errorMessage.value = "Username is required.";
    return;
  }

  try {
    await forgotPassword(username.value);
    router.push("/verify-code");
  } catch (error) {
    showErrorMessage.value = true;
    errorMessage.value = "Failed to send reset request. Please try again.";
  }
}
function redirectToHome() {
  router.push("/");
}
</script>

<template>
  <div class="container">
    <div class="forgot-password-card">
      <div class="header">
        <span
          class="material-symbols-outlined"
          @click="redirectToHome"
          style="cursor: pointer"
        >
          home
        </span>
        <FormTitle label="Forgot Password" class="form-title" />
      </div>
      <div v-if="showErrorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="input-field">
        <CustomInput
          type="text"
          id="username"
          placeholder="Enter your username"
          v-model:model-value="username"
          :widthInPx="350"
        />
      </div>
      <div class="button-container">
        <CustomButton
          id="submit-request"
          @click="fetchForgotPassword"
          class="btn-primary"
        >
          Submit
        </CustomButton>
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
}

.forgot-password-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 450px;
  padding: 50px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header {
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  gap: 10px;
  margin-left: 10vh;
  align-items: center;
}

.form-title {
  font-size: 24px;
  white-space: nowrap;
}

.input-field {
  width: 100%;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.btn-primary {
  padding: 16px 32px;
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

@media (max-width: 480px) {
  .forgot-password-card {
    padding: 40px;
  }

  .form-title {
    font-size: 28px;
  }

  .input-field {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>
