

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
           <input style={inputStyle} ref="input" autoFocus="true" type='text' valueLink={@linkState("value")} onBlur={_.partial(@props.cellEndEdit,@state.value)}
             className='form-control' />
        </td>
      else
        <td  onDoubleClick={@props.cellDoubleClick} onClick={@props.cellClick}>{@state.value}</td>

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
           <select style={inputStyle} ref="input" valueLink={@linkState("value")} onBlur={@props.cellEndEdit.bind(this,@state.value)}
             className='form-control' autoFocus="true" >
             {options}
           </select>
        </td>
      else
        <td  onClick={@props.cellClick}>{@getDisplayValue()}</td>


DateTimeCell = React.createClass
    mixins:[CellMixin]
    componentWillMount:->
      @setState value: @props.value
    getDisplayValue:->
      return @props.value
    closeButtonClick:(e)->
      console.log("close")
      e.preventDefault()
      e.stopPropagation()
      @props.cellEndEdit("")
    render:->
      cellStyle =
        padding:0
      inputStyle =
        marginBottom:0
      ###<td style={cellStyle}>
         <input style={inputStyle} type="text" ref="input" defaultValue={@getDisplayValue()}
           className='form-control' />
      </td>###
      if @props.required
        input = <input style={inputStyle} type="text" ref="input" defaultValue={@getDisplayValue()}
          className='form-control' autoFocus="true" />
      else
        input = <div className="input-group input-append date form_datetime" ref="datetimepicker">
             <input size="16" className="form-control" autoFocus="true" ref="input" type="text" defaultValue={@getDisplayValue()} readOnly="readonly"/>
             <span onClick={@closeButtonClick} className="input-group-addon add-on" ><i  className="glyphicon glyphicon-remove"></i></span>
        </div>
      if @props.isEdit
        <td style={cellStyle}>{input}</td>
      else
        <td  onMouseDown={@props.cellClick}>{@getDisplayValue()}</td>
    componentDidMount:->
      td = @getDOMNode()
      @width = $(td).innerWidth()

    componentDidUpdate:->
      that = @
      if @props.isEdit
        input = $(React.findDOMNode(this.refs.input))
        $(@getDOMNode()).width(@width)
        setTimeout ->
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
        ,0
        input.on "changeDate",->
          value = input.val()
          that.props.cellEndEdit(value)
        unless this.props.required
          input.on "hide",->
            console.log("hide")
        if @props.error
          input.popover
            content:@props.error[@props.fieldKey]
            placement:"auto"
          #input.focus().popover("show")
    componentWillUpdate:(nextProps, nextState)->
      if @props.isEdit
        input = $(React.findDOMNode(@refs.input))
        input.datetimepicker("remove")
        console.log("remove")
    componentWillUnmount:->
      if @props.isEdit
        input = $(React.findDOMNode(@refs.input))
        input.datetimepicker("remove")
        console.log("remove")

window.TextCell=TextCell
window.SelectCell = SelectCell
window.DateTimeCell = DateTimeCell
