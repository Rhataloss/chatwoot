/* global axios */

import ApiClient from './ApiClient';

class MetaTemplatesAPI extends ApiClient {
  constructor() {
    super('whatsapp/templates', { accountScoped: true });
  }

  // GET /api/v1/accounts/:account_id/whatsapp/templates?inbox_id=X
  get(inboxId) {
    return axios.get(this.url, { params: { inbox_id: inboxId } });
  }

  // POST /api/v1/accounts/:account_id/whatsapp/templates
  // body: { inbox_id, template: { name, category, language, components } }
  create(inboxId, template) {
    return axios.post(this.url, { inbox_id: inboxId, template });
  }

  // DELETE /api/v1/accounts/:account_id/whatsapp/templates/:name?inbox_id=X
  delete(inboxId, templateName) {
    return axios.delete(`${this.url}/${templateName}`, {
      params: { inbox_id: inboxId },
    });
  }
}

export default new MetaTemplatesAPI();
