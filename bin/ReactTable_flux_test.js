(function() {
  var Breadcrumb, BreadcrumbItem, Button, Col, Form, FormView, Grid, Input, Modal, Overlay, Popover, ReactTable, Row, User, Users, table, template, users;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover;

  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  User = Backbone.Model.extend({
    idAttribute: "id",
    urlRoot: "/users",
    defaults: {
      name: "",
      age: 0,
      Birthday: "1900-01-01",
      education: ""
    },
    validation: {
      name: {
        required: true,
        msg: "请输入姓名"
      },
      age: {
        required: true,
        msg: "请输入年龄"
      },
      birthday: {
        required: true,
        msg: "请输入出生日期"
      },
      updateDate: {
        required: false,
        msg: "请输入升级日期"
      },
      education: {
        required: true,
        msg: "请选择学历"
      }
    },
    schema: {
      name: {
        type: "Text",
        title: "姓名",
        readonly: true,
        readonlyOnModal: false
      },
      age: {
        type: "Text",
        title: "年龄"
      },
      birthday: {
        type: "DateTime",
        title: "出生日期",
        format: "yyyy-mm-dd"
      },
      education: {
        title: "学历",
        type: "Select",
        options: [
          {
            val: "",
            label: ""
          }, {
            val: "1",
            label: "大专"
          }, {
            val: "2",
            label: "本科"
          }, {
            val: "3",
            label: "硕士"
          }
        ]
      },
      sb: {
        type: "Checkbox",
        title: "工作标志",
        width: 80
      }
    }
  });

  Users = Backbone.Collection.extend({
    url: "/users",
    model: User
  });

  users = new Users;

  template = {
    'list|200': [
      {
        'id|+1': 10000,
        'name': "@cname",
        "age": "@integer(10,80)",
        "birthday": "@date",
        "education|1": ["", "1", "2", "3"],
        "sb|1": ["0", "1"]
      }
    ]
  };

  Mock.mock(/users/, "get", function(options) {
    return Mock.mock(template).list;
  });

  ReactTable = window.ReactTable;

  $("#btnSearch").click(function() {
    return users.fetch({
      reset: true
    });
  });

  table = new BackboneTable({
    el: $("#table"),
    collection: users,
    readonly: false,
    displayedPageRecordLength: 10,
    displayedPagesLength: 10,
    allowPage: true,
    allowSorting: true,
    cellClick: function(model, key) {
      debugger;
    },
    cellDoubleClick: function(model, key) {
      debugger;
      return alert("双击");
    },
    buttons: {
      headerButtons: {
        add: {
          text: "新增",
          onclick: function(model, e) {}
        }
      },
      rowButtons: {
        detail: {
          text: "详情",
          onclick: function(e) {}
        },
        edit: {
          text: "编辑",
          onclick: function(model, e) {
            var form;
            e.preventDefault();
            form = new Form({
              model: model
            });
            return form.render();
          }
        },
        "delete": {
          text: "删除",
          onclick: function(e) {}
        },
        verify: {
          text: "审核",
          onclick: function(model, e) {
            debugger;
            alert(model);
            return e.preventDefault();
          }
        }
      }
    }
  });

  table.render();

  FormView = Backbone.View.extend({
    tagName: "div",
    className: "modal fade",
    events: {
      "click [data-command=save]": "save"
    },
    initialize: function(options) {
      return this.options = _.extend({}, options);
    },
    bindingData: function() {
      var control, i, item, k, len, ref, ref1, results, that, v;
      that = this;
      ref = this.model.schema;
      results = [];
      for (k in ref) {
        v = ref[k];
        control = this.$el.find("[data-field=" + k + "]");
        switch (v.type.toLowerCase()) {
          case "text":
            results.push(control.val(this.model.get(k)));
            break;
          case "select":
            ref1 = this.model.schema[k].options;
            for (i = 0, len = ref1.length; i < len; i++) {
              item = ref1[i];
              control.append("<option value=\"" + item.val + "\">" + item.label + "</option> ");
            }
            results.push(control.val(this.model.get(k)));
            break;
          case "datetime":
            control.val(this.model.get(k));
            results.push(setTimeout((function(control) {
              return function() {
                var format, ref2;
                format = (ref2 = that.model.schema[k].format) != null ? ref2 : "yyyy-mm-dd";
                return control.datetimepicker({
                  format: format,
                  language: "zh-CN",
                  weekStart: 1,
                  autoclose: 1,
                  todayHighLight: 1,
                  startView: 2,
                  minView: 2,
                  forceParse: 0,
                  todayBtn: true,
                  pickerPosition: "bottom-right"
                });
              };
            })(control), 500));
            break;
          case "checkbox":
            if (this.model.get(k) === "1") {
              results.push(control.prop("checked", true));
            } else {
              results.push(void 0);
            }
            break;
          default:
            results.push(control.val(this.model.get(k)));
        }
      }
      return results;
    },
    validate: function() {
      var el, error, isValidate, k, ref, v, val;
      isValidate = true;
      val = {};
      ref = this.model.schema;
      for (k in ref) {
        v = ref[k];
        el = this.$el.find("[data-field=" + k + "]");
        el.popover("destroy");
        if (el.length > 0) {
          val[k] = el.val();
        }
      }
      error = this.model.validate(val);
      if (error) {
        isValidate = false;
        for (k in error) {
          v = error[k];
          el = this.$el.find("[data-field=" + k + "]");
          el.popover({
            content: v,
            placement: "auto"
          });
          el.popover("show");
        }
      }
      return isValidate;
    },
    save: function() {
      debugger;
      if (this.validate()) {
        return alert("保存");
      }
    },
    formTemplate: _.template(" "),
    template: _.template("<div class=\"modal-dialog modal-lg\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <h4 class=\"modal-title\">详情</h4>\n    </div>\n    <div class=\"modal-body\">\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-primary\" data-command=\"save\">保存</button>\n      <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>\n    </div>\n  </div>\n</div>"),
    render: function() {
      this.$el.append(this.template());
      debugger;
      this.$el.find(".modal-body").append(this.formTemplate({
        model: this.model
      }));
      this.$el.modal("show");
      this.bindingData();
      return typeof this.renderComplete === "function" ? this.renderComplete() : void 0;
    }
  });

  Form = FormView.extend({
    formTemplate: _.template(" <div class=\"row\">\n  <form class=\"form-horizontal\" role=\"form\">\n    <div class=\"col-md-6 col-sm-12\" style=\"margin-top:10px;\">\n      <label class=\"col-sm-4 control-label\">姓名</label>\n      <div class=\"col-sm-8\">\n        <input type=\"text\" class=\"form-control\" data-field=\"name\" />\n      </div>\n    </div>\n    <div class=\"col-md-6 col-sm-12\" style=\"margin-top:10px;\">\n      <label class=\"col-sm-4 control-label\">年龄</label>\n      <div class=\"col-sm-8\">\n        <input type=\"text\" class=\"form-control\" data-field=\"age\"  />\n      </div>\n    </div>\n    <div class=\"col-md-6 col-sm-12\" style=\"margin-top:10px;\">\n      <label class=\"col-sm-4 control-label\">出生日期</label>\n      <div class=\"col-sm-8\">\n        <input type=\"text\" class=\"form-control\" data-field=\"birthday\"  />\n      </div>\n    </div>\n    <div class=\"col-md-6 col-sm-12\" style=\"margin-top:10px;\">\n      <label class=\"col-sm-4 control-label\">学历</label>\n      <div class=\"col-sm-8\">\n        <select type=\"select\" class=\"form-control\" data-field=\"education\"/>\n      </div>\n    </div>\n    <div class=\"checkbox\">\n      <label class=\"\">\n        <input type=\"checkbox\" data-field=\"sb\" label=\"工作标志\" class=\"\">\n          <span>工作标志</span>\n        </label>\n    </div>\n    <div class=\"col-md-12 col-sm-12\" style=\"margin-top:10px;\">\n      <label class=\"col-sm-2 control-label\">途经港</label>\n      <div class=\"col-sm-10\" data-container=\"tjg\">\n\n      </div>\n    </div>\n  </form>\n</div>  "),
    renderComplete: function() {
      var that, tjgContainer;
      that = this;
      tjgContainer = this.$el.find("[data-container=tjg]");
      tjgContainer.on("click", "[data-command=remove]", function(e) {
        var span;
        if (tjgContainer.find(".input-group").length <= 1) {
          return;
        }
        $(this).closest(".input-group").remove();
        span = tjgContainer.children(".input-group").last().find("span").first();
        if (span.has("[data-command=add]").length < 1) {
          return span.append("<button type=\"button\" class=\"btn btn-default\" data-command=\"add\">\n <span class=\"glyphicon glyphicon-plus\"></span>\n</button> ");
        }
      });
      tjgContainer.on("click", "[data-command=add]", function(e) {
        tjgContainer.find("[data-command=add]").remove();
        return tjgContainer.append("<div class=\"input-group col-md-3\" style=\"float:left;\">\n  <input type=\"text\" data-cid=\"c405\" class=\"dtpControl_birthday form_datetime form-control\">\n  <span class=\"input-group-btn\">\n    <button type=\"button\" class=\"btn btn-default\" data-command=\"remove\">\n      <span class=\"glyphicon glyphicon-remove\"></span>\n    </button>\n    <button type=\"button\" class=\"btn btn-default\" data-command=\"add\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n    </button>\n  </span>\n</div> ");
      });
      return tjgContainer.append("<div class=\"input-group col-md-3\" style=\"float:left;\">\n  <input type=\"text\" data-cid=\"c405\" class=\"dtpControl_birthday form_datetime form-control\">\n  <span class=\"input-group-btn\">\n    <button type=\"button\" class=\"btn btn-default\" data-command=\"remove\">\n      <span class=\"glyphicon glyphicon-remove\"></span>\n    </button>\n    <button type=\"button\" class=\"btn btn-default\" data-command=\"add\">\n      <span class=\"glyphicon glyphicon-plus\"></span>\n    </button>\n  </span>\n</div> ");
    }
  });

}).call(this);
