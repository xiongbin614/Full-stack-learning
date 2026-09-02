<script setup lang="ts">
import LoginModal from "@/components/LoginModal.vue";
</script>

<template>
  <div class="app-shell">
    <RouterView />
    <LoginModal />
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
}
</style>
