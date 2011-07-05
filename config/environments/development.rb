HannotaatioServerNew::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_view.debug_rjs             = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin
  
  # Edit/view url for development env
  config.view_url = "/view/"
  
  # File storage configurations
  config.file_storage_path = "#{Rails.root}/public/captured_files/"
  config.file_storage_method = "s3" # fs, s3
  config.s3_server = "s3-eu-west-1.amazonaws.com"
  config.s3_bucket = "futurice-hannotaatiodev-files"
  
  # Sending mails
  config.action_mailer.delivery_method = :ses
  
  ActionMailer::Base.raise_delivery_errors = true
  
  # Do not use combined/compiled Javascript
  config.use_debug_javascript = true
end

