class DropContentColumn < ActiveRecord::Migration
  def self.up
    remove_column :captured_files, :content
  end

  def self.down
  end
end
