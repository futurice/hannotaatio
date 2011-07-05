class CreateNotificationEmails < ActiveRecord::Migration
  def self.up
    create_table :notification_emails do |t|
      t.string :email

      t.timestamps
    end
  end

  def self.down
    drop_table :notification_emails
  end
end
