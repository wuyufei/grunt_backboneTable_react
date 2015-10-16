modalView = Backbone.View.extend
  tagName : "div"
  className:"modal fade"
  attributes:
      "data-method":"modal"
      "style":"display:none"
  events:
      "hidden.bs.modal":"remove"
      "hide.bs.modal":"destroy"
      "click button[data-method=save]":"save"
  defaultOptions:
      readonly:false
      headerText:"详情"
      acceptText:"保存"
      cancelText:"取消"
  destroy:->
    _.each @cells,(control,key)->
        control.destroy()
  initialize:(options)->
    that = @
    @$el.html """
              <div class="modal-dialog modal-lg">
                <div class="modal-content"></div>
              </div>"""
    @options = $.extend true,{},@defaultOptions,options
    _.each @model.schema,(value,key)->
        if key isnt "buttons" and value.showOnModal isnt false
          obj = {}
          obj[key] = Backbone.TableView.CellMaker.factory key,that.model,that
          _.extend that.cells,obj
  headerTemplate:_.template """<div class="modal-header">
            										<button type="button" class="close" data-dismiss="modal" aria-hidden="true" >×</button>
            										<h4 class="modal-title"><%= headerText %></h4>
  									           </div> """
  bodyTemplate:_.template """<div class="modal-body">
              									<div class="row">
              										<form class="form-horizontal" role="form">
              										</form>
              									</div>
            								  </div> """
  footTemplate:_.template """<div class="modal-footer">
              									<button type="button" class="btn btn-default" data-dismiss="modal">
              											关闭</button>
              										<% if (!readonly) { %>
              									<button type="button" class="btn btn-primary" data-method="save">
              										保存</button>
              									<% } %>
          								  </div> """
  render:->
    that = @
    mContent = @$el.find "div.modal-content"
    mContent.append @headerTemplate @options
    mContent.append @bodyTemplate()
    form = mContent.find "form"
    $.each @model.schea,(key,value)->
      value.key = key
      if value.showOnModal isnt false and key isnt "button"
        if that.model.isNew()
            if value.showOnNew isnt false
              form.append that.cells[key].renderModalField(that)
        else
            form.append that.cells[key].renderModalField(that)
    mContent.append @footTemplate(@options)
    $("body").append @$el
    @$el.modal "show"
    @
  save:->
    that = @
    validPrompt = new $.Deferred()
    validPrompt.done ->
      that.$el.find("[data-field]").popover "destroy"
      errorFlag = false
      that.model.on "error",(model,xhr,options)->
        errorFlag = true
        $el = that.$el.find "[data-method=save]"
        $el.popover
          content:xhr.responseText
          placement:"auto"
        $el.popover "show"
      that.model.on "sync",->
        that.model.off "error"
        $el = that.$el.find "[data-method=save]"
        $el.popover "hide"
        $el.popover "destroy"
        $(that.el).modal "hide"
      xhr = if that.model.isNew()
              that.model.collection.create that.model,{wait:true}
            else
              that.model.save {wait:true}
    validPrompt.fail (model,error)->
      $.each error,(key,val)->
        $el = that.$el.find("[data-field=#{key}]")
        $el.popover
          content:val
          placement:"auto"
        $el.popover("show")
        $el.click ->
          $(@).popover "destroy"

    nVal = []
    _.each that.cells,(cell,key)->
      nVal[key] = cell.getModalValue()
    that.model.once "invalid",validPrompt.reject
    that.model.set nVal,{validate:true}
    validPrompt.resolve()
$.extend Backbone.TableView,Modal:modalView
