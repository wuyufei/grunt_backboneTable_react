(function() {
  var List, Model, ReactTable, TableView, list, table, template;

  template = {
    'list|20-30': [
      {
        "ID|+1": 10000,
        "CBID": function() {
          return '@name';
        },
        "BGSJ": '@date',
        "CZR": '@cname',
        "CZSJ": '@date',
        "HC": '@integer(10,30)',
        "DDGGM": '@region',
        "DGRQ": '@date',
        "HWMC": '@cname',
        "ZHL": '@integer(1000, 3000)',
        "XHL": '@integer(1000, 3000)',
        "QCS": '@integer(10, 30)',
        "HCS": '@integer(10, 30)',
        "QYXCL": '@integer(10, 30)',
        "ZYXCL": '@integer(10, 30)',
        "DSXCL": '@integer(10, 30)',
        "YJKBSJ": '@date',
        "YFLBSJ": '@date',
        "DLLXFS": '深圳77778899',
        "BZ": '注意'
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
      CBID: {
        title: "船舶",
        type: "Text"
      },
      BGSJ: {
        title: "报告日期",
        type: "DateTime"
      },
      CZR: {
        title: "操作人",
        type: "Text"
      },
      CZSJ: {
        title: "操作时间",
        type: "DateTime"
      },
      HC: {
        title: "航次号",
        type: "Text"
      },
      DDGGM: {
        title: "抵达港港名",
        type: "Text"
      },
      DGRQ: {
        title: "抵港日期及时间",
        type: "DateTime"
      },
      HWMC: {
        title: "货物名称",
        type: "Text"
      },
      ZHL: {
        title: "装货量",
        type: "Text"
      },
      XHL: {
        title: "卸货量",
        type: "Text"
      },
      QCS: {
        title: "前吃水",
        type: "Text"
      },
      HCS: {
        title: "后吃水",
        type: "Text"
      },
      QYXCL: {
        title: "轻油现存量",
        type: "Text"
      },
      ZYXCL: {
        title: "重油现存量",
        type: "Text"
      },
      DSXCL: {
        title: "淡水现存量",
        type: "Text"
      },
      YJKBSJ: {
        title: "预计靠泊时间",
        type: "DateTime"
      },
      YFLBSJ: {
        title: "预计离泊时间",
        type: "DateTime"
      },
      DLLXFS: {
        title: "代理/调度联系方式",
        type: "Text"
      },
      BZ: {
        title: "备注",
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
    buttons: [
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
