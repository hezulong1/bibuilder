<script setup lang="ts" generic="T extends string | number">
import * as Radix from 'radix-vue';

export interface TabsOption<TO> {
  value: TO;
  [K: string]: any;
}

withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal';
  wrapClass?: unknown;
  triggerClass?: unknown;
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
  <Radix.TabsRoot class="ui-Tabs" :model-value="model" :orientation="orientation" @update:model-value="handleUpdateModel">
    <Radix.TabsList :class="[{ 'relative box-center': true, 'flex-col': orientation === 'vertical' }, wrapClass]">
      <Radix.TabsTrigger
        v-for="opt of options"
        ref="buttonRefs"
        :key="opt.value"
        :value="opt.value"
        class="
          flex-1 box-center p-1
          text-gray
          hover:text-white
          data-[state=active]:text-white
          outline-none
        "
      >
        <slot name="trigger" v-bind="opt" />
      </Radix.TabsTrigger>

      <Radix.TabsIndicator
        class="
          absolute left-0 top-0
          rounded-full
          w-2px h-$radix-tabs-indicator-size
          translate-y-$radix-tabs-indicator-position
          transition-[width,transform]
          duration-300
        "
      >
        <div class="bg-primary size-full" />
      </Radix.TabsIndicator>
    </Radix.TabsList>

    <slot />
  </Radix.TabsRoot>
</template>
