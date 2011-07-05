class ViewController < ApplicationController

def index
  @use_debug_javascript = Rails.configuration.use_debug_javascript
end

end
