#模拟数据

template =
    'list|20-30':
        [
            'ID|+1': 10000
            'RQ': '@date'
            "CBID": '@name'
            'HC': '@name'
            "ZG":'@region'
            'GK': '@region'
            "XG":'@region'
            "HP":'@region'
            "YJ":'@integer(100000, 900000)'
            "SJLZ":'@integer(100000, 900000)'
            "SJLX":'@integer(100000, 900000)'
            "YXSH":'@integer(100000, 900000)'
            "SHL":'@integer(100000, 900000)'
            "DSL":'@integer(100000, 900000)'
            "CHL":'@integer(100000, 900000)'
            "DJ":'@integer(100000, 900000)'
            "ZYF":'@integer(100000, 900000)'
            "PCE":'@integer(100000, 900000)'
            "JYYF":'@integer(100000, 900000)'
            "HTF":'@integer(100000, 900000)'
            "CBLX|1":["集装箱船","散货船"]

        ]

Mock.mock /users/,"get",(options)->
    debugger
    Mock.mock(template).list
    #responseData = pickerData Mock.mock(template),{CBID:$("#ddlSscb").val()}


Mock.mock "/users/","delete",(options)->
    #返回 Json(new { result = true });
    debugger
    {result:true}


$("#btnSearch").click ->
  list.fetch
    reset:true
    async:false
    success:(data)->
      debugger

Model = Backbone.Model.extend
  idAttribute:"id"
  urlRoot:"/users"
  validation:{}
  schema:
     cbbh: title:"船舶ID",type:"Text"
     cbmc: title:"船名",type:"Text"
     zznf: title:"制造年份",type:"Text"
     cjg: title:"船籍港",type:"Text"
     hh: title:"呼号",type:"Text"
     cx: title:"船型",type:"Text"
     cjs: title:"船级社",type:"Text"
     zzd: title:"载重吨(公吨)",type:"Text"
     zdw: title:"总吨",type:"Text"
     jdw: title:"净吨",type:"Text"
     cc: title:"船长(米)",type:"Text"
     ck: title:"船宽(米)",type:"Text"
     xs: title:"型深",type:"Text"
     mzcs: title:"满载吃水",type:"Text"
     dsk: title:"单双壳",type:"Text"
     hybnl: title:"货油泵能力",type:"Text"
     hctc: title:"货仓涂层",type:"Text"
     hcsl: title:"货仓数量",type:"Text"
     hccr: title:"货舱舱容",type:"Text"
     hgcc: title:"货管尺寸",type:"Text"
     gxbz: title:"布置",type:"Text"
     gxyl: title:"压力",type:"Text"
     lssl: title:"数量",type:"Text"
     zjcc: title:"直径尺寸",type:"Text"
     lscz: title:"材质",type:"Text"
     zhsd: title:"装货速度",type:"Text"
     xhsd: title:"卸货速度",type:"Text"
     jwpg: title:"盘管",type:"Text"
     jwjz: title:"介质",type:"Text"
     xcsbfs: title:"方式",type:"Text"
     xcsbsl: title:"数量",type:"Text"
     xcsbyl: title:"压力",type:"Text"
     xcsbhs: title:"每小时耗水",type:"Text"
     jljzd: title:"绞缆机是否自动",type:"Text"
     hougcc: title:"尺寸",type:"Text"
     hougsl: title:"数量",type:"Text"
     dqxt: title:"惰气系统",type:"Text"



List = Backbone.Collection.extend
  url:"/users"
  model:Model


list = new List()


list.fetch
  reset:true
  async:false
  success:(data)->
    debugger
ReactTable = window.ReactTable



TableView = Backbone.View.extend
  initialize:(options)->
    debugger
    this.listenTo @collection,"reset add remove change",@render.bind(this)
    this.options = {}
    _.extend this.options,options
  selectedRowChange:(model)->
    @.trigger("selectedRowChange",model)
  render:->
    debugger
    React.render <ReactTable {...@options} tableView={@}></ReactTable>,
      @el
  remove:->
    React.unmountComponentAtNode(@el)
    TableView.__super__.remove.apply(this,arguments)

list.fetch
  reset:true
  async:false
table = new TableView
  el:$("#backboneTable")
  collection:list
  readonly:true
  cellClick:(model,key)->
  cellDoubleClick:(model,key)->
  headerButtons:[
    {
      text:"新增"
      command:"add"
    }
  ]
  rowButtons:[
    {
      text:"详情"
      command:"detail"
    }
    {
      text:"编辑"
      command:"edit"
    }
    {
      text:"删除"
      command:"delete"
    }
    {
      text:"审核"
      command:"verify"
      onClick:(model)->
        debugger
        alert("")
    }
  ]
  customTemplate:"""<table width="850" >
            <tbody>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">船舶编号
                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='cbbh' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">船名
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='cbmc'  style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">制造年份
                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='zznf'  style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">船籍港
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='cjg' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">呼号

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='hh' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">船型
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='cx' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">船级社

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='cjs' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">载重吨(公吨)
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='zzd' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">总吨

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='zdw' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">净吨
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='jdw' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">船长(米)

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='cc' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">船宽(米)
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='ck' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">型深

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='xs' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">满载吃水
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='mzcs' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">单双壳
                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-left-color: rgb(255, 255, 255); border-right-color: windowtext; border-bottom-color: windowtext;">
                        <div class='item-details-editor-container' data-editorid='dsk' style="display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">货油泵能力
                    </td>
                    <td width="214" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='hybnl' style="display:inline-block"></div>
                    </td>
                </tr>

                <tr style="height: 36px;">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">货舱

                    </td>
                    <td width="140" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>涂层</span><div class='item-details-editor-container' data-editorid='hctc' style="width:80px;display:inline-block"></div>
                    </td>
                    <td width="140" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>数量</span><div class='item-details-editor-container' data-editorid='hcsl' style="width:100px;display:inline-block"></div>
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">舱容
                    </td>
                    <td width="146" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='hccr'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">管系

                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>货管尺寸</span><div class='item-details-editor-container' data-editorid='hgcc'  style="width:70px;display:inline-block"></div>
                    </td>
                    <td width="166" valign="center"  style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>布置</span><div class='item-details-editor-container' data-editorid='gxbz' style="width:110px;display:inline-block"></div>
                    </td>
                     <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">压力
                    </td>
                    <td width="130" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='gxyl'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">缆绳

                    </td>
                    <td width="140" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>数量</span><div class='item-details-editor-container' data-editorid='lssl' style="width:90px;display:inline-block"></div>
                    </td>
                    <td width="146" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>直径尺寸</span><div class='item-details-editor-container' data-editorid='zjcc' style="width:90px;display:inline-block"></div>
                    </td>
                     <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">材质
                    </td>
                    <td width="140" valign="center"  style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                       <div class='item-details-editor-container' data-editorid='lscz'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">装卸货
                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>装货速度</span><div class='item-details-editor-container' data-editorid='zhsd' style="width:250px;display:inline-block"></div>
                    </td>
                     <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">卸货速度
                    </td>
                    <td width="214" valign="center"  style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                       <div class='item-details-editor-container' data-editorid='xhsd'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">加温

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>盘管</span><div class='item-details-editor-container' data-editorid='jwpg' style="width:273px;display:inline-block"></div>
                    </td>
                     <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">介质
                    </td>
                    <td width="214" valign="center"  style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                       <div class='item-details-editor-container' data-editorid='jwjz'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">洗舱设备
                    </td>
                    <td width="100" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>方式</span><div class='item-details-editor-container' data-editorid='xcsbfs' style="width:85px;display:inline-block"></div>
                    </td>
                    <td width="100" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>数量</span><div class='item-details-editor-container' data-editorid='xcsbsl' style="width:85px;display:inline-block"></div>
                    </td>
                    <td width="100" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>压力</span><div class='item-details-editor-container' data-editorid='xcsbyl' style="width:85px;display:inline-block"></div>
                    </td>
                    <td width="127" valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>耗水(/h)</span><div class='item-details-editor-container' data-editorid='xcsbhs' style="width:90px;display:inline-block"></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">绞缆机

                    </td>
                    <td width="427" valign="center" colspan="4" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>是否自动</span><div class='item-details-editor-container' data-editorid='jljzd' style='display:inline-block'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">喉管

                    </td>
                    <td width="213" valign="center" colspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <span>尺寸</span><div class='item-details-editor-container' data-editorid='hougcc' style='display:inline-block'></div>
                    </td>
                      <td width="130" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-bottom-color: windowtext;">数量
                    </td>
                    <td width="214" valign="center"  style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                       <div class='item-details-editor-container' data-editorid='hougsl'></div>
                    </td>
                </tr>
                <tr style="height: 36px">
                    <td width="120" valign="center" style="padding: 0px 7px; border-style: solid; border-width: 1px; border-right-color: windowtext; border-top-color: rgb(255, 255, 255); border-bottom-color: windowtext;">惰气系统

                    </td>
                    <td width="427" valign="center" colspan="4" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(255, 255, 255) windowtext windowtext rgb(255, 255, 255);">
                        <div class='item-details-editor-container' data-editorid='dqxt' style="width:630px;display:inline-block"></div>
                    </td>
                </tr>
            </tbody>
        </table> """



table.render()
