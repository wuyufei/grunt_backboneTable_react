
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover,Pagination,ButtonGroup,SplitButton,MenuItem}=ReactBootstrap
window.BackboneTable = BackboneTable = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
  render:->
    ReactDOM.render <ReactTable {...@options} />,@el

CreateCellContentMixin =
  getCellContent:(model,key)->
    schema = model.schema[key]
    if @props.readonly is true
      isEdit = false
    else if schema.edit is true or (model is @state.editCell?.model and key is @state.editCell?.key)
      isEdit = true
    switch schema.type.toLowerCase()
      when "text"
        if isEdit
          content = <input style={{height:32}} className="form-control" type="text" bsSize="small" value={model.get(key)} autoFocus="true"/>
        else
          content = <span>{model.get(key)}</span>
      when "select"
        if isEdit
          content = <select style={{height:32}} className="form-control"type="checkbox" bsSize="small" value={model.get(key)} autoFocus="true">
                      {<option value={opt.val}>{opt.label}</option> for opt in schema.options}
                    </select>
        else
          content = <span>{_.findWhere(schema.options,val:model.get(key)).label}</span>
      when "checkbox"
        if isEdit
          content = <input style={{height:32,marginTop:0}} className="form-control" type="checkbox" bsSize="small" checked={model.get(key) is "1"} autoFocus="true"/>
        else if model.get(key) is "1"
          content = <span className="glyphicon glyphicon-ok"></span>
      when "datetime"
        if isEdit
          content = <div className="input-group input-append date form_datetime" >
                       <input style={{height:32}} className="form-control dtpControl_#{key}" autoFocus="true" value={model.get(key)}  type="text"  readOnly="readonly"/>
                       <span className="input-group-addon add-on" ><i  className="glyphicon glyphicon-remove"></i></span>
                    </div>
        else
          content = <span>{model.get(key)}</span>
      else
        content =<span>{model.get(key)}</span>
    content

ReactTable = React.createClass
  mixins:[CreateCellContentMixin]
  getInitialState:->
    activePage:1
  componentWillMount:->
  componentDidMount:->
    @getColumnsWidth()
    @createDateTimePickerControl()
  componentWillUpdate:(nextProps,nextState)->
    el = $(@getDOMNode())
    schema = @props.collection.model::schema
    el.find(".dtpControl_#{k}").datetimepicker("remove") for k,v of schema when v.type.toLowerCase() is "datetime"
  componentDidUpdate:->
    @getColumnsWidth()
    @createDateTimePickerControl()
  getColumnsWidth:->
    cellWidths={}
    for k,v of @props.collection.model::schema
      $el = $(@refs["th_#{k}"].getDOMNode())
      cellWidths[k] = $el.outerWidth()
    @cellWidths = cellWidths
  createDateTimePickerControl:->
    schema = @props.collection.model::schema
    el = $(@getDOMNode())
    for k,v of schema when v.type.toLowerCase() is "datetime"
      dtpControls = el.find(".dtpControl_#{k}")
      dtpControls.datetimepicker {format:v.format,language:"zh-CN",weekStart:1,todayBtn:1,autoclose:1,todayHighLight: 1,startView: 2,minView: 2,forceParse: 0,todayBtn: true,pickerPosition:"bottom-right"}
      if @state.editCell?.key is k
        dtpControls.datetimepicker("show")
  cellClick:(model,key,e)->
    @setState selectedRow:model
    if @props.readonly isnt true and model.schema[key].readonly isnt true and model.schema[key].edit isnt true
      @setState editCell:{model:model,key:key}
  sort:(name)->
    if @state.sortField is name and @state.sortDir is "asc" then dir = "desc" else dir = "asc"
    @setState sortField:name,sortDir:dir


  pageChange:(event,selectedEvent)->
    @setState activePage:selectedEvent.eventKey
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
  render:->
    pageRecordLength = @props.pageRecordLength ? 10
    pageCount = Math.ceil(@props.collection.length/10)-1
    sortCollection = @getSortCollection()
    pageCollection = sortCollection[@state.activePage*10..(@state.activePage+1)*10-1]
    renderRowButton = =>
        <ButtonGroup bsSize="xsmall">
          {
            do =>
              if @props.rowButtons?.length <= 3
                for btnInfo in @props.rowButtons[0..2] when btnInfo?
                  <Button onClick={btnInfo.onclick}>{btnInfo.text}</Button>
              else if @props.rowButtons?.length>3
                for btnInfo in @props.rowButtons[0..1]
                  <Button onClick=btnInfo.onclick>{btnInfo.text}</Button>
          }
          {
            do =>
              if @props.rowButtons?.length>3
                  <SplitButton  bsSize="xsmall" title={@props.rowButtons[2].text}>
                    {do =>
                      for btnInfo in @props.rowButtons[3...]
                        <MenuItem>{btnInfo.text}</MenuItem>}
                  </SplitButton>
          }
        </ButtonGroup>
    <div className="panel panel-default">
        <div className="panel-heading clearfix">
            <div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
              {
                do =>
                  for btnInfo in @props.headerButtons
                    <Button bsStyle={btnInfo.style} onClick={btnInfo.onClick}>{btnInfo.text}</Button>
              }
            </div>
        </div>
        <div className="table-responsive" >
            <table className="table table-bordered table-hover table-condensed" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
              <thead>
                {
                  do =>
                    ths=for k,v of @props.collection.model::schema
                            <th ref={"th_#{k}"} onClick={@sort.bind(@,k)}>
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
                      ths.push <th style={{width:160,minWidth:160}}></th>
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
                            <td style={style} onClick={@cellClick.bind(@,model,k)}>{@getCellContent(model,k)}</td>
                        }
                        <td>
                        {if @props.rowButtons? then renderRowButton() else null}
                        </td>
                      </tr>
                }
              </tbody>
            </table>
            <Pagination prev next first last ellipsis items={pageCount} maxButtons={pageRecordLength} activePage={this.state.activePage} onSelect={this.pageChange} />
        </div>
    </div>





console.log ""
