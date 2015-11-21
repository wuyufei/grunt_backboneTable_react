#模拟数据

template =
    'list|20-30':
        [
            'ID|+1': 10000,
            'WTF': '@cname',
            "CBID": '@cname'
            'HWMC': '@cname',
            'QSG': '@region',
            'MDG': '@region',
            'ZCSJ': '@date',
            'YDQX': '@date',
            'CYFY': '@integer(100000, 900000)'
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
     WTF: title:"委托方",type:"Text"
     CBID: title:"船舶",type:"Text"
     HWMC: title:"货物名称",type:"Text"
     QSG: title:"起始港",type:"Text"
     MDG: title:"目的港",type:"Text"
     ZCSJ: title:"装船时间",type:"DateTime"
     YDQX: title:"运到期限",type:"DateTime"
     CYFY: title:"船运费用",type:"Text"


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
