GXTable = React.createClass
  refreshHandle:(e)->
  showReasonHandle:(e)->
  renderColumns:(isHeader)->
    [text1,text2,class1,class2,angle]=["日期","姓名","text-right","text-left",31]
    unless isHeader
      [text1,text2,class1,class2] = [text2,text1,class2,class1]
      angle = -angle

    monthDays = 31
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
    monthDays = 31
    index = 0
    for model in @props.collection.models
      index++
      <GXRow menu={menu} monthDays={monthDays} model={model} index={index}/>

  renderFooter:->
    monthDays = 31
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
            {@renderFooter()}
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
    day = @props.model.get("GXRQ")[-2..]
    day = parseInt(day)
    cells = for i in [1..@props.monthDays]
              if day is i
                value=@props.model.get("type")
              else
                value=""
              <GXCell value={value} menu={@props.menu}/>

    <tr>
      <td>{@props.index}</td><td>{@props.model.get("name")}</td>
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
     <td className="text-center" onMouseOver={@mouseOverHandle} onMouseLeave={@mouseLeaveHandle}>
      <span style={style}>{@props.value}</span>
     </td>

template =
 'gxsqList|20':[{
   name:'@cname'
   GXRQ:'@date(2015-01-dd)'
   SQSJ:'@date(2015-01-dd)'
   'type|1':["G","L"]
}]

Mock.mock "t.tt", "get",(options)->
    		gxsqList = Mock.mock(template).gxsqList
    		gxsqList


Model = Backbone.Model.extend
  idAttribute:"id"
  url:"t.tt"
Collection = Backbone.Collection.extend
  model:Model
  url:"t.tt"
list = new Collection()
list.fetch
  wait:true
  async:false




tableProps =
  year:2015
  month:1
  collection:list
React.render <GXTable {...tableProps}></GXTable>,
  document.getElementById 'container'
