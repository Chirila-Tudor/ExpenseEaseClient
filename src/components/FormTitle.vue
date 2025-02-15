<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <span>
    <h1>{{ label }}</h1>
  </span>
</template>

<style scoped>
span {
  width: 7vw;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0vh;
}

h1 {
  font-size: 30px;
  margin: 0;
}

#name {
  color: var(--selected-color);
}
</style>
