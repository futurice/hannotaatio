class CreateAnnotations < ActiveRecord::Migration
  def self.up
    create_table :annotations do |t|
      t.string :uuid
      t.string :site_name
      t.timestamp :capture_time
      t.string :captured_url

      t.timestamps
    end
  end

  def self.down
    drop_table :annotations
  end
end
