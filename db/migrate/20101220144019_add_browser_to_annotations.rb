class AddBrowserToAnnotations < ActiveRecord::Migration
  def self.up
    add_column :annotations, :browser, :string
  end

  def self.down
    remove_column :annotations, :browser
  end
end
