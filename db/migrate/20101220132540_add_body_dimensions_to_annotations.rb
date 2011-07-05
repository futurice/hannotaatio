class AddBodyDimensionsToAnnotations < ActiveRecord::Migration
  def self.up
    add_column :annotations, :body_width, :decimal
    add_column :annotations, :body_height, :decimal
  end

  def self.down
    remove_column :annotations, :body_height
    remove_column :annotations, :body_width
  end
end
