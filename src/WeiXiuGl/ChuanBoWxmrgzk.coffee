{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover}=ReactBootstrap
#tbinv_vesworkcardcbs

#加载下拉框数据源
getSelectData = (code)->
  array = []
  $.ajax
    url:"/GetSelectData/Get"
    data:"FieldName="+code
    async:false
    success:(data)->
      array = data
  array

cbSelectData = getSelectData("CBBH")

#主表model
MainModel = Backbone.Model.extend
            idAttribute:"DJHM"
            urlRoot:"/api/tbinv_vesworkcardzb"
            schema:
                DJHM:
                    type:"Text"
                    title:"单据号码"
                CBBH:
                    type:"Select"
                    title:"船舶"
                    options:do ->
                      for i in cbSelectData
                        item = {}
                        [item.label,item.val]=[i.mc,i.dm]
                        item
                WXBM:
                    type:"Select"
                    title:"部门"
                    options:[
                        {label:"甲板部",val:"0"}
                        {label:"轮机部",val:"1"}
                    ]
                ZDRQ:
                    type:"Text"
                    title:"填报日期"
                ZDR:
                    type:"Text"
                    title:"制单人"
                DJZT:
                    type:"Select"
                    title:"单据状态"
                    options:[
                         {label:"未审核",val:"0"}
                         {label:"已审核",val:"1"}
                    ]
List = Backbone.Collection.extend
    url: "/api/tbinv_vesworkcardzb"
    model: MainModel

#从表
SubModel = Backbone.RelationalModel.extend
    schema:
            XH:
                type:"Text"
                title:"项目编号"
                readonly:true
            MC:
                type:"Text"
                title:"项目名称"
                readonly:true
            WCRQ:
                type:"DateTime"
                title:"完成日期"
            BZ:
                type:"Text"
                title:"每日事件记录"
            WXBM:
                type:"Select"
                title:"完成部门"
                options:[
                    {label:"甲板部",val:"0"}
                    {label:"轮机部",val:"1"}
                ]
                readonly:true
            FZR:
                type:"Text"
                title:"负责人"
                readonly:true
            TQQK:
                type:"Text"
                title:"天气情况"
                readonly:false
SubList = Backbone.Collection.extend
    url:""
    model:SubModel

#弹出维修项目列表Model
ItemModel = Backbone.Model.extend
    schema:
        XH:
            type:"Text"
            title:"编号"
            sortValue:(model)->
                xh = model.get("XH")
                arr = xh.split('.');
                xh = arr[0]+arr[1]
                xh = parseInt xh
            readonly:false
        MC:
            type:"Text"
            title:"项目名称"
            readonly:true
        JHWCSJ:
            type:"DateTime"
            title:"计划完成日期"
        FZR:
            type:"Text"
            title:"负责人"
            readonly:true
ItemModelList = Backbone.Collection.extend
    url:""
    model:ItemModel

mainList = new List()

#查询
$("#btnSearch").click ->
        mainList.fetch
            reset:true



Page = React.createClass
  getInitialState:->
    showModal:false
    action:null
    model:null
  componentWillMount:->
    @props.collection.on "reset",=>
      @forceUpdate()
  componentWillReceiveProps:(nextProps)->
  closeHanele:->
    @setState
      showModal:false
      action:null
  detailClick:(model)->
    model.fetch async:false
    @setState
      showModal:true
      action:"detial"
      model:model
  addClick:()->
    model = new MainModel()
    @setState
      showModal:true
      action:"add"
      model:model
  editClick:(model)->
    model.fetch async:false
    @setState
      showModal:true
      action:"edit"
      model:model
  verifyClick:(model)->
  render:->
    that = @
    props =
      collection:@props.collection
      readonly:true
      headerButtons:[
        {
          text:"新增"
          command:"add"
          onclick:(e)->
            that.addClick()
            e.preventDefault()
        }
      ]
      rowButtons:[
        {
          text:"详情"
          command:"detail"
          onclick:(model,e)->
            that.detailClick(model)
            e.preventDefault()
        }
        {
          text:"编辑"
          command:"edit"
          onclick:(model,e)->
            that.editClick(model)
            e.preventDefault()
        }
        {
          text:"删除"
          command:"delete"
        }
        {
          text:"审核"
          command:"verify"
        }
      ]
    modalProps =
      showModal:@state.showModal
      action:@state.action
      closeHanele:@closeHanele
      model:@state.model
    <div>
      <ReactTable {...props}/>
      {
        if @state.showModal
          do =>
            <ModalForm {...modalProps}/>
      }
    </div>

ModalForm = React.createClass
  getInitialState:->
    CBBH:@props.model.get("CBBH")
    WXBM:@props.model.get("WXBM")
    showModal:false
  componentWillReceiveProps:(nextProps)->
    CBBH:nextProps.model.get("CBBH")
    WXBM:nextProps.model.get("WXBM")
  valueChangeHandle:(key,e)->
    newValue = {}
    newValue[key] = e.target.value
    @setState newValue
  addButtonClick:->
    @setState showModal:true
  render:->
    headerTexts =
      detail:"月度维修保养计划详情"
      edit:"月度维修保养计划编辑"
      add:"新增月度维修保养计划"
    action = @props.action

    @collection = new SubList @props.model.get("tbinv_vesworkcardcbs")

    tableProps =
          collection:@collection
          readonly:true
          sortField:"XH"
    if(action in ["edit","add"])
      _.extend tableProps,
        readonly:false
        headerButtons:[
          {
            text:"从月度计划选择"
            command:"select"
            onclick:(e)->
              that.addButtonClick()
              e.preventDefault()
          }
        ]
        rowButtons:[
          {
            text:"删除"
            command:"delete"
            onclick:(model,e)->
              that.collection.remove(model)
              that.forceUpdate()
              e.preventDefault()
          }
        ]
    <div>
      <Modal bsSize="large" show={@props.showModal}  onHide={@props.closeHanele}>
        <Modal.Header closeButton>
          <Modal.Title>{headerTexts[action]}</Modal.Title>
        </Modal.Header>
        <Modal.Body ref="modalBody">
          <Grid fluid=true >
            <Row className="show-grid">
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="CBBH" addonBefore="船舶" disabled={action in ["detail","edit"]}  value={@state.CBBH} onChange={@valueChangeHandle.bind(this,"CBBH")}>
                  {
                    do =>
                      for i in cbSelectData
                        <option value=i.dm>{i.mc}</option>
                  }
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" rel="WXBM" addonBefore="部门" disabled={action in ["detail","edit"]}  value={@state.WXBM} onChange={@valueChangeHandle.bind(this,"WXBM")}>
                  <option value="1">甲板部</option>
                  <option value="2">轮机部</option>
                </Input>
              </Col>
              <Col xs={12}>
                <ReactTable {...tableProps}/>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          {do =>
              if action isnt "detail"
                [
                  <Button bsStyle="primary" onClick={@saveButtonHandle}>保存</Button>
                  <Button  onClick={@props.closeHanele}>取消</Button>
                ]
          }
        </Modal.Footer>
      </Modal>
      <AddItemModal />
    </div>

#添加选项视图
AddItemModal = React.createClass
  componentWillReceiveProps:(nextProps)->
  render:->
    debugger
    that = @
    tableProps =
          collection:that.props.collection
          readonly:true
          sortField:"XH"
          rowButtons:[
            {
              text:"选择"
              command:"select"
              onclick:(model)->
                debugger
                that.props.selectItemHandle(model)
            }
          ]
    <Modal show={@props.show} onHide={@props.closeHanele}>
      <Modal.Header closeButton>
        <Modal.Title>请选择您要添加的项目</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <ReactTable {...tableProps} />
      </Modal.Body>
    </Modal>

ReactDOM.render <Page collection={mainList}/>,$("#backboneTable")[0]

























console.log ""
