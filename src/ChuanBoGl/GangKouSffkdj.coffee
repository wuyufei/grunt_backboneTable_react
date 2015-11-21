#模拟数据

template =
    'list|20-30':
        [
            'ID|+1': 10000
            'KBRQ': '@date'
            "CBID": '@name'
            'HC': '@name'
            "GK":'@region'
            'HX': '@region'
            "JE":'@integer(100000, 900000)'
            "LPJE":'@integer(100000, 900000)'
            "CE":'@integer(100000, 900000)'
            "FKNR":'@region'
            "LPSJ":'@date'
            "FKDW":'@region'
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
    KBRQ:
      title:"靠泊日期"
      type:"DateTime"
      format:"yyyy-mm-dd"
    CBID:
      title:"船舶"
      type:"Text"
    HC:
      title:"航次"
      type:"Text"
    GK:
      title:"港口"
      type:"Text"
    HX:
      title:"航线"
      type:"Text"
    JE:
      title:"金额"
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
