

CellMixin =
  componentWillMount:->
    @setState value: @props.value
  componentDidMount:->
    td = @getDOMNode()
    @width = $(td).innerWidth()
  componentDidUpdate:->
    if @props.isEdit
      input = $(React.findDOMNode(this.refs.input))
      $(@getDOMNode()).width(@width)
      if @props.error
        input.popover
          content:@props.error[@props.fieldKey]
          placement:"auto"
        input.focus().popover("show")




TextCell = React.createClass
    mixins:[React.addons.LinkedStateMixin,CellMixin]
    render:->
      cellStyle =
        padding:0
      inputStyle =
        marginBottom:0
      if @props.isEdit
        <td style={cellStyle}>
           <input style={inputStyle} ref="input" autoFocus="true" type='text' valueLink={@linkState("value")} onBlur={@props.cellEndEdit}
             className='form-control' />
        </td>
      else
        <td  onDoubleClick={@props.cellDoubleClick} onClick={@props.cellClick}>{@state.value}</td>

CheckBoxCell = React.createClass
  mixins:[React.addons.LinkedStateMixin,CellMixin]
  componentWillMount:->
     @setState value:if @props.value is "1" then true else false
  render:->
    cellStyle =
      #padding:0
      textAlign:"center"
    if @props.isEdit
      style =
        margin:0
        height:"100%"
        padding:0
        border:0
      <td style={cellStyle}>
        <input type="checkbox" className="input-lg" style={style}  checkedLink={@linkState("value")} onBlue={@props.cellEndEdit} />
      </td>
    else
      if @state.value
        <td style={cellStyle} onClick={@props.cellClick}>
          <span className="glyphicon glyphicon-ok"  ></span>
        </td>
      else
        <td style={cellStyle}  onClick={@props.cellClick}></td>



SelectCell = React.createClass
    mixins:[React.addons.LinkedStateMixin,CellMixin]
    getDisplayValue:->
      for opt in @props.schema.options when opt.val is @state.value
        displayValue = opt.label
      displayValue?=""
    render:->
      cellStyle =
        padding:0
      inputStyle =
        marginBottom:0
      options = for opt in @props.schema.options
        <option value={opt.val}>{opt.label}</option>
      if @props.isEdit
        <td style={cellStyle}>
           <select style={inputStyle} ref="input" valueLink={@linkState("value")} onBlur={@props.cellEndEdit}
             className='form-control' autoFocus="true" >
             {options}
           </select>
        </td>
      else
        <td  onClick={@props.cellClick}>{@getDisplayValue()}</td>


DateTimeCell = React.createClass
    mixins:[React.addons.LinkedStateMixin,CellMixin]
    componentWillMount:->
      @setState value: @props.value
    closeButtonClick:(e)->
      that = @
      @setState value:"",->
        that.props.cellEndEdit()
      e.preventDefault()
      e.stopPropagation()
    render:->
      cellStyle =
        padding:0
      inputStyle =
        marginBottom:0
      if @props.required
        input = <input style={inputStyle} type="text" ref="input" defaultValue={@getDisplayValue()}
          className='form-control' autoFocus="true" />
      else
        input = <div className="input-group input-append date form_datetime" ref="datetimepicker">
                     <input size="16" className="form-control" autoFocus="true" ref="input" type="text" valueLink={@linkState("value")} readOnly="readonly"/>
                     <span onClick={@closeButtonClick} className="input-group-addon add-on" ><i  className="glyphicon glyphicon-remove"></i></span>
                </div>
      if @props.isEdit
        <td style={cellStyle}>{input}</td>
      else
        <td  onClick={@props.cellClick}>{@state.value}</td>

    componentDidUpdate:->
      that = @
      if @props.isEdit
        input = $(React.findDOMNode(this.refs.input))
        if input.data("datetimepicker")
          input.datetimepicker("show")
        else
          input.datetimepicker
              format:that.props.schema.format
              language:"zh-CN"
              weekStart:1
              todayBtn:1
              autoclose:1
              todayHighLight: 1
              startView: 2
              minView: 2
              forceParse: 0
              todayBtn: true
              pickerPosition:"bottom-right"
          input.datetimepicker('show')

        input.off "changeDate"
        input.one "changeDate",->
          that.setState value:input.val(),->
            that.props.cellEndEdit()
        unless this.props.required
          input.on "hide",->
            console.log("hide")
        if @props.error
          input.popover
            content:@props.error[@props.fieldKey]
            placement:"auto"
          #input.focus().popover("show")
    componentWillUpdate:(nextProps, nextState)->
      if @props.isEdit is true and  nextProps.isEdit isnt true
        input = $(React.findDOMNode(@refs.input))
        input.datetimepicker("remove")
    componentWillUnmount:->
      if @props.isEdit
        input = $(React.findDOMNode(@refs.input))
        if input.data("datetimepicker")
          input.datetimepicker("remove")
          console.log("remove")
window.CellClasses =
          text:TextCell
          select:SelectCell
          datetime:DateTimeCell
          checkbox:CheckBoxCell
#window.TextCell=TextCell
#window.SelectCell = SelectCell
#window.DateTimeCell = DateTimeCell
