#_.extend  window, ReactBootstrap
{Grid,Row,Col,Input,Button,Breadcrumb,BreadcrumbItem,Modal,Overlay,Popover}=ReactBootstrap


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
            validation:
              CBBH:
                required:true
                msg:"请选择船舶"
              WXBM:
                required:true
                msg:"请选择部门"
              JHND:
                required:true
                msg:"请选择计划年度"
              JHYF:
                required:true
                msg:"请选择计划月份"
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
                JDRQ:
                    type:"Text"
                    title:"制单日期"
                    format:"yyyy-mm-dd"
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
        WCRQ:
            type:"DateTime"
            title:"计划完成日期"
            format:"yyyy-mm-dd"
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
    this.listenTo @collection,"add remove reset",@render
  save:(model,data)->
    that = @
    validated = true
    isNew = model.isNew()
    model.on "invalid",(model,error)->
      validated = false
      that.trigger("setError",error)
    model.set data,validate:true
    model.off("invalid")
    if validated
      model.save null,
        success:->
          that.trigger("saveSuccess")
          that.collection.add(model) if isNew
          # that.render()
        error:(e,x,c)->
          debugger
          that.trigger("saveError",serverError:x.responseJSON.ExceptionMessage)
  searchButtonClick:(data)->
    this.collection.fetch
      reset:true
      data:data
      async:false
    @render()

  getAddCollection:(data)->

  render:->
    ReactDOM.render <Page collection={@collection} searchButtonClick={@searchButtonClick.bind(@)}></Page>,$("#iframePageContainer")[0]

#页面视图
Page = React.createClass
  mixins:[React.addons.LinkedStateMixin]
  getInitialState:->
    showModal: false
    action:""
    JHND:"2015"
    CBBH:"1"
    WXBM:"1"

  componentWillReceiveProps:()->
    @setState
      showModal:false
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
  verifyButtonHandle:(model)->
    that = @
    $.ajax
        url : "/api/tbinv_cbwxydjhzb"
        type:"GET"
        data:{id:model.get("DJHM")}
        headers:method:"verify"
        success:->
            model.set("DJZT","1")
            that.forceUpdate()
            alert(" 审核成功")

  searchHandle:->
    debugger
    obj = _.pick @state,"JHND","CBBH","WXBM"
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
              onclick:(model,e)->
                that.verifyButtonHandle(model)
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
            <Input type="select" addonBefore="计划年度" valueLink={@linkState("JHND")}>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
              <option value="2016">2017</option>
              <option value="2016">2018</option>
              <option value="2016">2019</option>
            </Input>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="船舶" valueLink={@linkState("CBBH")}>
              {
                do =>
                  for i in cbSelectData
                    <option value=i.dm>{i.mc}</option>
              }
            </Input>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <Input type="select" addonBefore="部门" valueLink={@linkState("WXBM")}>
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
    error:{}
  closeModal:->
    @setState showModal:false
  addButtonClick:->
    itemModelList = new ItemModelList()
    # {JHND,CBBH,WXBM,JHYF} = @state
    # data = {JHND,CBBH,WXBM,JHYF}
    data = _.pick @state,"JHND","CBBH","WXBM","JHYF"
    itemModelList.fetch
          url:"/WeiXiuGl/GetYearPlanData/"
          data:data
          type:"GET"
          reset:true
          async:false
    @setState showModal:true,itemModelList:itemModelList
  valueChangeHandle:(key,e)->
    debugger
    newValue = {}
    newValue[key] = e.target.value
    @setState newValue,=>
      @collection = @getNewCollection()
      @forceUpdate()
  getNewCollection:->
    collection = new SubList()
    val = _.pick @state,"JHND","CBBH","WXBM","JHYF"
    if val.JHND isnt "" and val.CBBH isnt "" and val.WXBM isnt "" and val.JHYF isnt ""
      collection.fetch
          url:"/WeiXiuGl/GetNewMonthPlanData/"
          data:val
          type:"GET"
          reset:true
          async:false
    else
      collection.reset()
    collection
  addItem:(model)->
    if @collection.findWhere {XH:model.get("XH")}
      alert("列表中已包含该项目，请选择其他项目")
      return
    subModel = new SubModel
      XH:model.get("XH")
      MC:model.get("MC")
      FZR:model.get("FZR")
      WHZQ:model.get("WHZQ")
    @collection.add(subModel)
    @setState showModal:false


  componentWillMount:->
    debugger
    that = @
    if @props.action is "add"
      @collection = @getNewCollection()
    else
      @collection = new SubList @props.model.get("tbinv_cbwxydjhcbs")
    pageView.on "setError",(error)->
      debugger
      that.setState
        error:error

    pageView.on "saveError",(error)->
      that.setState
        error:error

    pageView.on "saveSuccess",->
      that.props.closeHanele()

  componentWillUnmount:->
    pageView.off "setError"
    pageView.off "saveError"
    pageView.off "saveSuccess"

  componentWillReceiveProps:(nextProps)->
    @setState
      JHND:nextProps.model.get("JHND")
      CBBH:nextProps.model.get("CBBH")
      WXBM:nextProps.model.get("WXBM")
      JHYF:nextProps.model.get("JHYF")

    if nextProps.action is "add"
      @collection = @getNewCollection()
    else
      @collection = new SubList nextProps.model.get("tbinv_cbwxydjhcbs")
  saveButtonHandle:->
    data = _.pick(@state,"JHND","WXBM","JHYF","CBBH")
    data.tbinv_cbwxydjhcbs = @collection.toJSON()
    timeInputFlag = true
    timeInputFlag = false for item in data.tbinv_cbwxydjhcbs when item.WCRQ is "" or item.WCRQ is null or item.WCRQ is undefined
    if timeInputFlag is false
      alert("列表中有计划完成时间未输入，请输入计划完成时间")
      return
    pageView.save(@props.model,data)
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

    <div>
      <Modal bsSize="large" show={@props.show}  onHide={@props.closeHanele}>
        <Modal.Header closeButton>
          <Modal.Title>{headerTexts[@props.action]}</Modal.Title>
        </Modal.Header>
        <Modal.Body ref="modalBody">
          <Grid fluid=true >
            <Row className="show-grid">
              <Col xs={12}>
              </Col>
              <Col xs={12} sm={6} md={3}>
                  <Input type="select"  ref="JHND" addonBefore="计划年度" disabled={action in ["detail","edit"]} value={@state.JHND} onChange={@valueChangeHandle.bind(this,"JHND")}>
                    <option value="2015" selected="">2015</option>
                    <option value="2016">2016</option>
                    <option value="2016">2017</option>
                    <option value="2016">2018</option>
                    <option value="2016">2019</option>
                  </Input>
                  {do =>
                    if @state.error.JHND?
                      <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.JHND)} container={@refs.modalBody} placement="bottom">
                        <Popover>{@state.error.JHND}</Popover>
                      </Overlay>
                  }
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="CBBH" addonBefore="船舶" disabled={action in ["detail","edit"]}  value={@state.CBBH} onChange={@valueChangeHandle.bind(this,"CBBH")}>
                  {
                    do =>
                      for i in cbSelectData
                        <option value=i.dm>{i.mc}</option>
                  }
                </Input>
                {do =>
                  if @state.error.CBBH?
                    <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.CBBH)} container={@refs.modalBody} placement="bottom" >
                      <Popover>{@state.error.CBBH}</Popover>
                    </Overlay>
                }
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Input type="select" rel="WXBM" addonBefore="部门" disabled={action in ["detail","edit"]}  value={@state.WXBM} onChange={@valueChangeHandle.bind(this,"WXBM")}>
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
              <Col xs={12} sm={6} md={3}>
                <Input type="select" ref="JHYF" addonBefore="计划月份" disabled={action in ["detail","edit"]}  value={@state.JHYF} onChange={@valueChangeHandle.bind(this,"JHYF")}>
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
                {do =>
                  if @state.error.JHYF?
                    <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.JHYF)} container={@refs.modalBody} placement="bottom">
                      <Popover>{@state.error.JHYF}</Popover>
                    </Overlay>
                }
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
                  <Button ref="saveBtn" bsStyle="primary" onClick={@saveButtonHandle}>保存</Button>
                  <Button  onClick={@props.closeHanele}>取消</Button>
                ]
          }
          {do =>
            if @state.error.serverError?
              <Overlay show={true} target={=>ReactDOM.findDOMNode(@refs.saveBtn)} container={@refs.modalBody} placement="top">
                <Popover>{@state.error.serverError}</Popover>
              </Overlay>
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

pageView = new PageControl({collection:mainList})
pageView.render()
