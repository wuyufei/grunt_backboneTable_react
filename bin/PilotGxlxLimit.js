(function() {
  var List, Model, ReactTable, list, table, tableOption;

  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  $("#btnSearch").click(function() {
    var data;
    data = {
      start: $("#startTime").val(),
      end: $("#endTime").val()
    };
    return list.fetch({
      reset: true,
      data: data
    });
  });

  Model = Backbone.Model.extend({
    idAttribute: "ID",
    urlRoot: "/PilotGxlxLimit.ashx",
    validation: {
      DTSTART: {
        required: true,
        msg: "请输入开始日期"
      },
      DTEND: {
        required: true,
        msg: "请输入结束日期"
      },
      NUCOUNT: {
        required: true,
        msg: "请输入最大天数"
      }
    },
    schema: {
      DTSTART: {
        title: "开始日期",
        type: "DateTime"
      },
      DTEND: {
        title: "结束日期",
        type: "DateTime"
      },
      NUCOUNT: {
        title: "允许最大天数",
        type: "Text"
      }
    }
  });

  List = Backbone.Collection.extend({
    url: "/PilotGxlxLimit.ashx",
    model: Model
  });

  list = new List();

  ReactTable = window.ReactTable;

  tableOption = {
    el: $("#backboneTable"),
    collection: list,
    readonly: true,
    displayedPageRecordLength: 10,
    displayedPagesLength: 10,
    allowPage: true,
    sortField: "DTSTART",
    sortDir: "desc",
    buttons: {
      headerButtons: {
        add: {
          text: "新增"
        }
      },
      rowButtons: {
        "detail": {
          text: "详情"
        },
        "edit": {
          text: "编辑"
        },
        "delete": {
          text: "删除"
        }
      }
    }
  };

  table = new BackboneTable(tableOption);

  table.render();

}).call(this);
