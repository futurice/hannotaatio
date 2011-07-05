require 'active_support/secure_random'

class ApiKey < ActiveRecord::Base
  has_many :annotation, :dependent => :destroy
  
  validates :api_key, :presence => true, :uniqueness => true
  validates :email, :presence => true, :format => { :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i,
                                :message => 'must be valid' }, :allow_nil => true
  
  before_validation :generate_api_key
  
  def generate_api_key
    self.api_key = ActiveSupport::SecureRandom.hex(20)
  end
  
end
