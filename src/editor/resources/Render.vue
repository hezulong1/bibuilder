<script setup lang="ts">
import { GridLayout, GridItem } from 'grid-layout-plus';
import CONFIG from '../config';

const layout = reactive([
  { x: 0, y: 0, w: 2, h: 2, i: '0', static: false },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: false },
  { x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
]);

</script>

<template>
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
