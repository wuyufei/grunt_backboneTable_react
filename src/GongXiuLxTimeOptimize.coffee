readonly = planmis.readonly
GXTable = React.createClass
  getInitialState:->
    sort:"GXRQ"
  refreshHandle:(e)->
    refresh()
  verifyAllHandle:(e)->
    return if readonly
    pData = @props.collection.toJSON()
    promise = $.ajax
      url:"/PilotGxWh.ashx"
      data:JSON.stringify(pData)
      headers:method:"allShenhe"
      type:"post"
      dataType:"json"
    promise.done ->
      refresh()
    promise.fail (xhr,status,err)->
      alert(xhr.responseText)
  _getMonthDayObj:->
    temp = if @props.month<10 then "0"+@props.month.toString() else @props.month.toString()
    month1 = moment(@props.year+"-"+temp+"-"+"01")
    month2 = moment(month1).add(1,"months")
    {
      m1 : @_getDaysInMonth(month1.get("year"),month1.get("month")+1)
      m2:  @_getDaysInMonth(month2.get("year"),month2.get("month")+1)
    }
  _getDaysInMonth:(year,month)->
    month = parseInt(month,10)
    d = new Date(year,month,0)
    return d.getDate();
  _timeEqual:(a,b)->


  renderColumns:(isHeader)->
    [text1,text2,class1,class2,angle]=["日期","姓名","text-right","text-left",20]
    unless isHeader
      [text1,text2,class1,class2] = [text2,text1,class2,class1]
      angle = -angle

    md = @_getMonthDayObj()
    tds1 = for i in [1..md.m1]
            <th>{i}</th>
    tds2 = for i in [1..md.m2]
            <th>{i}</th>
    tds = tds1.concat(tds2)
    lineStyle =
      top:"50%"
      bottom:"50%"
      left:0
      right:0
      position:"absolute"
      backgroundColor:"rgb(221, 221, 221)"
      height:1
      transform: "rotate(#{angle}deg)"
    # <tr >
    #   <th onClick={@sortClick} title="点击切换排序方式" style={{cursor:"pointer"}}>序</th>
    #   <th style={{padding:0,position:"relative"}}>
    #     <div style={{width:100}}>
    #       <div style={lineStyle}></div>
    #       <div className={class1}>{text1}</div>
    #       <div className={class2}>{text2}</div>
    #     </div>
    #   </th>
    #   {tds}
    # </tr>
    firstHeaderCellStyle=
        # borderRightColor:"rgb(221, 221, 221)"
        # borderRightStyle:"solid"
        # borderRightWidth:1
        cursor:"pointer"
        display:"inline-block"
        minWidth:48
        paddingLeft:5

    secondHeaderCellStyle =
      padding:0
      paddingLeft:5
      position:"relative"
      display:"inline-block"
      marginLeft:5
      borderLeftStyle:"solid"
      borderLeftWidth:1
      borderLeftColor:"rgb(211,211,211)"
    <tr >
      <th style={{minWidth:160,padding:0}}>
        <div onClick={@sortClick} title="点击切换排序方式" style={firstHeaderCellStyle}>序</div>
        <div style={secondHeaderCellStyle}>
          <div style={{width:100}}>
            <div style={lineStyle}></div>
            <div className={class1}>{text1}</div>
            <div className={class2}>{text2}</div>
          </div>
        </div>
      </th>
      {tds}
    </tr>
  sortClick:->
    debugger
    if @state.sort is "GXRQ"
      @setState sort:"SQSJ"
    else
      @setState sort:"GXRQ"
  renderRows:->
    # monthDays = @_getDaysInMonth(@props.year,@props.month)
    that = @
    index = 0
    group = @props.collection.groupBy (m)->
              m.get("CHPILOTCODE")

    #将group对象转换为数组然后排序
    groupArray = _.pairs group
    if @state.sort is "SQSJ"
      sortColl = _.sortBy groupArray,(l)->
        s = _.sortBy l[1],(x)->
          x.get("SQSJ")
        s[s.length-1].get("SQSJ")
    else
      sortColl = _.sortBy groupArray,(l)->
        s = _.sortBy l[1],(x)->
          x.get("GXRQ")
        s[0].get("GXRQ")
    #sortColl.reverse()
    for v in  sortColl
      index++
      <GXRow menu={menu} year={@props.year} month={@props.month} models={v[1]} index={index}/>


    # for model in @props.collection.models
    #   index++
    #   <GXRow menu={menu} monthDays={monthDays} model={model} index={index}/>

  renderFooter1:->
    # monthDays = @_getDaysInMonth(@props.year,@props.month)
    md = @_getMonthDayObj()
    # cells = for i in [1..monthDays]
    #           for model in @props.collection.models
    #             count= _.filter @props.collection.models,(m)->
    #                       d = moment(m.get("GXRQ")).get('date')
    #                       d is i
    #                   .length
    #           <td>{count}</td>
    #用分组的方法
    tempColl = (m for m in @props.collection.models when  $.trim(m.get("CHPILOTGRADE")) isnt "E")
    group = _.groupBy tempColl,(m)->
      temp = moment(m.get("GXRQ"))
      """#{temp.get("month")+1}-#{temp.get("date")}"""
    cells1 = for i in [1..md.m1]
      subS = @props.month + "-" + i
      count = group[subS]?.length
      #if大于限额，背景红色
      limit = c.TS for c in @props.gxtsList when moment(c.RQ).isSame("#{@props.year}-#{if @props.month >=10 then @props.month else "0"+@props.month}-#{if i>=10 then i else "0"+i}")
      <td className={if count>limit then "danger" else ""}>{count}</td>
    cells2 = for i in [1..md.m2]
      subS = @props.month+1 + "-" + i
      count = group[subS]?.length
      #if大于限额，背景红色
      limit = c.TS for c in @props.gxtsList when moment(c.RQ).isSame("#{@props.year}-#{if @props.month >=10 then @props.month else "0"+@props.month}-#{if i>=10 then i else "0"+i}")
      <td className={if count>limit then "danger" else ""}>{count}</td>
    cells = cells1.concat(cells2)
    <tr>
      <td style={{fontWeight:"bold"}} className="text-center">总计</td>{cells}
    </tr>


  renderFooter2:->
    # monthDays = @_getDaysInMonth(@props.year,@props.month)

    md = @_getMonthDayObj()
    cells1 = for i in [1..md.m1]
              limit = c.TS for c in @props.gxtsList when moment(c.RQ).isSame("#{@props.year}-#{if @props.month >=10 then @props.month else "0"+@props.month}-#{if i>=10 then i else "0"+i}")
              <td>{limit}</td>
    cells2 = for i in [1..md.m2]
              limit = c.TS for c in @props.gxtsList when moment(c.RQ).isSame("#{@props.year}-#{if @props.month+1 >=10 then @props.month+1 else "0"+(@props.month+1)}-#{if i>=10 then i else "0"+i}")
              <td>{limit}</td>
    cells = cells1.concat(cells2)
    <tr>
      <td style={{fontWeight:"bold"}} className="text-center">限额</td>{cells}
    </tr>
  onClick:(e)->
    debugger
    target = $(e.target)
    unless target.is("td") or target.is("th")
      target = target.closest("td")
      target = target.closest("th") if target.length is 0

    if target.length > 0
      index = target.index()
      table = target.closest("table")
      table.find("td,th").each ->
        el = $(this)
        if el.index() is index
          el.addClass("warning")
        else
          el.removeClass("warning")
      table.find("tr").removeClass("warning")
      target.closest("tr").addClass("warning")

  render:->
    monthDays = 31
    debugger
    firstYearMonth = moment(@props.year+"-"+@props.month+"-"+"01","YYYY-MM-DD")
    secondYearMonth = moment(firstYearMonth).add(1,"months")
    headerText = firstYearMonth.year() + "-" + (firstYearMonth.month()+1) + "至" + secondYearMonth.year() + "-" + (secondYearMonth.month()+1)
    <div className="panel panel-info">
      <div className="panel-heading text-center">
        <button onClick={@refreshHandle} className="btn btn-success pull-left"><span className="glyphicon glyphicon-refresh"/> 刷新</button>{if readonly then "" else <button onClick={@verifyAllHandle} className="btn btn-primary pull-right"><span className="glyphicon glyphicon-eye-open"/> 全部审核</button>}
        <h5>引航员公休轮休明细表({headerText})</h5>
      </div>
      <div className="table-responsive">
	     <table className="table table-bordered" onClick={@onClick}>
          <thead >
            {@renderColumns(true)}
          </thead>
          <tbody>
            {@renderRows()}
            {@renderFooter1()}
            {@renderFooter2()}
          </tbody>
          <thead>
            {@renderColumns(false)}
          </thead>
        </table>
      </div>
    </div>

GXRow = React.createClass
  _getDaysInMonth:(year,month)->
    month = parseInt(month,10)
    d = new Date(year,month,0)
    return d.getDate();
  _getMonthDayObj:->
    temp = if @props.month<10 then "0"+@props.month.toString() else @props.month.toString()
    month1 = moment(@props.year+"-"+temp+"-"+"01")
    month2 = moment(month1).add(1,"months")
    {
      m1 : @_getDaysInMonth(month1.get("year"),month1.get("month")+1)
      m2:  @_getDaysInMonth(month2.get("year"),month2.get("month")+1)
    }

  render:->
    that = @
    index = 1
    md = @_getMonthDayObj()
    twoMonth = moment(@props.year+"-"+@props.month+"-"+"01").add(1,"months")
    year2 = twoMonth.year()
    month2 = twoMonth.month() + 1
    cells1 = for i in [1..md.m1]
              model = _.find @props.models,(m)->
                mom = moment(m.get("GXRQ"))
                month = mom.get("month")+1
                d = mom.get('date')
                d is i and month is that.props.month
              #取得日期
              mon = moment(@props.models[0].get("GXRQ"))
              # date = """#{mon.year().toString()}-#{mon.month()+1}-#{i}"""
              date = """#{@props.year}-#{@props.month}-#{i} """
              pilotCode = @props.models[0].get("CHPILOTCODE")
              pilotName = @props.models[0].get("VCPILOTNAME")
              <GXCell date={date} model={model} pilotCode={pilotCode} pilotName={pilotName} month={mon.month()+1} day={i} menu={@props.menu}/>
    cells2 = for i in [1..md.m2]
              model = _.find @props.models,(m)->
                mom = moment(m.get("GXRQ"))
                month = mom.get("month")+1
                d = mom.get('date')
                d is i and month is (that.props.month + 1)
              #取得日期
              mon = moment(@props.models[0].get("GXRQ"))
              # date = """#{mon.year().toString()}-#{mon.month()+1}-#{i}"""
              date = """#{year2}-#{month2}-#{i} """
              pilotCode = @props.models[0].get("CHPILOTCODE")
              pilotName = @props.models[0].get("VCPILOTNAME")
              <GXCell date={date} model={model} pilotCode={pilotCode} pilotName={pilotName} month={mon.month()+2} day={i} menu={@props.menu}/>
    cells = cells1.concat(cells2)
    rowHeaderStyle1 =
      position:"absolute"
      borderRight:"none"
      backgroundColor:"#FFF"
      minWidth:160
      display:"inline-block"
      paddingTop:0
      paddingBottom:0
    rowHeaderStyle2 =
      # position:"absolute"
      # borderRight:"none"
      # backgroundColor:"#FFF"
      # marginLeft:60
      # width:100
      # display:"inline-block"
      # <td style={rowHeaderStyle1}>{@props.index}</td><td style={rowHeaderStyle2}>{@props.models[0].get("VCPILOTNAME")} <span className="badge">{@props.models.length}</span></td>
    firstCellStyle =
      borderRightColor:"rgb(221, 221, 221)"
      borderRightStyle:"solid"
      borderRightWidth:1
      display:"inline-block"
      width:46
      height:36
      paddingTop:5

    <tr>
      <td style={rowHeaderStyle1}>
        <div style={firstCellStyle}>{@props.index}</div>
        <div style={{display:"inline-block",width:93,marginLeft:5,paddingTop:5}}>{@props.models[0].get("VCPILOTNAME")}<span className="badge">{@props.models.length}</span></div>
      </td>
      {cells}
    </tr>

GXCell = React.createClass
  componentDidMount:->
    @_setMenu()
  _setMenu:->
    return if readonly
    that = @
    el = $(@getDOMNode())
    el.contextmenu
      target:"#menu"
      before:(e,context)->
        debugger
        ul =@getMenu().find("ul")
        ul.empty()
        if that.props.model
          ul.append """
                  <li><a href="#">单天确认</a></li>
                  <li><a href="#">全部确认</a></li>
                  <li><a t href="#">取消</a></li> """
        else
          ul.append """
                <li><a tabindex="-1" href="#">安排公休</a></li>
                <li><a tabindex="-1" href="#">安排轮休</a></li>"""
      onItem:(context,e)->
          e.preventDefault()
          target = $(e.target)
          model = that.props.model;
          switch target.text()
            when "取消"
              pData = model.toJSON()
              pData.day = moment(model.get("GXRQ")).format("YYYY-MM-DD")
              pData.method = "quxiao"
              promise = $.ajax
                url:"/PilotGxWh.ashx"
                data:pData
                type:"post"
                dataType:"json"
              promise.done (data,status,xhr)->
                refresh()
            when "单天确认"
              pData = model.toJSON()
              pData.day = moment(model.get("GXRQ")).format("YYYY-MM-DD")
              pData.method = "shenhe"
              promise = $.post "/PilotGxWh.ashx",pData
              promise.done (data,status,xhr)->
                refresh()
              promise.fail (xhr,status,err)->
                alert(xhr.responseText)
            when "全部确认"
              pData = model.collection.where {CHPILOTCODE:model.get("CHPILOTCODE")}
              promise = $.ajax
                url:"/PilotGxWh.ashx"
                data:JSON.stringify(pData)
                headers:method:"allShenhe"
                type:"post"
                dataType:"json"
              promise.done ->
                refresh()
              promise.fail (xhr,status,err)->
                alert(xhr.responseText)
            when "安排公休"
              debugger
              pData = {}
              pData.pilotCode = that.props.pilotCode
              pData.pilotName = that.props.pilotName
              pData.day = that.props.date
              pData.sqlb = "G"
              pData.method = "diaodushenqingnew"
              promise = $.post "/PilotGxWh.ashx",pData
              promise.done (data,status,xhr)->
                refresh()
              promise.fail (xhr,status,err)->
                alert(xhr.responseText)
            when "安排轮休"
              pData = {}
              pData.pilotCode = that.props.pilotCode
              pData.pilotName = that.props.pilotName
              pData.day = that.props.date
              pData.sqlb = "L"
              pData.method = "diaodushenqingnew"
              promise = $.post "/PilotGxWh.ashx",pData
              promise.done (data,status,xhr)->
                refresh()
              promise.fail (xhr,status,err)->
                alert(xhr.responseText)

  componentDidUnmount:->
    el = $(@getDOMNode())
    el.contextmenu("destroy")
    el.popover("destroy")
  componentDidUpdate:->
  mouseOverHandle:->
    return if readonly
    that = @
    el = $(@getDOMNode())

    # el.css("backgroundColor","#f5f5f5")
    @showPop = true
    if @props.model
      setTimeout ->
        if that.showPop and  el.data("bs.popover") in [null,undefined]
          day = moment(that.props.model.get("GXRQ")).format("YYYY-MM-DD")
          sqrq = moment(that.props.model.get("SQSJ")).format("YYYY-MM-DD")
          $.getJSON "/PilotGxWh.ashx",
            {pilotCode:that.props.model.get("CHPILOTCODE"),date:day},
            (data,state,xhr)->
              el.popover
                title:that.props.model.get("VCPILOTNAME")
                content:"""轮休天数:#{data.LXTS.toString()}</br>剩余天数:#{data.SYTS.toString()}</br>请假事由:#{that.props.model.get("QJSY")}</br>申请日期:#{sqrq} """
                trigger:""
                html:true
                placement:"auto right"
                container:"body"
              el.popover("show")
              setTimeout ->
                el.popover("destroy")
              ,3000
      ,600
  mouseLeaveHandle:->
    return if readonly
    @showPop = false
    el = $(@getDOMNode())
    # el.css("backgroundColor","#fff")
    # el.popover("destroy")
  render:->
     if @props.model
       style =
         color:if @props.model.get("SQLB") is "G" then "blue" else "black"
     #title={"#{@props.day}日"}
     className = "text-center"
     if @props.model and @props.model.get("SHBZ") is "1"
       className = "text-center success"
     <td className={className} onMouseOver={@mouseOverHandle} onMouseLeave={@mouseLeaveHandle}>
      <span style={style}>{if @props.model then @props.model.get("SQLB") else ""}</span>
     </td>




Model = Backbone.Model.extend
  urlRoot: "/PilotGxWh.ashx"
Collection = Backbone.Collection.extend
  model:Model
  url:"/PilotGxWh.ashx"
list = new Collection()




date = new Date();
curYear = date.getFullYear()
curMonth = date.getMonth()+1
curYearMonth = "#{curYear}-#{curMonth}"
$("#txtStart").val(curYearMonth)

# list.fetch
#   wait:true
#   data:gxlx: curYearMonth
#   async:false
#   rest:true
#   success:(collection, resp, options)->
#     debugger

pData = gxlx: curYearMonth
$.getJSON "/PilotGxWh.ashx",pData,(data)->
  _.extend pageView.options,gxtsList:data.gxtsList
  list.reset(data.gxsqList)
  pageView.render()

PageView = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
    @listenTo @collection,"reset",@render,this
  render:->
    tableProps =
      year:@options.year
      month:@options.month
      collection:@collection
      gxtsList:@options.gxtsList
    reactComponent = React.render <GXTable {...tableProps}></GXTable>,
                      document.getElementById 'table'
pageView = new PageView
  el:$("#table")
  collection:list
  gxtsList:[]
  year:curYear
  month:curMonth



$("#btnSearch").click ->
  date = $("#txtStart").val()
  year = parseInt date.substr(0, 4);
  month = parseInt date.substr(date.indexOf("-")+1);
  yearMonth = "#{year}-#{month}"
  _.extend pageView.options,year:year,month:month
  pData = gxlx: yearMonth
  $.getJSON "/PilotGxWh.ashx",pData,(data)->
    _.extend pageView.options,gxtsList:data.gxtsList
    list.reset(data.gxsqList)

refresh = ->
  date = $("#txtStart").val()
  year = parseInt date.substr(0, 4);
  month = parseInt date.substr(date.indexOf("-")+1);
  yearMonth = "#{year}-#{month}"
  _.extend pageView.options,year:year,month:month
  pData = gxlx: yearMonth
  $.getJSON "/PilotGxWh.ashx",pData,(data)->
    _.extend pageView.options,gxtsList:data.gxtsList
    list.reset(data.gxsqList)

$("#btnAdd").click ->
  return if readonly
  form = new Form()
  form.render()


  # list.fetch
  #   wait:true
  #   data:gxlx: yearMonth
  #   async:false
  #   reset:true
  #   success:(collection, resp, options)->
  #     debugger
  pageView.render()
User = Backbone.Model.extend
            urlRoot: "/PilotGxWh.ashx"
            schema:
                CHPILOTNO:
                    type: "Text"
                    title: "工号"
                    readonly: true

                VCPILOTNAME:
                    type: "Text"
                    title: "姓名"
                    readonly: true

Users = Backbone.TableCollection.extend
            url: "/PilotGxWh.ashx"
            model: User
users = new Users()
users.fetch()

Form = ModalFormView.extend
  renderComplete:->
    that = @
    @$el.find("[data-field=startTime],[data-field=endTime]").datetimepicker
      format: "yyyy-mm-dd",
      language: "zh-CN",
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighLight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0
    listView = new Backbone.TableView
            collection: users
            allowPageing: false
            allowSortting: true
            allowSaveButton: false
            allowAddButton: false
    listView.render()
    @$el.find("[data-container=list]").append listView.el
    listView.$el.click (e)->
      e.preventDefault()
      e.stopPropagation()
    listView.on "cellDoubleClick", (e,data)->
      debugger
      currEl = that.$el.find("[data-field=pilotCode]")
      currEl.data("pilotCode",data.get("CHPILOTNO"))
      currEl.val(data.get("VCPILOTNAME"))
      that.$el.find(".dropdown-menu").dropdown('toggle')
      #发送请求取得已轮休天数和剩余天数
      currDate = new Date()
      date =currDate.getFullYear() + "-" + (currDate.getMonth()+1) + "-" + currDate.getDate()
      $.getJSON "/PilotGxWh.ashx", {pilotCode: data.get("CHPILOTNO"),date:date},(data, state, xhr)->
        that.$el.find("[data-field=ylxts]").val(data.YLXTS)
        that.$el.find("[data-field=syts]").val(data.SYTS)
  save:->
    #验证数据
    that = @
    validated = true
    currEl = @$el.find("[data-field=pilotCode]")
    startEl = @$el.find("[data-field=startTime]")
    endEl = @$el.find("[data-field=endTime]")
    sqlbEl = @$el.find("[data-field=SQLB]")
    qjsyEl = @$el.find("[data-field=QJSY]")
    elArray = [startEl,endEl,sqlbEl]
    for el in elArray
      unless el.val()
        el.popover
          content:"该字段不能为空"
          placement:"auto"
        el.popover "show"
        el.click (e)->
                $(this).popover "destroy"
        validated = false
      else
        el.popover "destroy"
    if validated
      #组织数据并提交
      postData = {}
      postData.method = "ddkgxlxsq"
      postData.CHPILOTCODE = currEl.data("pilotCode")
      postData.CHPILOTNAME = currEl.val()
      postData.startTime = startEl.val()
      postData.endTime = endEl.val()
      postData.SQLB = sqlbEl.val()
      postData.QJSY = qjsyEl.val()
      promise = $.post("/PilotGxWh.ashx", postData)
      promise.done (data, status, xhr)->
        that.$el.modal("hide")
        refresh()
      promise.fail (xhr, status, err)->
        debugger
        $el = that.$el.find("[data-command=save]");
        $el.popover
            content: xhr.responseText
            placement: "auto"
        $el.popover("show");
  formTemplate:_.template """ <form>
                                <fieldset>
                                    <div class="panel panel-default">
                                        <div class="panel-heading text-center"><h4>公休轮休申请</h4></div>
                                        <div class="panel-body">
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                    <span class="input-group-addon">引航员</span>
                                                    <input type="text" data-field="pilotCode" class="form-control" readonly="readonly"></input>
                                                    <span class="input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret" ></span></span>
                                                    <div class="dropdown-menu" role="menu" aria-labelledby="dLabel"  style="width:150%;" >
                                                      <div class="col-md-12" >
                                                        <p data-container="list"style="height:320px;overflow-y:auto;"></p>
                                                      </div>
                                                    </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">已轮休天数</span>
                                                      <input type="text" class="form-control" data-field="ylxts" readonly="readonly" id="Text2" />
                                                      <span class="input-group-addon">天</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group" >
                                                      <span class="input-group-addon">剩余天数</span>
                                                      <input type="text" class="form-control" data-field="syts" readonly="readonly" id="Text3" />
                                                      <span class="input-group-addon">天</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="clearfix"></div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">开始日期
                                                      </span>
                                                      <input type="text" readonly="readonly" data-field="startTime" class="form-control" id="txtStart">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">结束日期
                                                      </span>
                                                      <input type="text" readonly="readonly" data-field="endTime" class="form-control" id="txtEnd">
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="col-xs-12 col-sm-6 col-md-4">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">公休/轮休
                                                      </span>
                                                      <select class="form-control" data-field="SQLB">
                                                        <option value="G">公休</option>
                                                        <option value="L">轮休</option>
                                                      </select>
                                                  </div>
                                              </div>
                                          </div>
                                           <div class="col-md-12">
                                              <div class="form-group">
                                                  <div class="input-group">
                                                      <span class="input-group-addon">请假事由
                                                      </span>
                                                      <textarea class="form-control" data-field="QJSY" rows="2"></textarea>
                                                  </div>
                                              </div>
                                          </div>
                                        </div>
                                    </div>
                                </fieldset>
                              </form>"""
