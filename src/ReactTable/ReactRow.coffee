Row = React.createClass
  componentWillMount:->
  getButtonProps:(buttonInfo)->
    btnProps = {}
    switch buttonInfo.command
        when "detail"
          btnProps.handleClick = buttonInfo.onClick ? @props.detailButtonClick
          btnProps.className = "btn btn-xs btn-info"
          btnProps.icon="glyphicon glyphicon-list"
        when "edit"
          btnProps.handleClick = buttonInfo.onClick ? @props.editButtonClick
          btnProps.className = "btn btn-xs btn-primary"
          btnProps.icon="glyphicon glyphicon-edit"
        when "delete"
          btnProps.handleClick = buttonInfo.onClick ? @props.deleteButtonClick
          btnProps.className = "btn btn-xs btn-danger"
          btnProps.icon="glyphicon glyphicon-trash"
        else
          btnProps.handleClick = buttonInfo.onClick
          btnProps.className = ""
          btnProps.icon = "glyphicon glyphicon-list"
      btnProps
  render:->
    debugger
    that = @
    schema = @props.model.schema
    validation = @props.model.validation
    editCellStyle =
      padding:1
    if @props.buttons?.length>0
      if @props.buttons.length >3
         buttons = @props.buttons[0..1]
         splitButton = @props.buttons[2]
         list = @props.buttons[3..]
       else
         buttons = @props.buttons[0..2]

      buttonsEl = for btn in buttons
        btnProps = that.getButtonProps(btn)
        <button className={btnProps.className} style={{marginRight:5}} onClick={btnProps.handleClick}>
          <span className={btnProps.icon}></span> {btn.text}
        </button>
      if list?
        listEl = for btn in list
          btnProps = that.getButtonProps(btn)
          <li><a href="#" onClick={btnProps.handleClick}>{btn.text}</a></li>
      if splitButton?
        btnProps = that.getButtonProps(splitButton)
        splitButtonEl = <div className="btn-group">
                          <button className={btnProps.className} onClick={btnProps.handleClick}>
                            <span className={btnProps.icon}></span> {btn.text}
                          </button>
                          <button type="button" className="btn btn-xs btn-danger  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="caret"></span>
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>
                            <ul className="dropdown-menu" role="menu">
                              {listEl}
                            </ul>
                        </div>

      buttonCellWidth = 70 * (if @props.buttons.length>3 then 3 else @props.buttons.length) + 10
      buttonCell = <td style={{width:buttonCellWidth}}>
                        {buttonsEl}{splitButtonEl}
                   </td>
    cells = for own k,v of schema
      cellProps =
        ref:k
        fieldKey:k
        value:@props.model.get(k)
        error:@props.error
        isEdit:if @props.edit is true and @props.editCell is k then true else false
        cellClick:_.partial(@props.cellClick,k)
        cellEndEdit:_.partial(@props.cellEndEdit,k)
        required:validation[k]?.required
        schema:v
      switch v.type
        when "Text"
          <TextCell key={k} {...cellProps}/>
        when "Select"
          <SelectCell key={k} {...cellProps}/>
        when "DateTime"
          <DateTimeCell key={k} {...cellProps}/>
        else
          <TextCell key={k} {...cellProps}/>
      #if @state.editCell is k
    <tr className={if @props.selected then "info" else ""}>{cells}{buttonCell}</tr>

window.Row = Row
