#模拟数据

template =
    'list|20-30':
        [
            'ID|+1': 10000
            'RQ': '@date'
            "CBID": '@name'
            'HC': '@name'
            "ZG":'@region'
            'GK': '@region'
            "XG":'@region'
            "HP":'@region'
            "YJ":'@integer(100000, 900000)'
            "SJLZ":'@integer(100000, 900000)'
            "SJLX":'@integer(100000, 900000)'
            "YXSH":'@integer(100000, 900000)'
            "SHL":'@integer(100000, 900000)'
            "DSL":'@integer(100000, 900000)'
            "CHL":'@integer(100000, 900000)'
            "DJ":'@integer(100000, 900000)'
            "ZYF":'@integer(100000, 900000)'
            "PCE":'@integer(100000, 900000)'
            "JYYF":'@integer(100000, 900000)'
            "HTF":'@integer(100000, 900000)'
            "CBLX|1":["集装箱船","散货船"]

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
    RQ:
      title:"日期"
      type:"DateTime"
      format:"yyyy-mm-dd"
    CBID:
      title:"船舶"
      type:"Text"
    HC:
      title:"航次"
      type:"Text"
    ZG:
      title:"装港"
      type:"Text"
    XG:
      title:"卸港"
      type:"Text"
    HP:
      title:"货品"
      type:"Text"
    YJ:
      title:"运价"
      type:"Text"
    SJLZ:
      title:"商检量/装"
      type:"Text"
    SJLX:
      title:"商检量/卸"
      type:"Text"
    YXSH:
      title:"允许损耗"
      type:"Text"
    SHL:
      title:"损耗量"
      type:"Text"
    DSL:
      title:"定损量"
      type:"Text"
    DSL:
      title:"超耗量"
      type:"Text"
    DSL:
      title:"单价"
      type:"Text"
    DSL:
      title:"总运费"
      type:"Text"
    DSL:
      title:"赔偿额"
      type:"Text"
    DSL:
      title:"结余运费"
      type:"Text"
    DSL:
      title:"合同方"
      type:"Text"
    DSL:
      title:"船舶类型"
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
  buttons:[
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
