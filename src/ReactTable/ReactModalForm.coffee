EditControlMinin =
  getEditControl :(key,schema)->
    switch schema.type
      when "Text"
        <input  ref={key} type="text" valueLink={@linkState(key)}
        className="form-control" placeholder={schema.title} ></input>
      when "Select"
        options = for opt in schema.options
          <option value={opt.val}>{opt.label}</option>
        <select ref={key} ref="input" valueLink={@linkState(key)}
          className='form-control' >
          {options}
        </select>
      when "DateTime"
        <input  className="form-control"  ref={key} type="text" valueLink={@linkState(key)}  readOnly="readonly"/>
      else
        <input  ref={key} type="text" valueLink={@linkState(k)}
        className="form-control" placeholder={schema.title} ></input>

  componentDidMount:->
    debugger
    for own k,v of @props.model.schema
      if v.type is "DateTime"
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
      React.unmountComponentAtNode(modalContainer[0])
      modalContainer.parent.remove()
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
            <button ref={"saveBtn"} type="button" className="btn btn-primary" onClick={@saveHandle}>保存</button>
          </div>
        </div>
      </div>
    </div>
window.ModalForm = ModalForm
