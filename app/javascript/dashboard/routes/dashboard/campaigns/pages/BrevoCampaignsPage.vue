<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import CampaignLayout from 'dashboard/components-next/Campaigns/CampaignLayout.vue';
import BrevoCampaignDialog from 'dashboard/components-next/Campaigns/Pages/CampaignPage/BrevoCampaign/BrevoCampaignDialog.vue';
import BrevoCampaignsAPI from 'dashboard/components-next/Campaigns/Pages/CampaignPage/BrevoCampaign/BrevoCampaignsAPI.js';

const { t } = useI18n();

const brevoCampaignDialogRef = ref(null);
const openCreateDialog = () => brevoCampaignDialogRef.value.open();
const closeCreateDialog = () => brevoCampaignDialogRef.value.close();

const campaigns = ref([]);
const isLoading = ref(true);
const hasError = ref(false);

const formatDate = value => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

const fetchCampaigns = async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    const { campaigns: list } = await BrevoCampaignsAPI.getCampaigns();
    campaigns.value = list || [];
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCampaigns);

defineExpose({ fetchCampaigns });
</script>

<template>
  <CampaignLayout
    data-tour-campaign-page="brevo"
    :header-title="t('CAMPAIGN.BREVO.HEADER_TITLE')"
    :button-label="t('CAMPAIGN.BREVO.NEW_CAMPAIGN')"
    @click="openCreateDialog"
    @close="closeCreateDialog"
  >
    <template #action>
      <BrevoCampaignDialog
        ref="brevoCampaignDialogRef"
        @created="fetchCampaigns"
      />
    </template>

    <template #default>
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <p class="text-sm text-n-slate-11">
          {{ t('CAMPAIGN.BREVO.HISTORY.LOADING') }}
        </p>
      </div>

      <div
        v-else-if="hasError"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <p class="text-sm text-n-ruby-11">
          {{ t('CAMPAIGN.BREVO.HISTORY.ERROR') }}
        </p>
      </div>

      <div
        v-else-if="!campaigns.length"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <p class="text-sm text-n-slate-11">
          {{ t('CAMPAIGN.BREVO.EMPTY_STATE.SUBTITLE') }}
        </p>
      </div>

      <div v-else class="w-full max-w-5xl mx-auto px-6 py-4 overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="border-b border-n-strong text-n-slate-11">
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.SUBJECT') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.STATUS') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.SENT_AT') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.SENT') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.OPENS') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.CLICKS') }}
              </th>
              <th class="py-2 pr-4 font-medium">
                {{ t('CAMPAIGN.BREVO.HISTORY.BOUNCES') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="campaign in campaigns"
              :key="campaign.id"
              class="border-b border-n-weak text-n-slate-12"
            >
              <td class="py-2 pr-4">{{ campaign.name }}</td>
              <td class="py-2 pr-4">{{ campaign.status }}</td>
              <td class="py-2 pr-4">
                {{ formatDate(campaign.sentDate) }}
              </td>
              <td class="py-2 pr-4">
                {{ campaign.stats?.sent ?? '—' }}
              </td>
              <td class="py-2 pr-4">
                {{ campaign.stats?.opens ?? '—' }}
              </td>
              <td class="py-2 pr-4">
                {{ campaign.stats?.clicks ?? '—' }}
              </td>
              <td class="py-2 pr-4">
                {{
                  (campaign.stats?.hardBounces ?? 0) +
                  (campaign.stats?.softBounces ?? 0)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </CampaignLayout>
</template>
