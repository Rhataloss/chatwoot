import axios from 'axios';

const client = axios.create({
  baseURL: '/brevo-app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

export default {
  getLabels() {
    return client.get('/labels').then(({ data }) => data);
  },
  getContactsByLabel(label) {
    return client
      .get('/contacts', { params: { label } })
      .then(({ data }) => data);
  },
  createCampaign(payload) {
    return client.post('/campaigns', payload).then(({ data }) => data);
  },
  getCampaigns(params = {}) {
    return client.get('/campaigns', { params }).then(({ data }) => data);
  },
};
