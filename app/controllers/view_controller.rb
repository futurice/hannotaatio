class ViewController < ApplicationController

def index
  @use_debug_javascript = Rails.configuration.use_debug_javascript
  @file_storage_method = Rails.configuration.file_storage_method
  
  if @file_storage_method == 'fs'
    @file_storage_domain = Rails.configuration.file_storage_domain
    @file_storage_path = "/#{Rails.configuration.file_storage_public_path}/"
  end
  if Rails.configuration.file_storage_method == 's3'
    @file_storage_domain = Rails.configuration.s3_server
    @file_storage_path = "/#{Rails.configuration.s3_bucket}/"
  end
end

end
