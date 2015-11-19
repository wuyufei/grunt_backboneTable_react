ActionMixin =
  cellClick:(model,key,e)->
    if @props.readonly isnt true
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
    @setState
      selectedRow:model.cid
    @props.cellClick?(model,key)

  cellDoubleClick:(model,key)->
    @props.cellDoubleClick?(model,key)

  addButtonClick:(e)->
    buttonHandle = _.findWhere(@props.headerButtons,command:"add")?.onclick
    buttonHandle?(e)
    return if @cellEndEdit?() is false or e.isDefaultPrevented()
    #model = @props.collection.create {},{wait:true}
    model = new @props.collection.model
    React.render  <ModalForm model={model} headerText={"新增"} customTemplate={@props.customTemplate}/>,$("<div>").appendTo($("body"))[0]
  detailButtonClick:(model,e)->
    buttonHandle = _.findWhere(@props.rowButtons,command:"detail")?.onclick
    buttonHandle?(model,e)
    return if @cellEndEdit?() is false or e.isDefaultPrevented()
    React.render <ModalForm readonly={true} model={model} headerText={"详情"} customTemplate={@props.customTemplate}/>,$("<div>").appendTo($("body"))[0]
  editButtonClick:(model,e)->
    buttonHandle = _.findWhere(@props.rowButtons,command:"edit")?.onclick
    buttonHandle?(model,e)
    return if @cellEndEdit?() is false or e.isDefaultPrevented()
    React.render <ModalForm model={model} headerText={"编辑"} customTemplate={@props.customTemplate}/>,$("<div>").appendTo($("body"))[0]
  deleteButtonClick:(model,e)->
    buttonHandle = _.findWhere(@props.rowButtons,command:"delete")?.onclick
    buttonHandle?(model,e)
    return if @cellEndEdit?() is false or e.isDefaultPrevented()
    @props.deleteButtonClick?(e,model)
    unless e.isDefaultPrevented()
      modalInfoProps =
        msg:"是否确认删除？"
        confirmButtonClick:(event)->
          model.destroy
            success:->
              props =
                msg:"删除成功"
                autoClose:true
              React.render <ModalInfo {...props} />,$("<div>").appendTo($("body"))[0]
            error:(model, response, options)->
              event.preventDefault()
              event.error = options.errorThrown
            wait:true
            async:false
          return
      React.render <ModalInfo {...modalInfoProps} />,$("<div>").appendTo($("body"))[0]




Table = React.createClass
    mixins:[ActionMixin]
    getInitialState:->
      selectedRow:null
      sortField:@props.sortField
      sortDir:"asc"
      currentPage:0
      editRow:null
      editCell:null
      cellError:null

    getDefaultProps:->
      enableSort:true
    componentWillMount:->
      # that = @
      # @sortedModels = @sortCollection()
      # @props.collection.on "add", ->
      #   @forceUpdate()
    componentWillUpdate:(nextProps, nextState)->#不能在该方法中更新props和state
      #_.isEqual深度判等
      #if nextState.sortField isnt @state.sortField or nextState.sortDir isnt @state.sortDir
      #  @sortedmodels = @sortCollection()
    componentDidUpdate:(prevProps,prevState)->
      if prevState.selectedRow isnt @state.selectedRow
        model = @props.collection.get(@state.selectedRow)
        @props.tableView.selectedRowChange(model)


    pageChange:(page)->
      @setState
        currentPage:page
        editRow:null
        editCell:null
        cellError:null
        selectedRow:null
    columnHeaderClickHandler:(e)->
      return unless @props.enableSort
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

    renderHeaderButtons:->
      btns = @props.headerButtons
      if btns?
        buttons =   for btn in btns
          props = {}
          if btn.command? and btn.command is "add"
              props.handleClick = @addButtonClick
              props.className =  "btn btn-primary btn-sm"
              props.icon = "glyphicon glyphicon-plus"
          else
              props.handleClick = btn.onclick ? _.noop()
              props.className =  btn.btnClass ? "btn btn-sm btn-info"
              props.icon = btn.iconClass ? "glyphicon glyphicon-list"
          <button className={props.className} style={{marginRight:5}} onClick={props.handleClick}>
            <span className={props.icon}></span> {btn.text}
          </button>
      buttons



    render:->
      that = @
      sortModels = @sortCollection()
      pageCollection = sortModels[@state.currentPage*10..(@state.currentPage+1)*10-1]
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
          buttons:that.props.rowButtons
          selected:if that.state.selectedRow is model.cid then true else false
          cellDoubleClick:@cellDoubleClick.bind(@,model)
        <Row ref={model.cid} key={model.cid}  {...rowProps}/>
      containerStyle =
                    marginBottom:10
                    borderBottomStyle:"none"
      <div className="panel panel-default" style={containerStyle}>
          <div className="panel-heading clearfix">
            	<div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
                {@renderHeaderButtons()}
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
