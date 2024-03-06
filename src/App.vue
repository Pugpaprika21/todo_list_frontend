<script setup>
import { RouterLink, RouterView } from "vue-router";
import TodoHomeView from "./views/TodoHomeView.vue";
</script>

<template>
  <div class="main">
    <header>

    </header>
    <div class="content">
      <RouterView />
    </div>
    <footer></footer>
  </div>
</template>

<style scoped>

</style>
