(function() {
  var List, Model, ReactTable, TableView, list, table, template;

  template = {
    'list|20-30': [
      {
        'ID|+1': 10000,
        'WTF': '@cname',
        "CBID": '@cname',
        'HWMC': '@cname',
        'QSG': '@region',
        'MDG': '@region',
        'ZCSJ': '@date',
        'YDQX': '@date',
        'CYFY': '@integer(100000, 900000)'
      }
    ]
  };

  Mock.mock(/users/, "get", function(options) {
    debugger;
    return Mock.mock(template).list;
  });

  Mock.mock("/users/", "delete", function(options) {
    debugger;
    return {
      result: true
    };
  });

  $("#btnSearch").click(function() {
    return list.fetch({
      reset: true,
      async: false,
      success: function(data) {
        debugger;
      }
    });
  });

  Model = Backbone.Model.extend({
    idAttribute: "id",
    urlRoot: "/users",
    validation: {},
    schema: {
      WTF: {
        title: "委托方",
        type: "Text"
      },
      CBID: {
        title: "船舶",
        type: "Text"
      },
      HWMC: {
        title: "货物名称",
        type: "Text"
      },
      QSG: {
        title: "起始港",
        type: "Text"
      },
      MDG: {
        title: "目的港",
        type: "Text"
      },
      ZCSJ: {
        title: "装船时间",
        type: "DateTime"
      },
      YDQX: {
        title: "运到期限",
        type: "DateTime"
      },
      CYFY: {
        title: "船运费用",
        type: "Text"
      }
    }
  });

  List = Backbone.Collection.extend({
    url: "/users",
    model: Model
  });

  list = new List();

  list.fetch({
    reset: true,
    async: false,
    success: function(data) {
      debugger;
    }
  });

  ReactTable = window.ReactTable;

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

  list.fetch({
    reset: true,
    async: false
  });

  table = new TableView({
    el: $("#backboneTable"),
    collection: list,
    readonly: true,
    cellClick: function(model, key) {},
    cellDoubleClick: function(model, key) {},
    headerButtons: [
      {
        text: "新增",
        command: "add"
      }
    ],
    rowButtons: [
      {
        text: "详情",
        command: "detail"
      }, {
        text: "编辑",
        command: "edit"
      }, {
        text: "删除",
        command: "delete"
      }, {
        text: "审核",
        command: "verify",
        onClick: function(model) {
          debugger;
          return alert("");
        }
      }
    ]
  });

  table.render();

}).call(this);
