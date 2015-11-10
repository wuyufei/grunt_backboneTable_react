_.extend  window, ReactBootstrap

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
                buttons:
                    detail: true
                    edit: true
                    verify:false
                    more: true

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



Page = React.createClass
  searchHandle:->
    alert("")
  render:->
    tableProps =
          collection:mainList
          readonly:true
          headerButtons:[
            {
              text:"新增"
              command:"add"
              onclick:(e)->
                #e.preventDefault()
            }
          ]
          rowButtons:[
            {
              text:"详情"
              command:"detail"
              onclick:(model,e)->
                e.preventDefault()
            }
            {
              text:"编辑"
              command:"edit"
              onclick:(model,e)->
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
      </Grid>
React.render <Page></Page>,$("body")[0]
