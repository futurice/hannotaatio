require 'test_helper'
require 'httpclient'
require 'aws/s3'
require "#{Rails.root}/lib/file_saver.rb"

class FileSaverTest < ActiveSupport::TestCase

  def teardown
    FileUtils.rm_r Rails.configuration.file_storage_local_path if File.exists? Rails.configuration.file_storage_local_path
    AWS::S3::S3Object.delete("documents/test_doc.txt", Rails.configuration.s3_bucket);
  end
  
  def create_test_file_to_fs uuid, path
    content = "test"  
    FileSaver.save_to_fs uuid, path, content
  end
  
  def create_test_file_to_s3 uuid, path
    content = "test"
    
    FileSaver.save_to_s3 uuid, path, content
  end

  test "save_to_fs" do 
    uuid = "1234-5678-90"
    path = "documents/test_doc.txt"
    
    # Test existence
    newfile = create_test_file_to_fs uuid, path
    assert File.exists? newfile
    
    # Test content
    assert_equal IO.read(newfile), "test"
  end
  
  test "save_to_s3" do 
    uuid = "1234-5678-90"
    path = "documents/test_doc.txt"
    
    create_test_file_to_s3 uuid, path
    
    # Test existence and content
    client = HTTPClient.new
    res = client.get("https://#{Rails.configuration.s3_server}/#{Rails.configuration.s3_bucket}/#{uuid}/#{path}");
    assert_equal res.body, "test"
  end
  
  test "delete_from_fs" do
    uuid = "1234-5678-90"
    path = "documents/test_doc.txt"
    path2 = "documents/test_doc2.txt"
    newfile = create_test_file_to_fs uuid, path
    newfile2 = create_test_file_to_fs uuid, path2
    
    FileSaver.delete_from_fs uuid, path
    
    # File deleted
    assert (not File.exists? newfile)
    
    # Another file still exists?
    assert (File.exists? newfile2)
    
    FileSaver.delete_from_fs uuid, path2
    
    # Another file deleted
    assert (not File.exists? newfile2)
    
    # Folder removed
    assert (not File.directory? File.dirname newfile2)
    
    # Delete unexisting file (should not raise error)
    FileSaver.delete_from_fs "1234-5678-9011", "page.html"
  end

  test "delete_from_s3" do
    uuid = "1234-5678-90"
    path = "documents/test_doc.txt"
    
    create_test_file_to_s3 uuid, path 
    
    FileSaver.delete_from_s3 uuid, path
    
    # Test existence and content
    client = HTTPClient.new
    res = client.get("https://#{Rails.configuration.s3_server}/#{Rails.configuration.s3_bucket}/#{uuid}/#{path}");
    assert_not_equal res.body, "test"
    
    # Delete unexisting file (should not raise error)
    FileSaver.delete_from_s3 "1234-5678-9011", "page.html"
  end
end
