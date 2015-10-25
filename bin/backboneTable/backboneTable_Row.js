(function() {
  var Row, RowMixin, RowView,
    hasProp = {}.hasOwnProperty;

  RowMixin = {
    componentDidMount: function() {},
    componentWillUnmount: function() {}
  };

  Row = React.createClass({
    mixins: [RowMixin],
    getInitialState: function() {},
    getDefaultProps: function() {
      return {
        openDropdown: -1
      };
    },
    propTypes: {
      config: React.PropTypes.array
    },
    componentWillMount: function() {},
    componentDidMount: function() {
      var node;
      return node = this.getDOMNode();
    },
    componentWillUnmount: function() {},
    render: function() {
      var k, tds, v;
      tds = (function() {
        var ref, results;
        ref = this.props.model.schema;
        results = [];
        for (k in ref) {
          if (!hasProp.call(ref, k)) continue;
          v = ref[k];
          results.push(React.createElement("td", null));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, tds);
    }
  });

  RowView = Backbone.View.extend({
    tagName: "tr",
    className: "backboneTableRow",
    events: {
      "click button[data-method=detail]": "showDetailForm",
      "click button[data-method=edit]": "showEditForm",
      "click a[data-method=delete]": "deleteRow",
      "click a[data-method=verify]": "verify",
      "click >td": "cellClick",
      "dblclick": "cellDoubleClick",
      "click button[data-method=deleteRow]": "deleteRow",
      "click button[data-method=selectImportRow]": "selectImportRow"
    },
    options: {
      readonly: false
    },
    selected: false,
    tableView: null,
    cellMakers: null,
    initialize: function(options) {
      var viewProp;
      viewProp = ["tableView", "cellMakers", "selected", "buttons"];
      _.extend(this, _.pick(options, viewProp));
      this.cellMakers = this.tableView.cellMakers;
      this.options.readonly = this.tableView.options.readonly;
      this.listenTo(this.model, "change", this.render, this);
      this.listenTo(this.model, "destroy", this.remove, this);
      this.on("_afterRowSelected", function() {
        return that.$el.addClass("active");
      });
      return this._setSelectable(this.$el, false);
    },
    _setSelectable: function(obj, enabled) {

      /*if enabled
        obj.removeAttr("unselectable").removeAttr("onselectstart").css("-moz-user-select", "").css("-webkit-user-select", "")
      else
        obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("-moz-user-select", "none").css("-webkit-user-select", "none")
       */
    },
    renderButtons: function() {
      var btnStyle, button, buttonContainer, buttonListContainer, i, index, len, ref, ref1, ref2, style, tdWidth;
      if (!this.buttons) {
        return;
      }
      style = {
        detail: {
          className: "btn-info",
          icon: "glyphicon glyphicon-list"
        },
        edit: {
          className: "btn-primary",
          icon: "glyphicon glyphicon-edit"
        },
        "delete": {
          className: "btn-danger",
          icon: "glyphicon glyphicon-trash"
        },
        defaults: {
          className: "btn-info",
          icon: "glyphicon glyphicon-list"
        }
      };
      buttonListContainer = null;
      if ((this.buttons != null)) {
        if (this.buttons.length <= 3) {
          tdWidth = 63 * this.buttons.length;
        } else {
          tdWidth = 220;
        }
        buttonContainer = $("<td nowrap=\"noWrap\" style=\"width:" + tdWidth + "px;\">");
        index = 0;
        ref = this.buttons;
        for (i = 0, len = ref.length; i < len; i++) {
          button = ref[i];
          debugger;
          btnStyle = (ref1 = (ref2 = button.style) != null ? ref2 : style[button.command]) != null ? ref1 : style.defaults;
          if (index < 2) {
            buttonContainer.append("  <button class=\"btn btn-xs " + btnStyle.className + "\" data-command=\"" + button.command + "\" style=\"margin-right:5px;\">\n  <span class=\"" + btnStyle.icon + " \"></span> " + button.text + "\n</button> ");
          } else if (index === 2) {

            /*buttonContainer.append """<div class="btn-group">
                                        <button type="button" class="btn btn-xs btn-primary  dropdown-toggle" data-toggle="dropdown">
                                          更多 <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
              												    <li><a href="#" data-command="#{button.command}">#{button.text}</a></li>
              											    </ul>
                                      </div> """
             */
            buttonContainer.append("<div class=\"btn-group\">\n  <button class=\"btn btn-xs " + btnStyle.className + "\" data-command=\"" + button.command + "\">\n    <span class=\"" + btnStyle.icon + " \"></span> " + button.text + "\n  </button>\n\n</div> ");
            if (this.buttons.length > 3) {
              buttonContainer.find(".btn-group").append("<button type=\"button\" class=\"btn btn-xs btn-danger  dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n  <span class=\"caret\"></span>\n  <span class=\"sr-only\">Toggle Dropdown</span>\n</button>\n<ul class=\"dropdown-menu\" role=\"menu\">\n</ul> ");
              buttonListContainer = buttonContainer.find(".dropdown-menu");
            }
          } else if (index > 2) {
            buttonListContainer.append("<li><a href=\"#\" data-command=\"" + button.command + "\">" + button.text + "</a></li>");
          }
          index++;
        }
        return this.$el.append(buttonContainer);
      }
    },
    render: function() {
      var key, ref, that, val;
      that = this;
      this.$el.empty();
      ref = this.model.schema;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        val = ref[key];
        if (key in this.cellMakers) {
          this.cellMakers[key].create(this.model).appendTo(this.$el);
        }
      }
      if (this.options.selected) {
        this.$el.addClass("active");
      }
      this.renderButtons();
      return this;
    },
    removeSelect: function() {
      this.$el.removeClass("active");
      return this.options.selected = false;
    },
    selectRow: function() {
      this.$el.addClass("active");
      return this.options.selected = true;
    },
    _commitEditControl: function(fieldSchema) {
      var cell;
      return cell = this.cellMakers[fieldSchema.key].commitEditControl(this.model);
    },
    cellClick: function(e) {
      debugger;
      var cell, fieldSchema;
      this.tableView.selectRow(this, e);
      cell = $(e.currentTarget);
      fieldSchema = this._getFieldSchemaByCell(cell);
      if (!((fieldSchema != null) || fieldSchema.readonly === true)) {
        return;
      }
      if (this.tableView.cellBeginEdit(this, fieldSchema)) {
        this.beginEdit(cell, fieldSchema);
      }
      return this.tableView.cellClick(this);
    },
    _getFieldSchemaByCell: function(cell) {
      var fieldSchema, key;
      key = cell.data("field");
      fieldSchema = this.model.schema[key];
      fieldSchema.key = key;
      return fieldSchema;
    },
    beginEdit: function(cell, fieldSchema) {
      var input, that;
      that = this;
      cell.empty();
      cell.attr("editor", "true");
      cell.css("padding", "2px");
      cell.width(cell.width());
      input = this._commitEditControl(fieldSchema);
      input.appendTo(cell).focus();
      if (fieldSchema.type !== "DateTime") {
        return input.on("blur", function(e) {
          that.tableView.cellEndEdit(that, fieldSchema);
          e.preventDefault();
          return e.stopImmediatePropagation();
        });
      }
    },
    commitEditValue: function(cell) {
      var input, isValidated, schema, setValue, value;
      isValidated = true;
      schema = this._getFieldSchemaByCell(cell);
      input = cell.find("input");
      value = this.cellMakers[schema.key].getEditValue(cell);
      setValue = (function(_this) {
        return function(dtd) {
          _this.model.on("invalid", function(model, error) {
            if (error[schema.key]) {
              return dtd.reject(model, error);
            }
          });
          _this.model.set(schema.key, value, {
            validate: true,
            silent: true
          });
          _this.model.off("invalid");
          return dtd.resolve();
        };
      })(this);
      $.Deferred(setValue).done(function() {
        var popover;
        popover = input.data("bs.popover");
        if (popover != null) {
          return popover.destroy();
        }
      }).fail(function() {
        var popover;
        popover = input.data('bs.popover');
        if (popover != null) {
          input.focus();
          return popover.show();
        } else {
          input.popover({
            content: error[schema.key],
            placement: "auto"
          });
          return input.focus().popover("show");
        }
      });
      return isValidated;
    },
    endEdit: function() {
      var cell, schema;
      cell = this.$el.find("[editor=true]");
      schema = this._getFieldSchemaByCell(cell);
      if (this.commitEditValue(cell)) {
        cell.empty();
        return cell.replaceWith(this.cellMakers[schema.key].create(this.model));
      }

      /*
      that = @
      $td = @$el.find("[editor=true]")
      $input = $($td.children()[0])
      inputValue = $input.val()
      if $input.is("[type=checkbox]")
        if $input.is(":checked")
          inputValue = "1"
        else
          inputValue = "0"
      fieldSchema = @_getFieldSchemaByCell($td)
      valudated = true
      validPrompt = new $.Deferred()
      validPrompt.done ->
        that.model.set fieldSchema.key,inputValue
        popover = $input.data "bs.popover"
        if popover isnt null
          popover.destroy()
      
        if fieldSchema.type is "DateTime"
          datetimepicker = $td.find("input").datetimepicker("remove")
        $td.removeAttr "editor"
        $td.removeAttr "style"
        $td.css "width","auto"
        $td.empty()
        key = fieldSchema.key
        if fieldSchema.key is "Checkbox"
          $td.css "textAlign","center"
          $(that.cellControls[key].getDisplayValue()).appendTo($td)
        else
          $td.text(that.cellControls[key].getDisplayValue())
      validPrompt.fail (model,error)->
        setTimeout ->
          popover = $input.data('bs.popover')
          if popover
            $input.focus()
            popover.show()
          else
            $input.popover
              content:error[fieldSchema.key]
              placement:"auto"
            $input.focus()
            $input.popover "show"
        ,0
        validated = false
      
      that.model.once "invalid",(model,error)->
        validPrompt.reject(model,error) if error[fieldSchema.key]
      that.model.set fieldSchema.key,inputValue,{validate:true}
      validPrompt.resolve()
      validated
       */
    },
    cellCancelEdit: function() {
      var $td, fieldSchema, prev, that;
      that = this;
      $td = this.el.parent().find("[editor=true]");
      if ($td.length === 0) {
        return;
      }
      fieldSchema = this._getFieldSchemaByCell($td);
      $td.removeAttr("editor");
      $td.removeAttr("style");
      $td.css("width", "auto");
      $td.empty();
      if (this.model.hasChanged(fieldSchema.key)) {
        prev = this.model.previous(fieldSchema.key);
        this.model.set(fieldSchema.key, prev);
      }
      if (fieldSchema.type === "Checkbox") {
        $td.css("textAlign", "center");
        return $(that.cellControls[fieldSchema.key].getDisplayValue()).appendTo($td);
      } else {
        return $td.text(that.cellControls[fieldSchema.key].getDisplayValue());
      }
    },
    showDetailForm: function(e) {
      var event;
      event = this.options.tableView._trigger("detialButtonClick", this.model);
      if (event.isDefaultPrevented()) {
        return;
      }
      return new Backbone.TableView.Modal({
        model: this.model,
        readonly: true
      }).render();
    },
    showEditForm: function(e) {
      var event;
      event = this.options.tableView._trigger("editButtonClick", this.model);
      if (event.isDefaultPrevented()) {
        return;
      }
      return new Backbone.TableView.Modal({
        model: this.model,
        readonly: false
      }).render();
    },
    deletedRow: function(e) {
      var event, modalView, that;
      that = this;
      event = this.options.tableView._trigger("deleteButtonClick", this.model);
      if (event.isDefaultPrevented()) {
        return;
      }
      modalView = new Backbone.modalView({
        contentText: "确认删除数据吗?"
      });
      modalView.render();
      return modalView.on("confirmButtonClick", function(e) {
        return that.model.destroy({
          wate: true
        });
      });
    },
    selectImportRow: function(e) {
      var event;
      return event = this.options.tableView._trigger("selectImportRow", this.model);
    },
    verify: function(e) {
      return this.options.tableView.verify(this);
    },
    cellDoubleClick: function(e) {
      return this.options.tableView.cellDoubleClick(this);
    }
  });

  $.extend(Backbone.TableView, {
    RowView: RowView
  });

}).call(this);
