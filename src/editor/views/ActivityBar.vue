<script setup lang="tsx">
import Tabs from '@/ui/Tabs.vue';

const activities = ref([
  { value: 'line-chart', label: '折现图', icon: () => <div class="i-vscode-home" /> },
  { value: 'bar-chart', label: '柱状图', icon: () => <div class="i-vscode-search" /> },
]);

const currentActivity = ref('line-chart');
</script>

<template>
  <div class="part activitybar">
    <div class="content">
      <Tabs v-model="currentActivity" :options="activities" orientation="vertical">
        <template #trigger="opt">
          <tippy
            :content="opt.label"
            theme="tooltip"
            placement="right"
            class="box-center flex-col items-center h-10 text-sm"
          >
            <component :is="opt.icon" class="size-6" />
          </tippy>
        </template>
      </Tabs>
    </div>
  </div>
</template>
