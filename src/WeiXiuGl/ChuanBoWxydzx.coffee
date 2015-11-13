#_.extend  window, ReactBootstrap
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal}=ReactBootstrap


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
            urlRoot:"/api/tbinv_cbwxydjhzb"
            defaults:
              CBBH:"1"
              WXBM:"1"
              JHND:"2015"
              JHYF:"1"
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
                        {label:"甲板部",val:"1"}
                        {label:"轮机部",val:"2"}
                    ]
                JHND:
                    type:"Text"
                    title:"计划年度"
                JHYF:
                    type:"Text"
                    title:"计划月份"
                ZDRQ:
                    type:"Text"
                    title:"制单日期"
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
MainList = Backbone.Collection.extend
    url: "/api/tbinv_cbwxydjhzb"
    #url:"api/ShipEquipment"
    model: MainModel
mainList = new MainList

#从表model
SubModel = Backbone.Model.extend
    schema:
        XH:
            type:"Text"
            title:"编号"
            readonly:true
            sortValue:(model)->
                xh = model.get("XH")
                arr = xh.split('.');
                xh = arr[0]+arr[1]
                xh = parseInt xh
        MC:
            type:"Text"
            title:"项目名称"
            readonly:true
        JHWCSJ:
            type:"DateTime"
            title:"计划完成日期"
            readonly:false
        FZR:
            type:"Text"
            title:"负责人"
            readonly:true
SubList = Backbone.Collection.extend
  url:""
  model:SubModel


#弹出维修项目列表Model
ItemModel = Backbone.Model.extend
    idAttribute:"BH"
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
            title:"设备名称"
        SBFL:
            type:"Text"
            title:"设备分类"
        WHZQ:
            type:"Text"
            title:"维护周期"
        FZR:
            type:"Text"
            title:"负责人"
        BZ:
            type:"Text"
            title:"备注"
ItemModelList = Backbone.Collection.extend
    url:""
    model:ItemModel




PageControl = Backbone.View.extend
  initialize:->
  searchButtonClick:(data)->
    this.collection.fetch
      reset:true
      data:data
      async:false
    @render()
  render:->
    ReactDOM.render <Page collection={@collection} searchButtonClick={@searchButtonClick.bind(@)}></Page>,$("#iframePageContainer")[0]

#页面视图
Page = React.createClass
  mixins:[React.addons.LinkedStateMixin]
  getInitialState:->
    showModal: false
    action:""
  closeHanele:->
    this.setState({ showModal: false })
  addButtonHandle:->
    model = new MainModel
    @setState showModal:true,action:"add",model:model
  detailButtonHandle:(model)->
    model.fetch
      wait:true
      async:false
    @setState showModal:true,action:"detail",model:model
  editButtonHandle:(model)->
    model.fetch
      wait:true
      async:false
    @setState showModal:true,action:"edit",model:model
  verifyButtonHandle:->

  searchHandle:->
    {jhnd,cb,bm}=@state
    obj = {jhnd,cb,bm}
    @props.searchButtonClick(obj)
  render:->
    that = @
    tableProps =
          collection:@props.collection
          readonly:true
          headerButtons:[
            {
              text:"新增"
              command:"add"
              onclick:(e)->
                that.addButtonHandle()
                e.preventDefault()
            }
          ]
          rowButtons:[
            {
              text:"详情"
              command:"detail"
              onclick:(model,e)->
                that.detailButtonHandle(model)
                e.preventDefault()
            }
            {
              text:"编辑"
              command:"edit"
              onclick:(model,e)->
                that.editButtonHandle(model)
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
      debugger

      <Grid fluid=true>
        <Row className="show-grid">
          <Col xs={12}>
            <Breadcrumb>
              <BreadcrumbItem>您的位置</BreadcrumbItem>
              <BreadcrumbItem>设备维修保养管理</BreadcrumbItem>
              <BreadcrumbItem active>船舶维修月度计划执行</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="计划年度" valueLink={@linkState("jhnd")}>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
              <option value="2016">2017</option>
              <option value="2016">2018</option>
              <option value="2016">2019</option>
            </Input>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="船舶" valueLink={@linkState("cb")}>
              {
                do =>
                  for i in cbSelectData
                    <option value=i.dm>{i.mc}</option>
              }
            </Input>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="部门" valueLink={@linkState("bm")}>
              <option value="1">甲板部</option>
              <option value="2">轮机部</option>
            </Input>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="primary" onClick={@searchHandle} block>查询</Button>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="info" block>打印</Button>
          </Col>
          <Col xs={12} id="mainTable">
            <ReactTable {...tableProps} />
          </Col>
        </Row>
          {
            do =>if @state.action isnt ""
                  detailModalProps =
                    model:@state.model
                    show:@state.showModal
                    action:@state.action
                    closeHanele:@closeHanele
                  <DetailModal {...detailModalProps}/>
          }
      </Grid>


#明细视图
DetailModal = React.createClass
  mixins:[React.addons.LinkedStateMixin]
  getInitialState:->
    JHND:@props.model.get("JHND")
    CBBH:@props.model.get("CBBH")
    WXBM:@props.model.get("WXBM")
    JHYF:@props.model.get("JHYF")
  closeModal:->
    @setState showModal:false
  addButtonClick:->
    itemModelList = new ItemModelList()
    {JHND,CBBH,WXBM,JHYF} = @state
    data = {JHND,CBBH,WXBM,JHYF}
    itemModelList.fetch
          url:"/WeiXiuGl/GetYearPlanData/"
          data:data
          type:"GET"
          reset:true
          async:false
    @setState showModal:true,itemModelList:itemModelList
  addItem:(model)->
    debugger
    @setState showModal:false
  componentWillMount:->
    if @state.action is "add"
      collection = new SubList()
    else
      collection = new SubList @props.model.get("tbinv_cbwxydjhcbs")
    @collection = collection
  componentWillReceiveProps:(nextProps)->
    @setState
      JHND:nextProps.model.get("JHND")
      CBBH:nextProps.model.get("CBBH")
      WXBM:nextProps.model.get("WXBM")
      JHYF:nextProps.model.get("JHYF")
  save:->
  render:->
    that = @
    action = @props.action
    headerTexts =
      detail:"月度维修保养计划详情"
      edit:"月度维修保养计划编辑"
      add:"新增月度维修保养计划"

    # if action is "add"
    #   collection = new SubList()
    # else
    #   collection = new SubList @props.model.get("tbinv_cbwxydjhcbs")
    # @collection = collection
    tableProps =
          collection:@collection
          readonly:true
          sortField:"XH"
    if(action in ["edit","add"])
      _.extend tableProps,
        readonly:false
        headerButtons:[
          {
            text:"从年度计划添加项目"
            command:"add"
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

    debugger
    <div>
      <Modal bsSize="large" show={@props.show}  onHide={@props.closeHanele}>
        <Modal.Header closeButton>
          <Modal.Title>{headerTexts[@props.action]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid fluid=true>
            <Row className="show-grid">
              <Col xs={12}>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="计划年度" disabled={action in ["detail","edit"]} valueLink={@linkState("JHND")}>
                  <option value="2015" selected="">2015</option>
                  <option value="2016">2016</option>
                  <option value="2016">2017</option>
                  <option value="2016">2018</option>
                  <option value="2016">2019</option>
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="船舶" disabled={action in ["detail","edit"]} valueLink={@linkState("CBBH")}>
                  {
                    do =>
                      for i in cbSelectData
                        <option value=i.dm>{i.mc}</option>
                  }
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="部门" disabled={action in ["detail","edit"]} valueLink={@linkState("WXBM")}>
                  <option value="1">甲板部</option>
                  <option value="2">轮机部</option>
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="计划月份" disabled={action in ["detail","edit"]} valueLink={@linkState("JHYF")}>
                  <option value="1" selected>1月</option>
                  <option value="2" >2月</option>
                  <option value="3" >3月</option>
                  <option value="4" >4月</option>
                  <option value="5" >5月</option>
                  <option value="6" >6月</option>
                  <option value="7" >7月</option>
                  <option value="8" >8月</option>
                  <option value="9" >9月</option>
                  <option value="10">10月</option>
                  <option value="11">11月</option>
                  <option value="12">12月</option>
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
                  <Button bsStyle="primary" onClick={@save}>保存</Button>
                  <Button  onClick={@props.closeHanele}>取消</Button>
                ]
          }
        </Modal.Footer>
      </Modal>
        {
          do =>
            if @state.showModal is true
              addItemModalProps =
                show:@state.showModal
                closeHanele:@closeModal
                selectItemHandle:@addItem
                collection:@state.itemModelList
              <AddItemModal {...addItemModalProps}/>
        }
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

pageView = new PageControl({collection:mainList}).render()
