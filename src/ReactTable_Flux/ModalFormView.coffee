# CoffeeScript
ModalFormView = Backbone.View.extend
    tagName: "div"
    className: "modal fade",
    events:
      "click [data-command=save]":"save"
      "hidden.bs.modal":"remove"
      "shown.bs.modal":"modalShown"
    initialize:(options)->
        @options = _.extend {},options
    close:->
        @$el.modal("hide")
    modalShown:->
        @$el.find("[data-command=colse]").focus()
    bindingData:->
        that = @
        for k,v of @model.schema
            control = @$el.find("[data-field=#{k}]")
            switch v.type.toLowerCase()
                when "text"
                    control.val @model.get(k)
                when "select"
                    #绑定下拉框
                    for item in @model.schema[k].options
                      control.append """<option value="#{item.val}">#{item.label}</option> """
                    control.val @model.get(k)
                when "checkbox"
                    control.prop("checked",true) if @model.get(k) is "1"
                when "datetime"
                    dateFormat = (v.format ? "YYYY-MM-DD").toUpperCase()
                    displayValue = if $.trim(@model.get(k)) is "" then "" else  moment(@model.get(k)).format(dateFormat)
                    format = @model.schema[k].format ? "yyyy-mm-dd"
                    control.val displayValue
                    control.datetimepicker
                        format:format
                        language:"zh-CN"
                        weekStart:1
                        todayBtn:1
                        autoclose:1
                        todayHighLight: 1
                        startView: 2
                        minView: 2
                        forceParse: 0
                        pickerPosition:"bottom-right"
                else
                    control.val @model.get(k)

    _getFormValues:->
      val = {}
      for k,v of @model.schema
        el = @$el.find("[data-field=#{k}]")
        el.popover "destroy"
        val[k] = el.val() if el.length>0
      if @getFormValue?
        _.extend val,@getFormValue()
      val
    _validate:(values)->
      isValidate = true
      error = @model.validate values
      if @validate?
        tmpError = @validate()
        unless _.isEmpty(tmpError)
            _.extend error,tmpError
            isValidate = false
      if error
        isValidate = false
        window.scroll(0,0)
        for k,v of error
          el = @$el.find("[data-field=#{k}]")
          if el.length>0
              el.popover
                content:v
                placement:"auto right"
              el.popover "show"
              el.click (e)->
                $(this).popover "destroy"
      isValidate
    save:->
      that = this;
      debugger
      formValues = @_getFormValues()
      if @_validate(formValues)
        isNew = @model.isNew()
        @model.save formValues,
            success:()->
                that.$el.modal("hide")
                that.model.collection.add(that.model) if isNew
            error:(model, xhr, options)->
                $el = that.$el.find("[data-command=save]");
                $el.popover
                    content: xhr.responseJSON.ExceptionMessage
                    placement: "auto"
                $el.popover("show");

    template:_.template """<div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" data-command="colse" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">详情</h4>
                                  </div>
                                  <div class="modal-body">
                                  </div>
                                </div>
                              </div>
                          """
    formTemplate:_.template """<div class="container-fluid">
                                    <div class="row">
                                        <%_.each(model.schema,function(v,k){ %>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="form-group">
                                                <div class="input-group">
                                                    <span class="input-group-addon"><%= v.title %></span>
                                                    <%= getControl(v.type,k) %>
                                                </div>
                                            </div>
                                        </div>
                                        <% }) %>
                                    </div>
                               </div>"""

    footerTemplate:_.template """<div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-command="save">保存</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                                  </div> """
    getControl:(type,key)->
        switch type.toLowerCase()
            when "text"
                """<input type="text" class="form-control" data-field=#{key} />"""
            when "select"
                """<select  class="form-control" data-field=#{key} />"""
            when "checkbox"
                """<input type="checkbox" class="form-control" data-field=#{key} />"""
            when "datetime"
                """<input type="text" class="form-control" data-field=#{key} readonly/>"""
            when "fileinput"
                """<input type="text"  className="form-control"/>
                     <span className="input-group-addon" data-container="fileinput">
                   </span>"""

    render:->
        #mContent = this.$el.find("div.modal-content")
        @$el.append @template()
        @$el.find(".modal-body").append @formTemplate model:@model,getControl:@getControl
        modalContent = @$el.find(".modal-content")
        if @options.action isnt "detail"
            modalContent.append @footerTemplate()
        if @width?
            #modalContent.minWidth(@width)
            #modalContent.css("minWidth",@width)
            @$el.find(".modal-dialog").css("minWidth",@width)
        @$el.modal({backdrop: "static"})
        @$el.modal("show")
        if @model? then  @bindingData()
        if @options.action is "detail"
            @$el.find("fieldset").attr("disabled","disabled")
        if @title?
            @$el.find(".modal-title").text(@title)
        this.renderComplete?()
        this.el.focus()


window.ModalFormView = ModalFormView
