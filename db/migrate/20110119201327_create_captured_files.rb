class CreateCapturedFiles < ActiveRecord::Migration
  def self.up
    create_table :captured_files do |t|
      t.string :path
      t.text :content

      t.timestamps
    end
  end

  def self.down
    drop_table :captured_files
  end
end
