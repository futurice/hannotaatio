# Create symlink to the captured files location

public_path = HannotaatioServerNew::Application.config.file_storage_public_path
local_path = HannotaatioServerNew::Application.config.file_storage_local_path
symlink_path = "#{Rails.root}/public/#{public_path}"

if File.directory? local_path and File.symlink? symlink_path
  # Everything ok
else 
  puts FileUtils.mkdir_p local_path 
  FileUtils.ln_s local_path, symlink_path, :force => true
end