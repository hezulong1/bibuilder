<script setup lang="ts">
import * as Radix from 'radix-vue';
import IconButton from '@/ui/IconButton.vue';
import TextButton from '@/ui/TextButton.vue';
</script>

<template>
  <div class="part titlebar absolute top-0 left-0 w-full h-9 border-b">
    <div class="content h-full m-auto grid grid-cols-3 grid-rows-1 gap-2 items-center">
      <div class="text-lg mx-4">Bi Editor</div>

      <Radix.ToolbarRoot class="flex items-center justify-center" loop>
        <Radix.ToolbarButton as-child>
          <IconButton class="rounded-r-none" disabled small title="后退 (Alt+LeftArrow)">
            <div class="i-vscode-arrow-left" />
          </IconButton>
        </Radix.ToolbarButton>

        <Radix.ToolbarButton as-child>
          <IconButton class="rounded-l-none" small title="前进 (Alt+RightArrow)">
            <div class="i-vscode-arrow-right" />
          </IconButton>
        </Radix.ToolbarButton>
      </Radix.ToolbarRoot>

      <Radix.ToolbarRoot class="flex items-center justify-end gap-2 mr-2" loop>
        <Radix.ToolbarButton as-child>
          <TextButton :bg="false" small label="预览" />
        </Radix.ToolbarButton>

        <Radix.ToolbarButton as-child>
          <TextButton small primary label="保存" />
        </Radix.ToolbarButton>

        <Radix.ToolbarSeparator
          class="
            w-px h-5.5 mx-2 py-1
            before:content-empty
            before:block
            before:w-full before:h-full
            before:border-r
          "
        />

        <Radix.ToolbarButton as-child>
          <IconButton small>
            <div class="i-vscode-gear" />
          </IconButton>
        </Radix.ToolbarButton>
      </Radix.ToolbarRoot>
    </div>
  </div>
</template>
