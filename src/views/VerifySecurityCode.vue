<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { requestPassword } from "../services/user_service";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";

const router = useRouter();
const username = ref<string>("");
const securityCode = ref<string>("");
const showErrorMessage = ref<boolean>(false);
const errorMessage = ref<string>("");

async function fetchRequestPassword() {
  if (!username.value || !securityCode.value) {
    showErrorMessage.value = true;
    errorMessage.value = "All fields are required.";
    return;
  }

  try {
    await requestPassword(username.value, securityCode.value);
    router.push("/");
  } catch (error) {
    showErrorMessage.value = true;
    errorMessage.value = "Invalid code or username. Please try again.";
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <FormTitle label="Verify Security Code" class="form-title" />
      </div>
      <div v-if="showErrorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="input-group">
        <CustomInput
          type="text"
          id="username"
          placeholder="Enter your username"
          v-model:model-value="username"
          :widthInPx="350"
        />
        <CustomInput
          type="text"
          id="securityCode"
          placeholder="Enter security code"
          v-model:model-value="securityCode"
          :widthInPx="350"
        />
      </div>
      <div class="button-container">
        <CustomButton
          id="submit-request"
          @click="fetchRequestPassword"
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

.card {
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

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
}

.header {
  width: 100%;
  margin-bottom: 30px;
  text-align: center;
}

.form-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
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
  .card {
    padding: 40px;
  }

  .form-title {
    font-size: 28px;
  }

  .btn-primary {
    width: 100%;
  }
}
</style>
