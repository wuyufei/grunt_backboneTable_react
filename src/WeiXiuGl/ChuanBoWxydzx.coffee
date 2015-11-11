#_.extend  window, ReactBootstrap
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal}=ReactBootstrap

#从表model
SubModel = Backbone.Model.extend
    schema:
        XH:
            type:"Text"
            title:"编号"
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

SubList = Backbone.Collection.extend
  url:""
  model:SubModel


#主表model
MainModel = Backbone.Model.extend
            idAttribute:"DJHM"
            urlRoot:"/api/tbinv_cbwxydjhzb"
            schema:
                DJHM:
                    type:"Select"
                    title:"单据号码"
                CBBH:
                    type:"Select"
                    title:"船舶"
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


#弹出维修项目列表Model
ItemModel = Backbone.Model.extend
    idAttribute:"BH"
    schema:
        XH:
            type:"Text"
            title:"编号"
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
itemModelList = new ItemModelList

AddItemModal = React.createClass
  getInitialState:->
    show:false
  componentWillReceiveProps:(nextProps)->
    @setState show:nextProps.show
  render:->
    tableProps =
          collection:itemModelList
          readonly:true
          rowButtons:[
            {
              text:"选择"
              command:"select"
              onClick:->
                alert("")
            }
          ]
    <Modal show={@state.show} onHide={@props.closeHanele}>
      <Modal.Header closeButton>
        <Modal.Title>请选择您要添加的项目</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <ReactTable {...tableProps} />
      </Modal.Body>
    </Modal>


DetailModal = React.createClass
  getInitialState:->
    show:false
    showModal:false
  closeModal:->
    @setState showModal:false
  componentWillReceiveProps:(nextProps)->
    @setState   show:nextProps.show
  save:->
  render:->
    that = @
    headerTexts =
      detail:"月度维修保养计划详情"
      edit:"月度维修保养计划编辑"
      add:"新增月度维修保养计划"


    tableProps =
          collection:@props.collection
          readonly:true
    if(@props.action in ["edit","add"])
      _.extend tableProps,
        headerButtons:[
          {
            text:"新增"
            command:"add"
            onclick:(e)->
              that.setState showModal:true
              e.preventDefault()
          }
        ]
        rowButtons:[
          {
            text:"删除"
            command:"delete"
          }
        ]
    addItemModalProps =
      show:@state.showModal
      closeHanele:@closeModal
    debugger
    <div>
      <Modal bsSize="large" show={@state.show}  onHide={@props.closeHanele}>
        <Modal.Header closeButton>
          <Modal.Title>{headerTexts[@props.action]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid fluid=true>
            <Row className="show-grid">
              <Col xs={12}>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="计划年度" >
                  <option value="2015" selected="">2015</option>
                  <option value="2016">2016</option>
                  <option value="2016">2017</option>
                  <option value="2016">2018</option>
                  <option value="2016">2019</option>
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="船舶" />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="部门" >
                  <option value="1">甲板部</option>
                  <option value="2">轮机部</option>
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" addonBefore="计划月份">
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
          <Button bsStyle="primary" onClick={@save}>保存</Button>
          <Button  onClick={@props.closeHanele}>取消</Button>
        </Modal.Footer>
      </Modal>
      <AddItemModal {...addItemModalProps}/>
    </div>

Page = React.createClass
  getInitialState:->
    showModal: false
    collection:[]
  closeHanele:->
    this.setState({ showModal: false })
  addButtonHandle:->
    debugger
    @setState showModal:true,action:"add",collection:new SubList
  detailButtonHandle:->
    @setState showModal:true,action:"detial",collection:new SubList
  editButtonHandle:->
    @setState showModal:true,action:"edit",collection:new SubList
  verifyButtonHandle:->

  searchHandle:->
    alert("")
  render:->
    that = @
    tableProps =
          collection:mainList
          readonly:true
          headerButtons:[
            {
              text:"新增"
              command:"add"
              onclick:(e)->
                that.addButtonHandle()
                e.preventDefault()
            }
            {
              text:"编辑"
              command:"edit"
              onclick:(model,e)->
                that.detailButtonHandle()
                e.preventDefault()
            }
          ]
          rowButtons:[
            {
              text:"详情"
              command:"detail"
              onclick:(model,e)->
                that.detailButtonHandle()
                e.preventDefault()
            }
            {
              text:"编辑"
              command:"edit"
              onclick:(model,e)->
                that.editButtonHandle()
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
      detailModalProps =
        collection:@state.collection
        show:@state.showModal
        action:@state.action
        closeHanele:@closeHanele
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
            <Input type="select" addonBefore="计划年度" />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="船舶" />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="部门" />
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="primary" onClick={this.searchHandle} block>查询</Button>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Button bsStyle="info" block>打印</Button>
          </Col>
          <Col xs={12} id="mainTable">
            <ReactTable {...tableProps} />
          </Col>
        </Row>
        <DetailModal {...detailModalProps}/>
      </Grid>
ReactDOM.render <Page></Page>,$("body")[0]
