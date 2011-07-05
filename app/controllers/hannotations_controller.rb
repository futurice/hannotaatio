class HannotationsController < ApplicationController
  
  def create
    @annotation = Annotation.find_by_uuid(params[:annotation_id])
    render :text => "Unknown annotation uuid.", :status => 404 and return if @annotation.nil?
    
    fh = request.body
    body = fh.read
    
    # Remove old annotation objects, if there is any
    @annotation.hannotation.destroy if not @annotation.hannotation.nil?
    
    @hannotation = Hannotation.new(:annotation => @annotation, :body => body)
    if !@hannotation.save
      render :text => "Could not save annotation objects.", :status => "409" and return
    end
    
    # Note: The recipient is assumed to be expecting the response as JSON.
    render :json => @hannotation.body, :status => '201'
    
    # Send notification emails
    if !@annotation.notification_emails.empty?
      NotificationMailer.new_hannotaatio(@annotation).deliver
    end
    
  end

  def index
    @annotation = Annotation.find_by_uuid(params[:annotation_id])
    render :text => "Unknown annotation uuid.", :status => 404 and return if @annotation.nil?
    render :nothing => true, :status => 204 and return if @annotation.hannotation.nil?
    
    # Note: The recipient is assumed to be expecting the response as JSON.
    render :json => @annotation.hannotation.body
  end

end

