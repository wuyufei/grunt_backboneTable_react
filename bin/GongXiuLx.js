(function() {
  var Collection, GXCell, GXRow, GXTable, Model, list, tableProps, template;

  GXTable = React.createClass({
    refreshHandle: function(e) {},
    showReasonHandle: function(e) {},
    renderColumns: function(isHeader) {
      var angle, class1, class2, i, lineStyle, monthDays, ref, ref1, tds, text1, text2;
      ref = ["日期", "姓名", "text-right", "text-left", 31], text1 = ref[0], text2 = ref[1], class1 = ref[2], class2 = ref[3], angle = ref[4];
      if (!isHeader) {
        ref1 = [text2, text1, class2, class1], text1 = ref1[0], text2 = ref1[1], class1 = ref1[2], class2 = ref1[3];
        angle = -angle;
      }
      monthDays = 31;
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
      var index, j, len, model, monthDays, ref, results;
      monthDays = 31;
      index = 0;
      ref = this.props.collection.models;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        model = ref[j];
        index++;
        results.push(React.createElement(GXRow, {
          "menu": menu,
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
      }, React.createElement("thead", null, this.renderColumns(true)), React.createElement("tbody", null, this.renderRows(), this.renderFooter()), React.createElement("thead", null, this.renderColumns(false)))));
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
            value = this.props.model.get("type");
          } else {
            value = "";
          }
          results.push(React.createElement(GXCell, {
            "value": value,
            "menu": this.props.menu
          }));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, React.createElement("td", null, this.props.index), React.createElement("td", null, this.props.model.get("name")), cells);
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
        "onMouseOver": this.mouseOverHandle,
        "onMouseLeave": this.mouseLeaveHandle
      }, React.createElement("span", {
        "style": style
      }, this.props.value));
    }
  });

  template = {
    'gxsqList|20': [
      {
        name: '@cname',
        GXRQ: '@date(2015-01-dd)',
        SQSJ: '@date(2015-01-dd)',
        'type|1': ["G", "L"]
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

  React.render(React.createElement(GXTable, React.__spread({}, tableProps)), document.getElementById('container'));

}).call(this);
