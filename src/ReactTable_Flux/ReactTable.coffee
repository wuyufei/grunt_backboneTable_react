
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover,Pagination,ButtonGroup,SplitButton,MenuItem}=ReactBootstrap
window.BackboneTable = BackboneTable = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
  render:->
    ReactDOM.render <ReactTable {...@options} />,@el



ReactTable = React.createClass
  getInitialState:->
    activePage:10
  componentWillMount:->
  cellClick:(model,key)->
    if @props.readonly isnt true and model.schema[key].readonly isnt true
      @setState
        selectedRow:model
        editCell:
          model:model
          key:key
    else
      @setState selectedRow:model



  sort:(name)->
    if @state.sortField is name and @state.sortDir is "asc"
      dir = "desc"
    else
      dir = "asc"
    @setState
      sortField:name
      sortDir:dir
  pageChange:(event,selectedEvent)->
    @setState
      activePage:selectedEvent.eventKey
  getSortCollection:->
      that = @
      sortModels = _.clone @props.collection.models
      schema = @props.collection.model::schema
      if @state.sortField
        getSortValue = schema[@state.sortField].sortValue
        sortModels.sort (a,b)->
          a = getSortValue?(a) ? a.get(that.state.sortField)
          b = getSortValue?(b) ? b.get(that.state.sortField)
          if _.isString(a)
            return a.localeCompare(b);
          else
            return a-b
        if @state.sortDir is "desc"
          sortModels.reverse()
      sortModels
  getCellContent:(model,key)->
    schema = model.schema[key]
    switch schema.type.toLowerCase()
      when "text"
        if model is @state.editCell?.model and key is @state.editCell?.key
          content = <Input groupClassName="group-class" type="text" bsSize="small" value={model.get(key)}/>
        else
          content = <span>{model.get(key)}</span>
      when "select"
        content = <span>{_.findWhere(schema.options,val:model.get(key)).label}</span>
      when "checkbox"
        if model.get(key) is "1"
          content = <span className="glyphicon glyphicon-ok"></span>
        else
          content = null
      else
        content =<span>{model.get(key)}</span>
    content
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
            <table className="table table-bordered table-hover" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
              <thead>
                {
                  do =>
                    ths=for k,v of @props.collection.model::schema
                            <th onClick={@sort.bind(@,k)}>
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
                      ths.push <th style={{width:"160px"}}></th>
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
                            <td onClick={@cellClick.bind(@,model,k)}>{@getCellContent(model,k)}</td>
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
