require 'test_helper'

class NotificationEmailTest < ActiveSupport::TestCase

  def setup
    # Delete fixtures for this one
    Annotation.delete_all
    NotificationEmail.delete_all
  end

  test "should save only valid emails" do
    # Valid
    notification_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice.com')
    assert notification_email.save!, "Failed to save valid email"
    
    # Invalid
    notification_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice@futurice.com.com')
    assert !notification_email.save, "Saved invalid email"
  end
  
  test "should replace 'at' and 'dot'" do
    notification_email = NotificationEmail.new(:email => 'hannotaatio dot user at futurice dot com')
    
    assert notification_email.save, "Save failed"
    
    # Fresh update from db
    notification_email = NotificationEmail.find_by_id(notification_email.id)
    
    assert_equal 'hannotaatio.user@futurice.com', notification_email.email
  end
  
  test "should save annotations even though one of the emails is invalid" do
    valid_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice.com')
    invalid_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice@futurice.com.com')    
    
    annotation = Annotation.new(:notification_emails => [valid_email, invalid_email]);
    
    # Save
    assert annotation.save!, "Saving annotation failed"
    
    # Fresh update from db
    annotation = Annotation.find_by_id(annotation.id)
    
    assert_equal 1, annotation.notification_emails.length, "Wrong number of emails"
    
  end
  
  test "shouldn't remove annotation if email is removed" do
    
    notification_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice.com')
    # assert notification_email.save!, "Failed to save email"
    
    annotation = Annotation.new(:notification_emails => [notification_email]);
    assert annotation.save!, "Failed to save annotation"
    
    assert_equal 1, NotificationEmail.count, "Wrong notification email count before destroy"
    assert_equal 1, Annotation.count, "Wrong annotation count before destroy"
    assert_equal 1, annotation.notification_emails.length, "Wrong notification email count on annotation"
    
    notification_email.destroy
    
    assert_equal 0, NotificationEmail.count, "Wrong notification email count after destroy"
    assert_equal 1, Annotation.count, "Wrong annotation count after destroy"
    
    # Update from db
    annotation = Annotation.find_by_id(annotation.id)
    assert annotation.notification_emails.empty?, "Notification email array was not empty after delete"
  end
  
  test "should remove emails if annotation is removed" do 
    
    notification_email = NotificationEmail.new(:email => 'hannotaatio.user@futurice.com')
    
    annotation = Annotation.new(:notification_emails => [notification_email]);
    assert annotation.save!, "Failed to save annotation"
        
    assert_equal 1, NotificationEmail.count, "Wrong notification email count before destroy"
    assert_equal 1, Annotation.count, "Wrong annotation count before destroy"
    
    annotation.destroy
    
    assert_equal 0, NotificationEmail.count, "Wrong notification email count after destroy"
    assert_equal 0, Annotation.count, "Wrong annotation count after destroy"
  end

end
