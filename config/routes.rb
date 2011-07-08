HannotaatioServerNew::Application.routes.draw do

  scope "/api" do

    resources :annotations, :only => [:show, :create, :destroy] do
    
      resources :annotations, :only => [:index, :create], :controller => :hannotations
    
      match "/capture" =>       "captured_files#index", :via => :get
      match "/capture/*path" => "captured_files#show", :via => :get
    
    end
  
    resources :api_key, :only => [:create]
  
  end
  
  match "/view/:uuid" => "view#index"

end
