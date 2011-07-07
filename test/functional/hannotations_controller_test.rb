require 'test_helper'

class HannotationsControllerTest < ActionController::TestCase
  def setup
    @anno1 = annotations(:anno1)
  end

  def teardown
  end

  test "route create" do
    assert_recognizes({:controller => 'hannotations', :action => 'create', :annotation_id => 'any-uuid'}, 
                      {:path => '/api/annotations/any-uuid/annotations', :method => :post})
  end

  test "route index" do
    assert_recognizes({:controller => 'hannotations', :action => 'index', :annotation_id => 'any-uuid'}, 
                      {:path => '/api/annotations/any-uuid/annotations', :method => :get})
  end

  test "show index" do
    get :index, :annotation_id => @anno1.uuid
    assert_response :success
  end

  test "should be destroyed when parent annotation is" do
    get :index, :annotation_id => @anno1.uuid
    assert_response :success
    @anno1.destroy
    get :index, :annotation_id => @anno1.uuid
    assert_response 404
  end
end
