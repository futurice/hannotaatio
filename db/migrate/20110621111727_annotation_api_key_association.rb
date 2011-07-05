class AnnotationApiKeyAssociation < ActiveRecord::Migration
  def self.up
    add_column :annotations, :api_key_id, :integer
  end

  def self.down
    remove_column :annotations, :api_key_id
  end
end
