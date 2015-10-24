GXTable = React.createClass
  refreshHandle:(e)->
  showReasonHandle:(e)->
  renderColumns:->
    monthDays = 31
    tds = for i in [1..monthDays]
            <th colspan="2">{i}</th>
    nullTds= for i in [1..monthDays]
                <th></th>
    result = []
    result.push
          <tr>
            <th colspan="2">序</th>
            <th>姓名</th>
            {tds}
          </tr>
    result.push <tr><th/><th>日期</th>{nullTds}</tr>
    result

  renderRows:->
    debugger
    monthDays = 31
    index = 0
    for model in @props.collection.models
      index++
      <GXRow monthDays={monthDays} model={model} index={index}/>

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
    debugger
    monthDays = 31
    yearMoonth = @props.year + "-" + @props.month
    <div className="panel panel-info">
      <div className="panel-heading text-center">
        <button onClick={@refreshHandle} className="btn btn-success pull-left">刷新</button>
        <button onClick={@showReasonHandle} className="btn btn-primary pull-right">显示请假事由</button>
        <h5>引航员轮休明细表({yearMoonth})</h5>
      </div>
      <div className="table-responsive">
	     <table className="table table-bordered">
          <thead>
            {@renderColumns()}
          </thead>
          <tbody>
            {@renderRows()}
            {@renderFooter()}
          </tbody>
          <thead>
            {@renderColumns()}
          </thead>
        </table>
      </div>
    </div>

GXRow = React.createClass
  render:->
    debugger
    index = 1
    day = @props.model.get("GXRQ")[-2..]
    day = parseInt(day)
    cells = for i in [1..@props.monthDays]
      if day is i then value=true else value=false
      <GXCell value={value} />
    <tr>
      <td>{@props.index}</td><td>{@props.model.get("name")}</td>
      {cells}
    </tr>

GXCell = React.createClass
  render:->
    <td>{if @props.value then "1" else ""}</td>


template =
		'gxsqList|20': [{
			'name': '@cname()',
			'GXRQ': '@date(2015-01-dd)',
			'SQSJ': '@date(2015-01-dd)'
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
debugger
React.render <GXTable {...tableProps}></GXTable>,
  document.getElementById 'container'
