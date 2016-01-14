(function() {
  var Collection, GXCell, GXRow, GXTable, Model, PageView, curMonth, curYear, curYearMonth, date, list, pageView;

  GXTable = React.createClass({
    refreshHandle: function(e) {},
    showReasonHandle: function(e) {},
    _getDaysInMonth: function(year, month) {
      var d;
      month = parseInt(month, 10);
      d = new Date(year, month, 0);
      return d.getDate();
    },
    renderColumns: function(isHeader) {
      var angle, class1, class2, i, lineStyle, monthDays, ref, ref1, tds, text1, text2;
      ref = ["日期", "姓名", "text-right", "text-left", 20], text1 = ref[0], text2 = ref[1], class1 = ref[2], class2 = ref[3], angle = ref[4];
      if (!isHeader) {
        ref1 = [text2, text1, class2, class1], text1 = ref1[0], text2 = ref1[1], class1 = ref1[2], class2 = ref1[3];
        angle = -angle;
      }
      monthDays = this._getDaysInMonth(this.props.year, this.props.month);
      tds = (function() {
        var j, ref2, results;
        results = [];
        for (i = j = 1, ref2 = monthDays; 1 <= ref2 ? j <= ref2 : j >= ref2; i = 1 <= ref2 ? ++j : --j) {
          results.push(React.createElement("th", null, i));
        }
        return results;
      })();
      lineStyle = {
        top: "50%",
        bottom: "50%",
        left: 0,
        right: 0,
        position: "absolute",
        backgroundColor: "rgb(221, 221, 221)",
        height: 1,
        transform: "rotate(" + angle + "deg)"
      };
      return React.createElement("tr", null, React.createElement("th", null, "\u5e8f"), React.createElement("th", {
        "style": {
          padding: 0,
          position: "relative"
        }
      }, React.createElement("div", {
        "style": lineStyle
      }), React.createElement("div", {
        "className": class1
      }, text1), React.createElement("div", {
        "className": class2
      }, text2)), tds);
    },
    renderRows: function() {
      var group, index, j, k, len, monthDays, results, v;
      monthDays = this._getDaysInMonth(this.props.year, this.props.month);
      index = 0;
      group = this.props.collection.groupBy(function(m) {
        return m.get("CHPILOTCODE");
      });
      results = [];
      for (v = j = 0, len = group.length; j < len; v = ++j) {
        k = group[v];
        results.push(React.createElement(GXRow, {
          "menu": menu,
          "monthDays": monthDays,
          "models": v,
          "index": index
        }));
      }
      return results;
    },
    renderFooter1: function() {
      var cells, count, i, model, monthDays;
      monthDays = this._getDaysInMonth(this.props.year, this.props.month);
      cells = (function() {
        var j, l, len, ref, ref1, results;
        results = [];
        for (i = j = 1, ref = monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          ref1 = this.props.collection.models;
          for (l = 0, len = ref1.length; l < len; l++) {
            model = ref1[l];
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
    renderFooter2: function() {
      var cells, i, monthDays;
      monthDays = this._getDaysInMonth(this.props.year, this.props.month);
      cells = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          results.push(React.createElement("td", null, 25.));
        }
        return results;
      })();
      return React.createElement("tr", null, React.createElement("td", null), React.createElement("td", {
        "style": {
          fontWeigh: "bold"
        }
      }, "\u9650\u989d"), cells);
    },
    render: function() {
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
      }, "\u663e\u793a\u8bf7\u5047\u4e8b\u7531"), React.createElement("h5", null, "\u5f15\u822a\u5458\u516c\u4f11\u8f6e\u4f11\u660e\u7ec6\u8868(", yearMoonth, ")")), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered"
      }, React.createElement("thead", null, this.renderColumns(true)), React.createElement("tbody", null, this.renderRows(), this.renderFooter1(), this.renderFooter2()), React.createElement("thead", null, this.renderColumns(false)))));
    }
  });

  GXRow = React.createClass({
    render: function() {
      var cells, day, i, index, value;
      index = 1;
      day = this.props.model.get("GXRQ").slice(-2);
      day = parseInt(day);
      cells = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = this.props.monthDays; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          if (day === i) {
            value = this.props.model.get("SQLB");
          } else {
            value = "";
          }
          results.push(React.createElement(GXCell, {
            "value": value,
            "day": i,
            "menu": this.props.menu
          }));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, React.createElement("td", null, this.props.index), React.createElement("td", null, this.props.model.get("VCPILOTNAME"), " ", React.createElement("span", {
        "className": "badge"
      }, "2")), cells);
    }
  });

  GXCell = React.createClass({
    componentDidMount: function() {
      debugger;
      var el;
      el = $(this.getDOMNode());
      return el.contextmenu({
        target: $("#menu"),
        onItem: function(context, e) {
          var target;
          target = $(e.target);
          if (target.text() === "取消") {
            return console.log("取消");
          }
        }
      });
    },
    componentDidUnmount: function() {
      var el;
      el = $(this.getDOMNode());
      return el.contextmenu("destroy");
    },
    mouseOverHandle: function() {
      var el;
      el = $(this.getDOMNode());
      return el.css("backgroundColor", "#f5f5f5");
    },
    mouseLeaveHandle: function() {
      var el;
      el = $(this.getDOMNode());
      return el.css("backgroundColor", "#fff");
    },
    render: function() {
      var style;
      style = {
        color: this.props.value === "G" ? "blue" : "black"
      };
      return React.createElement("td", {
        "className": "text-center",
        "title": this.props.day + "日",
        "onMouseOver": this.mouseOverHandle,
        "onMouseLeave": this.mouseLeaveHandle
      }, React.createElement("span", {
        "style": style
      }, this.props.value));
    }
  });

  Model = Backbone.Model.extend({
    urlRoot: "/PilotGxWh.ashx"
  });

  Collection = Backbone.Collection.extend({
    model: Model,
    url: "/PilotGxWh.ashx"
  });

  list = new Collection();

  date = new Date();

  curYear = date.getFullYear();

  curMonth = date.getMonth() + 1;

  curYearMonth = curYear + "-" + curMonth;

  $("#txtStart").val(curYearMonth);

  list.fetch({
    wait: true,
    data: {
      gxlx: curYearMonth
    },
    async: false
  });

  PageView = Backbone.View.extend({
    initialize: function(options) {
      this.options = _.extend({}, options);
      return this.listenTo(this.collection, "reset", this.render, this);
    },
    render: function() {
      var reactComponent, tableProps;
      tableProps = {
        year: this.options.year,
        month: this.options.month,
        collection: this.collection
      };
      return reactComponent = React.render(React.createElement(GXTable, React.__spread({}, tableProps)), document.getElementById('table'));
    }
  });

  pageView = new PageView({
    el: $("#table"),
    collection: list,
    year: curYear,
    month: curMonth
  });

  pageView.render();

  $("#btnSearch").click(function() {
    debugger;
    var month, year, yearMonth;
    date = $("#txtStart").val();
    year = parseInt(date.substr(0, 4));
    month = parseInt(date.substr(date.indexOf("-") + 1));
    yearMonth = year + "-" + month;
    _.extend(pageView.options, {
      year: year,
      month: month
    });
    list.fetch({
      wait: true,
      data: {
        gxlx: yearMonth
      },
      async: false,
      reset: true
    });
    return pageView.render();
  });

}).call(this);
