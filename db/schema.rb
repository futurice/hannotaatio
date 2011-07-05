# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110705072421) do

  create_table "annotations", :force => true do |t|
    t.string   "uuid"
    t.string   "site_name"
    t.datetime "capture_time"
    t.string   "captured_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "body_width"
    t.decimal  "body_height"
    t.string   "browser"
    t.integer  "api_key_id"
  end

  create_table "api_keys", :force => true do |t|
    t.string   "api_key"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "captured_files", :force => true do |t|
    t.string   "path"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "mime_type"
    t.integer  "annotation_id"
  end

  create_table "hannotations", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "body"
    t.integer  "annotation_id"
  end

  create_table "notification_emails", :force => true do |t|
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "annotation_id"
  end

end
