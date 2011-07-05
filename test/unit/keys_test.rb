
class KeysTest < ActiveSupport::TestCase

  test "administrator keys" do
    assert_equal "admin", Keys.admin_username
    assert_equal "adminpassword", Keys.admin_password
  end
  
  test "AWS keys" do
    assert_equal "aws_access_123456789", Keys.aws_access_key_id
    assert_equal "aws_secret_123456789", Keys.aws_secret_access_key    
  end

end