import { ref, computed, nextTick } from 'vue';
import { driver } from 'driver.js';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import {
  getModuleSteps,
  getModuleMeta,
  getAllModuleKeys,
  guideModules,
} from './guideSteps';

import 'driver.js/dist/driver.css';

const isTourActive = ref(false);
const activeModule = ref(null);
let driverInstance = null;

const NAVIGATE_WAIT = 400;
const PAGE_LOAD_WAIT = 700;

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function useUserGuide() {
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();

  function resolveAccountId() {
    return route.value?.params?.accountId || null;
  }

  function withAccountId(routeName) {
    const accountId = resolveAccountId();
    if (!accountId) {
      return { name: routeName };
    }
    return { name: routeName, params: { accountId } };
  }

  function translateStep(step) {
    if (!step?.popover) return step;
    return {
      ...step,
      popover: {
        ...step.popover,
        title: t(step.popover.titleKey),
        description: t(step.popover.descriptionKey),
      },
    };
  }

  async function navigateTo(routeName) {
    if (router.currentRoute.value.name === routeName) {
      await sleep(PAGE_LOAD_WAIT);
      return;
    }
    await router.push(withAccountId(routeName));
    await nextTick();
    await sleep(NAVIGATE_WAIT);
    await sleep(PAGE_LOAD_WAIT);
  }

  function prepare(page) {
    // Optional hook to prepare the UI before highlighting elements.
    if (page?.prepareName === 'expand-sidebar') {
      const sidebar = document.querySelector('[data-tour="sidebar"]');
      if (sidebar) {
        sidebar.dispatchEvent(new CustomEvent('tour-expand-request'));
      }
    }
  }

  function filterExisting(steps) {
    if (!Array.isArray(steps)) return steps;
    return steps.filter(step => {
      if (!step?.element) return true;
      return Boolean(document.querySelector(step.element));
    });
  }

  function createDriver(onFinish) {
    if (driverInstance) {
      try {
        driverInstance.destroy();
      } catch (e) {
        // ignore
      }
    }

    driverInstance = driver({
      animate: false,
      showProgress: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      overlayOpacity: 0.5,
      stagePadding: 6,
      stageRadius: 6,
      popoverClass: 'woot-driver-popover',
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: t('USER_GUIDE.NEXT'),
      prevBtnText: t('USER_GUIDE.PREVIOUS'),
      doneBtnText: t('USER_GUIDE.DONE'),
      onDestroyStarted: () => {
        if (driverInstance) {
          driverInstance.destroy();
        }
        if (onFinish) onFinish();
      },
      onDeselected: () => {
        if (onFinish) onFinish();
      },
    });

    return driverInstance;
  }

  function runPage(steps) {
    const filtered = filterExisting(steps).map(translateStep);
    return new Promise(resolve => {
      if (filtered.length === 0) {
        resolve();
        return;
      }
      let finished = false;
      const instance = createDriver(() => {
        if (finished) return;
        finished = true;
        resolve();
      });
      instance.setSteps(filtered);
      instance.drive();
      // Safety net: never leave the tour stuck open.
      setTimeout(() => {
        if (!finished) {
          finished = true;
          resolve();
        }
      }, 60000);
    });
  }

  async function runTour(moduleKey) {
    const pages = getModuleSteps(moduleKey);
    if (!pages || pages.length === 0) return;

    // Sequential flow: chain every page, advancing routes automatically.
    // Each page must fully complete before the next one starts.
    // eslint-disable-next-line no-restricted-syntax -- sequential dependency
    for (let i = 0; i < pages.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop -- sequence required
      const page = pages[i];
      if (page?.route) {
        // eslint-disable-next-line no-await-in-loop -- wait for route change
        await navigateTo(page.route);
      }
      prepare(page);
      // eslint-disable-next-line no-await-in-loop
      await sleep(100);
      const steps = page.steps || [];
      if (steps.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await runPage(steps);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await sleep(PAGE_LOAD_WAIT);
      }
    }
  }

  async function startTour(moduleKey) {
    try {
      activeModule.value = moduleKey || 'full';
      isTourActive.value = true;
      await runTour(moduleKey || 'full');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('UserGuide startTour error:', error);
    } finally {
      isTourActive.value = false;
      activeModule.value = null;
    }
  }

  function stopTour() {
    if (driverInstance) {
      driverInstance.destroy();
    }
    isTourActive.value = false;
    activeModule.value = null;
  }

  const modules = computed(() => {
    return getAllModuleKeys().map(key => ({
      key,
      label: t(guideModules[key].labelKey),
      description: t(guideModules[key].descriptionKey),
      icon: guideModules[key].icon,
    }));
  });

  return {
    isTourActive,
    activeModule,
    modules,
    startTour,
    stopTour,
    getModuleSteps,
    getModuleMeta,
  };
}
