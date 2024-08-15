<script setup lang="tsx">
import TitleBar from './views/TitleBar.vue';
import ActivityBar from './views/ActivityBar.vue';
import SideBar from './views/SideBar.vue';
// import Renderer from './resources/Renderer.vue';
import { Ruler4 } from '@/ui/Ruler4';
import { Ruler2 } from '@/ui/Ruler2';
import { Ruler3 } from '@/ui/Ruler3';

const { width: widthRef } = useWindowSize();

const heightRef = ref(30);
const zoomRef = ref(1);
</script>

<template>
  <TitleBar />

  <ActivityBar class="absolute top-9 left-0 bottom-0 w-12" />

  <SideBar class="left absolute top-9 left-12 bottom-0 w-90 border-x" />
  <SideBar class="right absolute top-9 bottom-0 right-0 w-90 border-l" />

  <div class="part editor absolute top-9 right-0 bottom-0 left-12 z-1">
    <!-- <Ruler
      :width="700"
      :height="30"
      :palette="{
        lineColor: '#181818',
        bgColor: '#0000',
        longfgColor: 'rgba(255,255,255,.87)',
        shortfgColor: 'rgba(255,255,255,.87)',
        fontColor: 'rgba(255,255,255,.87)',
        borderColor: 'var(--bi-primary)',
      }"
      :start-num-x="Number.NEGATIVE_INFINITY"
      :end-num-x="Number.POSITIVE_INFINITY"
      :start-num-y="Number.NEGATIVE_INFINITY"
      :end-num-y="Number.POSITIVE_INFINITY"
    /> -->
    <Ruler4
      :width="widthRef"
      :height="heightRef"
      :zoom="zoomRef"
      text-color="red"
      tick-color="rgba(255,255,255,.87)"
      fill-color="lightblue"
    />
    <br>
    {{ zoomRef }}
    <input v-model.number="zoomRef" type="range" min="0.3" max="3" step="0.1">

    <!-- <Ruler
      orientation="vertical"
      :width="heightRef"
      :height="widthRef"
      :zoom="zoomRef"
      text-color="red"
      tick-color="rgba(255,255,255,.87)"
      fill-color="lightblue"
    /> -->

    <Ruler2
      :width="widthRef"
      :height="heightRef"
      :zoom="zoomRef"
      class="w-full"
      axis-label-color="#fff"
      axis-tick-color="rgba(255,255,255,.87)"
      background-color="#181818"
    />

    <Ruler3
      :width="widthRef"
      :height="heightRef"
      :zoom="zoomRef"
      text-color="red"
      tick-color="rgba(255,255,255,.87)"
    />

    <Ruler2
      type="vertical"
      class="h-full"
      :width="heightRef"
      :height="widthRef"
      :zoom="zoomRef"
      axis-label-color="#fff"
      axis-tick-color="rgba(255,255,255,.87)"
      background-color="#181818"
    />
  </div>
</template>
