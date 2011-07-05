class NotificationEmailAnnotationAssociation < ActiveRecord::Migration
  def self.up
    add_column :notification_emails, :annotation_id, :integer
  end

  def self.down
    remove_column :notification_emails, :annotation_id
  end
end
