class AddAnnotationUuidToHannotations < ActiveRecord::Migration
  def self.up
    add_column :hannotations, :annotation_uuid, :string
  end

  def self.down
    remove_column :hannotations, :annotation_uuid
  end
end
