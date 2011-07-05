class AddBodyToHannotations < ActiveRecord::Migration
  def self.up
    add_column :hannotations, :body, :text
  end

  def self.down
    remove_column :hannotations, :body
  end
end
