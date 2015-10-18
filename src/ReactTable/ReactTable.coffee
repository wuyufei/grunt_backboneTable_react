ActionMixin =
  cellClick:(model,key,e)->
    schema = model.schema[key]
    if schema.readonly is true
      if @state.editRow
        editRow = @refs[@state.editRow]
        editCell = editRow.refs[@state.editCell]
        eidtModel = editRow.props.model
        editKey = editCell.props.fieldKey
        editValue = editCell.state.value
        @cellEndEdit(eidtModel,editKey,editValue)
    else
      @cellBeginEdit(model,key)
      e.preventDefault()
      e.stopPropagation()
    debugger
    @setState
      selectRow:model.cid
    @props.cellClick?(model,key)

  cellDoubleClick:(model,key)->
    debugger
    @props.cellDoubleClick?(model,key)

  addButtonClick:(e)->
    return if @cellEndEdit?() is false
    if @props.addButtonClick
      addButtonClick(e)
    unless e.isDefaultPrevented()
      model = @props.collection.create {},{wait:true}
      React.render  <ModalForm model={model} headerText={"新增"}/>,$("<div>").appendTo($("body"))[0]
  detailButtonClick:(model,e)->
    return if @cellEndEdit?() is false
    @props.detailButtonClick?(e,model)
    unless e.isDefaultPrevented()
      React.render <ModalForm model={model} headerText={"详情"}/>,$("<div>").appendTo($("body"))[0]
  editButtonClick:(model,e)->
    return if @cellEndEdit?() is false
    @props.detailButtonClick?(e,model)
    unless e.isDefaultPrevented()
      React.render <ModalForm model={model} headerText={"编辑"}/>,$("<div>").appendTo($("body"))[0]
  deleteButtonClick:(model,e)->
    return if @cellEndEdit?() is false
    modalInfoProps =
      msg:"是否确认删除？"
      confirmButtonClick:(event)->
        model.destroy
          success:->
            props =
              msg:"删除成功"
              autoClose:true
            React.render <ModalInfo {...modalInfoProps} />,$("<div>").appendTo($("body"))[0]
          error:(model, response, options)->
            event.preventDefault()
            event.error = options.errorThrown
          wait:true
          async:false
        return
    React.render <ModalInfo {...modalInfoProps} />,$("<div>").appendTo($("body"))[0]




Table = React.createClass
    mixins:[React.addons.PureRenderMixin,ActionMixin]
    getInitialState:->
      selectRow:null
      sortField:null
      sortDir:"asc"
      currentPage:0
      editRow:null
      editCell:null
      cellError:null
    componentWillMount:->
      that = @
      @sortedModels = @sortCollection()
      @props.collection.on "add", ->
        @forceUpdate()
    componentWillUpdate:(nextProps, nextState)->#不能在该方法中更新props和state
      #_.isEqual深度判等
      #if nextState.sortField isnt @state.sortField or nextState.sortDir isnt @state.sortDir
      #  @sortedmodels = @sortCollection()

    pageChange:(page)->
      @setState
        currentPage:page
        editRow:null
        editCell:null
        cellError:null
    columnHeaderClickHandler:(e)->
      key = e.target.dataset.column
      if key is @state.sortField
        sortDir = if @state.sortDir is "asc" then "desc" else "asc"
      else
        sortDir = "asc"
      @setState
          sortField:key
          sortDir:sortDir
          currentPage:0
          editRow:null
          editCell:null
          cellError:null
    sortCollection:->
      ###if @state.sortField?
        sortField = @state.sortField
        sortDir = @state.sortDir
        sortModels = @props.collection.models.sort (a,b)->
          a = a.get(sortField)
          b = b.get(sortField)
          if a>b
            if sortDir is "asc" then 1 else -1
          else if a is b
            0
          else
            if sortDir is "asc" then -1 else 1
      else###
      @props.collection.models

    cellBeginEdit:(model,key)->
      if @state.editRow
        if @cellEndEdit()
          @setState
            editRow:model.cid
            editCell:key
            cellError:null
      else
        @setState
          editRow:model.cid
          editCell:key
          cellError:null

    cellEndEdit:->

      if @state.editRow
        editRow = @refs[@state.editRow]
        editCell = editRow.refs[@state.editCell]
        model = editRow.props.model
        key = editCell.props.fieldKey
        value = editCell.state.value
        error = null
        invalidHandle =  (model, er)->
          error = er
        model.on "invalid",invalidHandle
        model.set key,value,validate:true
        model.off "invalid",invalidHandle
        if error?
          @setState
            editRow:model.cid
            editCell:key
            cellError:error
          return false
        else
          @setState
            editRow:null
            editCell:null
            cellError:null
          return true
      else
        true


    renderColumns:->
      sortField = @state.sortField
      sortDir = @state.sortDir
      schema = @props.collection.model::schema
      addColumnIcon = (field)->
        if field is sortField
          if sortDir is "asc"
            <i className='glyphicon glyphicon-sort-by-attributes pull-right' />
          else
            <i className='glyphicon glyphicon-sort-by-attributes-alt pull-right'/>
        else
          <i/>
      columnHeaders = for own k,v of schema
              <th data-column={k} onClick={@columnHeaderClickHandler}>
                {v.title}{addColumnIcon(k)}
              </th>
      if @props.buttons?.length>0
        columnHeaders.push(<th></th>)
      columnHeaders

    render:->
      that = @
      sortModels = @sortCollection()
      pageCollection = @sortedModels[@state.currentPage*10..(@state.currentPage+1)*10-1]
      rows = for model in pageCollection
        rowProps =
          model:model
          cellClick:that.cellClick.bind(@,model)
          cellEndEdit:that.cellEndEdit
          edit:if that.state.editRow is model.cid then true else false
          editCell:if that.state.editRow is model.cid then that.state.editCell else null
          error:if that.state.editRow is model.cid then @state.cellError else null
          detailButtonClick:that.detailButtonClick.bind(@,model)
          editButtonClick:that.editButtonClick.bind(@,model)
          deleteButtonClick:that.deleteButtonClick.bind(@,model)
          buttons:that.props.buttons
          selected:if that.state.selectRow is model.cid then true else false
          cellDoubleClick:@cellDoubleClick.bind(@,model)
        <Row ref={model.cid} key={model.cid}  {...rowProps}/>
      containerStyle =
                    marginBottom:10
                    borderBottomStyle:"none"
      <div className="panel panel-default" style={containerStyle}>
          <div className="panel-heading clearfix">
            	<div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
                <button className="btn btn-primary btn-sm" data-command="add" onClick={@addButtonClick}><span className="glyphicon glyphicon-plus"></span> 新增</button>
              </div>
          </div>
          <div className="table-responsive" >
            	<table className="table table-bordered table-hover" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
            		<thead>{@renderColumns()}</thead>
            		<tbody>{rows}</tbody>
            	</table>
              <Page collection={@props.collection} currentPage={@state.currentPage} pageChange={@pageChange}/>
            </div>
      </div>

window.ReactTable = Table
###
