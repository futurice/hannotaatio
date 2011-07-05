class ChangeCapturedFilesContentToBlob < ActiveRecord::Migration
  def self.up
    change_column :captured_files, :content, :binary
  end

  def self.down
    change_column :captured_files, :content, :longtext
  end
end
