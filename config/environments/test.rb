HannotaatioServerNew::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # The test environment is used exclusively to run your application's
  # test suite.  You never need to work with it otherwise.  Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs.  Don't rely on the data there!
  config.cache_classes = true

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates
  config.action_dispatch.show_exceptions = false

  # Disable request forgery protection in test environment
  config.action_controller.allow_forgery_protection    = false

  # Use SQL instead of Active Record's schema dumper when creating the test database.
  # This is necessary if your schema can't be completely dumped by the schema dumper,
  # like if you have constraints or database-specific column types
  # config.active_record.schema_format = :sql

  # Print deprecation notices to the stderr
  config.active_support.deprecation = :stderr
  
  # .................. Hannotaatio configurations ............................. #
  
  # Edit/view url for development env
  config.view_url = "http://testing.hannotaatio.futurice.com/view/"
  
  # File storage configurations
  config.file_storage_domain = "localhost:3000"
  config.file_storage_public_path = "captured_files/"
  config.file_storage_local_path = "#{Rails.root}/tmp/captured_files/"
  config.file_storage_method = "fs" # fs, s3
  config.s3_server = "s3-eu-west-1.amazonaws.com"
  config.s3_bucket = "futurice-hannotaatiotest-files"
  
  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test
  
  # Raise delivery errors if unable to send an email
  # If you are using a real mail server (e.g. Amazon SES)
  # setting this 'true' helps testing and debugging
  ActionMailer::Base.raise_delivery_errors = true
  
  # Do not use combined/compiled Javascript
  config.use_debug_javascript = true
  
end
