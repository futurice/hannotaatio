class ChangeCapturedFileContentToLongtxt < ActiveRecord::Migration
  def self.up
    change_column :captured_files, :content, :longtext
  end

  def self.down
  end
end
