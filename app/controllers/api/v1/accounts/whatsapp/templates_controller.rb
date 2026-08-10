class Api::V1::Accounts::Whatsapp::TemplatesController < Api::V1::Accounts::BaseController
  before_action :fetch_inbox, only: [:index, :create, :destroy]

  def index
    render json: service.list_templates
  end

  def create
    render json: service.create_template(template_params)
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    service.destroy_template(params[:id])
    head :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def fetch_inbox
    @inbox = Current.account.inboxes.find(params[:inbox_id])
  end

  def service
    @service ||= Whatsapp::TemplatesService.new(@inbox.channel)
  end

  def template_params
    params.require(:template).permit(
      :name, :category, :language,
      components: [:type, :format, :text, buttons: [:type, :text, :url, :phone_number]]
    )
  end
end
