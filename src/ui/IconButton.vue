<script setup lang="ts">
import { useTippy } from 'vue-tippy';

const props = defineProps<{
  title?: string;
  primary?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (type: 'click', event: PointerEvent): void;
}>();

const hover = ref(false);
const active = ref(false);
const domNodeRef = ref();

const classNames = computed(() => {
  const result = [];

  if (props.primary) {
    result.push('bg-primary');
    hover.value && result.push('bg-primaryHover');
    active.value && result.push('!bg-primaryActive');
  } else {
    result.push('bg-default');
    hover.value && result.push('bg-defaultHover');
    active.value && result.push('!bg-defaultActive');
  }

  if (props.disabled) {
    result.push('cursor-default op40');
  }

  return result;
});

const tippy = useTippy(domNodeRef, {
  content: props.title,
  interactive: false,
  hideOnClick: false,
  trigger: 'click',
});

function handleClick(e: Event) {
  if (props.disabled) return;
  tippy.show();
  emit('click', e as PointerEvent);
}

function onMouseOver(e: Event) {
  if (props.disabled) return;
  hover.value = true;
}

function onMouseOut(e: Event) {
  hover.value = false;
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  active.value = true;
}

function onPointerUp(e: PointerEvent) {
  active.value = false;
}
</script>

<template>
  <a
    ref="domNodeRef"
    class="ui-IconButton
      inline-flex items-center justify-center w-28px h-28px
      rounded-sm align-top
      text-base
      transition-colors duration-300
      no-underline
    "
    :class="classNames"
    :disabled="disabled ? 'true' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    role="button"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @click="handleClick"
  >
    <slot />
  </a>
</template>
