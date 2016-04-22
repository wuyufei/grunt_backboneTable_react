(function() {
  var Collection, Form, GXCell, GXRow, GXTable, Model, PageView, User, Users, curMonth, curYear, curYearMonth, date, list, pData, pageView, readonly, refresh, users;

  readonly = planmis.readonly;

  GXTable = React.createClass({
    getInitialState: function() {
      return {
        sort: "GXRQ"
      };
    },
    refreshHandle: function(e) {
      return refresh();
    },
    verifyAllHandle: function(e) {
      var pData, promise;
      if (readonly) {
        return;
      }
      pData = this.props.collection.toJSON();
      promise = $.ajax({
        url: "/PilotGxWh.ashx",
        data: JSON.stringify(pData),
        headers: {
          method: "allShenhe"
        },
        type: "post",
        dataType: "json"
      });
      promise.done(function() {
        return refresh();
      });
      return promise.fail(function(xhr, status, err) {
        return alert(xhr.responseText);
      });
    },
    _getMonthDayObj: function() {
      var month1, month2, temp;
      temp = this.props.month < 10 ? "0" + this.props.month.toString() : this.props.month.toString();
      month1 = moment(this.props.year + "-" + temp + "-" + "01");
      month2 = moment(month1).add(1, "months");
      return {
        m1: this._getDaysInMonth(month1.get("year"), month1.get("month") + 1),
        m2: this._getDaysInMonth(month2.get("year"), month2.get("month") + 1)
      };
    },
    _getDaysInMonth: function(year, month) {
      var d;
      month = parseInt(month, 10);
      d = new Date(year, month, 0);
      return d.getDate();
    },
    _timeEqual: function(a, b) {},
    renderColumns: function(isHeader) {
      var angle, class1, class2, firstHeaderCellStyle, i, lineStyle, md, ref, ref1, secondHeaderCellStyle, tds, tds1, tds2, text1, text2;
      ref = ["日期", "姓名", "text-right", "text-left", 20], text1 = ref[0], text2 = ref[1], class1 = ref[2], class2 = ref[3], angle = ref[4];
      if (!isHeader) {
        ref1 = [text2, text1, class2, class1], text1 = ref1[0], text2 = ref1[1], class1 = ref1[2], class2 = ref1[3];
        angle = -angle;
      }
      md = this._getMonthDayObj();
      tds1 = (function() {
        var j, ref2, results;
        results = [];
        for (i = j = 1, ref2 = md.m1; 1 <= ref2 ? j <= ref2 : j >= ref2; i = 1 <= ref2 ? ++j : --j) {
          results.push(React.createElement("th", null, i));
        }
        return results;
      })();
      tds2 = (function() {
        var j, ref2, results;
        results = [];
        for (i = j = 1, ref2 = md.m2; 1 <= ref2 ? j <= ref2 : j >= ref2; i = 1 <= ref2 ? ++j : --j) {
          results.push(React.createElement("th", null, i));
        }
        return results;
      })();
      tds = tds1.concat(tds2);
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
      firstHeaderCellStyle = {
        cursor: "pointer",
        display: "inline-block",
        minWidth: 48,
        paddingLeft: 5
      };
      secondHeaderCellStyle = {
        padding: 0,
        paddingLeft: 5,
        position: "relative",
        display: "inline-block",
        marginLeft: 5,
        borderLeftStyle: "solid",
        borderLeftWidth: 1,
        borderLeftColor: "rgb(211,211,211)"
      };
      return React.createElement("tr", null, React.createElement("th", {
        "style": {
          minWidth: 160,
          padding: 0
        }
      }, React.createElement("div", {
        "onClick": this.sortClick,
        "title": "点击切换排序方式",
        "style": firstHeaderCellStyle
      }, "\u5e8f"), React.createElement("div", {
        "style": secondHeaderCellStyle
      }, React.createElement("div", {
        "style": {
          width: 100
        }
      }, React.createElement("div", {
        "style": lineStyle
      }), React.createElement("div", {
        "className": class1
      }, text1), React.createElement("div", {
        "className": class2
      }, text2)))), tds);
    },
    sortClick: function() {
      debugger;
      if (this.state.sort === "GXRQ") {
        return this.setState({
          sort: "SQSJ"
        });
      } else {
        return this.setState({
          sort: "GXRQ"
        });
      }
    },
    renderRows: function() {
      var group, groupArray, index, j, len, results, sortColl, that, v;
      that = this;
      index = 0;
      group = this.props.collection.groupBy(function(m) {
        return m.get("CHPILOTCODE");
      });
      groupArray = _.pairs(group);
      if (this.state.sort === "SQSJ") {
        sortColl = _.sortBy(groupArray, function(l) {
          var s;
          s = _.sortBy(l[1], function(x) {
            return x.get("SQSJ");
          });
          return s[s.length - 1].get("SQSJ");
        });
      } else {
        sortColl = _.sortBy(groupArray, function(l) {
          var s;
          s = _.sortBy(l[1], function(x) {
            return x.get("GXRQ");
          });
          return s[0].get("GXRQ");
        });
      }
      results = [];
      for (j = 0, len = sortColl.length; j < len; j++) {
        v = sortColl[j];
        index++;
        results.push(React.createElement(GXRow, {
          "menu": menu,
          "year": this.props.year,
          "month": this.props.month,
          "models": v[1],
          "index": index
        }));
      }
      return results;
    },
    renderFooter1: function() {
      var c, cells, cells1, cells2, count, group, i, limit, m, md, subS, tempColl;
      md = this._getMonthDayObj();
      tempColl = (function() {
        var j, len, ref, results;
        ref = this.props.collection.models;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          m = ref[j];
          if ($.trim(m.get("CHPILOTGRADE")) !== "E") {
            results.push(m);
          }
        }
        return results;
      }).call(this);
      group = _.groupBy(tempColl, function(m) {
        var temp;
        temp = moment(m.get("GXRQ"));
        return (temp.get("month") + 1) + "-" + (temp.get("date"));
      });
      cells1 = (function() {
        var j, k, len, ref, ref1, ref2, results;
        results = [];
        for (i = j = 1, ref = md.m1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          subS = this.props.month + "-" + i;
          count = (ref1 = group[subS]) != null ? ref1.length : void 0;
          ref2 = this.props.gxtsList;
          for (k = 0, len = ref2.length; k < len; k++) {
            c = ref2[k];
            if (moment(c.RQ).isSame(this.props.year + "-" + (this.props.month >= 10 ? this.props.month : "0" + this.props.month) + "-" + (i >= 10 ? i : "0" + i))) {
              limit = c.TS;
            }
          }
          results.push(React.createElement("td", {
            "className": (count > limit ? "danger" : "")
          }, count));
        }
        return results;
      }).call(this);
      cells2 = (function() {
        var j, k, len, ref, ref1, ref2, results;
        results = [];
        for (i = j = 1, ref = md.m2; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          subS = this.props.month + 1 + "-" + i;
          count = (ref1 = group[subS]) != null ? ref1.length : void 0;
          ref2 = this.props.gxtsList;
          for (k = 0, len = ref2.length; k < len; k++) {
            c = ref2[k];
            if (moment(c.RQ).isSame(this.props.year + "-" + (this.props.month >= 10 ? this.props.month : "0" + this.props.month) + "-" + (i >= 10 ? i : "0" + i))) {
              limit = c.TS;
            }
          }
          results.push(React.createElement("td", {
            "className": (count > limit ? "danger" : "")
          }, count));
        }
        return results;
      }).call(this);
      cells = cells1.concat(cells2);
      return React.createElement("tr", null, React.createElement("td", {
        "style": {
          fontWeight: "bold"
        },
        "className": "text-center"
      }, "\u603b\u8ba1"), cells);
    },
    renderFooter2: function() {
      var c, cells, cells1, cells2, i, limit, md;
      md = this._getMonthDayObj();
      cells1 = (function() {
        var j, k, len, ref, ref1, results;
        results = [];
        for (i = j = 1, ref = md.m1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          ref1 = this.props.gxtsList;
          for (k = 0, len = ref1.length; k < len; k++) {
            c = ref1[k];
            if (moment(c.RQ).isSame(this.props.year + "-" + (this.props.month >= 10 ? this.props.month : "0" + this.props.month) + "-" + (i >= 10 ? i : "0" + i))) {
              limit = c.TS;
            }
          }
          results.push(React.createElement("td", null, limit));
        }
        return results;
      }).call(this);
      cells2 = (function() {
        var j, k, len, ref, ref1, results;
        results = [];
        for (i = j = 1, ref = md.m2; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          ref1 = this.props.gxtsList;
          for (k = 0, len = ref1.length; k < len; k++) {
            c = ref1[k];
            if (moment(c.RQ).isSame(this.props.year + "-" + (this.props.month + 1 >= 10 ? this.props.month + 1 : "0" + (this.props.month + 1)) + "-" + (i >= 10 ? i : "0" + i))) {
              limit = c.TS;
            }
          }
          results.push(React.createElement("td", null, limit));
        }
        return results;
      }).call(this);
      cells = cells1.concat(cells2);
      return React.createElement("tr", null, React.createElement("td", {
        "style": {
          fontWeight: "bold"
        },
        "className": "text-center"
      }, "\u9650\u989d"), cells);
    },
    onClick: function(e) {
      debugger;
      var index, table, target;
      target = $(e.target);
      if (!(target.is("td") || target.is("th"))) {
        target = target.closest("td");
        if (target.length === 0) {
          target = target.closest("th");
        }
      }
      if (target.length > 0) {
        index = target.index();
        table = target.closest("table");
        table.find("td,th").each(function() {
          var el;
          el = $(this);
          if (el.index() === index) {
            return el.addClass("warning");
          } else {
            return el.removeClass("warning");
          }
        });
        table.find("tr").removeClass("warning");
        return target.closest("tr").addClass("warning");
      }
    },
    render: function() {
      var firstYearMonth, headerText, monthDays, secondYearMonth;
      monthDays = 31;
      debugger;
      firstYearMonth = moment(this.props.year + "-" + this.props.month + "-" + "01", "YYYY-MM-DD");
      secondYearMonth = moment(firstYearMonth).add(1, "months");
      headerText = firstYearMonth.year() + "-" + (firstYearMonth.month() + 1) + "至" + secondYearMonth.year() + "-" + (secondYearMonth.month() + 1);
      return React.createElement("div", {
        "className": "panel panel-info"
      }, React.createElement("div", {
        "className": "panel-heading text-center"
      }, React.createElement("button", {
        "onClick": this.refreshHandle,
        "className": "btn btn-success pull-left"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-refresh"
      }), " \u5237\u65b0"), (readonly ? "" : React.createElement("button", {
        "onClick": this.verifyAllHandle,
        "className": "btn btn-primary pull-right"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-eye-open"
      }), " \u5168\u90e8\u5ba1\u6838")), React.createElement("h5", null, "\u5f15\u822a\u5458\u516c\u4f11\u8f6e\u4f11\u660e\u7ec6\u8868(", headerText, ")")), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered",
        "onClick": this.onClick
      }, React.createElement("thead", null, this.renderColumns(true)), React.createElement("tbody", null, this.renderRows(), this.renderFooter1(), this.renderFooter2()), React.createElement("thead", null, this.renderColumns(false)))));
    }
  });

  GXRow = React.createClass({
    _getDaysInMonth: function(year, month) {
      var d;
      month = parseInt(month, 10);
      d = new Date(year, month, 0);
      return d.getDate();
    },
    _getMonthDayObj: function() {
      var month1, month2, temp;
      temp = this.props.month < 10 ? "0" + this.props.month.toString() : this.props.month.toString();
      month1 = moment(this.props.year + "-" + temp + "-" + "01");
      month2 = moment(month1).add(1, "months");
      return {
        m1: this._getDaysInMonth(month1.get("year"), month1.get("month") + 1),
        m2: this._getDaysInMonth(month2.get("year"), month2.get("month") + 1)
      };
    },
    render: function() {
      var cells, cells1, cells2, date, firstCellStyle, i, index, md, model, mon, month2, pilotCode, pilotName, rowHeaderStyle1, rowHeaderStyle2, that, twoMonth, year2;
      that = this;
      index = 1;
      md = this._getMonthDayObj();
      twoMonth = moment(this.props.year + "-" + this.props.month + "-" + "01").add(1, "months");
      year2 = twoMonth.year();
      month2 = twoMonth.month() + 1;
      cells1 = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = md.m1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          model = _.find(this.props.models, function(m) {
            var d, mom, month;
            mom = moment(m.get("GXRQ"));
            month = mom.get("month") + 1;
            d = mom.get('date');
            return d === i && month === that.props.month;
          });
          mon = moment(this.props.models[0].get("GXRQ"));
          date = this.props.year + "-" + this.props.month + "-" + i + " ";
          pilotCode = this.props.models[0].get("CHPILOTCODE");
          pilotName = this.props.models[0].get("VCPILOTNAME");
          results.push(React.createElement(GXCell, {
            "date": date,
            "model": model,
            "pilotCode": pilotCode,
            "pilotName": pilotName,
            "month": mon.month() + 1,
            "day": i,
            "menu": this.props.menu
          }));
        }
        return results;
      }).call(this);
      cells2 = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = md.m2; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          model = _.find(this.props.models, function(m) {
            var d, mom, month;
            mom = moment(m.get("GXRQ"));
            month = mom.get("month") + 1;
            d = mom.get('date');
            return d === i && month === (that.props.month + 1);
          });
          mon = moment(this.props.models[0].get("GXRQ"));
          date = year2 + "-" + month2 + "-" + i + " ";
          pilotCode = this.props.models[0].get("CHPILOTCODE");
          pilotName = this.props.models[0].get("VCPILOTNAME");
          results.push(React.createElement(GXCell, {
            "date": date,
            "model": model,
            "pilotCode": pilotCode,
            "pilotName": pilotName,
            "month": mon.month() + 2,
            "day": i,
            "menu": this.props.menu
          }));
        }
        return results;
      }).call(this);
      cells = cells1.concat(cells2);
      rowHeaderStyle1 = {
        position: "absolute",
        borderRight: "none",
        backgroundColor: "#FFF",
        minWidth: 160,
        display: "inline-block",
        paddingTop: 0,
        paddingBottom: 0
      };
      rowHeaderStyle2 = firstCellStyle = {
        borderRightColor: "rgb(221, 221, 221)",
        borderRightStyle: "solid",
        borderRightWidth: 1,
        display: "inline-block",
        width: 46,
        height: 36,
        paddingTop: 5
      };
      return React.createElement("tr", null, React.createElement("td", {
        "style": rowHeaderStyle1
      }, React.createElement("div", {
        "style": firstCellStyle
      }, this.props.index), React.createElement("div", {
        "style": {
          display: "inline-block",
          width: 93,
          marginLeft: 5,
          paddingTop: 5
        }
      }, this.props.models[0].get("VCPILOTNAME"), React.createElement("span", {
        "className": "badge"
      }, this.props.models.length))), cells);
    }
  });

  GXCell = React.createClass({
    componentDidMount: function() {
      return this._setMenu();
    },
    _setMenu: function() {
      var el, that;
      if (readonly) {
        return;
      }
      that = this;
      el = $(this.getDOMNode());
      return el.contextmenu({
        target: "#menu",
        before: function(e, context) {
          debugger;
          var ul;
          ul = this.getMenu().find("ul");
          ul.empty();
          if (that.props.model) {
            return ul.append("<li><a href=\"#\">单天确认</a></li>\n<li><a href=\"#\">全部确认</a></li>\n<li><a t href=\"#\">取消</a></li> ");
          } else {
            return ul.append("<li><a tabindex=\"-1\" href=\"#\">安排公休</a></li>\n<li><a tabindex=\"-1\" href=\"#\">安排轮休</a></li>");
          }
        },
        onItem: function(context, e) {
          var model, pData, promise, target;
          e.preventDefault();
          target = $(e.target);
          model = that.props.model;
          switch (target.text()) {
            case "取消":
              pData = model.toJSON();
              pData.day = moment(model.get("GXRQ")).format("YYYY-MM-DD");
              pData.method = "quxiao";
              promise = $.ajax({
                url: "/PilotGxWh.ashx",
                data: pData,
                type: "post",
                dataType: "json"
              });
              return promise.done(function(data, status, xhr) {
                return refresh();
              });
            case "单天确认":
              pData = model.toJSON();
              pData.day = moment(model.get("GXRQ")).format("YYYY-MM-DD");
              pData.method = "shenhe";
              promise = $.post("/PilotGxWh.ashx", pData);
              promise.done(function(data, status, xhr) {
                return refresh();
              });
              return promise.fail(function(xhr, status, err) {
                return alert(xhr.responseText);
              });
            case "全部确认":
              pData = model.collection.where({
                CHPILOTCODE: model.get("CHPILOTCODE")
              });
              promise = $.ajax({
                url: "/PilotGxWh.ashx",
                data: JSON.stringify(pData),
                headers: {
                  method: "allShenhe"
                },
                type: "post",
                dataType: "json"
              });
              promise.done(function() {
                return refresh();
              });
              return promise.fail(function(xhr, status, err) {
                return alert(xhr.responseText);
              });
            case "安排公休":
              debugger;
              pData = {};
              pData.pilotCode = that.props.pilotCode;
              pData.pilotName = that.props.pilotName;
              pData.day = that.props.date;
              pData.sqlb = "G";
              pData.method = "diaodushenqingnew";
              promise = $.post("/PilotGxWh.ashx", pData);
              promise.done(function(data, status, xhr) {
                return refresh();
              });
              return promise.fail(function(xhr, status, err) {
                return alert(xhr.responseText);
              });
            case "安排轮休":
              pData = {};
              pData.pilotCode = that.props.pilotCode;
              pData.pilotName = that.props.pilotName;
              pData.day = that.props.date;
              pData.sqlb = "L";
              pData.method = "diaodushenqingnew";
              promise = $.post("/PilotGxWh.ashx", pData);
              promise.done(function(data, status, xhr) {
                return refresh();
              });
              return promise.fail(function(xhr, status, err) {
                return alert(xhr.responseText);
              });
          }
        }
      });
    },
    componentDidUnmount: function() {
      var el;
      el = $(this.getDOMNode());
      el.contextmenu("destroy");
      return el.popover("destroy");
    },
    componentDidUpdate: function() {},
    mouseOverHandle: function() {
      var el, that;
      if (readonly) {
        return;
      }
      that = this;
      el = $(this.getDOMNode());
      this.showPop = true;
      if (this.props.model) {
        return setTimeout(function() {
          var day, ref, sqrq;
          if (that.showPop && ((ref = el.data("bs.popover")) === null || ref === (void 0))) {
            day = moment(that.props.model.get("GXRQ")).format("YYYY-MM-DD");
            sqrq = moment(that.props.model.get("SQSJ")).format("YYYY-MM-DD");
            return $.getJSON("/PilotGxWh.ashx", {
              pilotCode: that.props.model.get("CHPILOTCODE"),
              date: day
            }, function(data, state, xhr) {
              el.popover({
                title: that.props.model.get("VCPILOTNAME"),
                content: "轮休天数:" + (data.LXTS.toString()) + "</br>剩余天数:" + (data.SYTS.toString()) + "</br>请假事由:" + (that.props.model.get("QJSY")) + "</br>申请日期:" + sqrq + " ",
                trigger: "",
                html: true,
                placement: "auto right",
                container: "body"
              });
              el.popover("show");
              return setTimeout(function() {
                return el.popover("destroy");
              }, 3000);
            });
          }
        }, 600);
      }
    },
    mouseLeaveHandle: function() {
      var el;
      if (readonly) {
        return;
      }
      this.showPop = false;
      return el = $(this.getDOMNode());
    },
    render: function() {
      var className, style;
      if (this.props.model) {
        style = {
          color: this.props.model.get("SQLB") === "G" ? "blue" : "black"
        };
      }
      className = "text-center";
      if (this.props.model && this.props.model.get("SHBZ") === "1") {
        className = "text-center success";
      }
      return React.createElement("td", {
        "className": className,
        "onMouseOver": this.mouseOverHandle,
        "onMouseLeave": this.mouseLeaveHandle
      }, React.createElement("span", {
        "style": style
      }, (this.props.model ? this.props.model.get("SQLB") : "")));
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

  pData = {
    gxlx: curYearMonth
  };

  $.getJSON("/PilotGxWh.ashx", pData, function(data) {
    _.extend(pageView.options, {
      gxtsList: data.gxtsList
    });
    list.reset(data.gxsqList);
    return pageView.render();
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
        collection: this.collection,
        gxtsList: this.options.gxtsList
      };
      return reactComponent = React.render(React.createElement(GXTable, React.__spread({}, tableProps)), document.getElementById('table'));
    }
  });

  pageView = new PageView({
    el: $("#table"),
    collection: list,
    gxtsList: [],
    year: curYear,
    month: curMonth
  });

  $("#btnSearch").click(function() {
    var month, year, yearMonth;
    date = $("#txtStart").val();
    year = parseInt(date.substr(0, 4));
    month = parseInt(date.substr(date.indexOf("-") + 1));
    yearMonth = year + "-" + month;
    _.extend(pageView.options, {
      year: year,
      month: month
    });
    pData = {
      gxlx: yearMonth
    };
    return $.getJSON("/PilotGxWh.ashx", pData, function(data) {
      _.extend(pageView.options, {
        gxtsList: data.gxtsList
      });
      return list.reset(data.gxsqList);
    });
  });

  refresh = function() {
    var month, year, yearMonth;
    date = $("#txtStart").val();
    year = parseInt(date.substr(0, 4));
    month = parseInt(date.substr(date.indexOf("-") + 1));
    yearMonth = year + "-" + month;
    _.extend(pageView.options, {
      year: year,
      month: month
    });
    pData = {
      gxlx: yearMonth
    };
    return $.getJSON("/PilotGxWh.ashx", pData, function(data) {
      _.extend(pageView.options, {
        gxtsList: data.gxtsList
      });
      return list.reset(data.gxsqList);
    });
  };

  $("#btnAdd").click(function() {
    var form;
    if (readonly) {
      return;
    }
    form = new Form();
    form.render();
    return pageView.render();
  });

  User = Backbone.Model.extend({
    urlRoot: "/PilotGxWh.ashx",
    schema: {
      CHPILOTNO: {
        type: "Text",
        title: "工号",
        readonly: true
      },
      VCPILOTNAME: {
        type: "Text",
        title: "姓名",
        readonly: true
      }
    }
  });

  Users = Backbone.TableCollection.extend({
    url: "/PilotGxWh.ashx",
    model: User
  });

  users = new Users();

  users.fetch();

  Form = ModalFormView.extend({
    renderComplete: function() {
      var listView, that;
      that = this;
      this.$el.find("[data-field=startTime],[data-field=endTime]").datetimepicker({
        format: "yyyy-mm-dd",
        language: "zh-CN",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighLight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
      });
      listView = new Backbone.TableView({
        collection: users,
        allowPageing: false,
        allowSortting: true,
        allowSaveButton: false,
        allowAddButton: false
      });
      listView.render();
      this.$el.find("[data-container=list]").append(listView.el);
      listView.$el.click(function(e) {
        e.preventDefault();
        return e.stopPropagation();
      });
      return listView.on("cellDoubleClick", function(e, data) {
        debugger;
        var currDate, currEl;
        currEl = that.$el.find("[data-field=pilotCode]");
        currEl.data("pilotCode", data.get("CHPILOTNO"));
        currEl.val(data.get("VCPILOTNAME"));
        that.$el.find(".dropdown-menu").dropdown('toggle');
        currDate = new Date();
        date = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-" + currDate.getDate();
        return $.getJSON("/PilotGxWh.ashx", {
          pilotCode: data.get("CHPILOTNO"),
          date: date
        }, function(data, state, xhr) {
          that.$el.find("[data-field=ylxts]").val(data.YLXTS);
          return that.$el.find("[data-field=syts]").val(data.SYTS);
        });
      });
    },
    save: function() {
      var currEl, el, elArray, endEl, j, len, postData, promise, qjsyEl, sqlbEl, startEl, that, validated;
      that = this;
      validated = true;
      currEl = this.$el.find("[data-field=pilotCode]");
      startEl = this.$el.find("[data-field=startTime]");
      endEl = this.$el.find("[data-field=endTime]");
      sqlbEl = this.$el.find("[data-field=SQLB]");
      qjsyEl = this.$el.find("[data-field=QJSY]");
      elArray = [startEl, endEl, sqlbEl];
      for (j = 0, len = elArray.length; j < len; j++) {
        el = elArray[j];
        if (!el.val()) {
          el.popover({
            content: "该字段不能为空",
            placement: "auto"
          });
          el.popover("show");
          el.click(function(e) {
            return $(this).popover("destroy");
          });
          validated = false;
        } else {
          el.popover("destroy");
        }
      }
      if (validated) {
        postData = {};
        postData.method = "ddkgxlxsq";
        postData.CHPILOTCODE = currEl.data("pilotCode");
        postData.CHPILOTNAME = currEl.val();
        postData.startTime = startEl.val();
        postData.endTime = endEl.val();
        postData.SQLB = sqlbEl.val();
        postData.QJSY = qjsyEl.val();
        promise = $.post("/PilotGxWh.ashx", postData);
        promise.done(function(data, status, xhr) {
          that.$el.modal("hide");
          return refresh();
        });
        return promise.fail(function(xhr, status, err) {
          debugger;
          var $el;
          $el = that.$el.find("[data-command=save]");
          $el.popover({
            content: xhr.responseText,
            placement: "auto"
          });
          return $el.popover("show");
        });
      }
    },
    formTemplate: _.template(" <form>\n  <fieldset>\n      <div class=\"panel panel-default\">\n          <div class=\"panel-heading text-center\"><h4>公休轮休申请</h4></div>\n          <div class=\"panel-body\">\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                      <span class=\"input-group-addon\">引航员</span>\n                      <input type=\"text\" data-field=\"pilotCode\" class=\"form-control\" readonly=\"readonly\"></input>\n                      <span class=\"input-group-addon\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"caret\" ></span></span>\n                      <div class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\"  style=\"width:150%;\" >\n                        <div class=\"col-md-12\" >\n                          <p data-container=\"list\"style=\"height:320px;overflow-y:auto;\"></p>\n                        </div>\n                      </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon\">已轮休天数</span>\n                        <input type=\"text\" class=\"form-control\" data-field=\"ylxts\" readonly=\"readonly\" id=\"Text2\" />\n                        <span class=\"input-group-addon\">天</span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\" >\n                        <span class=\"input-group-addon\">剩余天数</span>\n                        <input type=\"text\" class=\"form-control\" data-field=\"syts\" readonly=\"readonly\" id=\"Text3\" />\n                        <span class=\"input-group-addon\">天</span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"clearfix\"></div>\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon\">开始日期\n                        </span>\n                        <input type=\"text\" readonly=\"readonly\" data-field=\"startTime\" class=\"form-control\" id=\"txtStart\">\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon\">结束日期\n                        </span>\n                        <input type=\"text\" readonly=\"readonly\" data-field=\"endTime\" class=\"form-control\" id=\"txtEnd\">\n                    </div>\n                </div>\n            </div>\n            <div class=\"col-xs-12 col-sm-6 col-md-4\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon\">公休/轮休\n                        </span>\n                        <select class=\"form-control\" data-field=\"SQLB\">\n                          <option value=\"G\">公休</option>\n                          <option value=\"L\">轮休</option>\n                        </select>\n                    </div>\n                </div>\n            </div>\n             <div class=\"col-md-12\">\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <span class=\"input-group-addon\">请假事由\n                        </span>\n                        <textarea class=\"form-control\" data-field=\"QJSY\" rows=\"2\"></textarea>\n                    </div>\n                </div>\n            </div>\n          </div>\n      </div>\n  </fieldset>\n</form>")
  });

}).call(this);
