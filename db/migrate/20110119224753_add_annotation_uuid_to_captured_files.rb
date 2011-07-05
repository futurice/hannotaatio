class AddAnnotationUuidToCapturedFiles < ActiveRecord::Migration
  def self.up
    add_column :captured_files, :annotation_uuid, :string
  end

  def self.down
    remove_column :captured_files, :annotation_uuid
  end
end
