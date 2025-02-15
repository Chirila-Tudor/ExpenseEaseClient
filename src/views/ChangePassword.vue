<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormTitle from "../components/FormTitle.vue";
import PasswordInput from "../components/PasswordInput.vue";
import CustomButton from "../components/CustomButton.vue";
import { changePassword } from "../services/user_service";

const router = useRouter();

const oldPassword = ref<string>("");
const newPassword = ref<string>("");
const confirmNewPassword = ref<string>("");
const showErrorMessage = ref<boolean>(false);
const errorMessage = ref<string>("");
const passwordLength = ref<number>(0);
const containsTwelveCharacters = ref<boolean>(false);
const containsNumber = ref<boolean>(false);
const containsUppercase = ref<boolean>(false);
const containsSpecialCharacter = ref<boolean>(false);

function submit() {
  if (oldPassword.value && newPassword.value && confirmNewPassword.value) {
    if (newPassword.value === confirmNewPassword.value) {
      let passwordFormatOK = true;
      const upperCaseRegex = /[A-Z]/;
      const specialCharacterRegex = /[#$^&*_@!?]/;

      if (newPassword.value.length < 12) {
        errorMessage.value =
          "The new password must contain at least 12 characters";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if (!upperCaseRegex.test(newPassword.value) && passwordFormatOK) {
        errorMessage.value =
          "The new password must contain at least one uppercase character";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if (!specialCharacterRegex.test(newPassword.value) && passwordFormatOK) {
        errorMessage.value =
          "The new password must contain at least one special character(#$^&*_@)";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }
      if (passwordFormatOK) {
        changePassword({
          username: localStorage.getItem("username")!,
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        })
          .then(() => {
            router.push("/");
          })
          .catch(() => {
            errorMessage.value = "Old password is incorrect";
            showErrorMessage.value = true;
          });
      }
    } else {
      errorMessage.value = "Passwords are not equal";
      showErrorMessage.value = true;
    }
  } else {
    errorMessage.value = "All fields must be completed";
    showErrorMessage.value = true;
  }
}

function handleOldPasswordTextChanged(password: string) {
  oldPassword.value = password;
}

function handleNewPasswordTextChanged(password: string) {
  newPassword.value = password;
}

function handleConfirmPasswordTextChanged(password: string) {
  confirmNewPassword.value = password;
}

function checkPassword() {
  passwordLength.value = newPassword.value.length;
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\,.<>\/?]/;

  containsTwelveCharacters.value = passwordLength.value >= 12;
  containsNumber.value = /\d/.test(newPassword.value);
  containsUppercase.value = /[A-Z]/.test(newPassword.value);
  containsSpecialCharacter.value = format.test(newPassword.value);
}
</script>

<template>
  <div class="container">
    <div class="form-container">
      <div class="header">
        <FormTitle label="Change Password" class="form-title" />
      </div>
      <div v-if="showErrorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="input-field">
        <PasswordInput
          :label="'Old password'"
          :value="oldPassword"
          :widthInPx="350"
          @password-changed="handleOldPasswordTextChanged"
          @keyup="checkPassword"
        />
      </div>
      <div class="input-field">
        <PasswordInput
          :label="'New password'"
          :value="newPassword"
          :widthInPx="350"
          @password-changed="handleNewPasswordTextChanged"
          @keyup="checkPassword"
        />
      </div>
      <div class="input-field">
        <PasswordInput
          :label="'Confirm new password'"
          :value="confirmNewPassword"
          :widthInPx="350"
          @password-changed="handleConfirmPasswordTextChanged"
          @enter-password="submit"
        />
      </div>
      <div class="button-container">
        <CustomButton
          id="change-password"
          @click="submit"
          class="btn-primary"
          :widthInPx="200"
        >
          Schimbă parola
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
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  padding: 50px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-container:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1);
}

.header {
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-title {
  font-size: 24px;
  white-space: nowrap;
}

.input-field {
  margin-bottom: 25px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
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

@media (max-width: 480px) {
  .form-container {
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
