Page = React.createClass
  pageClick:(e)->
    debugger
    e.preventDefault()
    e.stopPropagation()
    return if $(e.target).parent().hasClass("disabled")
    pageLength = Math.ceil(@props.collection.length/10)-1
    info = e.target.dataset.number
    if info is "prev"
      pageNum = @props.currentPage-1
    else if info is "next"
      pageNum = @props.currentPage+1
    else
      pageNum = parseInt(info)
    pageNum = 0 if pageNum<0
    pageNum = pageLength if pageNum>pageLength
    if pageNum isnt @props.currentPage
      @props.pageChange(pageNum)
  getPageArray:->
    length = Math.ceil(@props.collection.length/10)-1
    currPage = @props.currentPage
    pages = []
    numbers = [0..length]
    if length>0
      if length>10
        if @props.currentPage>=4
          pages.push(0)
          pages.push("......")
          if currPage<length-4
            pages = pages.concat numbers[currPage-2..currPage+2]
            pages.push "......" if currPage+2<length-5
          pages = pages.concat numbers[-5..-1]
        else
          pages = pages.concat numbers[0..4]
          pages.push "......"
          pages = pages.concat numbers[length-4..-1]
      else
        pages = [0..length]
    pages
  render:->
    pageArray = @getPageArray()
    length = Math.ceil(@props.collection.length/10)-1
    length = 0 if length<0
    pages = for i in pageArray
      <li className={if @props.currentPage is i then "active"}>
        {if i is "......" then <span>......</span> else <a href="#" data-number={i} onClick={@pageClick}>{i+1}</a> }
      </li>
    <nav>
      <ul className="pagination" style={{marginTop:10,marginLeft:5,marginBottom:5}}>
        <li className={if @props.currentPage is 0 then "disabled"}><a href="#"  data-number="prev" onClick={@pageClick}>上一页</a></li>
        {pages}
        <li className={if @props.currentPage is length then "disabled"}><a href="#"  data-number="next" onClick={@pageClick}>下一页</a></li>
      </ul>
    </nav>

window.Page = Page
