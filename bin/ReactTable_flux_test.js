(function() {
  var Breadcrumb, BreadcrumbItem, Button, Col, Grid, Input, Modal, Overlay, Popover, ReactTable, Row, User, Users, table, template, users;

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
        readonlyOnModal: false,
        visible: false
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
          onclick: function(e) {}
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

}).call(this);
