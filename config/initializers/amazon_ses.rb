require 'aws/ses'

ActionMailer::Base.add_delivery_method :ses, AWS::SES::Base,
      :access_key_id     => Keys.aws_access_key_id,
      :secret_access_key => Keys.aws_secret_access_key