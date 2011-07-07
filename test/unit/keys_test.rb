
class KeysTest < ActiveSupport::TestCase

  test "administrator keys" do
    assert_equal "admin", Keys.admin_username
    assert_equal "adminpassword", Keys.admin_password
  end

end