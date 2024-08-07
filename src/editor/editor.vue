<script setup lang="ts">
import './editor.css';
import TitleBar from './views/TitleBar.vue';
import ActivityBar from './views/ActivityBar.vue';
import SideBar from './views/SideBar.vue';
</script>

<template>
  <TitleBar />

  <ActivityBar />

  <SideBar class="left" />
  <SideBar class="right" />

  <div class="part editor text-accent">
    <div class="content" />
  </div>
</template>
