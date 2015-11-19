{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover}=ReactBootstrap
#tbinv_vesworkcardcbs
#默认的船舶编号
vesinfo = "1"
#当前月份
currentMonth = ""
#当前年度
currentYear = "2015"


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
SubModel = Backbone.Model.extend
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



Page = React.createClass
  getInitialState:->
    showModal:false
    showAddItemModal:false
    action:null
    model:null
    modalValue:{}
    addItemModalValue:{}
    addItemModalList:new ItemModelList
    error:{}

  modalValueChange:(key,e)->
    obj = _.extend {},@state.modalValue
    obj[key] = e.target.value
    @setState modalValue:obj
  addItemModalValueChange:(key,e)->
    that = @
    obj = _.extend {},@state.addItemModalValue
    obj[key] = e.target.value
    @setState addItemModalValue:obj,->
      data = @state.addItemModalValue
      if data.CBBH isnt "" and data.WXBM isnt "" and data.JHND isnt "" and data.JHYF isnt ""
        that.setState
          addItemModalList:that.props.getAddItemList(data)


  closeModal:->
    @setState
      showModal:false
      action:null
  closeAddItemModal:->
    @setState showAddItemModal:false
  showAddItemModal:->
    obj =
      CBBH:@state.model.get("CBBH")
      WXBM:@state.model.get("WXBM")
      JHYF:"11"
      JHND:"2015"
    @setState
      showAddItemModal:true
      addItemModalValue:obj
      addItemModalList:@props.getAddItemList(obj)


  addModalSelectButtonClick:(model)->
    if @subCollection.findWhere({XH:model.get("XH")})
      alert("列表中已包含该项目，请选择其他项目")
      return
    subModel = new SubModel
      XH:model.get("XH")
      MC:model.get("MC")
      WXBM:model.get("WXBM")
      FZR:model.get("FZR")
    @subCollection.add(subModel)
    @setState
      showAddItemModal:false

  addClick:()->
    @subCollection = new SubList()
    @setState
      showModal:true
      action:"add"
      model:new MainModel {CBBH:1,WXBM:1}
      modalValue:
        CBBH:"1"
        WXBM:"1"
  detailClick:(model)->
    @subCollection = @props.getSubModelList(model)
    @setState
      showModal:true
      action:"detail"
      model:model
      modalValue:
        CBBH:model.get("CBBH")
        WXBM:model.get("WXBM")
  editClick:(model)->
    @subCollection = @props.getSubModelList(model)
    @setState
      showModal:true
      action:"edit"
      model:model
      modalValue:
        CBBH:model.get("CBBH")
        WXBM:model.get("WXBM")
  saveClick:->
    data = @state.modalValue
    data.tbinv_vesworkcardcbs = @collection.toJSON()
    error = @props.saveButtonHandle(@state.model,data)
    if error is null
      @setState
        showModal:false
        error:{}
    else
      @setState error:error
  verifyClick:(model)->


  getMainTableProps:->
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
  getModalTableProps:->
    that = @
    props =
          collection:@subCollection
          readonly:true
          sortField:"XH"
    if(@state.action in ["edit","add"])
      _.extend props,
        readonly:false
        headerButtons:[
          {
            text:"从月度计划选择"
            command:"select"
            onclick:(e)->
              that.showAddItemModal()
              e.preventDefault()
          }
        ]
        rowButtons:[
          {
            text:"删除"
            command:"delete"
            onclick:(model,e)->
              that.subCollection.remove(model)
              that.forceUpdate()
              e.preventDefault()
          }
        ]
    props
  getAddItemModalTableProps:->
    addItemModalTableProps =
        collection:@state.addItemModalList
        readonly:true
        sortField:"XH"
        rowButtons:[
          {
            text:"选择"
            command:"select"
            onclick:(model)->
              that.addModalSelectButtonClick(model)
          }
        ]

  render:->
    <div>
      <ReactTable {...@getMainTableProps()}/>
      <Modal  show={@state.showModal}  onHide={@closeModal} dialogClassName="large-modal">
        <Modal.Header closeButton>
          <Modal.Title>船舶维修每日工作卡</Modal.Title>
        </Modal.Header>
        <Modal.Body ref="modalBody">
          <Grid fluid=true >
            <Row className="show-grid">
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="CBBH" addonBefore="船舶" disabled={@state.action in ["detail","edit"]} value={@state.modalValue.CBBH} onChange={@modalValueChange.bind(@,"CBBH")}>
                  {
                    do =>
                      for i in cbSelectData
                        <option value=i.dm>{i.mc}</option>
                  }
                </Input>
                {do =>
                  if @state.error.CBBH?
                    <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.CBBH)} container={@refs.modalBody} placement="bottom">
                      <Popover>{@state.error.CBBH}</Popover>
                    </Overlay>
                }
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" rel="WXBM" addonBefore="部门" disabled={@state.action in ["detail","edit"]} value={@state.modalValue.WXBM} onChange={@modalValueChange.bind(@,"WXBM")}>
                  <option value="1">甲板部</option>
                  <option value="2">轮机部</option>
                </Input>
                {do =>
                  if @state.error.WXBM?
                    <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.WXBM)} container={@refs.modalBody} placement="bottom">
                      <Popover>{@state.error.WXBM}</Popover>
                    </Overlay>
                }
              </Col>
              <Col xs={12}>
                <ReactTable {...@getModalTableProps()}/>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          {do =>
              if @state.action isnt "detail"
                [
                  <Button bsStyle="primary" onClick={@saveClick}>保存</Button>
                  <Button bsStyle="default" onClick={@closeModal}>取消</Button>
                ]
          }
        </Modal.Footer>
      </Modal>
      <Modal show={@state.showAddItemModal} onHide={@closeAddItemModal} bsSize="large" >
        <Modal.Header closeButton>
          <Modal.Title>请选择您要添加的项目</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid fluid=true >
            <Row className="show-grid">
              <Col xs={12} sm={6} md={3}>
                  <Input type="select"  ref="JHND" addonBefore="计划年度" value={@state.addItemModalValue.JHND} onChange={@addItemModalValueChange.bind(@,"JHND")}>
                    <option value="2015" selected="">2015</option>
                    <option value="2016">2016</option>
                    <option value="2016">2017</option>
                    <option value="2016">2018</option>
                    <option value="2016">2019</option>
                  </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="CBBH" addonBefore="船舶" value={@state.addItemModalValue.CBBH} onChange={@addItemModalValueChange.bind(@,"CBBH")} >
                  {
                    do =>
                      for i in cbSelectData
                        <option value=i.dm>{i.mc}</option>
                  }
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" rel="WXBM" addonBefore="部门" value={@state.addItemModalValue.WXBM} onChange={@addItemModalValueChange.bind(@,"WXBM")}>
                  <option value="1">甲板部</option>
                  <option value="2">轮机部</option>
                </Input>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="JHYF" addonBefore="计划月份" value={@state.addItemModalValue.JHYF} onChange={@addItemModalValueChange.bind(@,"JHYF")}>
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
               <ReactTable {...@getAddItemModalTableProps()}/>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
      </Modal>
    </div>


PageController = Backbone.View.extend
  initialize:(options)->
    $("#btnSearch").click @search.bind(@)
  search:->
    that = @
    mainList.fetch
        reset:true
        success:->
          that.render()
  getSubModelList:(model)->
    model.fetch async:false
    new SubList model.get("tbinv_vesworkcardcbs")

  save:(model,data)->
    #验证数据并保存
    validated = true
    error = null
    isNew = model.isNew()
    model.on "invalid",(model,error)->
      validated = false
      error = error
    model.set data,validate:true
    model.off("invalid")
    if validated
      error = model.save(null,{async:false,wait:true})
      unless error
        mainList.add(model) if isNew
        return {}
      else
        return error
    else
      return error


  getAddItemList:(data)->
    itemModelList = new ItemModelList
    itemModelList.fetch
      url:"/WeiXiuGl/GetMonthPlanData"
      data:data
      async:false
      reset:true
    itemModelList
  render:->
    ReactDOM.render <Page collection={mainList} getSubModelList={@getSubModelList} getAddItemList={@getAddItemList} saveButtonHandle={@save}/>,@el

pageController = new PageController el:$("#backboneTable")[0]
pageController.render()























console.log ""
