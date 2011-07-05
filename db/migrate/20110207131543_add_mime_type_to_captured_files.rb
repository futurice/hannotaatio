class AddMimeTypeToCapturedFiles < ActiveRecord::Migration
  def self.up
    add_column :captured_files, :mime_type, :string
  end

  def self.down
    remove_column :captured_files, :mime_type
  end
end
