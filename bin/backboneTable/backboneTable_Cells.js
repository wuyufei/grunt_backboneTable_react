(function() {
  var CellBase, CheckboxCell, DateTimeCell, SelectCell, TextCell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CellBase = (function() {
    function CellBase(key, schema) {
      this.key = key;
      this.schema = schema;
    }

    CellBase.prototype.getDisplayValue = function(model) {
      var ref, value;
      return value = (ref = model.get(this.key)) != null ? ref : "";
    };

    CellBase.prototype.getCellHtml = function(model) {
      var html, ref;
      return html = (ref = model.get(this.key)) != null ? ref : "";
    };

    CellBase.prototype.create = function(model) {
      var cell;
      cell = $("<td>");
      cell.data("field", this.key);
      return cell.html(this.getCellHtml(model));
    };

    CellBase.prototype.virtualEditControl = function(model) {};

    CellBase.prototype.commitEditControl = function(model) {
      var input;
      input = this.virtualEditControl(model);
      this.stopPropagation(input);
      return input;
    };

    CellBase.prototype.endEdit = function() {};

    CellBase.prototype.stopPropagation = function($input) {
      return $input.on("click dblclick", function(e) {
        return e.stopPropagation();
      });
    };

    CellBase.prototype.destroy = function() {};

    CellBase.prototype.getModalValue = function(modalView) {
      return $.trim(this.modalView.$el.find("[data-field=" + this.key + "]").val());
    };

    CellBase.prototype.getEditValue = function(cell) {
      var input;
      input = cell.find("input");
      return input.val();
    };

    CellBase.prototype.template = function() {};

    CellBase.prototype.renderModalField = function() {};

    return CellBase;

  })();

  TextCell = (function(superClass) {
    extend(TextCell, superClass);

    function TextCell(key, modelClass) {
      this.key = key;
      this.modelClass = modelClass;
      TextCell.__super__.constructor.apply(this, arguments);
    }

    TextCell.prototype.create = function(model) {
      var $td;
      $td = TextCell.__super__.create.call(this, model);
      $td.css("wordBreak", "break-all");
      return $td;
    };

    TextCell.prototype.virtualEditControl = function(model) {
      var $input, v;
      v = model.get(this.key);
      return $input = $("<input type='text' class='form-control'/>").val(v);
    };

    TextCell.prototype.template = _.template("<div class=\"form-group col-md-6 col-sm-12\">\n          									<label class=\"col-sm-4 control-label\">\n						                      <%= schema.title %>\n          									</label>\n          									<div class=\"col-sm-8\">\n          										<input type=\"text\" class=\"form-control\"\n                                    data-field=\"<%= schema.key %>\"\n      										          placeholder=\"<%= schema.title %>\"\n										                <% if(readonly) { %> readonly=\"readonly\" 	<% } %>\n										                value=\"<%= model.get(schema.key) %>\">\n                              <input/>\n          									</div>\n</div> ");

    TextCell.prototype.renderModalField = function(model) {
      return this.template({
        model: model,
        schema: this.schema,
        readonly: this.schema.readonly
      });
    };

    return TextCell;

  })(CellBase);

  SelectCell = (function(superClass) {
    extend(SelectCell, superClass);

    function SelectCell(key, schema) {
      this.key = key;
      this.schema = schema;
      SelectCell.__super__.constructor.apply(this, arguments);
    }

    SelectCell.prototype.getCellHtml = function(model) {
      var temp, v;
      v = model.get(this.key);
      if (v != null) {
        temp = _.findWhere(this.schema.options, {
          val: v
        });
      }
      if (temp != null) {
        v = temp.label;
      }
      return v;
    };

    SelectCell.prototype.virtualEditControl = function(model) {
      var $input, $td, i, obj;
      $td = this;
      $input = $("<select class='form-control' />");
      if (this.schema.options[0].dm != null) {
        this.schema.options = (function() {
          var j, len, ref, results;
          ref = this.schema.options;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            results.push(obj = {
              label: i.mc,
              val: i.dm
            });
          }
          return results;
        }).call(this);
      }
      $.each(this.schema.options, function(i, v) {
        var opt;
        opt = $("<option value='" + v.val + "'>" + v.label + "</option>");
        if (v.val === val) {
          opt.attr("selected", "selected");
        }
        return opt.appendTo($input);
      });
      return $input;
    };

    SelectCell.prototype.template = _.template("<div class=\"form-group col-md-6 col-sm-12\">\n	<label class=\"col-sm-4 control-label\">\n        								        <%= schema.title %>\n	</label>\n	<div class=\"col-sm-8\">\n		<select  class=\"form-control\" data-field=\"<%= schema.key %>\"\n			placeholder=\"<%= schema.title %>\"\n			<% if(readonly) { %>\n				disabled\n			<% } %>\n			value=\"<%= model.get(schema.key) %>\">\n				<% _.each(schema.options,function(item,i){ %>\n					<option value=\"<%= item.val %>\"\n						<% if(item.val == model.get(schema.key)){ %>\n							selected=\"selected\"\n						<% } %>\n					><%= item.label %></options>\n				<% }); %>\n		</select>\n	</div>\n</div> ");

    SelectCell.prototype.renderModalField = function(model) {
      return this.template({
        model: model,
        schema: this.schema,
        readonly: this.schema.readonly
      });
    };

    return SelectCell;

  })(CellBase);

  CheckboxCell = (function(superClass) {
    extend(CheckboxCell, superClass);

    function CheckboxCell(key, schema) {
      this.key = key;
      this.schema = schema;
      CheckboxCell.__super__.constructor.apply(this, arguments);
    }

    CheckboxCell.prototype.getCellHtml = function(model) {
      var v;
      v = model.get(this.key);
      return v = v === "1" ? '<span class="glyphicon glyphicon-ok" ></span>' : "";
    };

    CheckboxCell.prototype.creat = function(model) {
      var $td;
      $td = CheckboxCell.__super__.creat.call(this, model);
      $td.css("textAlign", "center");
      return $td;
    };

    CheckboxCell.prototype.virtualEditControl = function(model) {
      var $input, v;
      v = model.get(this.key);
      $input = $("<input type='checkbox'>");
      $input.css({
        margin: 0,
        height: "100%",
        padding: 0,
        border: 0
      });
      if (v === "1") {
        $input.prop("checked", true);
      }
      return $input;
    };

    CheckboxCell.prototype.template = _.template("<div class=\"form-group col-md-6 col-sm-12\">\n	<label class=\"col-sm-4 control-label\">\n	<%= schema.title %>\n	</label>\n	<div class=\"col-sm-8\">\n		<input type=\"checkbox\" class=\"form-control\" data-field=\"<%= schema.key %>\"\n		<% if(readonly) { %>\n			readonly=\"readonly\"\n		<% } %><% if(model.get(schema.key)===\"1\"){ %>\n                                  checked=\"checked\"\n                              <% } %>\n		/>\n	</div>\n</div> ");

    CheckboxCell.prototype.renderModalField = function(model) {
      return this.template({
        model: model,
        schema: this.schema,
        readonly: this.schema.readonly
      });
    };

    CheckboxCell.prototype.getModalValue = function() {
      if (this.modalView.$el.find("[data-field=" + this.key + "]").prop("checked")) {
        return "1";
      } else {
        return "0";
      }
    };

    CheckboxCell.prototype.getEditValue = function(cell) {
      if (cell.prop("checked")) {
        return "1";
      } else {
        return "0";
      }
    };

    return CheckboxCell;

  })(CellBase);

  DateTimeCell = (function(superClass) {
    extend(DateTimeCell, superClass);

    function DateTimeCell(key, schema) {
      this.key = key;
      this.schema = schema;
      DateTimeCell.__super__.constructor.apply(this, arguments);
    }

    DateTimeCell.prototype.getCellHtml = function(model) {
      var formatStr, ref, v;
      v = model.get(this.key);
      formatStr = (ref = this.schema.format) != null ? ref : "yyyy-mm-dd";
      return v;
    };

    DateTimeCell.prototype.getDisplayValue = function(model) {
      var formatStr, ref, tmp, v;
      v = model.get(this.key);
      formatStr = (ref = this.schema.format) != null ? ref : "yyyy-mm-dd";
      if ((v != null) && $.type(v) !== "date") {
        if (v.substr(0, 1).indexOf("\/") !== -1) {
          v = v.replace("\/", "");
          v = v.replace("\/", "");
          eval("v = new " + v);
        } else {
          if (!$.support.leadingWhitespace) {
            v = new Date(Date.parse(v.replace(/-/g, "/")));
          } else {
            tmp = v.replace("T", " ");
            v = new Date(tmp);
          }
        }
      }
      return v;
    };

    DateTimeCell.prototype.create = function(model) {
      var $td;
      $td = DateTimeCell.__super__.create.call(this, model);
      $td.attr("noWrap", "noWrap");
      return $td;
    };

    DateTimeCell.prototype.virtualEditControl = function(model) {
      var $input, format, ref, ref1, that, v;
      that = this;
      v = (ref = this.model.get(this.key)) != null ? ref : "";
      $input = $("<input class='form-control' form_datetime' type='text' value='" + v + "' />");
      this.stopPropagation($input);
      format = (ref1 = that.schema.format) != null ? ref1 : "yyyy-mm-dd";
      setTimeout(function() {
        $input.datetimepicker({
          format: format,
          language: "zh-CN",
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          todayHighLight: 1,
          startView: 2,
          minView: 2,
          forceParse: 0
        }).on("changeDate hide", function(ev) {});
        return $input.datetimepicker("show");
      }, 0);
      return $input;
    };

    DateTimeCell.prototype.template = _.template("<div class=\"form-group col-md-6 col-sm-12\">\n            								<label class=\"col-sm-4 control-label\">\n            								<%= schema.title %>\n            								</label>\n            								<div class=\"col-sm-8\" >\n            									<input class=\"form-control form_datetime\" type=\"text\"\n            										data-field=\"<%= schema.key %>\"\n            											value=\"<%= method(schema.key) %> \" readonly />\n            								</div>\n</div> ");

    DateTimeCell.prototype.renderModalField = function(model) {
      var that;
      that = this;
      if (!this.schema.readonly) {
        setTimeout(function() {
          return that.modalView.$el.find("[data-field=" + that.key + "]").datetimepicker({
            format: that.schema.format,
            language: "zh-CN",
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighLight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
          });
        }, 0);
      }
      return this.template({
        model: model,
        schema: this.schema,
        method: $.proxy(that.getDisplayValue, this)
      });
    };

    return DateTimeCell;

  })(CellBase);

  $.extend(Backbone.TableView, {
    CellMaker: {
      Text: TextCell,
      Checkbox: CheckboxCell,
      DateTime: DateTimeCell,
      Select: SelectCell
    }
  });

}).call(this);
