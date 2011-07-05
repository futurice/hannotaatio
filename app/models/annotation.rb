class Annotation < ActiveRecord::Base
  has_many :captured_files, :dependent => :destroy
  has_one :hannotation, :dependent => :destroy
  has_many :notification_emails, :dependent => :destroy
  belongs_to :api_key
  
  before_validation :remove_invalid_emails
  
  # Removed invalid emails silently before the annotation is validated and saved
  #
  # Invalid emails should not be saved to the db, but an invalid email shouldn't
  # block annotation from being saved. This method allows annotation with invalid 
  # emails to be saved.
  def remove_invalid_emails
    notification_emails.each do |email|
      if !email.valid?
        notification_emails.delete email
      end
    end
  end
  
end
