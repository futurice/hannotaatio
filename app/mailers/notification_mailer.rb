class NotificationMailer < ActionMailer::Base
  default :from => "hannotaatio@futurice.com"
  
  def new_hannotaatio annotation
    @view_url = "#{Rails.configuration.view_url}#{annotation.uuid}"
    recipients = []
    
    annotation.notification_emails.each do |notification_email|
      recipients.push notification_email.email
    end
    
    logger.info "Annotation #{annotation.uuid} is sending notification email to #{recipients}"
    
    mail(
        :to => recipients,
        :subject => "New Hannotaatio has been made on your site"
      )
  end
  
  def new_api_key api_key
    @api_key = api_key
    
    mail(
      :to => @api_key.email,
      :subject => "Hannotaatio API key created"
    )
  end
  
end