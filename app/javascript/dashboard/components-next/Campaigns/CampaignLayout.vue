<script setup>
import { vOnClickOutside } from '@vueuse/components';
import Button from 'dashboard/components-next/button/Button.vue';

defineProps({
  headerTitle: {
    type: String,
    default: '',
  },
  buttonLabel: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['click', 'close']);

const handleButtonClick = () => {
  emit('click');
};
</script>

<template>
  <section class="flex flex-col w-full h-full overflow-hidden bg-n-surface-1">
    <header class="sticky top-0 z-10 px-6" data-tour="campaign-header">
      <div class="w-full max-w-5xl mx-auto">
        <div class="flex items-center justify-between w-full h-20 gap-2">
          <span class="text-heading-1 text-n-slate-12">
            {{ headerTitle }}
          </span>
          <div
            v-on-click-outside="[
              e => {
                const dialogEl = e?.target?.closest('dialog');
                console.log('CAMPAIGNLAYOUT CLOSE target:', e?.target);
                console.log('CAMPAIGNLAYOUT closest dialog:', dialogEl);
                console.log(
                  'CAMPAIGNLAYOUT dialog has open attr:',
                  dialogEl?.hasAttribute('open')
                );
                if (dialogEl?.hasAttribute('open')) {
                  return;
                }
                emit('close');
              },
              // This will prevent closing the modal when the editor Create link popup is open
              {
                ignore: ['dialog.ProseMirror-prompt-backdrop', 'dialog[open]'],
              },
            ]"
            class="relative group/campaign-button"
            data-tour="new-campaign"
          >
            <Button
              :label="buttonLabel"
              icon="i-lucide-plus"
              size="sm"
              class="group-hover/campaign-button:brightness-110"
              @click="handleButtonClick"
            />
            <slot name="action" />
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1 px-6 overflow-y-auto">
      <div class="w-full max-w-5xl mx-auto py-4">
        <slot name="default" />
      </div>
    </main>
  </section>
</template>
