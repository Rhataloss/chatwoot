<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMapGetter } from 'dashboard/composables/store';

import CampaignLayout from 'dashboard/components-next/Campaigns/CampaignLayout.vue';
import ComboBox from 'dashboard/components-next/combobox/ComboBox.vue';
import MetaTemplateDialog from 'dashboard/components-next/Campaigns/Pages/CampaignPage/MetaTemplate/MetaTemplateDialog.vue';
import MetaTemplatesAPI from 'dashboard/api/MetaTemplatesAPI';

const { t } = useI18n();

const metaTemplateDialogRef = ref(null);
const openCreateDialog = () => metaTemplateDialogRef.value.open();
const closeCreateDialog = () => metaTemplateDialogRef.value.close();

const allInboxes = useMapGetter('inboxes/getInboxes');

const whatsAppInboxes = computed(() =>
  (allInboxes.value || []).filter(
    inbox => inbox.channel_type === 'Channel::Whatsapp'
  )
);

const inboxOptions = computed(() =>
  whatsAppInboxes.value.map(inbox => ({
    value: inbox.id,
    label: inbox.name,
  }))
);

const selectedInboxId = ref(null);

const templates = ref([]);
const isLoading = ref(true);
const hasError = ref(false);

const fetchTemplates = async () => {
  if (!selectedInboxId.value) {
    templates.value = [];
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  hasError.value = false;
  try {
    const response = await MetaTemplatesAPI.get(selectedInboxId.value);
    // El backend reenvía la respuesta cruda de la Graph API de Meta: { data: [...] }
    templates.value = response.data?.data || [];
  } catch (error) {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const deletingName = ref(null);

const deleteTemplate = async template => {
  // eslint-disable-next-line no-alert
  const confirmed = window.confirm(
    t('CAMPAIGN.META_TEMPLATES.HISTORY.DELETE_CONFIRM', { name: template.name })
  );
  if (!confirmed) return;

  deletingName.value = template.name;
  try {
    await MetaTemplatesAPI.delete(selectedInboxId.value, template.name);
    templates.value = templates.value.filter(t2 => t2.name !== template.name);
  } catch (error) {
    // eslint-disable-next-line no-alert
    window.alert(t('CAMPAIGN.META_TEMPLATES.HISTORY.DELETE_ERROR'));
  } finally {
    deletingName.value = null;
  }
};

onMounted(() => {
  if (whatsAppInboxes.value.length) {
    selectedInboxId.value = whatsAppInboxes.value[0].id;
  } else {
    isLoading.value = false;
  }
});

watch(selectedInboxId, fetchTemplates);

defineExpose({ fetchTemplates });
</script>

<template>
  <CampaignLayout
    data-tour-campaign-page="meta"
    :header-title="t('CAMPAIGN.META_TEMPLATES.HEADER_TITLE')"
    :button-label="t('CAMPAIGN.META_TEMPLATES.NEW_CAMPAIGN')"
    @click="openCreateDialog"
    @close="closeCreateDialog"
  >
    <template #action>
      <MetaTemplateDialog
        ref="metaTemplateDialogRef"
        :inbox-id="selectedInboxId"
        @created="fetchTemplates"
      />
    </template>

    <template #default>
      <div
        v-if="!whatsAppInboxes.length"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <p class="text-sm text-n-slate-11">
          {{ t('CAMPAIGN.META_TEMPLATES.NO_INBOX') }}
        </p>
      </div>

      <template v-else>
        <div class="w-full max-w-5xl mx-auto px-6 pt-4">
          <div class="flex flex-col gap-1 max-w-xs">
            <label class="mb-0.5 text-sm font-medium text-n-slate-12">
              {{ t('CAMPAIGN.META_TEMPLATES.INBOX_FIELD.LABEL') }}
            </label>
            <ComboBox
              v-model="selectedInboxId"
              :options="inboxOptions"
              :placeholder="
                t('CAMPAIGN.META_TEMPLATES.INBOX_FIELD.PLACEHOLDER')
              "
            />
          </div>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <p class="text-sm text-n-slate-11">
            {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.LOADING') }}
          </p>
        </div>

        <div
          v-else-if="hasError"
          class="flex flex-col items-center justify-center gap-2 py-16 text-center"
        >
          <p class="text-sm text-n-ruby-11">
            {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.ERROR') }}
          </p>
        </div>

        <div
          v-else-if="!templates.length"
          class="flex flex-col items-center justify-center gap-2 py-16 text-center"
        >
          <p class="text-sm text-n-slate-11">
            {{ t('CAMPAIGN.META_TEMPLATES.EMPTY_STATE.SUBTITLE') }}
          </p>
        </div>

        <div v-else class="w-full max-w-5xl mx-auto px-6 py-4 overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-n-strong text-n-slate-11">
                <th class="py-2 pr-4 font-medium">
                  {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.NAME') }}
                </th>
                <th class="py-2 pr-4 font-medium">
                  {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.CATEGORY') }}
                </th>
                <th class="py-2 pr-4 font-medium">
                  {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.LANGUAGE') }}
                </th>
                <th class="py-2 pr-4 font-medium">
                  {{ t('CAMPAIGN.META_TEMPLATES.HISTORY.STATUS') }}
                </th>
                <th class="py-2 pr-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="template in templates"
                :key="`${template.name}-${template.language}`"
                class="border-b border-n-weak text-n-slate-12"
              >
                <td class="py-2 pr-4">{{ template.name }}</td>
                <td class="py-2 pr-4">{{ template.category }}</td>
                <td class="py-2 pr-4">{{ template.language }}</td>
                <td class="py-2 pr-4">{{ template.status }}</td>
                <td class="py-2 pr-4 text-right">
                  <button
                    type="button"
                    class="text-xs text-n-ruby-11 hover:underline disabled:opacity-50"
                    :disabled="deletingName === template.name"
                    @click="deleteTemplate(template)"
                  >
                    {{
                      deletingName === template.name
                        ? t('CAMPAIGN.META_TEMPLATES.HISTORY.DELETING')
                        : t('CAMPAIGN.META_TEMPLATES.HISTORY.DELETE')
                    }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </CampaignLayout>
</template>
