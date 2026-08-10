<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlert } from 'dashboard/composables';

import Dialog from 'dashboard/components-next/dialog/Dialog.vue';
import BrevoCampaignForm from './BrevoCampaignForm.vue';
import BrevoCampaignsAPI from './BrevoCampaignsAPI';

const { t } = useI18n();

const dialogRef = ref(null);
const formRef = ref(null);
const isSubmitting = ref(false);

const open = () => dialogRef.value.open();
const close = () => dialogRef.value.close();

defineExpose({ open, close });

const isConfirmDisabled = computed(() => formRef.value?.v$?.$invalid ?? true);

const handleConfirm = async () => {
  const isFormValid = await formRef.value.v$.$validate();
  if (!isFormValid) return;

  isSubmitting.value = true;
  try {
    await BrevoCampaignsAPI.createCampaign(formRef.value.getPayload());
    useAlert(t('CAMPAIGN.BREVO.API.SUCCESS_MESSAGE'));
    formRef.value.reset();
    close();
  } catch (error) {
    useAlert(
      error?.response?.data?.message || t('CAMPAIGN.BREVO.API.ERROR_MESSAGE')
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog
    ref="dialogRef"
    :title="t('CAMPAIGN.BREVO.CREATE.TITLE')"
    :confirm-button-label="t('CAMPAIGN.BREVO.CREATE.FORM.BUTTONS.CREATE')"
    :cancel-button-label="t('CAMPAIGN.BREVO.CREATE.FORM.BUTTONS.CANCEL')"
    :disable-confirm-button="isConfirmDisabled"
    :is-loading="isSubmitting"
    width="md"
    @confirm="handleConfirm"
  >
    <BrevoCampaignForm ref="formRef" />
  </Dialog>
</template>
