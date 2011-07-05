class CreateHannotations < ActiveRecord::Migration
  def self.up
    create_table :hannotations do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :hannotations
  end
end
