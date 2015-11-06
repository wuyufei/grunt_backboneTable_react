(function() {
  var List, Model, ReactTable, TableView, list, table, template;

  template = {
    'list|20-30': [
      {
        "ID|+1": 10000,
        "CBID": "@name",
        "BGSJ": '@date',
        "CZR": '@cname',
        "CZSJ": '@date',
        "HC": '@integer(10,30)',
        "LGGM": '@region',
        "LGSJ": '@date',
        "XYGMC": '@region',
        "YDSJ": '@date',
        "QCS": '@integer(10, 30)',
        "HCS": '@integer(10, 30)',
        "QYXCL": '@integer(10, 30)',
        "ZYXCL": '@integer(10, 30)',
        "DSXCL": '@integer(10, 30)',
        "BZ": ''
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
      LGGM: {
        title: "离港港名",
        type: "Text"
      },
      LGSJ: {
        title: "离港时间",
        type: "DateTime"
      },
      XYGMC: {
        title: "下一港港名",
        type: "Text"
      },
      YDSJ: {
        title: "预计抵达下一港时间",
        type: "DateTime"
      },
      QCS: {
        title: "离港时前吃水",
        type: "Text"
      },
      HCS: {
        title: "离港时后吃水",
        type: "Text"
      },
      QYXCL: {
        title: "清油现存量",
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
