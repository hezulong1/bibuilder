<script setup lang="tsx">
import TitleBar from './views/TitleBar.vue';
import ActivityBar from './views/ActivityBar.vue';
import SideBar from './views/SideBar.vue';
import Render from './resources/Render.vue';
</script>

<template>
  <TitleBar />

  <ActivityBar class="absolute top-9 left-0 bottom-0 w-12" />

  <SideBar class="left absolute top-9 left-12 bottom-0 w-90 border-x" />
  <SideBar class="right absolute top-9 bottom-0 right-0 w-90 border-l" />

  <div class="part editor absolute top-9 right-90 bottom-0 left-102">
    <Render />
  </div>
</template>
