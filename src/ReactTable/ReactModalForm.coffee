EditControlMinin =
  getEditControl :(key,schema)->
    if @props.customTemplate
      type = schema.type.toLowerCase()
      switch type
        when "text"
          input = $("<input type='text' value='#{@props.model.get(key) ? ""}' class='form-control' style='display:inline-block;width:100%;'/>")
        when "select"
          input = $("<select type='text'  class='form-control' style='display:inline-block;'/>")
        when "dateTime"
          input = $("<input type='text' value='#{@props.model.get(key) ? ""}' class='form-control' style='display:inline-block;'/>")
        when "checkbox"
          input = $("<input type='checkbox'>")
        else
          input = $("<input type='text' value='#{@props.model.get(key) ? ""}' class='form-control' style='display:inline-block;'/>")
    else
      readonly = @props.readonly ? schema.readonlyOnModal ? schema.readonly
      type = schema.type.toLowerCase()
      switch type
        when "text"
          <input  ref={key} type="text" valueLink={@linkState(key)} readOnly={if readonly then true else false}
            className="form-control" placeholder={schema.title} ></input>
        when "select"
          if schema.options
            options = for opt in schema.options
              <option value={opt.val}>{opt.label}</option>
          <select ref={key} ref="input" valueLink={@linkState(key)} disabled={if readonly then true else false}
            className='form-control' >
            {options}
          </select>
        when "datetime"
          <input  className="form-control"  ref={key} type="text" valueLink={@linkState(key)}  readOnly="readonly"/>
        when "checkbox"
          <input type="checkbox" />
        else
          <input  ref={key} type="text" valueLink={@linkState(k)}
            className="form-control" placeholder={schema.title} ></input>

  componentDidMount:->
    debugger
    $el = $(@getDOMNode())
    if @props.customTemplate
      for own k,v of @props.model.schema
        container = $el.find("[data-editorid=#{k}]")
        container.append @getEditControl(k,v)

    else
      for own k,v of @props.model.schema when @props.readonly isnt true and v.readonly isnt true and v.type is "DateTime"
          dateTimeEl = $ React.findDOMNode(@refs[k])
          dateTimeEl.datetimepicker
              format:v.format
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



ModalForm = React.createClass
  mixins:[React.addons.LinkedStateMixin,EditControlMinin]
  getInitialState:->
    state = {}
    for own k,v of @props.model.schema
      state[k] = @props.model.get(k)
    state
  componentDidMount:->
    that = @
    el = @getDOMNode()
    modalContainer = $(el)
    modalContainer.modal("show")
    modalContainer.on "hidden.bs.modal",->
      React.unmountComponentAtNode(modalContainer.parent()[0])
      modalContainer.parent().remove()
  saveHandle:->
    [model,state,that] = [@props.model,@state,@]
    modalContainer = $(@getDOMNode())

    newValue = {}
    for own k,v of model.schema
      newValue[k] = that.state[k] ? undefined

    invalidHandle = (model, error)-> that.setState fieldError:error
    model.on "invalid",invalidHandle

    @props.model.save newValue,
      success:->modalContainer.modal("hide")
      error:(model,xhr,error)->
        that.setState serverError:error.errorThrown
      wait:true
    model.off "invalid",invalidHandle

  componentWillUpdate:(nextProps, nextState)->


  componentDidUpdate:->
    [model,state,that] = [@props.model,@state,@]

    saveBtn = $ React.findDOMNode(that.refs.saveBtn)
    if state.serverError
      saveBtn.popover(content:state.serverError,placement:"auto")
      saveBtn.popover("show")
    else
      saveBtn.popover("destroy") if saveBtn.data("bs.popover")?

    if state.fieldError
      for own fieldKey,schema of model.schema
        control = $ React.findDOMNode(that.refs[fieldKey])
        if state.fieldError[fieldKey]?
          control.popover content:state.fieldError[fieldKey],placement:"auto"
          control.popover("show")
          control.click  -> el.popover("destroy")
        else
          control.popover("destroy") if control.data("bs.popover")?

  render:->
    #<input  ref={k} type="text" valueLink={@linkState(k)} className="form-control" placeholder={v.title} ></input>
    if @props.customTemplate
      that = @
      createCustomForm = ->
        __html:that.props.customTemplate
      <div className='modal fade'>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">x</button>
              <h4 className="modal-title">{@props.headerText}</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                <form className="form-horizontal" role="form">
                  <div dangerouslySetInnerHTML={createCustomForm()} />
                </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              {if @props.readonly then null else <button ref={"saveBtn"} type="button" className="btn btn-primary" onClick={@saveHandle}>保存</button>}
            </div>
          </div>
        </div>
      </div>
    else
      fieldEls = for own k,v of @props.model.schema
        <div className="col-md-6 col-sm-12" style={{marginTop:10}}>
          <label className="col-sm-4 control-label">{v.title}</label>
          <div className="col-sm-8">
            {@getEditControl(k,v)}
          </div>
        </div>
      <div className='modal fade'>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">x</button>
              <h4 className="modal-title">{@props.headerText}</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <form className="form-horizontal" role="form">
                    {fieldEls}
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
              {if @props.readonly then null else <button ref={"saveBtn"} type="button" className="btn btn-primary" onClick={@saveHandle}>保存</button>}
            </div>
          </div>
        </div>
      </div>
window.ModalForm = ModalForm
