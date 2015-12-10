#添加backbone.Validate插件支持

{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover}=ReactBootstrap
_.extend Backbone.Model.prototype, Backbone.Validation.mixin
User = Backbone.Model.extend
  idAttribute:"id"
  urlRoot:"/users"
  defaults:
    name:""
    age:0
    Birthday:"1900-01-01"
    education:""
  validation:
    name:
      required:true
      msg:"请输入姓名"
    age:
      required:true
      msg:"请输入年龄"
    birthday:
      required:true
      msg:"请输入出生日期"
    updateDate:
      required:false
      msg:"请输入升级日期"
    education:
      required:true
      msg:"请选择学历"
  schema:
    name:
      type:"Text"
      title:"姓名"
      readonly:true
      readonlyOnModal:false
      visible:false
    age:
      type:"Text"
      title:"年龄"
    birthday:
      type:"DateTime"
      title:"出生日期"
      format:"yyyy-mm-dd"
    education:
      title:"学历"
      type:"Select"
      options:[
        {val:"",label:""}
        {val:"1",label:"大专"}
        {val:"2",label:"本科"}
        {val:"3",label:"硕士"}
      ]
    sb:
      type:"Checkbox"
      title:"工作标志"
      width:80


Users = Backbone.Collection.extend
  url:"/users"
  model:User


users = new Users


template =
    'list|200':
        [
            'id|+1':10000
            'name':"@cname"
            "age": "@integer(10,80)"
            "birthday":"@date"
            "education|1":["","1","2","3"]
            "sb|1":["0","1"]
        ]
Mock.mock /users/,"get",(options)->
  Mock.mock(template).list
ReactTable = window.ReactTable

#
# users.fetch
#   reset:true
#   async:false

$("#btnSearch").click ->
  users.fetch reset:true

table = new BackboneTable
  el:$("#table")
  collection:users
  readonly:false
  displayedPageRecordLength:10
  displayedPagesLength:10
  allowPage:true
  cellClick:(model,key)->
    debugger
  cellDoubleClick:(model,key)->
    debugger
    alert("双击")

  buttons:
    headerButtons:
      add:
        text:"新增"
        onclick:(model,e)->
    rowButtons:
      detail:
        text:"详情"
        onclick:(e)->
          # e.preventDefault()
      edit:
        text:"编辑"
        onclick:(model,e)->
          e.preventDefault()
          form = new Form model:model
          form.render()
      delete:
        text:"删除"
        onclick:(e)->
          # e.preventDefault()
      verify:
        text:"审核"
        onclick:(model,e)->
          debugger
          alert(model)
          e.preventDefault()

table.render()

FormView = Backbone.View.extend
    tagName: "div"
    className: "modal fade",
    events:
      "click [data-command=save]":"save"
    initialize:(options)->
        @options = _.extend {},options
    validate:->
      isValidate = true
      val = {}
      for k,v of @model.schema
        el = @$el.find("[data-field=#{k}]")
        el.popover "destroy"
        val[k] = el.val() if el.length>0
      error = @model.validate val
      if error
        isValidate = false
        for k,v of error
          el = @$el.find("[data-field=#{k}]")
          el.popover
            content:v
            placement:"auto"
          el.popover "show"
      isValidate
    save:->
      debugger
      if @validate()
        alert("保存")
    formTemplate:_.template """ """
    template:_.template """<div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">详情</h4>
                                  </div>
                                  <div class="modal-body">
                                  </div>
                                  <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-command="save">保存</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                                  </div>
                                </div>
                              </div>
                          """
    render:->
        #mContent = this.$el.find("div.modal-content")
        @$el.append @template()
        debugger
        @$el.find(".modal-body").append @formTemplate model:@model
        this.$el.modal("show")
        this.renderComplete?()

Form = FormView.extend
  formTemplate:_.template """ <div class="row">
                                <form class="form-horizontal" role="form">
                                  <div class="col-md-6 col-sm-12" style="margin-top:10px;">
                                    <label class="col-sm-4 control-label">姓名</label>
                                    <div class="col-sm-8">
                                      <input type="text" class="form-control" data-field="name"  value="<%=model.get("name") %>" />
                                    </div>
                                  </div>
                                  <div class="col-md-6 col-sm-12" style="margin-top:10px;">
                                    <label class="col-sm-4 control-label">年龄</label>
                                    <div class="col-sm-8">
                                      <input type="text" class="form-control" data-field="age" value="<%=model.get("age")%>" />
                                    </div>
                                  </div>
                                  <div class="col-md-6 col-sm-12" style="margin-top:10px;">
                                    <label class="col-sm-4 control-label">出生日期</label>
                                    <div class="col-sm-8">
                                      <input type="text" class="form-control" data-field="birthday" value="<%=model.get("birthday")%>" />
                                    </div>
                                  </div>
                                  <div class="col-md-6 col-sm-12" style="margin-top:10px;">
                                    <label class="col-sm-4 control-label">学历</label>
                                    <div class="col-sm-8">
                                      <select type="select" class="form-control" data-field="education"/>
                                    </div>
                                  </div>
                                  <div class="col-md-12 col-sm-12" style="margin-top:10px;">
                                    <label class="col-sm-4 control-label">途经港</label>
                                    <div class="col-sm-8" data-container="tjg">

                                    </div>
                                  </div>
                                </form>
                              </div>  """
  renderComplete:->
    that = @
    selectControl = that.$el.find("[data-field=education]")
    for item in that.model.schema.education.options
      selectControl.append """<option value="#{item.val}">#{item.label}</option> """
    selectControl.val that.model.get("education")
    tjgContainer = @$el.find("[data-container=tjg]")
    tjgContainer.append """<div class="input-group">
                              <input type="text" data-cid="c405" class="dtpControl_birthday form_datetime form-control">
                              <span class="input-group-btn">
                                <button type="button" class="btn btn-default">
                                  <span class="glyphicon glyphicon-remove"></span>
                                </button>
                                <button type="button" class="btn btn-default">
                                  <span class="glyphicon glyphicon-remove"></span>
                                </button>
                              </span>
                            </div> """
    setTimeout ->
      format = that.model.schema.birthday.format ? "yyyy-mm-dd"
      that.$el.find("[data-field=birthday]").datetimepicker
        format:format,language:"zh-CN",weekStart:1,todayBtn:1,autoclose:1,todayHighLight: 1,startView: 2,minView: 2,forceParse: 0,todayBtn: true,pickerPosition:"bottom-right"
    ,500
