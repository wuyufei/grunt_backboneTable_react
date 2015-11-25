
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover,Pagination,ButtonGroup,SplitButton,MenuItem,Glyphicon,Dropdown}=ReactBootstrap
window.BackboneTable = BackboneTable = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
  setModel:(model,key,value)->
    error = null
    invalidHandle = (model,er)->
      error = er
      model.set key,value,silent:true
    model.on "invalid",invalidHandle
    model.set key,value,validate:true,silent:true
    model.off "invalid",invalidHandle
    if error?[key]? then error else null
  render:->
    ReactDOM.render <ReactTable {...@options } setModel={@setModel}/>,@el

CreateCellContentMixin =
  componentWillUpdate:(nextProps,nextState)->
    el = $(@getDOMNode())
    schema = @props.collection.model::schema
    el.find(".dtpControl_#{k}").datetimepicker("remove") for k,v of schema when v.type.toLowerCase() is "datetime"
  componentDidMount:->
    @getColumnsWidth()
    @createDateTimePickerControl()
  componentDidUpdate:->
    @getColumnsWidth()
    @createDateTimePickerControl()
  getCellContent:(model,key)->
    schema = model.schema[key]
    ref = key+model.cid
    if @props.readonly is true
      isEdit = false
    else if schema.edit is true or (model is @state.editCell?.model and key is @state.editCell?.key)
      isEdit = true

    if isEdit
      content = switch schema.type.toLowerCase()
                  when "text" then <input style={{height:32}} ref={ref} className="form-control" type="text" bsSize="small" value={model.get(key)} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true"/>
                  when "select" then  <select style={{height:32}} ref={ref} className="form-control" bsSize="small" value={model.get(key)} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true">
                                        {<option value={opt.val}>{opt.label}</option> for opt in schema.options}
                                      </select>
                  when "checkbox" then <input style={{height:32,marginTop:0}} className="form-control" type="checkbox" bsSize="small" checked={model.get(key) is "1"} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true"/>
                  when "datetime" then <div className="input-group input-append date form_datetime" >
                                           <input ref={ref} style={{height:32}} className="form-control dtpControl_#{key}" autoFocus="true" data-cid={model.cid} value={model.get(key)}  type="text" onChange={@onCellValueChange.bind(@,model,key)}  readOnly="readonly"/>
                                           <span className="input-group-addon add-on" onClick={@onCellEndEdit.bind(@,model,key)}><i  className="glyphicon glyphicon-remove" ></i></span>
                                      </div>
    else
      content =<span>{model.get(key)}</span>
      if schema.type.toLowerCase() is "checkbox"
        if model.get(key) is "1" then content = <span className="glyphicon glyphicon-ok"></span> else content = <span/>
      else if schema.type.toLowerCase() is "select"
        content =<span>{_.findWhere(schema.options,val:model.get(key)).label}</span>
    if @state.error?.model is model and @state.error.key is key
      error = <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs[ref])} placement="right">
                    <Popover>{@state.error.msg}</Popover>
              </Overlay>
      content = [content,error]
    content
  getModalFieldContent:(model,key)->
    schema = model.schema[key]
    type = schema.type.toLowerCase()
    switch type
      when "text" then <Input type="text" addonBefore={schema.title} value={model.get(key)}/>
      when "select" then <Input type="select" addonBefore={schema.title} value={model.get(key)}>
                            {options = for opt in schema.options
                              <option value={opt.val}>{opt.label}</option>}
                        </Input>
      when "datetime"then <Input type="text" disabled=true addonBefore={schema.title} buttonAfter={<Button><Glyphicon glyph="remove" /></Button>} value={model.get(key)} />
      when "checkbox" then <Input type="checkbox" bsSize="small" label={schema.title} value={model.get(key)}/>
      else  <Input type="text" addonBefore={schema.title} value={model.get(key)}/>
  onCellValueChange:(model,key,e)->
    value = if model.schema[key].type.toLowerCase() is "checkbox" then (if e.target.checked is true then "1" else "0") else e.target.value
    error = @props.setModel(model,key,value)
    if error then @setState error:model:model,key:key,msg:error[key] else @setState error:null
  onCellEndEdit:(model,key,e)->
    value = if model.schema[key].type.toLowerCase() is "checkbox" then (if e.target.checked is true then "1" else "0") else e.target.value
    error = @props.setModel(model,key,value)
    if error
       @setState
          error : model:model,key:key,msg:error[key]
          editCellIsValidate:false
    else
      @setState error:null,editCellIsValidate:true,editCell:null
    e.preventDefault()
    e.stopPropagation()
  createDateTimePickerControl:->
    that = @
    schema = @props.collection.model::schema
    el = $(@getDOMNode())
    for k,v of schema when v.type.toLowerCase() is "datetime"
      dtpControls = el.find(".dtpControl_#{k}")
      dtpControls.datetimepicker {format:v.format,language:"zh-CN",weekStart:1,todayBtn:1,autoclose:1,todayHighLight: 1,startView: 2,minView: 2,forceParse: 0,todayBtn: true,pickerPosition:"bottom-right"}
      dtpControls.on "changeDate",do (k)->
        (e)->
          $el = $(e.currentTarget)
          model = that.props.collection.get $el.data("cid")
          e = target:value:$el.val()
          that.onCellEndEdit(model,k,e)
          if that.state.editCell?.model is model && that.state.editCell.key is k
            that.setState editCell:null

      if @state.editCell?.key is k
        dtpControls.datetimepicker("show")
  getButtonProps:(buttonInfo)->
    debugger
    that = @
    btnProps = {}
    switch buttonInfo.command
        when "detail"
          btnProps.clickHandle = @detailButtonHandle
          btnProps.bsStyle = "info"
          btnProps.icon="list"
        when "edit"
          btnProps.clickHandle = @editButtonHandle
          btnProps.bsStyle = "primary"
          btnProps.icon="edit"
        when "delete"
          btnProps.clickHandle = @deleteButtonHandle
          btnProps.bsStyle = "danger"
          btnProps.icon="trash"
        else
          btnProps.clickHandle = buttonInfo.onclick
          btnProps.bsStyle = buttonInfo.btnClass ? "info"
          btnProps.icon = buttonInfo.iconClass ? "list"
    btnProps
  getColumnsWidth:->
    cellWidths={}
    for k,v of @props.collection.model::schema
      $el = $(@refs["th_#{k}"].getDOMNode())
      cellWidths[k] = $el.outerWidth()
    @cellWidths = cellWidths
  getSortCollection:->
      that = @
      sortModels = _.clone @props.collection.models
      schema = @props.collection.model::schema
      if @state.sortField
        getSortValue = schema[@state.sortField].sortValue
        sortModels.sort (a,b)->
          a = getSortValue?(a) ? a.get(that.state.sortField)
          b = getSortValue?(b) ? b.get(that.state.sortField)
          if _.isString(a) then return a.localeCompare(b); else return a-b
        sortModels.reverse() if @state.sortDir is "desc"
      sortModels


ReactTable = React.createClass
  mixins:[CreateCellContentMixin]
  getInitialState:->
    activePage:1
    editCellIsValidate:true
    showModal:false
  componentWillMount:->
  componentDidMount:->
  componentWillUpdate:(nextProps,nextState)->
  componentDidUpdate:->

  # changeStateEventHandler
  showModalHandle:->
    @setState showModal:true
  hideModalHandle:->
    @setState showModal:false
  cellClickHandle:(model,key,e)->
    @setState selectedRow:model
    if @props.readonly isnt true and model.schema[key].readonly isnt true and model.schema[key].edit isnt true and @state.editCellIsValidate is true
      @setState editCell:{model:model,key:key}
  columnHeaderClickHandle:(name)->
    if @state.sortField is name and @state.sortDir is "asc" then dir = "desc" else dir = "asc"
    @setState sortField:name,sortDir:dir
  pageChangeHandle:(event,selectedEvent)->
    @setState activePage:selectedEvent.eventKey
  detailButtonHandle:(model,e)->
    alert("")
  editButtonHandle:(model,e)->
  addButtonHandle:(model,e)->
  deleteButtonHandle:(model,e)->
  selectButtonClick:(model,e,eventKey)->
    alert eventKey
  render:->
    pageRecordLength = @props.pageRecordLength ? 10
    pageCount = Math.ceil(@props.collection.length/10)
    sortCollection = @getSortCollection()
    pageCollection = sortCollection[(@state.activePage-1)*10..(@state.activePage)*10-1]
    <div className="panel panel-default">
        <div className="panel-heading clearfix">
            <div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
              {
                do =>
                  for btnInfo in @props.headerButtons
                    <Button bsStyle="primary" bsSize="small" onClick={btnInfo.onClick} onClick={@showModalHandle}><Glyphicon glyph="plus" />{" " + btnInfo.text}</Button>
              }
            </div>
        </div>
        <div className="table-responsive" >
            <table className="table table-bordered table-hover table-condensed" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
              <thead>
                {
                  do =>
                    ths=for k,v of @props.collection.model::schema
                            <th ref={"th_#{k}"} onClick={@columnHeaderClickHandle.bind(@,k)}>
                              {v.title}
                              {
                                do =>
                                  if @state.sortField is k
                                    if @state.sortDir is "asc"
                                      <i className='glyphicon glyphicon-sort-by-attributes pull-right' />
                                    else
                                      <i className='glyphicon glyphicon-sort-by-attributes-alt pull-right'/>
                              }
                            </th>
                    if @props.rowButtons?.length>0
                      ths.push <th style={{width:160,minWidth:200}}></th>
                    ths
                }
              </thead>
              <tbody>
                {
                  do =>
                    for model in pageCollection
                      <tr className={if @state.selectedRow is model then "info" else ""}>
                        {
                          for k,v of model.schema
                            if @state.editCell?.model is model and @state.editCell.key is k
                              style={padding:0,width:@cellWidths[k]}
                            else if v.edit is true
                              style={padding:0,width:v.width ? 200}
                            else
                              style={}
                            <td style={style} onClick={@cellClickHandle.bind(@,model,k)}>{@getCellContent(model,k)}</td>
                        }
                        <td>
                          <ButtonGroup bsSize="xsmall">
                            {
                              do =>
                                if @props.rowButtons?.length <= 3
                                  for btnInfo in @props.rowButtons[0..2] when btnInfo?
                                    btnProps = @getButtonProps(btnInfo)
                                    <Button onClick={btnProps.clickHandle.bind(@,model)} bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + btnInfo.text}</Button>
                                else if @props.rowButtons?.length>3
                                  result =   for btnInfo in @props.rowButtons[0..1]
                                                btnProps = @getButtonProps(btnInfo)
                                                <Button onClick={btnProps.clickHandle?.bind(@,model)} bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + btnInfo.text}</Button>
                                  btnProps = @getButtonProps(@props.rowButtons[2])
                                  tmp1 = <Dropdown id="dropdown-custom-2" bsSize="xsmall" onSelect={@selectButtonClick.bind(@,model)}>
                                           <Button onClick={btnProps.clickHandle.bind(@,model)}  bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + @props.rowButtons[2].text}</Button>
                                           <Dropdown.Toggle bsStyle="default"/>
                                           <Dropdown.Menu>
                                             {do =>
                                               for btnInfo in @props.rowButtons[3...]
                                                 btnProps = @getButtonProps(btnInfo)
                                                 <MenuItem eventKey={btnInfo.command}>{btnInfo.text}</MenuItem>}
                                           </Dropdown.Menu>
                                         </Dropdown>
                                 result.push tmp1
                                 result
                            }
                          </ButtonGroup>
                        </td>
                      </tr>
                }
              </tbody>
            </table>
            <Pagination prev next first last ellipsis items={pageCount} maxButtons={pageRecordLength} activePage={this.state.activePage} onSelect={this.pageChangeHandle} />
        </div>
        <Modal show={@state.showModal} onHide={@hideModalHandle} bsSize="large" >
          <Modal.Header closeButton>
            <Modal.Title>详情</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid fluid=true >
              <Row className="show-grid">
                {do =>
                  if @state.selectedRow?
                    model = @state.selectedRow
                    for k,v of model.schema
                      <Col xs={12} sm={6} md={6}>
                        {@getModalFieldContent(model,k)}
                      </Col>}
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
                    <Button bsStyle="primary">保存</Button>
                    <Button bsStyle="default" onClick={@hideModalHandle}>取消</Button>
          </Modal.Footer>
        </Modal>
    </div>
console.log ""
