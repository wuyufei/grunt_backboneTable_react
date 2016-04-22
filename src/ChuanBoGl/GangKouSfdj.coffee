# CoffeeScript
#港口驶费登记

$("#startTime,#endTime").datetimepicker
    format:"yyyy-mm-dd"
    language:"zh-CN"
    weekStart:1
    autoclose:1
    todayHighLight: 1
    startView: 2
    minView: 2
    forceParse: 0
    todayBtn: true
    pickerPosition:"bottom-right"

$("#btnSearch").click ->
  data =
        cbbh:$("#sltCb").val()
        startTime:$("#startTime").val()
        endTime:$("#endTime").val()
  list.fetch
    reset:true
    data:data

$("#btnPrint").click ->
    table.options.allowPage = false
#    delete table.options.buttons.rowButtons
    table.render()
    setTimeout ->
        $("#backboneTable").printArea
            popTitle:"港口驶费登记"
    ,1000
    setTimeout ->
        table.options.allowPage = true
        table.render()
    ,5000



getSelectData = (code)->
  array = []
  $.ajax
    url:"/GetSelectData/Get"
    data:"FieldName="+code
    async:false
    success:(data)->
      array = data
  array

cbSelectData = getSelectData("CBBH")
Model = Backbone.Model.extend
  idAttribute:"ID"
  urlRoot:"/api/tbinv_gksfdj"
  validation:
    KBSJ:
        required:true
        msg:"请输入靠泊时间"
    CBBH:
        required:true
        msg:"请输入船舶编号"
    HCBH:
        required:true
        msg:"请选择航次编号"
    JE:
        required:true
        pattern:"number"
        msg:"请输入正确的数字"
    LPJE:
        pattern:"number"
        msg:"请输入正确的数字"
    CE:
        pattern:"number"
        msg:"请输入正确的数字"

  schema:
    KBSJ:
      title:"靠泊日期"
      type:"DateTime"
      format:"yyyy-mm-dd"
    CBBH:
      title:"船舶"
      type:"Select"
      options:do ->
                    for i in cbSelectData
                        item = {}
                        [item.label,item.val]=[i.mc,i.dm]
                        item
    HCBH:
      title:"航次"
      type:"Text"
    GK:
      title:"港口"
      type:"Text"
    HX:
      title:"航线"
      type:"Text"
    JE:
      title:"预付款"
      type:"Text"
    LPJE:
      title:"来票金额"
      type:"Text"
    CE:
      title:"差额"
      type:"Text"
    FKNR:
      title:"付款内容"
      type:"Text"
    LPSJ:
      title:"来票时间"
      type:"DateTime"
    FKDW:
      title:"付款单位"
      type:"Text"
    URL:
      title:"文件"
      type:"fileinput"
      url:"/ChuanBoGl/FileUpload"
      fileCategory:"gksfdj"

List = Backbone.Collection.extend
  url:"/api/tbinv_gksfdj"
  model:Model

list = new List()


tableOption =
  el:$("#backboneTable")
  collection:list
  readonly:true
  displayedPageRecordLength:10
  displayedPagesLength:10
  allowPage:true
  buttons:
    headerButtons:
      add:
        text:"新增"
        onclick:(model,e)->
          model = new Model()
          model.collection = list
          e.preventDefault()
          form = new Form
            model:model
            action:"add"
          form.render()
    rowButtons:
      detail:
        text:"详情"
        onclick:(model,e)->
            e.preventDefault()
            form = new Form
                model:model
                action:"detail"
            form.render()
      edit:
        text:"编辑"
#        onclick:(model,e)->
#            e.preventDefault()
#            form = new Form
#                model:model
#                action:"edit"
#            form.render()
      "delete":text:"删除"


Form = ModalFormView.extend
  renderComplete:->
    debugger
    that = @
    cbbhInput = @$el.find "[data-field=CBBH]"
    hcbhInput = @$el.find "[data-field=HCBH]"
    cbbhInput.change ->
        hcbhInput = that.$el.find "[data-field=HCBH]"
        hcbhInput.empty()
        val = $(@).val()
        array = getSelectData "hcbh|#{val}"
        for i in array
            hcbhInput.append """<option value="#{i.dm}">#{i.mc}</option> """
    if @options.action is "add"
        hcbhInput.replaceWith("<select data-field='HCBH' class='form-control' />")
        cbbhInput.trigger("change")
    else if  @options.action is "edit"
        cbbhInput.attr("disabled","disabled")
        hcbhInput.attr("disabled","disabled")

    fileInputContainer = @$el.find("[data-container=fileinput]")
    fileInput = @$el.find("[data-field=URL]")
    schema = @model.schema["URL"]
    fuOpt =
      baseUrl:schema.url
      dataType:"string"
      chooseFile:(files,mill)->
        fileInput.val(files[0].name)
      beforeUpload:(files,nill)->
      uploadSuccess:(resp)->
        fileInput.data("url",resp.url)
      uploadFail:(resp)->
        debugger
      param:
        fileCategory:schema.fileCategory
    ReactDOM.render  <FileUpload options={fuOpt} style={{height:20}} >
                        <button className="btn btn-default btn-xs" ref="uploadBtn" ><span className="glyphicon glyphicon glyphicon-upload" aria-hidden="true"></span>  上传</button>
                        <button className="btn btn-info btn-xs" ref="chooseBtn" ><span className="glyphicon glyphicon glyphicon-folder-open" aria-hidden="true"></span>  浏览</button>
                     </FileUpload>
    ,fileInputContainer[0]





if sa.Search is false
    delete tableOption.buttons.rowButtons.detail
if sa.Edit is false
    delete tableOption.buttons.headerButtons.add
    delete tableOption.buttons.rowButtons.edit
if sa.Delete is false
    delete tableOption.buttons.rowButtons.delete
if sa.Verify is false
    delete tableOption.buttons.rowButtons.verify


table = new BackboneTable tableOption

table.render()
