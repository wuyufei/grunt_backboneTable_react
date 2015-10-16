RowMixin =
  componentDidMount:->
  componentWillUnmount:->


Row = React.createClass
  #混入
  mixins:[RowMixin]
  #状态初始化
  getInitialState:->
  #属性默认值
  getDefaultProps:->
    openDropdown:-1
  #指定属性类型
  propTypes:
    config:React.PropTypes.array
  #组件加载前
  componentWillMount:->
  #组件加载后
  componentDidMount:->
    node = @getDOMNode()
  #组件移除前调用
  componentWillUnmount:->
  render:->
    tds = for own k,v of @props.model.schema
      <td></td>
    <tr>
      {tds}
    </tr>

RowView = Backbone.View.extend
  tagName:"tr"
  className:"backboneTableRow"
  events:
    "click button[data-method=detail]": "showDetailForm"
    "click button[data-method=edit]": "showEditForm"
    "click a[data-method=delete]": "deleteRow"
    "click a[data-method=verify]": "verify"
    "click >td": "cellClick"
    "dblclick": "cellDoubleClick"
    "click button[data-method=deleteRow]": "deleteRow"
    "click button[data-method=selectImportRow]": "selectImportRow"
  options:
    readonly:false
  selected:false
  tableView:null
  cellMakers:null

  initialize:(options)->
    viewProp = ["tableView","cellMakers","selected","buttons"]
    _.extend @,_.pick(options,viewProp)

    @cellMakers = @tableView.cellMakers
    @options.readonly = @tableView.options.readonly

    @listenTo @model,"change",@render,@
    @listenTo @model,"destroy",@remove,@
    @on "_afterRowSelected",->
      that.$el.addClass "active"
    @_setSelectable(@$el,false)
  _setSelectable:(obj,enabled)->
    ###if enabled
      obj.removeAttr("unselectable").removeAttr("onselectstart").css("-moz-user-select", "").css("-webkit-user-select", "")
    else
      obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("-moz-user-select", "none").css("-webkit-user-select", "none")###

  renderButtons:->
    return unless @buttons
    style =
      detail:
        className:"btn-info"
        icon:"glyphicon glyphicon-list"
      edit:
        className:"btn-primary"
        icon:"glyphicon glyphicon-edit"
      delete:
        className:"btn-danger"
        icon:"glyphicon glyphicon-trash"
      defaults:
        className:"btn-info"
        icon:"glyphicon glyphicon-list"

    buttonListContainer = null
    if(@buttons?)
      if @buttons.length<=3
        tdWidth = 63*@buttons.length
      else
        tdWidth = 220
      buttonContainer = $ """<td nowrap="noWrap" style="width:#{tdWidth}px;">"""
      index = 0
      for button in @buttons
        debugger
        btnStyle = button.style ? style[button.command] ? style.defaults
        if index<2
          buttonContainer.append """  <button class="btn btn-xs #{btnStyle.className}" data-command="#{button.command}" style="margin-right:5px;">
                                        <span class="#{btnStyle.icon} "></span> #{button.text}
                                      </button> """
        else if index is 2
          ###buttonContainer.append """<div class="btn-group">
                                      <button type="button" class="btn btn-xs btn-primary  dropdown-toggle" data-toggle="dropdown">
                                        更多 <span class="caret"></span>
                                      </button>
                                      <ul class="dropdown-menu" role="menu">
            												    <li><a href="#" data-command="#{button.command}">#{button.text}</a></li>
            											    </ul>
                                    </div> """###
          buttonContainer.append """<div class="btn-group">
                                      <button class="btn btn-xs #{btnStyle.className}" data-command="#{button.command}">
                                        <span class="#{btnStyle.icon} "></span> #{button.text}
                                      </button>

                                    </div> """
          if @buttons.length>3
            buttonContainer.find(".btn-group").append """<button type="button" class="btn btn-xs btn-danger  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="caret"></span>
                                        <span class="sr-only">Toggle Dropdown</span>
                                      </button>
                                      <ul class="dropdown-menu" role="menu">
                                      </ul> """
            buttonListContainer = buttonContainer.find(".dropdown-menu")
        else if index>2
          buttonListContainer.append """<li><a href="#" data-command="#{button.command}">#{button.text}</a></li>"""
        index++
      @$el.append buttonContainer
  render:->
    that = @
    @$el.empty()
    for own key,val of @model.schema when key of @cellMakers
      @cellMakers[key].create(@model).appendTo @$el
    #@$el.append @btnTemplate(@model.schema.buttons)
    @$el.addClass("active") if @options.selected
    @renderButtons()
    @
  removeSelect:->
    @$el.removeClass("active")
    @options.selected = false
  selectRow:->
    @$el.addClass("active")
    @options.selected = true
  _commitEditControl:(fieldSchema)->
        cell = @cellMakers[fieldSchema.key].commitEditControl @model
  cellClick:(e)->
    debugger
    @tableView.selectRow(@,e)
    cell = $(e.currentTarget)
    fieldSchema = @_getFieldSchemaByCell(cell)
    return unless fieldSchema? or fieldSchema.readonly is true

    @beginEdit cell,fieldSchema if @tableView.cellBeginEdit @,fieldSchema
    @tableView.cellClick(@)
  _getFieldSchemaByCell:(cell)->
    key = cell.data("field")
    fieldSchema = @model.schema[key]
    fieldSchema.key = key
    fieldSchema
  beginEdit:(cell,fieldSchema)->
    that = @
    cell.empty()
    cell.attr "editor","true"
    cell.css "padding","2px"
    cell.width cell.width()

    input = @_commitEditControl fieldSchema
    input.appendTo(cell).focus()
    if fieldSchema.type isnt "DateTime"
      input.on "blur",(e)->
        that.tableView.cellEndEdit(that,fieldSchema)
        e.preventDefault()
        e.stopImmediatePropagation()

  commitEditValue:(cell)->
    isValidated = true

    schema = @_getFieldSchemaByCell(cell)
    input = cell.find("input")
    value = @cellMakers[schema.key].getEditValue(cell)

    setValue = (dtd)=>
      @model.on "invalid",(model,error)->
        dtd.reject(model,error) if error[schema.key]
      @model.set schema.key,value,{validate:true,silent: true}
      @model.off("invalid")
      dtd.resolve()

    $.Deferred(setValue)#这样写减少了一个函数调用
    .done ->
      popover = input.data "bs.popover"
      popover.destroy() if popover?
    .fail ->
      popover = input.data('bs.popover')
      if popover?
        input.focus()
        popover.show()
      else
        input.popover
          content:error[schema.key]
          placement:"auto"
        input.focus().popover("show")

    isValidated
  endEdit:->
    cell = @$el.find "[editor=true]"
    schema = @_getFieldSchemaByCell(cell)
    if @commitEditValue(cell)
      cell.empty()
      cell.replaceWith @cellMakers[schema.key].create(@model)
    ###
    that = @
    $td = @$el.find("[editor=true]")
    $input = $($td.children()[0])
    inputValue = $input.val()
    if $input.is("[type=checkbox]")
      if $input.is(":checked")
        inputValue = "1"
      else
        inputValue = "0"
    fieldSchema = @_getFieldSchemaByCell($td)
    valudated = true
    validPrompt = new $.Deferred()
    validPrompt.done ->
      that.model.set fieldSchema.key,inputValue
      popover = $input.data "bs.popover"
      if popover isnt null
        popover.destroy()

      if fieldSchema.type is "DateTime"
        datetimepicker = $td.find("input").datetimepicker("remove")
      $td.removeAttr "editor"
      $td.removeAttr "style"
      $td.css "width","auto"
      $td.empty()
      key = fieldSchema.key
      if fieldSchema.key is "Checkbox"
        $td.css "textAlign","center"
        $(that.cellControls[key].getDisplayValue()).appendTo($td)
      else
        $td.text(that.cellControls[key].getDisplayValue())
    validPrompt.fail (model,error)->
      setTimeout ->
        popover = $input.data('bs.popover')
        if popover
          $input.focus()
          popover.show()
        else
          $input.popover
            content:error[fieldSchema.key]
            placement:"auto"
          $input.focus()
          $input.popover "show"
      ,0
      validated = false

    that.model.once "invalid",(model,error)->
      validPrompt.reject(model,error) if error[fieldSchema.key]
    that.model.set fieldSchema.key,inputValue,{validate:true}
    validPrompt.resolve()
    validated###

  cellCancelEdit:->
    that = @
    $td = @el.parent().find("[editor=true]")
    return if $td.length is 0
    fieldSchema = @_getFieldSchemaByCell($td)
    $td.removeAttr "editor"
    $td.removeAttr "style"
    $td.css "width","auto"
    $td.empty()
    if @model.hasChanged(fieldSchema.key)
      prev = @model.previous fieldSchema.key
      @model.set(fieldSchema.key,prev)
    if fieldSchema.type is "Checkbox"
      $td.css "textAlign","center"
      $(that.cellControls[fieldSchema.key].getDisplayValue()).appendTo($td)
    else
      $td.text(that.cellControls[fieldSchema.key].getDisplayValue())

  showDetailForm:(e)->
    event = @options.tableView._trigger "detialButtonClick",@model
    return if event.isDefaultPrevented()
    new Backbone.TableView.Modal(
          model:@model,
          readonly:true
    ).render()

  showEditForm:(e)->
    event = @options.tableView._trigger "editButtonClick",@model
    return if event.isDefaultPrevented()
    new Backbone.TableView.Modal(
          model:@model
          readonly:false
    ).render()
  deletedRow:(e)->
    that = @
    event= @options.tableView._trigger "deleteButtonClick",@model
    return if event.isDefaultPrevented()
    modalView = new Backbone.modalView
      contentText:"确认删除数据吗?"
    modalView.render()
    modalView.on "confirmButtonClick",(e)->
      that.model.destroy {wate:true}
  selectImportRow:(e)->
    event = @options.tableView._trigger "selectImportRow",@model
  verify:(e)->
    @options.tableView.verify(this)
  cellDoubleClick:(e)->
    @options.tableView.cellDoubleClick(@)

$.extend Backbone.TableView,{RowView:RowView}
