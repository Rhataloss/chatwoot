class Whatsapp::TemplatesService
  def initialize(channel)
    @channel = channel
    @business_account_id = channel.provider_config['business_account_id']
    @api_key = channel.provider_config['api_key']
  end

  def list_templates
    response = HTTParty.get(
      "#{graph_base_url}/#{@business_account_id}/message_templates",
      headers: auth_headers
    )
    handle_response(response)
  end

  def create_template(params)
    response = HTTParty.post(
      "#{graph_base_url}/#{@business_account_id}/message_templates",
      headers: auth_headers,
      body: template_payload(params).to_json
    )
    handle_response(response)
  end

  def destroy_template(name)
    response = HTTParty.delete(
      "#{graph_base_url}/#{@business_account_id}/message_templates",
      headers: auth_headers,
      query: { name: name }
    )
    handle_response(response)
  end

  private

  def graph_base_url
    "https://graph.facebook.com/#{GlobalConfigService.load('WHATSAPP_API_VERSION', 'v19.0')}"
  end

  def auth_headers
    {
      'Authorization' => "Bearer #{@api_key}",
      'Content-Type' => 'application/json'
    }
  end

  def template_payload(params)
    {
      name: params[:name],
      category: params[:category],
      language: params[:language],
      components: params[:components]
    }
  end

  def handle_response(response)
    unless response.success?
      Rails.logger.error("[Whatsapp::TemplatesService] #{response.code} - #{response.body}")
      raise StandardError, (response.parsed_response.dig('error', 'message') || 'Error de Meta API')
    end
    response.parsed_response
  end
end
