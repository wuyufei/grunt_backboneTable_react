(function() {
  var List, Model, ReactTable, TableView, list, table, template;

  template = {
    'list|20-30': [
      {
        'ID|+1': 10000,
        'KBRQ': '@date',
        "CBID": '@name',
        'HC': '@name',
        "GK": '@region',
        'HX': '@region',
        "JE": '@integer(100000, 900000)',
        "LPJE": '@integer(100000, 900000)',
        "CE": '@integer(100000, 900000)',
        "FKNR": '@region',
        "LPSJ": '@date',
        "FKDW": '@region'
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
      KBRQ: {
        title: "靠泊日期",
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
      GK: {
        title: "港口",
        type: "Text"
      },
      HX: {
        title: "航线",
        type: "Text"
      },
      JE: {
        title: "金额",
        type: "Text"
      },
      LPJE: {
        title: "来票金额",
        type: "Text"
      },
      CE: {
        title: "差额",
        type: "Text"
      },
      FKNR: {
        title: "付款内容",
        type: "Text"
      },
      LPSJ: {
        title: "来票时间",
        type: "DateTime"
      },
      FKDW: {
        title: "付款单位",
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
