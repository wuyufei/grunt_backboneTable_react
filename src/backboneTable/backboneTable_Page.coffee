pageView = Backbone.View.extend
  tagName:"ul"
  className:"list-group"
  attributes:
      style:"margin-bottom:0px;"
  currPage:1
  pageNum:10
  events:
      "click a":"pageClick"
  initialize:(options)->
    viewOptions = ["pageNum"]
    _.extend @,_.pick(options,viewOptions)
    @listenTo(@collection,"sort add remove reset",@sort,@)
  _getPagesArray:->
    pageCount = Math.ceil(@collection.length/@pageNum)
    pageArray = (i for i in [1..pageCount]) if pageCount>0
    pageArray ? []
  template:_.template """
                        <li class="list-group-item" style="padding-top:0px;padding-bottom:0px;">
                          <ul class="pagination square">
                            <li data-button="prev">
                              <a href="#">上一页</a>
                            </li>
                          <% _.each(items,function(item,index){ %>
                            <li <%= index+1 === currPage ? 'class="active"':'' %>>
                              <a href="#"><%= item %></a>
                            </li>
                          <% }); %>
                            <li data-button="next">
                              <a href="#">下一页</a>
                            </li>
                          </ul>
                        </li> """
  render:->
    that = @
    pages = @_getPagesArray()
    if pages.length >0
      pageCount = _.last(pages) ? 0
      @currPage = pageCount if @currPage>pageCount
      @$el.html @template(items:pages,currPage:@currPage)
      $("[data-button=prev]").addClass("disabled") if @currPage is 1
      $("[data-button=next]").addClass("disabled") if @currPage is pageCount
    @
  sort:(e)->
    @currPage = 1
    @render()
  pageClick:(e)->
    e.preventDefault()
    $target = $(e.currentTarget)
    txt = $.trim($target.text())
    return if $target.parent().hasClass("disabled") or parseInt(txt) is @currPage
    switch txt
      when "上一页"
        @trigger "pageChange",--@currPage
      when "下一页"
        @trigger "pageChange",++@currPage
      else
        @currPage = parseInt(txt)
        @trigger "pageChange",txt
    @render()

$.extend Backbone.TableView,{Page:pageView}
