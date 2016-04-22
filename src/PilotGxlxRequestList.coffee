# 航次命令
# CoffeeScript

$("#btnSearch").click ->
  data =
        yhyCode:pilotCode
        pilotSearch:"1"
        startTime:$("#startTime").val()
        endTime:$("#endTime").val()
  list.fetch
    reset:true
    data:data

Model = Backbone.Model.extend
  idAttribute:"ID"
  urlRoot:"/PilotGxWh.ashx"
  validation:
    CHPILOTCODE:
        required:true
        msg:"请输入引航员编码"
    VCPILOTNAME:
        required:true
        msg:"请输入引航员姓名"
    GXRQ:
        required:true
        msg:"请输入休假日期"
    SQLB:
        required:true
        msg:"请选择休假类别"
    QJSY:
        required:true
        msg:"请输入请假事由"

  schema:
    CHPILOTCODE:title:"引航员编码", type:"Text"
    VCPILOTNAME: title:"引航员姓名",type:"Text"
    GXRQ:title:"休假日期",type:"DateTime"
    SQLB:
      title:"申请类别"
      type:"Select"
      options:[
        {label:"公休",val:"G"}
        {label:"轮休",val:"L"}
      ]
    QJSY:title:"请假事由",type:"Text"
    SHBZ:title:"审核标志",type:"Checkbox"

List = Backbone.Collection.extend
  url:"/PilotGxWh.ashx"
  model:Model


list = new List()


#list.fetch
#  reset:true
#  async:false
#  success:(data)->

ReactTable = window.ReactTable
tableOption =
  el:$("#backboneTable")
  collection:list
  readonly:true
  displayedPageRecordLength:10
  displayedPagesLength:10
  allowPage:true
  sortField:"GXRQ"
  sortDir:"desc"
  buttons:
    headerButtons:
      add:
        text:"新增申请"
        onclick:(model,e)->
          model = new Model()
          model.collection = list
          e.preventDefault()
          form = new Form
            model:model
            action:"add"
          form.render()
    rowButtons:
      "detail": text:"详情"
      "delete":
        text:"删除"
        onclick:(model,e)->
          debugger
          e.preventDefault()
          if confirm("确认删除吗？")
            postData = {}
            postData.method = "delete"
            postData.pilotCode = model.get("CHPILOTCODE")
            postData.day = moment(model.get("GXRQ")).format("YYYY-MM-DD")
            postData.SQLB = model.get("SQLB")
            promise = $.post("/PilotGxWh.ashx", postData)
            promise.done (data, status, xhr)->
              list.remove(model)
            promise.fail (xhr, status, err)->
              alert(xhr.responseText)


table = new BackboneTable tableOption
table.render()
Form = ModalFormView.extend
  renderComplete:->
    that = @
    @$el.find("[data-field=startTime],[data-field=endTime]").datetimepicker
      format: "yyyy-mm-dd",
      language: "zh-CN",
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighLight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0
    #发送请求取得已轮休天数和剩余天数
    currDate = new Date()
    date =currDate.getFullYear() + "-" + (currDate.getMonth()+1) + "-" + currDate.getDate()
    $.getJSON "/PilotGxWh.ashx", {pilotCode: pilotCode,date:date},(data, state, xhr)->
      that.$el.find("[data-field=VCPILOTNAME]").val(pilotName)
      that.$el.find("[data-field=ylxts]").val(data.YLXTS)
      that.$el.find("[data-field=syts]").val(data.SYTS)


    $.getJSON
  save:->
    #验证数据
    that = @
    validated = true
    startEl = @$el.find("[data-field=startTime]")
    endEl = @$el.find("[data-field=endTime]")
    sqlbEl = @$el.find("[data-field=SQLB]")
    qjsyEl = @$el.find("[data-field=QJSY]")
    elArray = [startEl,endEl,sqlbEl]
    for el in elArray
      unless el.val()
        el.popover
          content:"该字段不能为空"
          placement:"auto"
        el.popover "show"
        el.click (e)->
                $(this).popover "destroy"
        validated = false
      else
        el.popover "destroy"

    if sqlbEl.val() is "G" and qjsyEl.val() is ""
      qjsyEl.popover
        content:"该字段不能为空"
        placement:"auto"
      qjsyEl.popover "show"
      qjsyEl.click (e)->
                $(this).popover "destroy"
      validated = false
    if validated
      #组织数据并提交
      postData = {}
      postData.method = "yhygxlxsq"
      postData.CHPILOTCODE = pilotCode
      postData.CHPILOTNAME = pilotName
      postData.startTime = startEl.val()
      postData.endTime = endEl.val()
      postData.SQLB = sqlbEl.val()
      postData.QJSY = qjsyEl.val()
      promise = $.post("/PilotGxWh.ashx", postData)
      promise.done (data, status, xhr)->
        debugger
        d = JSON.parse(data)
        list.add(d)
        that.$el.modal("hide")
      promise.fail (xhr, status, err)->
        debugger
        $el = that.$el.find("[data-command=save]");
        $el.popover
            content: xhr.responseText
            placement: "auto"
        $el.popover("show");
        #alert(xhr.responseText)











  formTemplate:_.template """ <form>
                                <fieldset>
                                    <div class="panel panel-default">
                                        <div class="panel-heading text-center"><h4>公休轮休申请</h4></div>
                                        <div class="panel-body">
                                          <div class="alert alert-warning alert-dismissible fade in" role="alert">
                                              <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                              <h4>网上申请休假注意事项</h4>
                                              <ol>
                                                  <li>提交的申请需经科里审核通过后方生效，批准的时间与申请时间可能有出入。</li>
                                                  <li>引航员应在休假前跟科里电话确认。</li>
                                                  <li>未经审核的申请可以网上修改。</li>
                                                  <li>原则上不允许同时使用轮休和公休。</li>
                                                  <li>由于今年下半年考证人员较多，请大家在9月15日以前及早安排轮休。未提出申请轮休的，引航科将根据生产情况酌情安排。</li>
                                              </ol>
                                           </div>
                                           <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group" id="yhyInputGroup">
                                                      <span class="input-group-addon">引航员</span>
                                                      <input type="text" data-field="VCPILOTNAME" class="form-control" readonly="readonly" id="txtYhy" />
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group" id="Div2">
                                                      <span class="input-group-addon">已轮休天数</span>
                                                      <input type="text" class="form-control" data-field="ylxts" readonly="readonly" id="Text2" />
                                                      <span class="input-group-addon">天</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group" id="Div3">
                                                      <span class="input-group-addon">剩余天数</span>
                                                      <input type="text" class="form-control" data-field="syts" readonly="readonly" id="Text3" />
                                                      <span class="input-group-addon">天</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="clearfix"></div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">开始日期
                                                      </span>
                                                      <input type="text" readonly="readonly" data-field="startTime" class="form-control" id="txtStart">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">结束日期
                                                      </span>
                                                      <input type="text" readonly="readonly" data-field="endTime" class="form-control" id="txtEnd">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">公休/轮休
                                                      </span>
                                                      <select class="form-control" data-field="SQLB">
                                                      </select>
                                                  </div>
                                              </div>
                                          </div>
                                           <div class="col-md-12">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">请假事由
                                                      </span>
                                                      <textarea class="form-control" data-field="QJSY" rows="2"></textarea>
                                                  </div>
                                              </div>
                                          </div>
                                        </div>
                                    </div>
                                </fieldset>
                              </form>"""
