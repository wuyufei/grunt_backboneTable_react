#添加backbone.Validate插件支持
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
      required:false
      msg:"请输入出生日期"
    education:
      required:true
      msg:"请选择学历"
  schema:
    name:
      type:"Text"
      title:"姓名"
      readonly:true
      readonlyOnModal:false
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
      title:"傻逼"

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
            "education|1":["1","2","3"]
            "sb|1":["0","1"]
        ]
Mock.mock /users/,"get",(options)->
  Mock.mock(template).list
ReactTable = window.ReactTable
users.fetch
  reset:true
  async:false

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

table = new TableView
  el:$("#container")
  collection:users
  readonly:false
  cellClick:(model,key)->
    debugger
    #alert("单击")
  cellDoubleClick:(model,key)->
    debugger
    alert("双击")
  addButtonClick:(e)->
    e.preventDefault()
  detailButtonClick:(model,e)->
    e.preventDefault()
  editButtonClick:(model,e)->
    e.preventDefault()
  buttons:[
    {
      text:"详情"
      command:"detail"
      onClick:(model)->
        debugger
    }
    {
      text:"编辑"
      command:"edit"
      onClick:(model)->
        debugger
    }
    {text:"删除", command:"delete"}
    {
      text:"审核"
      command:"verify"
      onClick:(model)->
        debugger
        alert("")
    }
    {text:"删除", command:"delete"}
  ]

table.render()

###tableProps =
  collection:users
  cellClick:(model,key)->
    debugger
    #alert("单击")
  cellDoubleClick:(model,key)->
    debugger
    alert("双击")
  buttons:[
    {text:"详情", command:"detail"}
    {text:"编辑", command:"edit"}
    {text:"删除", command:"delete"}
    {text:"删除", command:"delete"}
    {text:"删除", command:"delete"}
  ]
React.render <ReactTable {...tableProps}></ReactTable>,
  document.getElementById 'container'###
