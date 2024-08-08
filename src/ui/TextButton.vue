<script setup lang="ts">
const props = defineProps<{
  label?: string;
  primary?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (type: 'click', event: PointerEvent): void;
}>();

const hover = ref(false);
const active = ref(false);

const classNames = computed(() => {
  const result = [];

  if (props.primary) {
    result.push('bg-primary');
    hover.value && result.push('bg-primaryHover');
    active.value && result.push('!bg-primaryActive');
  } else {
    result.push('bg-default border-default');
    hover.value && result.push('bg-defaultHover');
    active.value && result.push('!bg-defaultActive');
  }

  if (props.disabled) {
    result.push('cursor-default op40');
  }

  return result;
});

function handleClick(e: Event) {
  if (props.disabled) return;
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
    class="ui-TextButton
      inline-flex items-center justify-center min-w-12 h-28px py-1 px-1.5
      rounded-sm align-top
      text-sm
      transition-colors duration-300
      no-underline
    "
    :class="classNames"
    :disabled="disabled"
    :aria-disabled="disabled"
    role="button"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @click="handleClick"
  >
    <span>{{ label }}</span>
  </a>
</template>
