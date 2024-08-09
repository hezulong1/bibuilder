<script setup lang="tsx">
import TitleBar from './views/TitleBar.vue';
import ActivityBar from './views/ActivityBar.vue';
import SideBar from './views/SideBar.vue';
import TextButton from '@/ui/TextButton.vue';
import IconButton from '@/ui/IconButton.vue';
</script>

<template>
  <TitleBar />

  <ActivityBar class="absolute top-9 left-0 bottom-0 w-12" />

  <SideBar class="left absolute top-9 left-12 bottom-0 w-90 border-x" />
  <SideBar class="right absolute top-9 bottom-0 right-0 w-90 border-l" />

  <div class="part editor absolute top-9 right-90 bottom-0 left-102">
    <div class="content p-6">
      <TextButton label="default" />
      <TextButton label="primary" primary class="ml-1" />
      <TextButton label="default" disabled class="ml-1" />
      <TextButton label="primary" primary disabled class="ml-1" />

      <IconButton class="ml-1" title="Support（Alt+ArrowLeft）">
        <div class="i-vscode-debug-reverse-continue" />
      </IconButton>

      <IconButton class="ml-1" primary title="Home">
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="home"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
        </svg>
      </IconButton>
    </div>
  </div>
</template>
