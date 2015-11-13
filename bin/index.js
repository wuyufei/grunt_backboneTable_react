(function() {
  var ReactTable, TableView, User, Users, table, template, users;

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
        required: false,
        msg: "请输入出生日期"
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
        title: "傻逼"
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
        "education|1": ["1", "2", "3"],
        "sb|1": ["0", "1"]
      }
    ]
  };

  Mock.mock(/users/, "get", function(options) {
    return Mock.mock(template).list;
  });

  ReactTable = window.ReactTable;

  users.fetch({
    reset: true,
    async: false
  });

  TableView = Backbone.View.extend({
    initialize: function(options) {
      debugger;
      this.listenTo(this.collection, "reset add remove change", this.render.bind(this));
      this.options = {};
      return _.extend(this.options, options);
    },
    selectedRowChange: function(model) {
      return this.trigger("selectedRowChange", model);
    },
    render: function() {
      debugger;
      return React.render(React.createElement(ReactTable, React.__spread({}, this.options, {
        "tableView": this
      })), this.el);
    },
    remove: function() {
      React.unmountComponentAtNode(this.el);
      return TableView.__super__.remove.apply(this, arguments);
    }
  });

  table = new TableView({
    el: $("#container"),
    collection: users,
    readonly: false,
    cellClick: function(model, key) {
      debugger;
    },
    cellDoubleClick: function(model, key) {
      debugger;
      return alert("双击");
    },
    addButtonClick: function(e) {},
    headerButtons: [
      {
        text: "新增",
        command: "add",
        onclick: function(e) {}
      }
    ],
    rowButtons: [
      {
        text: "详情",
        command: "detail",
        onclick: function(model, e) {
          return e.preventDefault();
        }
      }, {
        text: "编辑",
        command: "edit",
        onclick: function(model, e) {}
      }, {
        text: "删除",
        command: "delete",
        onclick: function(model, e) {}
      }, {
        text: "审核",
        command: "verify",
        onclick: function(model, e) {
          debugger;
          return alert("");
        }
      }, {
        text: "删除",
        command: "delete"
      }
    ]
  });

  table.render();


  /*tableProps =
    collection:users
    cellClick:(model,key)->
      debugger
      #alert("单击")
    cellDoubleClick:(model,key)->
      debugger
      alert("双击")
    buttons:[
      {text:"详情", command:"detail"}
      {text:"编辑", command:"edit"}
      {text:"删除", command:"delete"}
      {text:"删除", command:"delete"}
      {text:"删除", command:"delete"}
    ]
  React.render <ReactTable {...tableProps}></ReactTable>,
    document.getElementById 'container'
   */

}).call(this);
