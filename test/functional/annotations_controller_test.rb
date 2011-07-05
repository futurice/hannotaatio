require 'test_helper'

class AnnotationsControllerTest < ActionController::TestCase

=begin
http://localhost:3000/annotations?annotation[uuid]=7846-abc5-b349&annotation[site_name]=Example site&annotation[capture_time]=1290281074&annotation[captured_url]=http://www.customer.com/some/page&annotation[body_width]=1024&annotation[body_height]="768"&capture[page.html]=%3Chtml+xmlns%3D%22ht...
=end

  def setup
    @anno1 = annotations(:anno1)
    @cap_file_1 = captured_files(:cap_file_1)
  end

  def teardown
  end

  test "route create" do
    assert_recognizes({:controller => 'annotations', :action => 'create'}, 
                      {:path => '/api/annotations', :method => :post})
  end

  test "create an annotation without api key" do
    @anno1.destroy
    @h = {}
    @anno1.attribute_names.each do |a|
      @h.store(a.to_sym, @anno1.send(a))
    end
    post :create, {:annotation => @h}
    assert_response 201
  end
  
  test "create an annotation with email" do
    @anno1.destroy
    @h = {}
    @anno1.attribute_names.each do |a|
      @h.store(a.to_sym, @anno1.send(a))
    end
    post :create, {:annotation => @h, :notification_emails => ["hannotaatio.user@futurice.com", "hannotaatio.user@futurice@.com"]}
    assert_response 201
  end

  test "route show" do
    assert_recognizes({:controller => 'annotations', :action => 'show', :id => 'any-uuid'}, 
                      {:path => '/api/annotations/any-uuid', :method => :get})
  end


  test "show annotation" do
    get :show, :id => @anno1.uuid, :format => :json
    assert_response :success, @response.body
  end

  test "route destroy" do
    assert_recognizes({:controller => 'annotations', :action => 'destroy', :id => 'any-uuid'}, 
                      {:path => '/api/annotations/any-uuid', :method => :delete})
  end

  test "destroy annotation" do
    delete :destroy, {:id => @anno1.uuid}
    assert_response :success
    get :show, {:id => @anno1.uuid}
    assert_response :missing
  end

  test "destroy annotation should cause removal of child objects" do
    assert_equal CapturedFile.find_all_by_annotation_id(@anno1.id).length, 2
    assert_equal Hannotation.find_all_by_annotation_id(@anno1.id).length, 1
    delete :destroy, {:id => @anno1.uuid}
    assert_empty CapturedFile.find_all_by_annotation_id(@anno1.id)
    assert_empty Hannotation.find_all_by_annotation_id(@anno1.id)
  end



end
