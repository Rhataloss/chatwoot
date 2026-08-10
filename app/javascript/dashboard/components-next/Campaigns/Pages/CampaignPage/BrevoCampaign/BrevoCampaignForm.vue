<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { useMapGetter } from 'dashboard/composables/store';

import Input from 'dashboard/components-next/input/Input.vue';
import ComboBox from 'dashboard/components-next/combobox/ComboBox.vue';
import Editor from 'dashboard/components-next/Editor/Editor.vue';

const { t } = useI18n();

const formState = {
  labels: useMapGetter('labels/getLabels'),
};

const state = reactive({
  label: null,
  subject: '',
  htmlContent: '',
  sendMode: 'draft', // 'draft' | 'now' | 'schedule'
  scheduledAt: '', // valor crudo del <input type="datetime-local">
});

const rules = {
  label: { required },
  subject: { required, minLength: minLength(1) },
  htmlContent: { required, minLength: minLength(1) },
  scheduledAt: {
    requiredIfSchedule: value =>
      state.sendMode !== 'schedule' ||
      (!!value && new Date(value) > new Date()),
  },
};

const v$ = useVuelidate(rules, state);

const labelOptions = computed(() =>
  (formState.labels.value || []).map(label => ({
    value: label.title,
    label: label.title,
  }))
);

const getErrorMessage = (field, errorKey) => {
  const baseKey = 'CAMPAIGN.BREVO.CREATE.FORM';
  return v$.value[field].$error ? t(`${baseKey}.${errorKey}.ERROR`) : '';
};

const formErrors = computed(() => ({
  label: getErrorMessage('label', 'LABEL_FIELD'),
  subject: getErrorMessage('subject', 'SUBJECT'),
  htmlContent: getErrorMessage('htmlContent', 'CONTENT'),
  scheduledAt: getErrorMessage('scheduledAt', 'SEND_MODE.SCHEDULE_ERROR'),
}));

// Llamado por BrevoCampaignDialog.vue en el @confirm del Dialog genérico.
const getPayload = () => ({
  label: state.label,
  subject: state.subject,
  htmlContent: state.htmlContent,
  sendNow: state.sendMode === 'now',
  scheduledAt:
    state.sendMode === 'schedule' && state.scheduledAt
      ? new Date(state.scheduledAt).toISOString()
      : null,
});

const reset = () => {
  state.label = null;
  state.subject = '';
  state.htmlContent = '';
  state.sendMode = 'draft';
  state.scheduledAt = '';
  v$.value.$reset();
};

// Se expone para que el Dialog padre valide antes de llamar a la API,
// lea los valores actuales y resetee tras un submit exitoso.
defineExpose({ v$, getPayload, reset });
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <label for="label" class="mb-0.5 text-sm font-medium text-n-slate-12">
        {{ t('CAMPAIGN.BREVO.CREATE.FORM.LABEL_FIELD.LABEL') }}
      </label>
      <ComboBox
        id="label"
        v-model="state.label"
        :options="labelOptions"
        :has-error="!!formErrors.label"
        :placeholder="t('CAMPAIGN.BREVO.CREATE.FORM.LABEL_FIELD.PLACEHOLDER')"
        :message="formErrors.label"
        class="[&>div>button]:bg-n-alpha-black2 [&>div>button:not(.focused)]:dark:outline-n-weak [&>div>button:not(.focused)]:hover:!outline-n-slate-6"
      />
      <p class="mt-1 text-xs text-n-slate-11">
        {{ t('CAMPAIGN.BREVO.CREATE.FORM.LABEL_FIELD.INFO') }}
      </p>
    </div>

    <Input
      v-model="state.subject"
      :label="t('CAMPAIGN.BREVO.CREATE.FORM.SUBJECT.LABEL')"
      :placeholder="t('CAMPAIGN.BREVO.CREATE.FORM.SUBJECT.PLACEHOLDER')"
      :message="formErrors.subject"
      :message-type="formErrors.subject ? 'error' : 'info'"
    />

    <Editor
      v-model="state.htmlContent"
      channel-type="Context::Campaign"
      :label="t('CAMPAIGN.BREVO.CREATE.FORM.CONTENT.LABEL')"
      :placeholder="t('CAMPAIGN.BREVO.CREATE.FORM.CONTENT.PLACEHOLDER')"
      :show-character-count="false"
      :max-length="0"
      :enable-variables="false"
      :enable-canned-responses="false"
      :enable-captain-tools="false"
      :allow-signature="false"
      :message="formErrors.htmlContent"
      :message-type="formErrors.htmlContent ? 'error' : 'info'"
    />

    <div class="flex flex-col gap-1">
      <label class="mb-0.5 text-sm font-medium text-n-slate-12">
        {{ t('CAMPAIGN.BREVO.CREATE.FORM.SEND_MODE.LABEL') }}
      </label>
      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 text-sm text-n-slate-12">
          <input
            v-model="state.sendMode"
            type="radio"
            value="draft"
            class="rounded"
          />
          {{ t('CAMPAIGN.BREVO.CREATE.FORM.SEND_MODE.DRAFT') }}
        </label>
        <label class="flex items-center gap-2 text-sm text-n-slate-12">
          <input
            v-model="state.sendMode"
            type="radio"
            value="now"
            class="rounded"
          />
          {{ t('CAMPAIGN.BREVO.CREATE.FORM.SEND_MODE.NOW') }}
        </label>
        <label class="flex items-center gap-2 text-sm text-n-slate-12">
          <input
            v-model="state.sendMode"
            type="radio"
            value="schedule"
            class="rounded"
          />
          {{ t('CAMPAIGN.BREVO.CREATE.FORM.SEND_MODE.SCHEDULE') }}
        </label>
      </div>
      <input
        v-if="state.sendMode === 'schedule'"
        v-model="state.scheduledAt"
        type="datetime-local"
        class="mt-1 w-full rounded-lg border border-n-weak bg-n-alpha-black2 p-2 text-sm text-n-slate-12 outline-none focus:border-n-blue-9"
        :class="{ 'border-n-ruby-9': formErrors.scheduledAt }"
      />
      <p
        v-if="state.sendMode === 'schedule' && formErrors.scheduledAt"
        class="text-xs text-n-ruby-9"
      >
        {{ formErrors.scheduledAt }}
      </p>
    </div>
  </div>
</template>
