<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';

import Dialog from 'dashboard/components-next/dialog/Dialog.vue';
import MetaTemplateForm from './MetaTemplateForm.vue';
import MetaTemplatesAPI from 'dashboard/api/MetaTemplatesAPI';

const props = defineProps({
  inboxId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(['created']);

const { t } = useI18n();

const dialogRef = ref(null);
const formRef = ref(null);
const isSubmitting = ref(false);

const open = () => dialogRef.value.open();
const close = () => dialogRef.value.close();

defineExpose({ open, close });

const isConfirmDisabled = computed(
  () => !props.inboxId || (formRef.value?.v$?.$invalid ?? true)
);

const handleConfirm = async () => {
  const isFormValid = await formRef.value.v$.$validate();
  if (!isFormValid || !props.inboxId) return;

  isSubmitting.value = true;
  try {
    await MetaTemplatesAPI.create(props.inboxId, formRef.value.getPayload());
    useAlert(t('CAMPAIGN.META_TEMPLATES.API.SUCCESS_MESSAGE'));
    formRef.value.reset();
    emit('created');
    close();
  } catch (error) {
    // El controller devuelve { error: e.message } en fallos (ver
    // templates_controller.rb), por eso se prioriza error.response.data.error.
    useAlert(
      error?.response?.data?.error ||
        error?.response?.data?.message ||
        t('CAMPAIGN.META_TEMPLATES.API.ERROR_MESSAGE')
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog
    ref="dialogRef"
    :title="t('CAMPAIGN.META_TEMPLATES.CREATE.TITLE')"
    :confirm-button-label="
      t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS.CREATE')
    "
    :cancel-button-label="
      t('CAMPAIGN.META_TEMPLATES.CREATE.FORM.BUTTONS.CANCEL')
    "
    :disable-confirm-button="isConfirmDisabled"
    overflow-y-auto
    :is-loading="isSubmitting"
    width="md"
    @confirm="handleConfirm"
  >
    <MetaTemplateForm ref="formRef" />
  </Dialog>
</template>
