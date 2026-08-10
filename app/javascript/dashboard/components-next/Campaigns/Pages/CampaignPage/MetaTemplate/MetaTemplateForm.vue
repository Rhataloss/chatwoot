<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

import Input from 'dashboard/components-next/input/Input.vue';
import ComboBox from 'dashboard/components-next/combobox/ComboBox.vue';

const { t } = useI18n();

const NAME_PATTERN = /^[a-z0-9_]+$/;
const MAX_BUTTONS = 3;

const categoryOptions = computed(() => [
  {
    value: 'MARKETING',
    label: t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.CATEGORY.OPTIONS.MARKETING'),
  },
  {
    value: 'UTILITY',
    label: t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.CATEGORY.OPTIONS.UTILITY'),
  },
  {
    value: 'AUTHENTICATION',
    label: t(
      'CAMPAIGN.META_TEMPLATES.CREATE.FORM.CATEGORY.OPTIONS.AUTHENTICATION'
    ),
  },
]);

// Subset curado de códigos de idioma soportados por WhatsApp Business.
const languageOptions = [
  { value: 'en_US', label: 'English (US)' },
  { value: 'es', label: 'Español' },
  { value: 'es_MX', label: 'Español (México)' },
  { value: 'es_ES', label: 'Español (España)' },
  { value: 'es_AR', label: 'Español (Argentina)' },
  { value: 'pt_BR', label: 'Português (Brasil)' },
  { value: 'pt_PT', label: 'Português (Portugal)' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italiano' },
  { value: 'de', label: 'Deutsch' },
];

const buttonTypeOptions = computed(() => [
  {
    value: 'QUICK_REPLY',
    label: t(
      'CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.TYPES.QUICK_REPLY'
    ),
  },
  {
    value: 'URL',
    label: t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.TYPES.URL'),
  },
  {
    value: 'PHONE_NUMBER',
    label: t(
      'CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.TYPES.PHONE_NUMBER'
    ),
  },
]);

const state = reactive({
  name: '',
  category: 'MARKETING',
  language: 'en_US',
  headerEnabled: false,
  headerText: '',
  bodyText: '',
  footerEnabled: false,
  footerText: '',
  buttons: [], // { type, text, value }
});

const buttonsValid = value =>
  value.every(button => {
    if (!button.text) return false;
    if (button.type === 'URL' || button.type === 'PHONE_NUMBER') {
      return !!button.value;
    }
    return true;
  });

const rules = {
  name: {
    required,
    validFormat: helpers.withMessage(
      'invalid format',
      value => !value || NAME_PATTERN.test(value)
    ),
  },
  category: { required },
  language: { required },
  headerText: {
    requiredIfEnabled: value => !state.headerEnabled || !!value,
  },
  bodyText: { required, minLength: minLength(1) },
  footerText: {
    requiredIfEnabled: value => !state.footerEnabled || !!value,
  },
  buttons: {
    valid: helpers.withMessage('invalid buttons', buttonsValid),
  },
};

const v$ = useVuelidate(rules, state);

const getErrorMessage = (field, errorKey) => {
  const baseKey = 'CAMPAIGN.META_TEMPLATES.CREATE.FORM';
  return v$.value[field].$error ? t(`${baseKey}.${errorKey}.ERROR`) : '';
};

const formErrors = computed(() => ({
  name: getErrorMessage('name', 'NAME_FIELD'),
  category: getErrorMessage('category', 'CATEGORY'),
  language: getErrorMessage('language', 'LANGUAGE'),
  headerText: getErrorMessage('headerText', 'HEADER_FIELD'),
  bodyText: getErrorMessage('bodyText', 'BODY_FIELD'),
  footerText: getErrorMessage('footerText', 'FOOTER_FIELD'),
  buttons: getErrorMessage('buttons', 'BUTTONS_FIELD'),
}));

const addButton = () => {
  if (state.buttons.length >= MAX_BUTTONS) return;
  state.buttons.push({ type: 'QUICK_REPLY', text: '', value: '' });
};

const removeButton = index => {
  state.buttons.splice(index, 1);
};

const buildComponents = () => {
  const components = [];

  if (state.headerEnabled && state.headerText) {
    components.push({ type: 'HEADER', format: 'TEXT', text: state.headerText });
  }

  components.push({ type: 'BODY', text: state.bodyText });

  if (state.footerEnabled && state.footerText) {
    components.push({ type: 'FOOTER', text: state.footerText });
  }

  if (state.buttons.length) {
    components.push({
      type: 'BUTTONS',
      buttons: state.buttons.map(button => {
        if (button.type === 'URL') {
          return { type: 'URL', text: button.text, url: button.value };
        }
        if (button.type === 'PHONE_NUMBER') {
          return {
            type: 'PHONE_NUMBER',
            text: button.text,
            phone_number: button.value,
          };
        }
        return { type: 'QUICK_REPLY', text: button.text };
      }),
    });
  }

  return components;
};

// Llamado por MetaTemplateDialog.vue en el @confirm del Dialog genérico.
const getPayload = () => ({
  name: state.name,
  category: state.category,
  language: state.language,
  components: buildComponents(),
});

const reset = () => {
  state.name = '';
  state.category = 'MARKETING';
  state.language = 'en_US';
  state.headerEnabled = false;
  state.headerText = '';
  state.bodyText = '';
  state.footerEnabled = false;
  state.footerText = '';
  state.buttons = [];
  v$.value.$reset();
};

// Se expone para que el Dialog padre valide antes de llamar a la API,
// lea los valores actuales y resetee tras un submit exitoso.
defineExpose({ v$, getPayload, reset });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Input
      v-model="state.name"
      :label="t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.NAME_FIELD.LABEL')"
      :placeholder="
        t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.NAME_FIELD.PLACEHOLDER')
      "
      :message="
        formErrors.name ||
        t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.NAME_FIELD.INFO')
      "
      :message-type="formErrors.name ? 'error' : 'info'"
    />

    <div class="flex flex-col gap-1">
      <label class="mb-0.5 text-sm font-medium text-n-slate-12">
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.CATEGORY.LABEL') }}
      </label>
      <ComboBox
        v-model="state.category"
        :options="categoryOptions"
        :has-error="!!formErrors.category"
        :message="formErrors.category"
        class="[&>div>button]:bg-n-alpha-black2 [&>div>button:not(.focused)]:dark:outline-n-weak [&>div>button:not(.focused)]:hover:!outline-n-slate-6"
      />
    </div>

    <div class="flex flex-col gap-1">
      <label class="mb-0.5 text-sm font-medium text-n-slate-12">
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.LANGUAGE.LABEL') }}
      </label>
      <ComboBox
        v-model="state.language"
        :options="languageOptions"
        :has-error="!!formErrors.language"
        :message="formErrors.language"
        class="[&>div>button]:bg-n-alpha-black2 [&>div>button:not(.focused)]:dark:outline-n-weak [&>div>button:not(.focused)]:hover:!outline-n-slate-6"
      />
    </div>

    <!-- HEADER (opcional) -->
    <div class="flex flex-col gap-1 border-t border-n-weak pt-4">
      <label
        class="flex items-center gap-2 text-sm font-medium text-n-slate-12"
      >
        <input v-model="state.headerEnabled" type="checkbox" class="rounded" />
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.HEADER_FIELD.TOGGLE') }}
      </label>
      <Input
        v-if="state.headerEnabled"
        v-model="state.headerText"
        :placeholder="
          t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.HEADER_FIELD.PLACEHOLDER')
        "
        :message="formErrors.headerText"
        :message-type="formErrors.headerText ? 'error' : 'info'"
      />
    </div>

    <!-- BODY (requerido) -->
    <div class="flex flex-col gap-1">
      <label class="mb-0.5 text-sm font-medium text-n-slate-12">
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BODY_FIELD.LABEL') }}
      </label>
      <textarea
        v-model="state.bodyText"
        rows="4"
        :placeholder="
          t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BODY_FIELD.PLACEHOLDER')
        "
        class="w-full rounded-lg border border-n-weak bg-n-alpha-black2 p-2 text-sm text-n-slate-12 outline-none focus:border-n-blue-9"
        :class="{ 'border-n-ruby-9': formErrors.bodyText }"
      />
      <p class="mt-1 text-xs text-n-slate-11">
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BODY_FIELD.INFO') }}
      </p>
      <p v-if="formErrors.bodyText" class="text-xs text-n-ruby-9">
        {{ formErrors.bodyText }}
      </p>
    </div>

    <!-- FOOTER (opcional) -->
    <div class="flex flex-col gap-1">
      <label
        class="flex items-center gap-2 text-sm font-medium text-n-slate-12"
      >
        <input v-model="state.footerEnabled" type="checkbox" class="rounded" />
        {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.FOOTER_FIELD.TOGGLE') }}
      </label>
      <Input
        v-if="state.footerEnabled"
        v-model="state.footerText"
        :placeholder="
          t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.FOOTER_FIELD.PLACEHOLDER')
        "
        :message="formErrors.footerText"
        :message-type="formErrors.footerText ? 'error' : 'info'"
      />
    </div>

    <!-- BUTTONS (opcional, dinámico, máx 3) -->
    <div class="flex flex-col gap-2 border-t border-n-weak pt-4">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-n-slate-12">
          {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.LABEL') }}
        </label>
        <button
          type="button"
          class="text-xs text-n-blue-11 hover:underline disabled:opacity-50"
          :disabled="state.buttons.length >= 3"
          @click="addButton"
        >
          {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.ADD') }}
        </button>
      </div>

      <div
        v-for="(button, index) in state.buttons"
        :key="index"
        class="flex flex-col gap-2 rounded-lg border border-n-weak p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <ComboBox
            v-model="button.type"
            :options="buttonTypeOptions"
            class="flex-1 [&>div>button]:bg-n-alpha-black2 [&>div>button:not(.focused)]:dark:outline-n-weak [&>div>button:not(.focused)]:hover:!outline-n-slate-6"
          />
          <button
            type="button"
            class="text-xs text-n-ruby-11 hover:underline"
            @click="removeButton(index)"
          >
            {{ t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.REMOVE') }}
          </button>
        </div>

        <Input
          v-model="button.text"
          :placeholder="
            t(
              'CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.TEXT_PLACEHOLDER'
            )
          "
        />

        <Input
          v-if="button.type === 'URL'"
          v-model="button.value"
          :placeholder="
            t(
              'CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.URL_PLACEHOLDER'
            )
          "
        />

        <Input
          v-if="button.type === 'PHONE_NUMBER'"
          v-model="button.value"
          :placeholder="
            t(
              'CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS_FIELD.PHONE_PLACEHOLDER'
            )
          "
        />
      </div>

      <p v-if="formErrors.buttons" class="text-xs text-n-ruby-9">
        {{ formErrors.buttons }}
      </p>
    </div>
  </div>
</template>
