# Default S3 host

AWS::S3::Base.establish_connection!(
  :access_key_id     => Keys.aws_access_key_id,
  :secret_access_key => Keys.aws_secret_access_key
)

AWS::S3::DEFAULT_HOST.replace Rails.configuration.s3_server