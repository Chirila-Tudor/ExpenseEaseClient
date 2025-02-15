<script setup>
import CustomNavbar from "./components/CustomNavbar.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const showNavbar = computed(() => {
  const currentRoute = useRoute();
  let value = true;
  if (currentRoute.name === "login") {
    value = false;
  }

  return value;
});
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style scoped></style>
