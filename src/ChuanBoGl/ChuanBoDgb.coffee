#模拟数据

template =
    'list|20-30':
        [
            "ID|+1": 10000,
            "CBID": ->'@name'
            "BGSJ":'@date'
            "CZR": '@cname',
            "CZSJ":'@date'
            "HC":'@integer(10,30)'
            "DDGGM":'@region'
            "DGRQ":'@date'
            "HWMC":'@cname'
            "ZHL":'@integer(1000, 3000)'
            "XHL":'@integer(1000, 3000)'
            "QCS":'@integer(10, 30)'
            "HCS":'@integer(10, 30)'
            "QYXCL":'@integer(10, 30)'
            "ZYXCL":'@integer(10, 30)'
            "DSXCL":'@integer(10, 30)'
            "YJKBSJ":'@date'
            "YFLBSJ":'@date'
            "DLLXFS":'深圳77778899'
            "BZ":'注意'
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
     CZSJ: title:"操作时间",type:"DateTime"
     HC: title:"航次号",type:"Text"
     DDGGM: title:"抵达港港名",type:"Text"
     DGRQ: title:"抵港日期及时间",type:"DateTime"
     HWMC: title:"货物名称",type:"Text"
     ZHL: title:"装货量",type:"Text"
     XHL: title:"卸货量",type:"Text"
     QCS: title:"前吃水",type:"Text"
     HCS: title:"后吃水",type:"Text"
     QYXCL: title:"轻油现存量",type:"Text"
     ZYXCL: title:"重油现存量",type:"Text"
     DSXCL: title:"淡水现存量",type:"Text"
     YJKBSJ: title:"预计靠泊时间",type:"DateTime"
     YFLBSJ: title:"预计离泊时间",type:"DateTime"
     DLLXFS: title:"代理/调度联系方式",type:"Text"
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
