(function() {
  var Cell, Row, Table, addColumnIcon,
    hasProp = {}.hasOwnProperty;

  Table = React.createClass({
    getInitialState: function() {},
    getDefaultProps: function() {},
    propTypes: {
      config: React.PropTypes.array
    },
    componentWillMount: function() {},
    componentDidMount: function() {},
    componentDidUpdate: function() {},
    componentWillUnmount: function() {},
    columnHeaderClickHandler: function(e) {
      var key, sortDir;
      key = e.target.dataset.column;
      if (key === this.state.sortField) {
        sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
      } else {
        sortDir = "asc";
      }
      return this.setState({
        sortField: key,
        sortDir: "asc"
      });
    }
  }, addColumnIcon = function(field) {
    var columnHeaders, k, v;
    if (field === this.state.sortField) {
      if (that.state.sortDir === "asc") {
        React.createElement("i", {
          "className": 'glyphicon glyphicon-sort-by-attributes pull-right'
        });
      } else {
        React.createElement("i", {
          "className": 'glyphicon glyphicon-sort-by-attributes-alt pull-right'
        });
      }
    } else {
      React.createElement("i", null);
    }
    return columnHeaders = (function() {
      var results;
      results = [];
      for (k in schema) {
        if (!hasProp.call(schema, k)) continue;
        v = schema[k];
        results.push(React.createElement("th", {
          "data-column": k,
          "onClick": this.columnHeaderClickHandler
        }, v.title, addColumnIcon(k)));
      }
      return results;
    }).call(this);
  }, {
    sortCollection: function() {
      var sortDir, sortField, sortModels;
      if (this.state.sortField != null) {
        sortField = this.state.sortField;
        sortDir = this.state.sortDir;
        return sortModels = this.props.collection.models.sort(function(a, b) {
          a = a.get(sortField);
          b = b.get(sortField);
          if (a > b) {
            if (sortDir === "asc") {
              return 1;
            } else {
              return -1;
            }
          } else if (a === b) {
            return 0;
          } else {
            if (sortDir === "asc") {
              return -1;
            } else {
              return 1;
            }
          }
        });
      } else {
        return sortModels = this.props.collection.models;
      }
    },
    render: function() {
      var containerStyle, model, rows;
      rows = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = sortModels.length; i < len; i++) {
          model = sortModels[i];
          results.push(React.createElement(Row, {
            "model": model
          }));
        }
        return results;
      })();
      containerStyle = {
        marginBottom: 10,
        borderBottomStyle: "none"
      };
      return React.createElement("div", {
        "className": "panel panel-default",
        "style": containerStyle
      }, React.createElement("div", {
        "className": "panel-heading clearfix"
      }, React.createElement("div", {
        "className": "pull-right",
        "data-range": "headerButtons",
        "style": {
          minHeight: 20
        }
      })), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered table-hover"
      }, React.createElement("thead", null, columnHeaders), React.createElement("tbody", null, rows))));
    }
  });

  Row = React.createClass({
    getInitialState: function() {
      return {
        editCell: null,
        editCellWidth: null
      };
    },
    cellClick: function(e) {
      debugger;
      var key, width;
      key = e.target.dataset.field;
      width = $(React.findDOMNode(this.refs[key + "-cell"])).outerWidth();
      return this.setState({
        editCell: key,
        editCellWidth: width
      });
    },
    inputClick: function(event) {
      debugger;
      return event.stopPropagation();
    },
    inputBlur: function(event) {
      return this.setState({
        editCell: null
      });
    },
    componentDidUpdate: function() {
      debugger;
      if (this.state.editCell !== null) {
        return React.findDOMNode(this.refs[this.state.editCell]).focus();
      }
    },
    valueChange: function(e) {
      var key, value;
      key = e.target.dataset.field;
      value = e.target.value;
      return this.props.handlerValueChange(key, value);
    },
    render: function() {
      var cells, editCellStyle, k, schema, v;
      schema = this.props.model.schema;
      editCellStyle = {
        width: this.state.editCellWidth,
        padding: 1
      };
      cells = (function() {
        var results;
        results = [];
        for (k in schema) {
          if (!hasProp.call(schema, k)) continue;
          v = schema[k];
          if (this.state.editCell === k) {
            results.push(React.createElement("td", {
              "data-field": k,
              "ref": k + "-cell",
              "style": editCellStyle,
              "onClick": this.cellClick.bind(this)
            }, React.createElement("input", {
              "data-field": k,
              "ref": k,
              "type": 'text',
              "onChange": this.valueChange,
              "onClick": this.inputClick,
              "onBlur": this.inputBlur,
              "className": 'form-control',
              "value": this.props.model.get(k)
            })));
          } else {
            results.push(React.createElement("td", {
              "data-field": k,
              "ref": k + "-cell",
              "onClick": this.cellClick
            }, this.props.model.get(k)));
          }
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, cells);
    }
  });

  Cell = React.createClass;

  window.BackboneTable = Table({
    getInitialState: function() {}
  });


  /*TableView = Backbone.View.extend
    tagName:"div"
    className:"panel panel-default"
    attributes:
      style:"margin-bottom:10px;border-bottom-style:none;"
    events:
      "click button[data-method=add]": "addNewRowByModal"
      "click th": "sort"
      "click button[data-method=save]": "saveList"
      "click button[data-method=role]": "roleButtonClick"
    options:
      allowPageing: true
      pageNum:10
      allowSortting: true
      allowMultiRowSelected: false
      buttons:null
    #以下将合并到this中
    sortColumn: null
    editRow: null
    pageView:null
    schema:null
    rowViewList:[]
    #selectedRows: []
    selectedRow:null
    cellMakers:{}
    schema:null
      #allowAddButton: true
      #allowSaveButton: false
      #allowRoleButton: false
      #saveUrl: ""
      #rowViewList: []
    initialize:(options)->
      viewOptions = ["allowPageing","allowSortting","allowMultiRowSelected","buttons"]
      _.extend @options, _.pick(options, viewOptions)
  
      @schema = @collection.model::schema
      @pageView = new TableView.Page {collection:@collection,pageNum:@options.pageNum} if @options.allowPageing
  
      @listenTo @collection,"add sort sync reset",@renderBody,@
      @collection.setSort @options.sortColumn if @options.sortColumn
      #创建单元格对象
      for own k,v of @schema when k isnt "buttons"
        @cellMakers[k] = new Backbone.TableView.CellMaker[v.type](k,v)
  
  
    render:->
      @renderContainer()
      @renderHeaderButtons()
      @renderColumnsHeader()
      @renderBody()
      @renderFooter()
  
    _getPageCollection:->
      #这里假定集合已经是排好序的了
      sIndex = @pageView.pageNum * (@pageView.currPage-1)
      eIndex = sIndex + @pageView.pageNum-1
      pageCollection = @collection.models[sIndex..eIndex]
    renderContainer:->
      @$el.html """<div class="panel-heading clearfix">
                  	<div class="pull-right" data-range="headerButtons">
                      &nbsp;
                  	</div>
                  	<div class="pull-right"></div>
                    </div>
                  <div class="table-responsive" >
                  	<table class="table table-bordered table-hover">
                  		<thead></thead>
                  		<tbody></tbody>
                  	</table>
                  </div> """
  
    renderHeaderButtons:->
        debugger
        buttonContainer = @$el.find "[data-range=headerButtons]"
        if @options.buttons is "default"
          buttonContainer.empty().append '<button class="btn btn-success btn-sm" data-command="add"><span class="glyphicon glyphicon-plus"></span> 新增</button>'
        else if @options.buttons.headerButtons?
          buttonContainer.empty()
          for button in @options.buttons.headerButtons
            btnStyle = button.style ? {className:"btn btn-success",icon:""}
            buttonContainer.append """<button class="btn #{btnStyle.className}" data-command="#{button.command}"><span class="#{btnStyle.icon}"></span>#{button.text}</button>"""
  
    renderColumnsHeader:->
      schema = @collection.model::schema
      tr = $ "<tr style='cursor:pointer;'>"
      $.each schema,(key,val)->
        if key isnt "button" and val.visible isnt false
          $("<th>#{val.title}</th>").data("column",key).appendTo(tr)
      if @.options.buttons?
        tr.append("<td>")
      @$el.find("thead").append(tr)
  
    renderBody:->
      that = @
      _.each @options.rowViewList,(v,i)->
        v.remove().off()
      @options.rowViewList = []
  
      $tbody = @$el.find("table tbody")
      $docFragment = $(document.createDocumentFragment())
      curPageCollection = @_getPageCollection()
  
      selectedModel = _.pluck @options.selectedRows,"model"
      debugger
      buttons = null
      if @options.buttons is "default"
        buttons = [
          {text:"详情", command:"detial"}
          {text:"编辑", command:"edit"}
          {text:"删除", command:"delete"}
        ]
      else if @options.buttons?.rowButtons?
        buttons = @options.buttons.rowButtons
      $.each curPageCollection,(index,value)->
        selected = $.inArray(value,selectedModel) isnt -1
        rowOptions =
          model:value
          tableView:that
          selected:selected
          buttons:buttons
  
        #buttons:that.buttons?.rowButtons
        rowView= new TableView.RowView rowOptions
        that.options.rowViewList.push(rowView)
        $docFragment.append rowView.render().el
      $tbody.empty()
      @options.selectedRow = null
      @options.editRow = null
      $tbody.append $docFragment
  
    renderFooter:->
      return if @options.infinite
      if @pageView and @options.allowPageing
        @$("table").after @pageView.render().el
        @listenTo @pageView,"pageChange",@renderBody,@
  
    cancelEdit:->
      @editRow.cancelEdit() if @editRow
      @options.editRow = null
  
    addNewRow:->
      User = @collection.model
      model = new User null,{collection:@collection}
      @collection.add model
      e = @_triggerEvent.addNewRow.call @,model
      unless e.isDefaultPrevented()
        @renderBody()
      else
        @collection.remove(model)
  
  
    addNewRowByModal:(e)->
      that = @
      event = @_trigger "addButtonClick"
      return if event.isDefaultPrevented()
      e = @_triggerEvent.beforeShowAddNewModal.call @
      return e.isDefaultPrevented()
  
      User = @collection.model
      view = new Backbone.Tableview.Modal
        model:new User null,{collection:that.collection}
        readonly:false
      @_triggerEvent.afterShowAddNowModal.call @,view.model
      view.render()
  
    getColDef:($el)->
      colName = $($el).data("column")
      schema = _.pick(@collection.model::schema,collName)[colName]
      schema?.name = colName
      schema
  
    sort:(e)->
      return unless @options.allowSortting
      target = $ e.currentTarget
      c_name = @getColDef(target).name
      @collection.setSort c_name
      $("th i").remove()
      if @collection.sortDir is "asc"
        target.append "<i class='fa fa-sort-asc pull-right' style='padding-top:6px;'>"
      else
        target.append "<i class='fa fa-sort-desc pull-right'>"
  
    cellDoubleClick:(rowView)->
      @_triggerEvent.cellDoubleClick.call @,rowView.model
  
    cellClick:(rowView)->
      #@_triggerEvent.cellClick.call @,rowView.model
  
    cellBeginEdit:(rowView,fieldSchema)->
      return if @options.readonly
      success = true
      if @editRow
        unless @editRow.endEdit()
          success = false
      #e = @_triggerEvent.cellBeginEdit.call @,rowView.model,fieldSchema
      #rtlVal = false if e.isDefaultPrevented()
      @editRow = rowView if success
      success
  
    cellEndEdit:(rowView,fieldSchema)->
      rtlVal = true
      if @options.editRow
        e = @_triggerEvent.cellEndEdit.call @,rowView.model,fieldSchema
        unless e.isDefaultPrevented()
          unless @options.editRow.endEdit()
            rtlval = false
          else
            rtlval = false
      @options.editRow = null if rtlval?
      return rtlval
  
    cancelEdit:->
      if @options.editRow
        @options.editRow.cellCancelEdit()
        @options.editRow = null
  
    selectRow:(rowView,e)->
      if rowView isnt @selectedRow
        @selectedRow?.removeSelect()
        rowView.selectRow()
        @selectedRow = rowView
  
    _trigger:(eventName,data,target)->
      target?=@
      e = $.Event()
      target.trigger eventName,e,data
      e
  
    _triggerEvent:
      "beforeRowSelectChanged":(model)->
        @_trigger "beforeRowSelected",model
  
      "afterRowSelectChanged":(model)->
        @_trigger "afterRowSelected",model
  
  $.extend Backbone,TableView:TableView
   */

}).call(this);
