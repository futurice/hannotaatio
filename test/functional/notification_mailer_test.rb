require 'test_helper'

class NotificationMailerTest < ActionMailer::TestCase

  test "new annotation" do

    emails = [
      NotificationEmail.new(:email => "hannotaatio.user@futurice.com"),
      NotificationEmail.new(:email => "hannotaatio.admin@futurice.com")
    ]

    annotation = Annotation.new(:uuid => "1234-5678-90", :notification_emails => emails)
    
    mail = NotificationMailer.new_hannotaatio(annotation).deliver
    assert !ActionMailer::Base.deliveries.empty?
    assert_equal 1, ActionMailer::Base.deliveries.length
    
    assert_equal "New Hannotaatio has been made on your site", mail.subject
    assert_match /A new Hannotaatio has been made on your site/, mail.encoded
    assert_match /Please go to http:\/\/testing.hannotaatio.futurice.com\/edit\/1234-5678-90 to see the newly made Hannotaatio./, mail.encoded
    
  end
  
  test "new api key" do

    api_key = ApiKey.new(:email => "hannotaatio.user@futurice.com")
    assert api_key.save!
    
    mail = NotificationMailer.new_api_key(api_key).deliver
    assert !ActionMailer::Base.deliveries.empty?
    assert_equal 1, ActionMailer::Base.deliveries.length
    
    assert_equal "Hannotaatio API key created", mail.subject
    assert_match /A new Hannotaatio API key has been created. Here are the details:/, mail.encoded
    
    assert_match /API key: #{api_key.api_key}/, mail.encoded
    assert_match /Email: hannotaatio.user@futurice.com/, mail.encoded
    
  end
  
end
