<script setup lang="ts">
import type { TippyContent } from 'vue-tippy';

const props = withDefaults(defineProps<{
  title?: TippyContent;
  primary?: boolean;
  small?: boolean;
  bg?: boolean;
  disabled?: boolean;
  outline?: boolean;
}>(), {
  outline: true,
});

const emit = defineEmits<{
  (type: 'click', event: PointerEvent): void;
  (type: 'mouseover', event: MouseEvent): void;
  (type: 'mouseout', event: MouseEvent): void;
  (type: 'pointerdown', event: PointerEvent): void;
  (type: 'pointerup', event: PointerEvent): void;
}>();

const hover = ref(false);
const active = ref(false);
const disabledRef = computed(() => props.disabled ? true : undefined);
const tabindexRef = computed(() => props.disabled ? '-1' : '0');

const classNames = computed(() => {
  const result = [];

  if (props.primary) {
    props.bg && result.push('bg-primary');
    hover.value && result.push('bg-primaryHover');
    active.value && result.push('!bg-primaryActive');
  } else {
    props.bg && result.push('bg-default');
    hover.value && result.push('bg-defaultHover');
    active.value && result.push('!bg-defaultActive');
  }

  if (props.disabled) {
    result.push('cursor-default op40');
  } else {
    props.outline && result.push('focus:outline-primary');
  }

  if (props.small) {
    result.push('text-xs w-5.5 h-5.5');
  } else {
    result.push('text-sm w-7 h-7');
  }

  return result;
});

function handleClick(e: Event) {
  if (props.disabled) return;
  emit('click', e as PointerEvent);
}

function onMouseOver(e: MouseEvent) {
  if (props.disabled) return;
  hover.value = true;
  emit('mouseover', e);
}

function onMouseOut(e: MouseEvent) {
  hover.value = false;
  emit('mouseout', e);
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  active.value = true;
  emit('pointerdown', e);
}

function onPointerUp(e: PointerEvent) {
  active.value = false;
  emit('pointerup', e);
}
</script>

<template>
  <a
    v-tippy="{
      theme: 'tooltip',
      content: title,
    }"
    class="ui-IconButton
      inline-flex items-center justify-center
      rounded-sm align-top
      transition-colors duration-300
      no-underline
      outline-none
    "
    :class="classNames"
    :disabled="disabledRef"
    :aria-disabled="disabledRef"
    :tabindex="tabindexRef"
    role="button"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @click.capture="handleClick"
  >
    <slot />
  </a>
</template>
