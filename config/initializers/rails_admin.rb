RailsAdmin.authenticate_with {

  redirect_to "#{RAILS_ROOT}/admin" unless authenticate_or_request_with_http_basic do |user_name, password|
    user_name == Keys.admin_username && password == Keys.admin_password
  end
}