class Keys < Settingslogic
  source "#{Rails.root}/config/keys.yml"
  namespace Rails.env
end