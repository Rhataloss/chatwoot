<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { OnClickOutside } from '@vueuse/components';
import Icon from 'dashboard/components-next/icon/Icon.vue';
import { useUserGuide } from './useUserGuide';

const { t } = useI18n();
const { modules, startTour } = useUserGuide();

const isMenuOpen = ref(false);
const isBusy = ref(false);

const toggleMenu = () => {
  if (isBusy.value) return;
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleStartModule = moduleKey => {
  isMenuOpen.value = false;
  isBusy.value = true;
  // let the menu close before the driver overlay mounts
  setTimeout(async () => {
    try {
      await startTour(moduleKey);
    } finally {
      isBusy.value = false;
    }
  }, 120);
};
</script>

<template>
  <div class="relative flex-shrink-0">
    <button
      type="button"
      data-tour="user-guide-trigger"
      class="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-start text-n-slate-11 hover:bg-n-alpha-2 transition-colors outline-transparent focus-visible:bg-n-alpha-2"
      :title="t('USER_GUIDE.TITLE')"
      @click="toggleMenu"
    >
      <Icon icon="i-lucide-circle-help" class="size-5 text-n-brand" />
      <span v-if="!isMenuOpen && $slots.default" class="truncate text-sm">
        <slot />
      </span>
    </button>

    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-n-alpha-black1 backdrop-blur-[4px]"
      >
        <OnClickOutside @trigger="closeMenu">
          <div
            class="flex flex-col w-full max-w-lg gap-6 p-6 mx-4 text-start bg-n-alpha-3 backdrop-blur-[100px] shadow-xl rounded-xl border border-n-weak"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center size-9 rounded-lg bg-n-alpha-2"
                >
                  <Icon
                    icon="i-lucide-circle-help"
                    class="size-5 text-n-brand"
                  />
                </div>
                <div>
                  <h3 class="text-base font-medium text-n-slate-12">
                    {{ t('USER_GUIDE.TITLE') }}
                  </h3>
                  <p class="text-sm text-n-slate-11">
                    {{ t('USER_GUIDE.SUBTITLE') }}
                  </p>
                </div>
              </div>
              <button
                class="flex items-center justify-center size-8 rounded-lg text-n-slate-11 hover:bg-n-alpha-2 transition-colors"
                @click="closeMenu"
              >
                <Icon icon="i-lucide-x" class="size-4" />
              </button>
            </div>

            <div class="flex flex-col gap-2">
              <button
                class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors hover:bg-n-alpha-2 group"
                :disabled="isBusy"
                @click="handleStartModule('full')"
              >
                <div
                  class="flex items-center justify-center size-10 rounded-lg bg-n-brand/10 text-n-brand group-hover:bg-n-brand/20 transition-colors"
                >
                  <Icon icon="i-lucide-play" class="size-5" />
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-medium text-n-slate-12">
                    {{ t('USER_GUIDE.FULL_TOUR') }}
                  </span>
                  <span class="text-xs text-n-slate-11">
                    {{ t('USER_GUIDE.FULL_TOUR_DESCRIPTION') }}
                  </span>
                </div>
                <Icon
                  icon="i-lucide-chevron-right"
                  class="size-4 text-n-slate-10 ml-auto"
                />
              </button>

              <div class="h-px bg-n-weak my-1" />

              <p
                class="text-xs font-medium text-n-slate-10 uppercase tracking-wider px-1"
              >
                {{ t('USER_GUIDE.SELECT_MODULE') }}
              </p>

              <button
                v-for="mod in modules.filter(m => m.key !== 'full')"
                :key="mod.key"
                class="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left transition-colors hover:bg-n-alpha-2 group"
                :disabled="isBusy"
                @click="handleStartModule(mod.key)"
              >
                <div
                  class="flex items-center justify-center size-8 rounded-lg bg-n-alpha-2 group-hover:bg-n-alpha-3 transition-colors"
                >
                  <Icon :icon="mod.icon" class="size-4 text-n-slate-11" />
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm text-n-slate-12">{{ mod.label }}</span>
                  <span class="text-xs text-n-slate-11">{{
                    mod.description
                  }}</span>
                </div>
                <Icon
                  icon="i-lucide-chevron-right"
                  class="size-3 text-n-slate-10 ml-auto"
                />
              </button>
            </div>
          </div>
        </OnClickOutside>
      </div>
    </Teleport>
  </div>
</template>
