GXTable = React.createClass
  refreshHandle:(e)->
  showReasonHandle:(e)->
  _getDaysInMonth:(year,month)->
    month = parseInt(month,10)
    d = new Date(year,month,0)
    return d.getDate();
  renderColumns:(isHeader)->
    [text1,text2,class1,class2,angle]=["日期","姓名","text-right","text-left",20]
    unless isHeader
      [text1,text2,class1,class2] = [text2,text1,class2,class1]
      angle = -angle

    monthDays = @_getDaysInMonth(@props.year,@props.month)
    tds = for i in [1..monthDays]
            <th>{i}</th>
    lineStyle =
      top:"50%"
      bottom:"50%"
      left:0
      right:0
      position:"absolute"
      backgroundColor:"rgb(221, 221, 221)"
      height:1
      transform: "rotate(#{angle}deg)"

    <tr >
      <th>序</th>
      <th style={{padding:0,position:"relative"}}>
        <div style={lineStyle}></div>
        <div className={class1}>{text1}</div>
        <div className={class2}>{text2}</div>
      </th>
      {tds}
    </tr>
  renderRows:->
    monthDays = @_getDaysInMonth(@props.year,@props.month)
    index = 0
    group = @props.collection.groupBy (m)->
              m.get("CHPILOTCODE")
    for k,v in group
      <GXRow menu={menu} monthDays={monthDays} models={v} index={index}/>


    # for model in @props.collection.models
    #   index++
    #   <GXRow menu={menu} monthDays={monthDays} model={model} index={index}/>

  renderFooter1:->
    monthDays = @_getDaysInMonth(@props.year,@props.month)
    cells = for i in [1..monthDays]
              for model in @props.collection.models
                count= _.filter @props.collection.models,(m)->
                          day = parseInt(m.get("GXRQ")[-2..])
                          if day is i then true else false
                      .length
              <td>{count}</td>
    <tr>
      <td></td><td style={{fontWeigh:"bold"}}>总计</td>{cells}
    </tr>
  renderFooter2:->
    monthDays = @_getDaysInMonth(@props.year,@props.month)
    cells = for i in [1..monthDays]
              <td>{25}</td>
    <tr>
      <td></td><td style={{fontWeigh:"bold"}}>限额</td>{cells}
    </tr>
  render:->
    monthDays = 31
    yearMoonth = @props.year + "-" + @props.month
    <div className="panel panel-info">
      <div className="panel-heading text-center">
        <button onClick={@refreshHandle} className="btn btn-success pull-left">刷新</button>
        <button onClick={@showReasonHandle} className="btn btn-primary pull-right">显示请假事由</button>
        <h5>引航员公休轮休明细表({yearMoonth})</h5>
      </div>
      <div className="table-responsive">
	     <table className="table table-bordered">
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
  render:->
    index = 1
    debugger
    day = @props.model.get("GXRQ")[-2..]
    day = parseInt(day)
    cells = for i in [1..@props.monthDays]
              if day is i
                value=@props.model.get("SQLB")
              else
                value=""
              <GXCell value={value} day={i} menu={@props.menu}/>

    <tr>
      <td>{@props.index}</td><td>{@props.model.get("VCPILOTNAME")} <span className="badge">2</span></td>
      {cells}
    </tr>

GXCell = React.createClass
  componentDidMount:->
    debugger
    el = $(@getDOMNode())
    el.contextmenu
      target:$("#menu")
      onItem:(context,e)->
        target = $(e.target)
        if target.text() is "取消"
          console.log("取消")
  componentDidUnmount:->
    el = $(@getDOMNode())
    el.contextmenu("destroy")
  mouseOverHandle:->
    el = $(@getDOMNode())
    el.css("backgroundColor","#f5f5f5")
  mouseLeaveHandle:->
    el = $(@getDOMNode())
    el.css("backgroundColor","#fff")
  render:->
     style =
       color:if @props.value is "G" then "blue" else "black"
     <td className="text-center" title={"#{@props.day}日"} onMouseOver={@mouseOverHandle} onMouseLeave={@mouseLeaveHandle}>
      <span style={style}>{@props.value}</span>
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

list.fetch
  wait:true
  data:gxlx: curYearMonth
  async:false

PageView = Backbone.View.extend
  initialize:(options)->
    @options = _.extend {},options
    @listenTo @collection,"reset",@render,this
  render:->
    tableProps =
      year:@options.year
      month:@options.month
      collection:@collection
    reactComponent = React.render <GXTable {...tableProps}></GXTable>,
                      document.getElementById 'table'
pageView = new PageView
  el:$("#table")
  collection:list
  year:curYear
  month:curMonth

pageView.render()

$("#btnSearch").click ->
  debugger
  date = $("#txtStart").val()
  year = parseInt date.substr(0, 4);
  month = parseInt date.substr(date.indexOf("-")+1);
  yearMonth = "#{year}-#{month}"
  _.extend pageView.options,year:year,month:month
  list.fetch
    wait:true
    data:gxlx: yearMonth
    async:false
    reset:true
  pageView.render()
