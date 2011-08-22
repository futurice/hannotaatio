
class KeysTest < ActiveSupport::TestCase

  test "administrator keys" do
    assert_equal "admin", Keys.admin_username
    assert_equal "hannotaatio", Keys.admin_password
  end

end