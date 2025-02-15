<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../services/user_service";
import sha256 from "crypto-js/sha256";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import PasswordInput from "../components/PasswordInput.vue";
import CustomButton from "../components/CustomButton.vue";

const router = useRouter();

const username = ref<string>("");
const passwordText = ref<string>("");
const showErrorMessage = ref<boolean>(false);
const errorMessage = ref<string>("");

async function login(): Promise<void> {
  if (username.value && passwordText.value) {
    try {
      await loginUser(username.value, sha256(passwordText.value).toString());
      const firstLogin = localStorage.getItem("isFirstLogin");
      if (firstLogin === "true") {
        router.push("/change-password");
      } else {
        window.location.replace("/expenses");
      }
    } catch (error) {
      passwordText.value = "";
      showErrorMessage.value = true;
      errorMessage.value = "Incorrect username or password. Please try again.";
    }
  } else {
    showErrorMessage.value = true;
    errorMessage.value = "The fields must not be empty";
    passwordText.value = "";
  }
}

function handlePasswordTextChanged(password: string): void {
  passwordText.value = password;
}
</script>

<template>
  <div class="container">
    <div class="loginCard">
      <div class="header">
        <FormTitle label="Log In" class="form-title" />
      </div>
      <div v-if="showErrorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div>
        <CustomInput
          type="text"
          id="email-input"
          placeholder="Username"
          v-model:model-value="username"
          :widthInPx="350"
        />
      </div>
      <div>
        <PasswordInput
          :label="'Password'"
          :value="passwordText"
          @password-changed="handlePasswordTextChanged"
          @enter-password="login"
          :widthInPx="350"
        />
      </div>
      <div>
        <CustomButton id="sign-in" @click="login" class="btn-primary">
          Log In
        </CustomButton>
      </div>
      <div class="links">
        <router-link to="/recovery" class="forgot-password-link">
          Forgot password?
        </router-link>
        <router-link to="/new-user" class="new-member-link">
          New Member? Register now!
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

/* Header section with the title */
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

/* Input fields with smooth transitions */
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

/* Error message style */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

/* Buttons with modern hover effects */
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

/* Link section at the bottom */
.links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 350px;
  margin-top: 20px;
}

.forgot-password-link,
.new-member-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password-link:hover,
.new-member-link:hover {
  color: #0056b3;
}

/* Responsiveness for smaller screens */
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
