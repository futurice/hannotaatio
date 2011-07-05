require "base64"

class AnnotationsController < ApplicationController

#  #Unecessary since protect_from_forgery not present in application_controller
#  #Remove authentication from create
#  protect_from_forgery :except => :create
#  skip_before_filter :verify_authenticity_token

  def index
    # Note! This is currently deactivated from routes, but is kept here
    # for reference.
    @annotations = Annotation.all
    respond_to do |format|
      format.json  { render :json => @annotations }
    end
  end

  def show
    # It should be noted that the :id field in RESTful routing actually maps
    # to :uuid in our model and controller. While the :id field still exists
    # implicitly in our model, it's not visible to the end user, and is not
    # used in unit testing to locate a unique object which has no UUID, e.g.
    # CapturedFile and Hannotation. Since we didn't do explicit parameter
    # remapping in routes.rb, here the actual UUID value is stored in params[:id].
    @annotation = Annotation.find_by_uuid(params[:id])
    # render :json => {:error => {:message => "Unknown annotation uuid"}}, :status => 404 and return if @annotation.nil?
    render :text => "Unknown annotation uuid.", :status => 404 and return if @annotation.nil?
    respond_to do |format|
      format.json { render :json => @annotation }
    end
  end

  def create
    # Parse and validate the post parameters in the request
    annotation_params = params[:annotation]
    render :text => "Invalid data in request.", :status => 400 and return if annotation_params.nil?

    uuid = annotation_params[:uuid]
    render :text => "Annotation #{uuid} already exists.", :status => 409 and return if Annotation.exists?(:uuid => uuid)

    # Create the annotation, and any additional objects or values that are required
    @annotation = Annotation.new(annotation_params)
    @annotation.browser = request.env['HTTP_USER_AGENT']
    @annotation.capture_time = Time.at(Float(annotation_params[:capture_time]))

    # Check API key
    api_key = ApiKey.find_by_api_key(params[:api_key]);
    @annotation.api_key = api_key if api_key != nil

    # Notification emails
    notification_emails_params = params[:notification_emails]
    if notification_emails_params != nil
      notification_emails = []
      notification_emails_params.each do |notification_email|
        notification_emails.push NotificationEmail.new(:email => notification_email)
      end
      
      @annotation.notification_emails = notification_emails
    end

    if !@annotation.save
      render :text => "Failed saving annotation object. Error: #{@annotation.errors}", :status => 500 and return
    end

    if request.form_data?

        if params.has_key?(:capture_encoding)
            capture_encodings = params[:capture_encoding]
        else
            capture_encodings = {}
        end

        capture_files = params[:capture]
        capture_files.each do |path, data|
            data = case capture_encodings[path]
                when "base64" then Base64.decode64(data)
                else data
            end
            file = CapturedFile.new(:annotation => @annotation, :path => path, :content => data)
            if !file.save
                logger.warn "Failed saving capture/#{path} for annotation #{uuid}."
            end
        end

      # TODO: Use some configuration file for resolving the View URL.
      view_url = "#{Rails.configuration.view_url}#{uuid}"

      redirect_to view_url and return
    end

    # Note: The recipient is assumed to be expecting the response as JSON.
    render :json => @annotation, :status => 201
  end

  def destroy
    @annotation = Annotation.find_by_uuid(params[:id])
    render :text => "Unknown annotation uuid.", :status => 404 and return if @annotation.nil?

    # TODO: Verify that related objects are deleted!!
    @annotation.destroy

    render :text => "Deleted."
  end

end
