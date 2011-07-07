HannotaatioServerNew::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  
  # Set up log directory outside application directory
  config.paths.log = "/var/hannotation_data/log/#{Rails.env}.log"
  
  config.view_url = "https://hannotaatio-test.futurice.com/view/"
  
  ActionMailer::Base.raise_delivery_errors = false

  # The qa environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Specifies the header that your server uses for sending files
  config.action_dispatch.x_sendfile_header = "X-Sendfile"

  # For nginx:
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  # If you have no front-end server that supports something like X-Sendfile,
  # just comment this out and Rails will serve the files

  # See everything in the log (default is :info)
  # config.log_level = :debug

  # Use a different logger for distributed setups
  # config.logger = SyslogLogger.new

  # Use a different cache store in production
  # config.cache_store = :mem_cache_store

  # Disable Rails's static asset server
  # In production, Apache or nginx will already do this
  config.serve_static_assets = false

  # Enable serving of images, stylesheets, and javascripts from an asset server
  # config.action_controller.asset_host = "http://assets.example.com"

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false

  # Enable threaded mode
  # config.threadsafe!

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify
  
  # .................. Hannotaatio configurations ............................. #
  
  # Edit/view url
  config.view_url = "https://hannotaatio-test.futurice.com/view/"
  
  # File storage configurations
  config.file_storage_path = "#{Rails.root}/public/captured_files/"
  config.file_storage_method = "s3" # fs, s3
  config.s3_server = "s3-eu-west-1.amazonaws.com"
  config.s3_bucket = "futurice-hannotaatioqa-files"
  
  # Uncomment this to use Amazon SES as the mail server
  config.action_mailer.delivery_method = :ses
  
  # Raise delivery errors if unable to send an email
  # If you are using a real mail server (e.g. Amazon SES)
  # setting this 'true' helps testing and debugging
  ActionMailer::Base.raise_delivery_errors = false
  
  # Do not use combined/compiled Javascript
  config.use_debug_javascript = false
end
