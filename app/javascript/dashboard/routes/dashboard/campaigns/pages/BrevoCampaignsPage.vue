<script setup>
import { computed } from 'vue';
import { useMapGetter } from 'dashboard/composables/store';

// URL del backend Node/Express que sirve el dashboard embebido de Brevo.
// TODO: mover a variable de entorno / configuración de cuenta en vez de hardcode.
const currentAccountId = useMapGetter('getCurrentAccountId');

const brevoAppUrl = computed(() => {
  const base = window.chatwootConfig?.brevoDashboardUrl || '/brevo-app';
  return `${base}?account_id=${currentAccountId.value}`;
});
</script>

<template>
  <div class="flex flex-col flex-1 h-full">
    <iframe
      :src="brevoAppUrl"
      title="Brevo Campaigns"
      class="w-full h-full border-0"
      allow="clipboard-write"
    />
  </div>
</template>
