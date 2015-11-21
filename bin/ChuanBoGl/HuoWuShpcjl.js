(function() {
  var List, Model, ReactTable, TableView, list, table, template;

  template = {
    'list|20-30': [
      {
        'ID|+1': 10000,
        'RQ': '@date',
        "CBID": '@name',
        'HC': '@name',
        "ZG": '@region',
        'GK': '@region',
        "XG": '@region',
        "HP": '@region',
        "YJ": '@integer(100000, 900000)',
        "SJLZ": '@integer(100000, 900000)',
        "SJLX": '@integer(100000, 900000)',
        "YXSH": '@integer(100000, 900000)',
        "SHL": '@integer(100000, 900000)',
        "DSL": '@integer(100000, 900000)',
        "CHL": '@integer(100000, 900000)',
        "DJ": '@integer(100000, 900000)',
        "ZYF": '@integer(100000, 900000)',
        "PCE": '@integer(100000, 900000)',
        "JYYF": '@integer(100000, 900000)',
        "HTF": '@integer(100000, 900000)',
        "CBLX|1": ["集装箱船", "散货船"]
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
      RQ: {
        title: "日期",
        type: "DateTime",
        format: "yyyy-mm-dd"
      },
      CBID: {
        title: "船舶",
        type: "Text"
      },
      HC: {
        title: "航次",
        type: "Text"
      },
      ZG: {
        title: "装港",
        type: "Text"
      },
      XG: {
        title: "卸港",
        type: "Text"
      },
      HP: {
        title: "货品",
        type: "Text"
      },
      YJ: {
        title: "运价",
        type: "Text"
      },
      SJLZ: {
        title: "商检量/装",
        type: "Text"
      },
      SJLX: {
        title: "商检量/卸",
        type: "Text"
      },
      YXSH: {
        title: "允许损耗",
        type: "Text"
      },
      SHL: {
        title: "损耗量",
        type: "Text"
      },
      DSL: {
        title: "定损量",
        type: "Text"
      },
      DSL: {
        title: "超耗量",
        type: "Text"
      },
      DSL: {
        title: "单价",
        type: "Text"
      },
      DSL: {
        title: "总运费",
        type: "Text"
      },
      DSL: {
        title: "赔偿额",
        type: "Text"
      },
      DSL: {
        title: "结余运费",
        type: "Text"
      },
      DSL: {
        title: "合同方",
        type: "Text"
      },
      DSL: {
        title: "船舶类型",
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
