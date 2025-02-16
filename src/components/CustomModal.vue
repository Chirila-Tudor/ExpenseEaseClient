<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (event: "confirm"): void;
  (event: "cancel"): void;
}>();

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="button-group">
        <button @click="cancel" class="cancel-button">No</button>
        <button @click="confirm" class="confirm-button">Yes</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 50;
}

.modal-container {
  background-color: white;
  color: black;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

p {
  margin-top: 0.5rem;
  color: #555;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cancel-button {
  background-color: #e5e7eb;
  color: #374151;
}

.cancel-button:hover {
  background-color: #d1d5db;
}

.confirm-button {
  background-color: #2563eb;
  color: white;
}

.confirm-button:hover {
  background-color: #1d4ed8;
}
</style>
