#模拟数据

template =
    'list|20-30':
        [
            "ID|+1": 10000
            "CBID": '@name'
            "BGSJ":'@date'
            "CZR": '@cname'
            "HC":"123"
            "CZSJ":'@date'
            "QDD":'@region'
            "ZDD":'@region'
            "RHXJL":'@integer(100000, 900000)'
            "RHXSJ":'@integer(10,100)'
            "RJHS":'@integer(30,100)'
            "ZHXJL":'@integer(100000, 900000)'
            "ZHXSJ":'@integer(10,100)'
            "ZJHS":'@integer(10,100)'
            "SYLC":'@integer(10,100)'
            "YDGSJ":'@date'
            "ZWHX":'@integer(10,100)'
            "WD":'@integer(10,100)'
            "JD":'@integer(10,100)'
            "QY":'@integer(10,100)'
            "FX":'@integer(10,100)'
            "FL":'@integer(10,100)'
            "LJ":'@integer(10,100)'
            "NJD":'@integer(10,100)'
            "ZJZS":'@integer(10,100)'
            "QYXH":'@integer(10,100)'
            "QYXC":'@integer(10,100)'
            "ZYXH":'@integer(10,100)'
            "ZYXC":'@integer(10,100)'
            "DSXHL":'@integer(10,100)'
            "DSXC":'@integer(10,100)'
            "BZ":"bz"
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
     CBID: title:"船舶",type:"Text"
     BGSJ: title:"报告日期",type:"DateTime"
     CZR: title:"操作人",type:"Text"
     HC: title:"航次",type:"Text"
     CZSJ: title:"操作时间",type:"Text"
     QDD: title:"起地点",type:"Text"
     ZDD: title:"止地点",type:"Text"
     RHXJL: title:"日航行距离",type:"Text"
     RHXSJ: title:"日航行时间",type:"Text"
     RJHS: title:"日均航速",type:"Text"
     ZHXJL: title:"总航行距离",type:"Text"
     ZHXSJ: title:"总航行时间",type:"Text"
     ZJHS: title:"总均航速",type:"Text"
     SYLC: title:"剩余里程",type:"Text"
     YDGSJ: title:"预抵港时间",type:"DateTime"
     ZWHX: title:"中午航向",type:"Text"
     WD: title:"维度",type:"Text"
     JD: title:"经度",type:"Text"
     QY: title:"气压",type:"Text"
     FX: title:"风向",type:"Text"
     FL: title:"风力",type:"Text"
     LJ: title:"浪级",type:"Text"
     NJD: title:"能见度",type:"Text"
     ZJZS: title:"主机转数",type:"Text"
     QYXH: title:"轻油消耗",type:"Text"
     QYXC: title:"轻油现存",type:"Text"
     ZYXH: title:"重油消耗",type:"Text"
     ZYXC: title:"重油现存",type:"Text"
     DSXHL: title:"淡水消耗量",type:"Text"
     DSXC: title:"淡水现存",type:"Text"
     BZ: title:"备注",type:"Text"


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
