Table = React.createClass
    #mixins:[RowMixin]
    #状态初始化
    getInitialState:->
    getDefaultProps:->
    #指定属性类型
    propTypes:
      config:React.PropTypes.array
    #组件加载前-执行一次
    componentWillMount:->
    #组件加载后--执行一次
    componentDidMount:->
    #组件每次更新后执行
    componentDidUpdate:->
    #组件移除前调用
    componentWillUnmount:->
    #排序
    columnHeaderClickHandler:(e)->
      key = e.target.dataset.column
      if key is @state.sortField
        sortDir = if @state.sortDir is "asc" then "desc" else "asc"
      else
        sortDir = "asc"
      @setState
          sortField:key
          sortDir:"asc"
    addColumnIcon = (field)->
      if field is @state.sortField
        if that.state.sortDir is "asc"
          <i className='glyphicon glyphicon-sort-by-attributes pull-right' />
        else
          <i className='glyphicon glyphicon-sort-by-attributes-alt pull-right'/>
      else
        <i/>
      columnHeaders = for own k,v of schema
              <th data-column={k} onClick={@columnHeaderClickHandler}>{v.title}{addColumnIcon(k)}</th>

    sortCollection:->
      if @state.sortField?
        sortField = @state.sortField
        sortDir = @state.sortDir
        sortModels = @props.collection.models.sort (a,b)->
          a = a.get(sortField)
          b = b.get(sortField)
          if a>b
            if sortDir is "asc" then 1 else -1
          else if a is b
            0
          else
            if sortDir is "asc" then -1 else 1
      else
        sortModels = @props.collection.models
    render:->
      rows = for model in sortModels
              <Row model={model}/>
      containerStyle =
                    marginBottom:10
                    borderBottomStyle:"none"
      <div className="panel panel-default" style={containerStyle}>
          <div className="panel-heading clearfix">
            	<div className="pull-right" data-range="headerButtons" style={{minHeight:20}}></div>
          </div>
          <div className="table-responsive" >
            	<table className="table table-bordered table-hover">
            		<thead>{columnHeaders}</thead>
            		<tbody>{rows}</tbody>
            	</table>
            </div>
      </div>

Row = React.createClass
  getInitialState:->
    editCell:null
    editCellWidth:null
  cellClick:(e)->
    debugger
    key = e.target.dataset.field
    width = $(React.findDOMNode(this.refs[key+"-cell"])).outerWidth()
    @setState
      editCell:key
      editCellWidth:width
  inputClick:(event)->
    debugger
    event.stopPropagation()
  inputBlur:(event)->
    @setState
      editCell:null
  componentDidUpdate:->
    debugger
    unless @state.editCell is null
      #查找相关组件并执行focus
      React.findDOMNode(this.refs[@state.editCell]).focus()
  valueChange:(e)->
    #通知父组件更新属性
    key = e.target.dataset.field
    value = e.target.value
    @props.handlerValueChange(key,value)
  render:->
    schema = @props.model.schema
    editCellStyle =
      width:@state.editCellWidth
      padding:1
    cells = for own k,v of schema
      if @state.editCell is k
        <td data-field={k} ref={k+"-cell"} style={editCellStyle} onClick={@cellClick.bind(this)}>
           <input data-field={k} ref={k} type='text' onChange={@valueChange} onClick={@inputClick} onBlur={@inputBlur}
             className='form-control' value={@props.model.get(k)}/>
        </td>
      else
        <td data-field={k} ref={k+"-cell"} onClick={@cellClick}>{@props.model.get(k)}</td>
    <tr>{cells}</tr>

Cell = React.createClass

window.BackboneTable = Table
  getInitialState:->

###TableView = Backbone.View.extend
  tagName:"div"
  className:"panel panel-default"
  attributes:
    style:"margin-bottom:10px;border-bottom-style:none;"
  events:
    "click button[data-method=add]": "addNewRowByModal"
    "click th": "sort"
    "click button[data-method=save]": "saveList"
    "click button[data-method=role]": "roleButtonClick"
  options:
    allowPageing: true
    pageNum:10
    allowSortting: true
    allowMultiRowSelected: false
    buttons:null
  #以下将合并到this中
  sortColumn: null
  editRow: null
  pageView:null
  schema:null
  rowViewList:[]
  #selectedRows: []
  selectedRow:null
  cellMakers:{}
  schema:null
    #allowAddButton: true
    #allowSaveButton: false
    #allowRoleButton: false
    #saveUrl: ""
    #rowViewList: []
  initialize:(options)->
    viewOptions = ["allowPageing","allowSortting","allowMultiRowSelected","buttons"]
    _.extend @options, _.pick(options, viewOptions)

    @schema = @collection.model::schema
    @pageView = new TableView.Page {collection:@collection,pageNum:@options.pageNum} if @options.allowPageing

    @listenTo @collection,"add sort sync reset",@renderBody,@
    @collection.setSort @options.sortColumn if @options.sortColumn
    #创建单元格对象
    for own k,v of @schema when k isnt "buttons"
      @cellMakers[k] = new Backbone.TableView.CellMaker[v.type](k,v)


  render:->
    @renderContainer()
    @renderHeaderButtons()
    @renderColumnsHeader()
    @renderBody()
    @renderFooter()

  _getPageCollection:->
    #这里假定集合已经是排好序的了
    sIndex = @pageView.pageNum * (@pageView.currPage-1)
    eIndex = sIndex + @pageView.pageNum-1
    pageCollection = @collection.models[sIndex..eIndex]
  renderContainer:->
    @$el.html """<div class="panel-heading clearfix">
                	<div class="pull-right" data-range="headerButtons">
                    &nbsp;
                	</div>
                	<div class="pull-right"></div>
                  </div>
                <div class="table-responsive" >
                	<table class="table table-bordered table-hover">
                		<thead></thead>
                		<tbody></tbody>
                	</table>
                </div> """

  renderHeaderButtons:->
      debugger
      buttonContainer = @$el.find "[data-range=headerButtons]"
      if @options.buttons is "default"
        buttonContainer.empty().append '<button class="btn btn-success btn-sm" data-command="add"><span class="glyphicon glyphicon-plus"></span> 新增</button>'
      else if @options.buttons.headerButtons?
        buttonContainer.empty()
        for button in @options.buttons.headerButtons
          btnStyle = button.style ? {className:"btn btn-success",icon:""}
          buttonContainer.append """<button class="btn #{btnStyle.className}" data-command="#{button.command}"><span class="#{btnStyle.icon}"></span>#{button.text}</button>"""

  renderColumnsHeader:->
    schema = @collection.model::schema
    tr = $ "<tr style='cursor:pointer;'>"
    $.each schema,(key,val)->
      if key isnt "button" and val.visible isnt false
        $("<th>#{val.title}</th>").data("column",key).appendTo(tr)
    if @.options.buttons?
      tr.append("<td>")
    @$el.find("thead").append(tr)

  renderBody:->
    that = @
    _.each @options.rowViewList,(v,i)->
      v.remove().off()
    @options.rowViewList = []

    $tbody = @$el.find("table tbody")
    $docFragment = $(document.createDocumentFragment())
    curPageCollection = @_getPageCollection()

    selectedModel = _.pluck @options.selectedRows,"model"
    debugger
    buttons = null
    if @options.buttons is "default"
      buttons = [
        {text:"详情", command:"detial"}
        {text:"编辑", command:"edit"}
        {text:"删除", command:"delete"}
      ]
    else if @options.buttons?.rowButtons?
      buttons = @options.buttons.rowButtons
    $.each curPageCollection,(index,value)->
      selected = $.inArray(value,selectedModel) isnt -1
      rowOptions =
        model:value
        tableView:that
        selected:selected
        buttons:buttons

      #buttons:that.buttons?.rowButtons
      rowView= new TableView.RowView rowOptions
      that.options.rowViewList.push(rowView)
      $docFragment.append rowView.render().el
    $tbody.empty()
    @options.selectedRow = null
    @options.editRow = null
    $tbody.append $docFragment

  renderFooter:->
    return if @options.infinite
    if @pageView and @options.allowPageing
      @$("table").after @pageView.render().el
      @listenTo @pageView,"pageChange",@renderBody,@

  cancelEdit:->
    @editRow.cancelEdit() if @editRow
    @options.editRow = null

  addNewRow:->
    User = @collection.model
    model = new User null,{collection:@collection}
    @collection.add model
    e = @_triggerEvent.addNewRow.call @,model
    unless e.isDefaultPrevented()
      @renderBody()
    else
      @collection.remove(model)


  addNewRowByModal:(e)->
    that = @
    event = @_trigger "addButtonClick"
    return if event.isDefaultPrevented()
    e = @_triggerEvent.beforeShowAddNewModal.call @
    return e.isDefaultPrevented()

    User = @collection.model
    view = new Backbone.Tableview.Modal
      model:new User null,{collection:that.collection}
      readonly:false
    @_triggerEvent.afterShowAddNowModal.call @,view.model
    view.render()

  getColDef:($el)->
    colName = $($el).data("column")
    schema = _.pick(@collection.model::schema,collName)[colName]
    schema?.name = colName
    schema

  sort:(e)->
    return unless @options.allowSortting
    target = $ e.currentTarget
    c_name = @getColDef(target).name
    @collection.setSort c_name
    $("th i").remove()
    if @collection.sortDir is "asc"
      target.append "<i class='fa fa-sort-asc pull-right' style='padding-top:6px;'>"
    else
      target.append "<i class='fa fa-sort-desc pull-right'>"

  cellDoubleClick:(rowView)->
    @_triggerEvent.cellDoubleClick.call @,rowView.model

  cellClick:(rowView)->
    #@_triggerEvent.cellClick.call @,rowView.model

  cellBeginEdit:(rowView,fieldSchema)->
    return if @options.readonly
    success = true
    if @editRow
      unless @editRow.endEdit()
        success = false
    #e = @_triggerEvent.cellBeginEdit.call @,rowView.model,fieldSchema
    #rtlVal = false if e.isDefaultPrevented()
    @editRow = rowView if success
    success

  cellEndEdit:(rowView,fieldSchema)->
    rtlVal = true
    if @options.editRow
      e = @_triggerEvent.cellEndEdit.call @,rowView.model,fieldSchema
      unless e.isDefaultPrevented()
        unless @options.editRow.endEdit()
          rtlval = false
        else
          rtlval = false
    @options.editRow = null if rtlval?
    return rtlval

  cancelEdit:->
    if @options.editRow
      @options.editRow.cellCancelEdit()
      @options.editRow = null

  selectRow:(rowView,e)->
    if rowView isnt @selectedRow
      @selectedRow?.removeSelect()
      rowView.selectRow()
      @selectedRow = rowView

  _trigger:(eventName,data,target)->
    target?=@
    e = $.Event()
    target.trigger eventName,e,data
    e

  _triggerEvent:
    "beforeRowSelectChanged":(model)->
      @_trigger "beforeRowSelected",model

    "afterRowSelectChanged":(model)->
      @_trigger "afterRowSelected",model

$.extend Backbone,TableView:TableView
###
