<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string;
  primary?: boolean;
  small?: boolean;
  bg?: boolean;
  outline?: boolean;
  disabled?: boolean;
}>(), {
  bg: true,
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
    result.push('text-xs min-w-10 h-5.5 p-1');
  } else {
    result.push('text-sm min-w-12 h-7 py-1 px-1.5');
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
    class="ui-TextButton
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
    <slot><span>{{ label }}</span></slot>
  </a>
</template>
