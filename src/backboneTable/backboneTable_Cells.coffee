#用coffee的类重写
class  CellBase
  constructor:(@key,@schema)->
    #初始化时根据model和key得到schema，用collection.model取得model
  getDisplayValue :(model)->
    value = model.get(@key) ? ""
  getCellHtml:(model)->
    html = model.get(@key) ? ""
  create:(model)->
    cell = $("<td>")
    cell.data("field",@key)
    cell.html @getCellHtml(model)

  virtualEditControl:(model)->
  commitEditControl:(model)->
    input = @virtualEditControl(model)
    @stopPropagation(input)
    input
  endEdit:->
  stopPropagation:($input)->
    $input.on "click dblclick",(e)->
      e.stopPropagation()
  destroy:->
  getModalValue:(modalView)->
    $.trim @modalView.$el.find("[data-field=#{@key}]").val()
  getEditValue:(cell)->
    input = cell.find("input");
    return input.val()
  template:->
  renderModalField:->



class TextCell extends CellBase
  constructor:(@key,@modelClass)->
    super
  create:(model)->
    $td = super(model)
    $td.css "wordBreak","break-all"
    $td
  virtualEditControl:(model)->
    v = model.get(@key)
    $input = $("<input type='text' class='form-control'/>").val(v)

  template:_.template """<div class="form-group col-md-6 col-sm-12">
          									<label class="col-sm-4 control-label">
						                      <%= schema.title %>
          									</label>
          									<div class="col-sm-8">
          										<input type="text" class="form-control"
                                    data-field="<%= schema.key %>"
      										          placeholder="<%= schema.title %>"
										                <% if(readonly) { %> readonly="readonly" 	<% } %>
										                value="<%= model.get(schema.key) %>">
                              <input/>
          									</div>
        								</div> """
  renderModalField:(model)->
    @template
        model:model
        schema:@schema
        readonly:@schema.readonly


class SelectCell extends CellBase
  constructor:(@key,@schema)->
    super
  getCellHtml:(model)->
    v = model.get(@key)
    temp = _.findWhere @schema.options,{val:v} if v?
    v = temp.label if temp?
    v
  virtualEditControl:(model)->
    $td = @
    $input = $ "<select class='form-control' />"
    if @schema.options[0].dm?
      @schema.options = for i in @schema.options
                          obj =
                            label:i.mc
                            val : i.dm
    $.each @schema.options,(i,v)->
      opt = $ "<option value='#{v.val}'>#{v.label}</option>"
      opt.attr "selected","selected" if v.val is val
      opt.appendTo $input
    $input

  template:_.template """<div class="form-group col-md-6 col-sm-12">
            								<label class="col-sm-4 control-label">
        								        <%= schema.title %>
            								</label>
            								<div class="col-sm-8">
            									<select  class="form-control" data-field="<%= schema.key %>"
            										placeholder="<%= schema.title %>"
            										<% if(readonly) { %>
            											disabled
            										<% } %>
            										value="<%= model.get(schema.key) %>">
            											<% _.each(schema.options,function(item,i){ %>
            												<option value="<%= item.val %>"
            													<% if(item.val == model.get(schema.key)){ %>
            														selected="selected"
            													<% } %>
            												><%= item.label %></options>
            											<% }); %>
            									</select>
            								</div>
            							</div> """
  renderModalField:(model)->
    @template
      model:model
      schema:@schema
      readonly:@schema.readonly


class CheckboxCell extends CellBase
  constructor:(@key,@schema)->
    super
  getCellHtml:(model)->
    v = model.get @key
    v = if v is "1" then '<span class="glyphicon glyphicon-ok" ></span>' else ""
  creat:(model)->
    $td = super(model)
    $td.css "textAlign","center"
    $td
  virtualEditControl:(model)->
    v = model.get @key
    $input = $ "<input type='checkbox'>"
    $input.css
      margin:0
      height:"100%"
      padding:0
      border:0
    $input.prop "checked", true if v is "1"
    $input
  template:_.template """<div class="form-group col-md-6 col-sm-12">
            								<label class="col-sm-4 control-label">
            								<%= schema.title %>
            								</label>
            								<div class="col-sm-8">
            									<input type="checkbox" class="form-control" data-field="<%= schema.key %>"
            									<% if(readonly) { %>
            										readonly="readonly"
            									<% } %>\
                              <% if(model.get(schema.key)==="1"){ %>
                                  checked="checked"
                              <% } %>
            									/>
            								</div>
            							</div> """
  renderModalField:(model)->
    @template
      model:model
      schema:@schema
      readonly:@schema.readonly
  getModalValue:->
    if @modalView.$el.find("[data-field=#{@key}]").prop("checked") then "1" else "0"
  getEditValue:(cell)->
    if cell.prop("checked") then "1" else "0"

class DateTimeCell extends CellBase
  constructor:(@key,@schema)->
    super
  getCellHtml:(model)->
    v = model.get @key
    formatStr = @schema.format ? "yyyy-mm-dd"
    v
  getDisplayValue:(model)->
    v = model.get @key
    formatStr = @schema.format ? "yyyy-mm-dd"
    if v? and $.type(v) isnt "date"
      if v.substr(0,1).indexOf("\/") isnt -1
        v = v.replace("\/","")
        v = v.replace("\/","")
        eval("v = new #{v}")
      else
        if not $.support.leadingWhitespace
          v = new Date(Date.parse(v.replace(/-/g,"/")))
        else
          tmp = v.replace "T"," "
          v = new Date(tmp)
    v
  create:(model)->
    $td = super(model)
    $td.attr "noWrap","noWrap"
    $td
  virtualEditControl:(model)->
    that = @
    v = @model.get(@key) ? ""
    $input = $ "<input class='form-control' form_datetime' type='text' value='#{v}' />"
    @stopPropagation($input)
    format = that.schema.format ? "yyyy-mm-dd"
    setTimeout ->
      $input.datetimepicker
        format:format
        language:"zh-CN"
        weekStart:1
        todayBtn:1
        autoclose:1
        todayHighLight:1
        startView:2
        minView:2
        forceParse:0
      .on "changeDate hide",(ev)->
      $input.datetimepicker("show")
    ,0
    $input
  template:_.template """<div class="form-group col-md-6 col-sm-12">
            								<label class="col-sm-4 control-label">
            								<%= schema.title %>
            								</label>
            								<div class="col-sm-8" >
            									<input class="form-control form_datetime" type="text"
            										data-field="<%= schema.key %>"
            											value="<%= method(schema.key) %> " readonly />
            								</div>
          							</div> """
  renderModalField:(model)->
    that = @
    unless @schema.readonly
      setTimeout ->
        that.modalView.$el.find("[data-field=#{that.key}]").datetimepicker
          format:that.schema.format
          language:"zh-CN"
          weekStart:1
          todayBtn:1
          autoclose:1
          todayHighLight:1
          startView:2
          minView:2
          forceParse:0
      ,0
    @template
      model:model
      schema:@schema
      method:$.proxy that.getDisplayValue,@

#公开类

$.extend Backbone.TableView,
  CellMaker:
      Text: TextCell,
      Checkbox: CheckboxCell,
      DateTime: DateTimeCell,
      Select: SelectCell,
