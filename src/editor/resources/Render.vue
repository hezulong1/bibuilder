<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus';
import SketchRuler from 'vue3-sketch-ruler';
import 'vue3-sketch-ruler/lib/style.css';
import CONFIG from '../config';
import { windowSize } from '@/state';

const layout = reactive([
  { x: 0, y: 0, w: 2, h: 2, i: '0', static: false },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: false },
  { x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
]);

// 更多配置,参见 https://github.com/timmywil/panzoom
const panzoomOption = reactive({
  maxScale: 3,
  minScale: 0.3,
  // startX: 0,   // 画布距离左边框距离, 如果想自动,那么不要传
  // startY: 0,   // 画布距离顶边框距离, 如果想自动,那么不要传
  disablePan: false,
  disableZoom: false,
  contain: 'none', // 'inside' | 'outside' | 'none'
  handleStartEvent: (event: Event) => {
    event.preventDefault();
  },
});

const rulerOptions = reactive({
  thick: 20,
  scale: 1,
  width: 1600,
  height: windowSize.height.value - 36,
  // canvasWidth: 1000,
  // canvasHeight: 500,
  palette: {
    bgColor: 'transparent',
    hoverBg: '#fff',
    hoverColor: '#000',
    longfgColor: '#303030', // ruler longer mark color
    fontColor: 'rgba(255,255,255,0.5)', // ruler font color
    shadowColor: '#52525200', // ruler shadow color
    lineColor: 'var(--bi-primary)',
    borderColor: '#303030',
  },
  snapsObj: { h: [0, 100, 200], v: [130] },
  shadow: {
    x: 0,
    y: 0,
    width: 300,
    height: 300,
  },
  panzoomOption,
  isShowReferLine: true,
  lines: {
    h: [0, 250],
    v: [0, 500],
  },
});

</script>

<template>
  <SketchRuler
    v-bind="rulerOptions"
  >
    <template #default>
      <GridLayout
        v-model:layout="layout"
        :col-num="CONFIG.total_columns"
        :row-height="CONFIG.row_height"
        :max-rows="CONFIG.total_rows"
        :margin="[0, 0]"
        is-draggable
        is-resizable
        is-bounded
        use-css-transforms
      >
        <GridItem
          v-for="item of layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          {{ item.i }}
        </GridItem>
      </GridLayout>
    </template>
  </SketchRuler>
</template>
