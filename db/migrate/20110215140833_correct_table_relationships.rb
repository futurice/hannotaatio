class CorrectTableRelationships < ActiveRecord::Migration
  def self.up
    change_table 'hannotations' do |t|
      t.remove 'annotation_uuid'
      t.column 'annotation_id', :integer
    end
    
    change_table 'captured_files' do |t|
      t.remove 'annotation_uuid'
      t.column 'annotation_id', :integer
    end
# Correct way of doing:
#    add_column :hannotations, :annotation_id, :int
#    execute 'UPDATE hannotations SET annotation_id = (SELECT id FROM annotations WHERE uuid = hannotations.annotation_uuid);'
#    remove_column :hannotations, :annotation_uuid
#    
#    add_column :captured_files, :annotation_id, :int
#    execute 'UPDATE captured_files SET annotation_id = (SELECT id FROM annotations WHERE uuid = captured_files.annotation_uuid);'
#    remove_column :captured_files, :annotation_uuid
  end

  def self.down
    change_table 'captured_files' do |t|
      t.remove 'annotation_id'
      t.column 'annotation_uuid', :string
    end
    
    change_table 'hannotations' do |t|
      t.remove 'annotation_id'
      t.column 'annotation_uuid', :string
  end
# Example on other style:
#    add_column :captured_files, :annotation_uuid, :string
#    remove_column :captured_files, :annotation_id
#    
#    add_column :hannotations, :annotation_uuid, :string
#    remove_column :hannotations, :annotation_id
  end
end
