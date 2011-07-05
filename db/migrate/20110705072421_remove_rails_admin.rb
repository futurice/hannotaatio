class RemoveRailsAdmin < ActiveRecord::Migration
  def self.up
    remove_index :rails_admin_histories, :name => :index_histories_on_item_and_table_and_month_and_year
    drop_table :rails_admin_histories
  end

  def self.down
  end
end
