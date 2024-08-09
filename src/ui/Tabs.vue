<script setup lang="ts" generic="T extends string | number">
import * as Radix from 'radix-vue';

export interface TabsOption<TO> {
  value: TO;
  [K: string]: any;
}

withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal';
  options?: TabsOption<T>[];
}>(), {
  orientation: 'horizontal',
});

defineSlots<{
  default(): void;
  trigger(opt: TabsOption<T>): void;
}>();

const model = defineModel<T>({ required: true });

function handleUpdateModel(payload: T) {
  model.value = payload;
}
</script>

<template>
  <Radix.TabsRoot :model-value="model" :orientation="orientation" @update:model-value="handleUpdateModel">
    <Radix.TabsList>
      <Radix.TabsIndicator class="absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300">
        <div class="bg-grass8 w-full h-full" />
      </Radix.TabsIndicator>

      <Radix.TabsTrigger v-for="opt of options" :key="opt.value" :value="opt.value">
        <slot name="trigger" v-bind="opt" />
      </Radix.TabsTrigger>
    </Radix.TabsList>

    <slot />
  </Radix.TabsRoot>
</template>
