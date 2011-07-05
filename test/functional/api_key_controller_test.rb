require 'test_helper'

class ApiKeyControllerTest < ActionController::TestCase

  def valid_api_key? key
    key.length == 40
  end

  test "route create" do
    assert_routing({ :method => 'post', :path => '/api/api_key' }, { :controller => 'api_key', :action => 'create'})
  end
  
  test "should create valid api key" do
    post :create, {:api_key => {:email => 'hannotaatio_tester@futurice.com'}}
    assert_response 201
    
    json = JSON.parse(@response.body)
    assert valid_api_key? json['api_key']['api_key']
  end

  test "shouldn't create api key without valid email" do
    
    # Without email
    post :create, {:api_key => {}}
    assert_response 400
    
    # With email
    post :create, {:api_key => {:email => 'hannotaatio_tester@futurice.com'}}
    assert_response 201
    
    # With ínvalidate email
    post :create, {:api_key => {:email => 'hannotaatio_tester@futurice@futurice.com'}}
    assert_response 400
  end
end
