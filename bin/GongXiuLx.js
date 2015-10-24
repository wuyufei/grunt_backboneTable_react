(function() {
  var Collection, GXCell, GXRow, GXTable, Model, list, tableProps, template;

  GXTable = React.createClass({
    refreshHandle: function(e) {},
    showReasonHandle: function(e) {},
    renderColumns: function() {
      var i, monthDays, tds;
      monthDays = 31;
      tds = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          results.push(React.createElement("th", null, i));
        }
        return results;
      })();
      React.createElement("tr", null, React.createElement("th", null, "\u5e8f"), React.createElement("th", null, "\u59d3\u540d"), React.createElement("th", null, "\u65e5\u671f"), tds);
      return React.createElement("tr", null);
    },
    renderRows: function() {
      debugger;
      var index, j, len, model, monthDays, ref, results;
      monthDays = 31;
      index = 0;
      ref = this.props.collection.models;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        model = ref[j];
        index++;
        results.push(React.createElement(GXRow, {
          "monthDays": monthDays,
          "model": model,
          "index": index
        }));
      }
      return results;
    },
    renderFooter: function() {
      var cells, count, i, model, monthDays;
      monthDays = 31;
      cells = (function() {
        var j, k, len, ref, ref1, results;
        results = [];
        for (i = j = 1, ref = monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          ref1 = this.props.collection.models;
          for (k = 0, len = ref1.length; k < len; k++) {
            model = ref1[k];
            count = _.filter(this.props.collection.models, function(m) {
              var day;
              day = parseInt(m.get("GXRQ").slice(-2));
              if (day === i) {
                return true;
              } else {
                return false;
              }
            }).length;
          }
          results.push(React.createElement("td", null, count));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, React.createElement("td", null), React.createElement("td", {
        "style": {
          fontWeigh: "bold"
        }
      }, "\u603b\u8ba1"), cells);
    },
    render: function() {
      debugger;
      var monthDays, yearMoonth;
      monthDays = 31;
      yearMoonth = this.props.year + "-" + this.props.month;
      return React.createElement("div", {
        "className": "panel panel-info"
      }, React.createElement("div", {
        "className": "panel-heading text-center"
      }, React.createElement("button", {
        "onClick": this.refreshHandle,
        "className": "btn btn-success pull-left"
      }, "\u5237\u65b0"), React.createElement("button", {
        "onClick": this.showReasonHandle,
        "className": "btn btn-primary pull-right"
      }, "\u663e\u793a\u8bf7\u5047\u4e8b\u7531"), React.createElement("h5", null, "\u5f15\u822a\u5458\u8f6e\u4f11\u660e\u7ec6\u8868(", yearMoonth, ")")), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered"
      }, React.createElement("thead", null, this.renderColumns()), React.createElement("tbody", null, this.renderRows(), this.renderFooter()), React.createElement("thead", null, this.renderColumns()))));
    }
  });

  GXRow = React.createClass({
    render: function() {
      debugger;
      var cells, day, i, index, value;
      index = 1;
      day = this.props.model.get("GXRQ").slice(-2);
      day = parseInt(day);
      cells = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = this.props.monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          if (day === i) {
            value = true;
          } else {
            value = false;
          }
          results.push(React.createElement(GXCell, {
            "value": value
          }));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, React.createElement("td", null, this.props.index), React.createElement("td", null, this.props.model.get("name")), cells);
    }
  });

  GXCell = React.createClass({
    render: function() {
      return React.createElement("td", null, (this.props.value ? "1" : ""));
    }
  });

  template = {
    'gxsqList|20': [
      {
        'name': '@cname()',
        'GXRQ': '@date(2015-01-dd)',
        'SQSJ': '@date(2015-01-dd)'
      }
    ]
  };

  Mock.mock("t.tt", "get", function(options) {
    var gxsqList;
    gxsqList = Mock.mock(template).gxsqList;
    return gxsqList;
  });

  Model = Backbone.Model.extend({
    idAttribute: "id",
    url: "t.tt"
  });

  Collection = Backbone.Collection.extend({
    model: Model,
    url: "t.tt"
  });

  list = new Collection();

  list.fetch({
    wait: true,
    async: false
  });

  tableProps = {
    year: 2015,
    month: 1,
    collection: list
  };

  debugger;

  React.render(React.createElement(GXTable, React.__spread({}, tableProps)), document.getElementById('container'));

}).call(this);
