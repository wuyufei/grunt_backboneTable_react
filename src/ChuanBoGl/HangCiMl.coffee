#模拟数据

template =
    'list|20-30':
        [
            'ID|+1': 10000
            "CBID": "@cname"
            "HC":'@integer(2000, 5000)'
            "RQ":'@date'
            "TZCZ":'@cname'
            "ZHG":'@region'
            "XHG":'@region'
            "HM":"@title(1)"
            "JHZZL":'@integer(3000, 60000)'
            "JHSZRQ":"@date"
            "XCYQ" :"@paragraph"
            "LXFS":"@paragraph"
            "ZYSX":"@paragraph"
            "HTSY":"@paragraph"
            "XGSY":"@paragraph"
            "HYBJL":"@cname"
        ]

Mock.mock /users/,"get",(options)->
    debugger
    Mock.mock(template).list
    #responseData = pickerData Mock.mock(template),{CBID:$("#ddlSscb").val()}


Mock.mock "/users/","delete",(options)->
    #返回 Json(new { result = true });
    debugger
    {result:true}


$("#btnSearch").click ->
  list.fetch
    reset:true
    async:false
    success:(data)->
      debugger

Model = Backbone.Model.extend
  idAttribute:"id"
  urlRoot:"/users"
  validation:{}
  schema:
    CBID:
      title:"船舶"
      type:"Text"
    HC:
      title:"航次"
      type:"Text"
    RQ:
      title:"靠泊日期"
      type:"DateTime"
      format:"yyyy-mm-dd"
    TZCZ:
      title:"通知船长"
      type:"Text"
    ZXG:
      title:"装货港"
      type:"Text"
    XHG:
      title:"卸货港"
      type:"Text"
    JHZZL:
      title:"计划装载量"
      type:"Text"
    JHSZRQ:
      title:"计划受载日期"
      type:"DateTime"
    XCYQ:
      title:"洗舱具体要求"
      type:"Text"
    LXFS:
      title:"港口调度/发货人/收货人/代理人的相关资料、联系方式"
      type:"Text"
    ZYSX:
      title:"航次港口、货物等应注意的问题"
      type:"Text"
    XGSY:
      title:"航次合同的相关事宜"
      type:"Text"
    HYBJL:
      title:"航运部经理"
      type:"Text"

List = Backbone.Collection.extend
  url:"/users"
  model:Model


list = new List()


list.fetch
  reset:true
  async:false
  success:(data)->
    debugger
ReactTable = window.ReactTable



TableView = Backbone.View.extend
  initialize:(options)->
    debugger
    this.listenTo @collection,"reset add remove change",@render.bind(this)
    this.options = {}
    _.extend this.options,options
  selectedRowChange:(model)->
    @.trigger("selectedRowChange",model)
  render:->
    debugger
    React.render <ReactTable {...@options} tableView={@}></ReactTable>,
      @el
  remove:->
    React.unmountComponentAtNode(@el)
    TableView.__super__.remove.apply(this,arguments)

list.fetch
  reset:true
  async:false
table = new TableView
  el:$("#backboneTable")
  collection:list
  readonly:true
  cellClick:(model,key)->
  cellDoubleClick:(model,key)->
  headerButtons:[
    {
      text:"新增"
      command:"add"
    }
  ]
  rowButtons:[
    {
      text:"详情"
      command:"detail"
    }
    {
      text:"编辑"
      command:"edit"
    }
    {
      text:"删除"
      command:"delete"
    }
    {
      text:"审核"
      command:"verify"
      onClick:(model)->
        debugger
        alert("")
    }
  ]



table.render()
