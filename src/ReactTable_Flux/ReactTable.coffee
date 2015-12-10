
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover,Pagination,ButtonGroup,SplitButton,MenuItem,Glyphicon,Dropdown}=ReactBootstrap
window.BackboneTable = BackboneTable = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
    #监听事件
    @listenTo @collection,"sync destroy add",@render

  getSortList:(field,dir)->
    that = @
    sortModels = _.clone @collection.models
    schema = @collection.model::schema
    if field
      getSortValue = schema[field].sortValue
      sortModels.sort (a,b)->
        a = getSortValue?(a) ? a.get(field)
        b = getSortValue?(b) ? b.get(field)
        if _.isString(a) then return a.localeCompare(b); else return a-b
      sortModels.reverse() if dir is "desc"
    sortModels
  getNewModel:()->
    return new @collection.model()
  deleteModel:(model)->
    er = ""
    model.destroy
      async:false
      success:->
        er = ""
      error:(msg)->
        er = msg
    er
  saveModel:(model,props)->
    that = @
    isNew = model.isNew()
    model.save props,
      success:->
        that.collection.add(model) if isNew
        that.render()
      error:->
  render:->
    ReactDOM.render <ReactTable {...@options } saveModel={@saveModel.bind(@)} deleteModel={@deleteModel} getSortList={@getSortList} getNewModel={@getNewModel}/>,@el

DateTimeCellMixin =
  componentWillUpdate:(nextProps,nextState)->
    el = $(@getDOMNode())
    modalBody = $(React.findDOMNode(@refs.modalBody))
    schema = @props.collection.model::schema
    for k,v of schema when v.type.toLowerCase() is "datetime"
      el.find(".dtpControl_#{k}").datetimepicker("remove")
      modalBody.find(".dtpControl_#{k}").datetimepicker("remove")
  componentDidMount:->
    @createDateTimePickerControl()
  componentDidUpdate:->
    if @state.action in ["add","edit"]
      @createDateTimePickerControl()
  createDateTimePickerControl:->
    that = @
    schema = @props.collection.model::schema
    if @state.showModal
      modalBody = $(React.findDOMNode(@refs.modalBody))
      for k,v of schema when v.type.toLowerCase() is "datetime"
          debugger
          dtpControls = modalBody.find(".dtpControl_#{k}")
          dtpControls.datetimepicker {format:v.format,language:"zh-CN",weekStart:1,todayBtn:1,autoclose:1,todayHighLight: 1,startView: 2,minView: 2,forceParse: 0,todayBtn: true,pickerPosition:"bottom-right"}
          dtpControls.off "changeDate"
          dtpControls.on "changeDate",do (k)->
            (e)->
              $el = $(e.currentTarget)
              model = that.state.modalFormModel
              e = target:value:$el.val()
              that.onModalFieldValueChange(model,k,e)



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


CreateCellContentMixin =

  componentDidMount:->
    @getColumnsWidth()
  componentDidUpdate:->
    @getColumnsWidth()
  getCellContent:(model,key)->
    schema = model.schema[key]
    ref = key+model.cid
    if @props.readonly is true
      isEdit = false
    else if schema.edit is true or (model is @state.editCell?.model and key is @state.editCell?.key)
      isEdit = true
    else
      isEdit = false

    if isEdit
      content = switch schema.type.toLowerCase()
                  when "text" then <input style={{height:32}} ref={ref} className="form-control" type="text" bsSize="small" value={@state.editCell.value} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true"/>
                  when "select" then  <select style={{height:32}} ref={ref} className="form-control" bsSize="small" value={@state.editCell.value} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true">
                                        {<option value={opt.val ? " "}>{opt.label}</option> for opt in schema.options}
                                      </select>
                  when "checkbox" then <input style={{height:32,marginTop:0}} className="form-control" type="checkbox" bsSize="small" checked={@state.editCell.value is "1"} onChange={@onCellValueChange.bind(@,model,key)} onBlur={@onCellEndEdit.bind(@,model,key)} autoFocus="true"/>
                  when "datetime" then <div className="input-group input-append date form_datetime" >
                                           <input ref={ref} style={{height:32}} className="form-control dtpControl_#{key}" autoFocus="true" data-cid={model.cid} value={@state.editCell.value}  type="text" onChange={@onCellValueChange.bind(@,model,key)}  readOnly="readonly"/>
                                           <span className="input-group-addon add-on" onClick={@onCellEndEdit.bind(@,model,key)}><i  className="glyphicon glyphicon-remove" ></i></span>
                                      </div>
    else
      content =<span>{model.get(key)}</span>
      if schema.type.toLowerCase() is "checkbox"
        if model.get(key) is "1" then content = <span className="glyphicon glyphicon-ok"></span> else content = <span/>
      else if schema.type.toLowerCase() is "select"
        content =<span>{_.findWhere(schema.options,val:model.get(key))?.label}</span>
    if @state.error?.model is model and @state.error.key is key
      error = <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs[ref])} placement="right">
                    <Popover>{@state.error.msg}</Popover>
              </Overlay>
      content = [content,error]
    content
  getModalFieldContent:(model,key)->
    ref = "modalForm" +key+model.cid
    schema = model.schema[key]
    type = schema.type.toLowerCase()
    emptyValue = target:value:""
    timeClearButton = <Button onClick={@onModalFieldValueChange.bind(@,model,key,emptyValue)}><Glyphicon glyph="remove" /></Button>
    if model?.validation?[key]?.required is true
      addonBefore = schema.title+"*"
    else
      addonBefore = schema.title
    content =
      switch type
        when "text" then <Input type="text" ref={ref} addonBefore={addonBefore} value={@state.modalFormValues[key]} onChange={@onModalFieldValueChange.bind(@,model,key)}/>
        when "select" then <Input type="select" ref={ref}  addonBefore={schema.title} value={@state.modalFormValues[key]} onChange={@onModalFieldValueChange.bind(@,model,key)}>
                              {options = for opt in schema.options
                                <option value={opt.val}>{opt.label}</option>}
                           </Input>
        when "datetime"then <Input type="text" ref={ref} data-cid={model.cid}  className="dtpControl_#{key} form_datetime" addonBefore={schema.title} buttonAfter={timeClearButton} value={@state.modalFormValues[key]}/>
        when "checkbox" then <Input type="checkbox" ref={ref} bsSize="small" label={schema.title} checked={@state.modalFormValues[key] is "1"} onChange={@onModalFieldValueChange.bind(@,model,key)}/>
        else  <Input type="text" addonBefore={schema.title} ref={ref} value={@state.modalFormValues[key]} onChange={@onModalFieldValueChange.bind(@,model,key)}/>

    if @state.modalFormError?[key]?
      error = <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs[ref])} container={@}  placement="top">
                    <Popover style={{zIndex:99999}}>{@state.modalFormError[key]}</Popover>
              </Overlay>
      content = [content,error]
    content
  onModalFieldValueChange:(model,key,e)->
    value = if model.schema[key].type.toLowerCase() is "checkbox" then (if e.target.checked is true then "1" else "0") else e.target.value
    formValues = @state.modalFormValues
    formValues[key] = value
    @setState modalFormValues:formValues
    error = model.validate formValues
    @setState modalFormError:error
  onCellValueChange:(model,key,e)->
    value = if model.schema[key].type.toLowerCase() is "checkbox" then (if e.target.checked is true then "1" else "0") else e.target.value
    obj = {}
    obj[key] = value
    error = model.validate obj
    if error
      @setState
        error:
          model:model
          key:key
          msg:error[key]
        editCell:
          model:model
          key:key
          value:value
    else
      model.set obj
      @setState
        error:
          null
        editCell:
          model:model
          key:key
          value:value
  onCellEndEdit:(model,key,e)->
    value = if model.schema[key].type.toLowerCase() is "checkbox" then (if e.target.checked is true then "1" else "0") else e.target.value
    obj = {}
    obj[key] = value
    error = model.validate obj
    if error
       @setState
          error : model:model,key:key,msg:error[key]
          editCell:model:model,key:key,value:value
          editCellIsValidate:false
    else
      model.set obj
      @setState error:null,editCellIsValidate:true,editCell:null
    e.preventDefault()
    e.stopPropagation()
  getButtonProps:(buttonInfo)->
    btnProps = {}
    switch buttonInfo.command
        when "detail"
          btnProps.clickHandle = @buttonClickHandle.bind(@,"detail")
          btnProps.bsStyle = "info"
          btnProps.icon="list"
        when "edit"
          btnProps.clickHandle = @buttonClickHandle.bind(@,"edit")
          btnProps.bsStyle = "primary"
          btnProps.icon="edit"
        when "delete"
          btnProps.clickHandle = @buttonClickHandle.bind(@,"delete")
          btnProps.bsStyle = "danger"
          btnProps.icon="trash"
        when "add"
          btnProps.clickHandle = @buttonClickHandle.bind(@,"add")
          btnProps.bsStyle = "primary"
          btnProps.icon = "plus"
        else
          btnProps.clickHandle = buttonInfo.onclick
          btnProps.bsStyle = buttonInfo.btnClass ? "info"
          btnProps.icon = buttonInfo.iconClass ? "list"
    btnProps
  getColumnsWidth:->
    cellWidths={}
    for k,v of @props.collection.model::schema when v.visible isnt false
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
  mixins:[DateTimeCellMixin,CreateCellContentMixin]
  getInitialState:->
    activePage:1
    selectedRow:null

    showModal:false
    showConfirmModal:false

    sortField:@props.sortField ? null
    sortDir:"asc"
    editCell:
      model:null
      key:null
      error:null
    modalFormValues:null
    modalFormModel:null
    editCellIsValidate:true
    error:
      model:null
      key:null
      msg:null
  componentWillMount:->
    @sortList = @props.getSortList(@state.sortField,@state.sortDir)
  componentWillReceiveProps:(nextProps)->
    @sortList = @props.getSortList @state.sortField,@state.sortDir
    @setState showModal:false,showConfirmModal:false
  hideModalHandle:->
    @setState showModal:false
  hideConfirmModalHandle:->
    @setState showConfirmModal:false
  deleteConfirmButtonClickHandle:->
    debugger
    error = @props.deleteModel @state.selectedRow
    @hideConfirmModalHandle()
    if error
      alert(error)

  saveButtonHandle:->
    debugger
    #要考虑到value为空对象的情况
    #从schema中取得attr
    schemas = @props.collection.model::schema
    obj = {}
    obj[k] = undefined for k,v of schemas
    values = _.extend obj,@state.modalFormValues

    error = @state.modalFormModel.validate values
    if error
      @setState modalFormError:error
    else
      @.props.saveModel(@state.modalFormModel,@state.modalFormValues)

  cellClickHandle:(model,key,e)->
    if @setState.selectedRow isnt model
      @setState selectedRow:model
    if @props.readonly isnt true and model.schema[key].readonly isnt true and model.schema[key].edit isnt true and @state.editCellIsValidate is true
      unless @state.editCell?.model is model and @state.editCell.key is key
        @setState editCell:{model:model,key:key,value:model.get(key)}
  columnHeaderClickHandle:(name)->
    dir = if @state.sortField is name and @state.sortDir is "asc" then dir = "desc" else dir = "asc"
    @setState sortField:name,sortDir:dir
    @sortList =  @props.getSortList(name,dir)
  pageChangeHandle:(event,selectedEvent)->
    @setState activePage:selectedEvent.eventKey
  buttonClickHandle:(command,model,e)->
    @props.buttons?.rowButtons?[command]?.onclick?(model,e)
    @props.buttons?.headerButtons?[command]?.onclick?(model,e)

    unless e?.isDefaultPrevented?() is true
      switch command
        when "add"
          model = @props.getNewModel()
          @setState showModal:true,action:command,modalFormModel:model,modalFormValues:_.extend({}, model.attributes),modalFormError:null
        when "edit"
          @setState selectedRow:model,showModal:true,action:command,modalFormModel:model,modalFormValues:_.extend({}, model.attributes),modalFormError:null
        when "detail"
          @setState selectedRow:model,showModal:true,action:command,modalFormModel:model,modalFormValues:_.extend({}, model.attributes),modalFormError:null
        when "delete"
          @setState selectedRow:model,showConfirmModal:true,action:command


  render:->
    if @props.allowPage isnt false
      displayedPageRecordLength = @props.displayedPageRecordLength ? 10
      displayedPagesLength = @props.displayedPagesLength ? 10
      pageCount = Math.ceil(@props.collection.length/displayedPageRecordLength)
      sortCollection = @sortList
      pageCollection = sortCollection[(@state.activePage-1)*displayedPageRecordLength..(@state.activePage)*displayedPageRecordLength-1]
    else
      pageCollection = @sortList
    <div className="panel panel-default">
        <div className="panel-heading clearfix">
            <div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
              {

                  buttons = for k,v of @props.buttons.headerButtons
                              obj = _.extend {},v
                              obj.command = k
                              obj
                  if buttons?.length>0
                    <ButtonGroup>
                    {
                      for btnInfo in buttons
                        btnProps= @getButtonProps(btnInfo)
                        <Button onClick={btnProps.clickHandle?.bind(@,null)} bsSize="small" bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + btnInfo.text}</Button>
                    }
                    </ButtonGroup>
              }
            </div>
        </div>
        <div className="table-responsive">
            <table className="table table-bordered table-hover table-condensed" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
              <thead>
                {

                    columns=for k,v of @props.collection.model::schema when v.visible isnt false
                              <th ref={"th_#{k}"} onClick={@columnHeaderClickHandle.bind(@,k)}>
                                {v.title}
                                {

                                    if @state.sortField is k
                                      if @state.sortDir is "asc"
                                        <i className='glyphicon glyphicon-sort-by-attributes pull-right' />
                                      else
                                        <i className='glyphicon glyphicon-sort-by-attributes-alt pull-right'/>
                                }
                              </th>
                    if @props.buttons.rowButtons? and _.size(@props.buttons.rowButtons)>0
                      columns.push <th style={{width:160,minWidth:200}}></th>
                    columns
                }
              </thead>
              <tbody>
                {

                    for model in pageCollection
                      <tr className={if @state.selectedRow is model then "info" else ""}>
                        {
                          for k,v of model.schema when v.visible isnt false
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

                                #把对象转换为数组
                                buttons = for k,v of @props.buttons.rowButtons
                                            obj = _.extend {},v
                                            obj.command = k
                                            obj
                                if buttons.length <= 3
                                  for btnInfo in buttons[0..buttons.length]
                                    btnProps = @getButtonProps(btnInfo)
                                    <Button onClick={btnProps.clickHandle.bind(@,model)} bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + btnInfo.text}</Button>
                                else if buttons.length>3
                                  result =   for btnInfo in buttons[0..1]
                                                btnProps = @getButtonProps(btnInfo)
                                                <Button onClick={btnProps.clickHandle?.bind(@,model)} bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + btnInfo.text}</Button>
                                  btnProps = @getButtonProps(buttons[2])
                                  tmp1 = <Dropdown id="dropdown-custom-2" bsSize="xsmall">
                                           <Button  onClick={btnProps.clickHandle?.bind(@,model)}  bsStyle={btnProps.bsStyle}><Glyphicon glyph={btnProps.icon} />{" " + buttons[2].text}</Button>
                                           <Dropdown.Toggle bsStyle="default"/>
                                           <Dropdown.Menu>
                                             {
                                               for btnInfo in buttons[3...]
                                                 btnProps = @getButtonProps(btnInfo)
                                                 <MenuItem eventKey={btnInfo.command} onClick={btnProps.clickHandle?.bind(@,model)}>{btnInfo.text}</MenuItem>}
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
            {
                if @props.allowPage isnt false
                  <Pagination prev next first last ellipsis items={pageCount} maxButtons={displayedPagesLength} activePage={this.state.activePage} onSelect={this.pageChangeHandle} />
            }
        </div>
        <Modal show={@state.showModal} onHide={@hideModalHandle} bsSize="large" >
          <Modal.Header closeButton>
            <Modal.Title>详情</Modal.Title>
          </Modal.Header>
          <Modal.Body ref="modalBody">
            <Grid fluid=true >
              <Row className="show-grid">
                {
                  if @state.modalFormValues?
                    model = @state.modalFormModel
                    for k,v of model.schema
                      <Col xs={12} sm={6} md={6}>
                        {@getModalFieldContent(model,k)}
                      </Col>}
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            {
              if @state.action in ["add","edit"]
                <div>
                    <Button bsStyle="primary" onClick={@saveButtonHandle}>保存</Button>
                    <Button bsStyle="default" onClick={@hideModalHandle}>取消</Button>
                </div>
            }
          </Modal.Footer>
        </Modal>
        <Modal show={@state.showConfirmModal} onHide={@hideConfirmModalHandle} bsSize="sm">
          <Modal.Header closeButton>
            <Modal.Title>提示</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className="text-center">确认删除吗</h4>
          </Modal.Body>
          <Modal.Footer>
                    <Button bsStyle="primary" onClick={@deleteConfirmButtonClickHandle}>确定</Button>
                    <Button bsStyle="default" onClick={@hideConfirmModalHandle}>取消</Button>
          </Modal.Footer>
        </Modal>
    </div>


































console.log ""
