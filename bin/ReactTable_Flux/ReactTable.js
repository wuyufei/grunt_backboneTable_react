(function() {
  var BackboneTable, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Col, Grid, Input, MenuItem, Modal, Overlay, Pagination, Popover, ReactTable, Row, SplitButton;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover, Pagination = ReactBootstrap.Pagination, ButtonGroup = ReactBootstrap.ButtonGroup, SplitButton = ReactBootstrap.SplitButton, MenuItem = ReactBootstrap.MenuItem;

  window.BackboneTable = BackboneTable = Backbone.View.extend({
    initialize: function(options) {
      return this.options = _.extend({}, options);
    },
    render: function() {
      return ReactDOM.render(React.createElement(ReactTable, React.__spread({}, this.options)), this.el);
    }
  });

  ReactTable = React.createClass({
    getInitialState: function() {
      return {
        activePage: 10
      };
    },
    componentWillMount: function() {},
    cellClick: function(model, key) {
      if (this.props.readonly !== true && model.schema[key].readonly !== true) {
        return this.setState({
          selectedRow: model,
          editCell: {
            model: model,
            key: key
          }
        });
      } else {
        return this.setState({
          selectedRow: model
        });
      }
    },
    sort: function(name) {
      var dir;
      if (this.state.sortField === name && this.state.sortDir === "asc") {
        dir = "desc";
      } else {
        dir = "asc";
      }
      return this.setState({
        sortField: name,
        sortDir: dir
      });
    },
    pageChange: function(event, selectedEvent) {
      return this.setState({
        activePage: selectedEvent.eventKey
      });
    },
    getSortCollection: function() {
      var getSortValue, schema, sortModels, that;
      that = this;
      sortModels = _.clone(this.props.collection.models);
      schema = this.props.collection.model.prototype.schema;
      if (this.state.sortField) {
        getSortValue = schema[this.state.sortField].sortValue;
        sortModels.sort(function(a, b) {
          var ref, ref1;
          a = (ref = typeof getSortValue === "function" ? getSortValue(a) : void 0) != null ? ref : a.get(that.state.sortField);
          b = (ref1 = typeof getSortValue === "function" ? getSortValue(b) : void 0) != null ? ref1 : b.get(that.state.sortField);
          if (_.isString(a)) {
            return a.localeCompare(b);
          } else {
            return a - b;
          }
        });
        if (this.state.sortDir === "desc") {
          sortModels.reverse();
        }
      }
      return sortModels;
    },
    getCellContent: function(model, key) {
      var content, ref, ref1, schema;
      schema = model.schema[key];
      switch (schema.type.toLowerCase()) {
        case "text":
          if (model === ((ref = this.state.editCell) != null ? ref.model : void 0) && key === ((ref1 = this.state.editCell) != null ? ref1.key : void 0)) {
            content = React.createElement(Input, {
              "groupClassName": "group-class",
              "type": "text",
              "bsSize": "small",
              "value": model.get(key)
            });
          } else {
            content = React.createElement("span", null, model.get(key));
          }
          break;
        case "select":
          content = React.createElement("span", null, (_.findWhere(schema.options, {
            val: model.get(key)
          }).label));
          break;
        case "checkbox":
          if (model.get(key) === "1") {
            content = React.createElement("span", {
              "className": "glyphicon glyphicon-ok"
            });
          } else {
            content = null;
          }
          break;
        default:
          content = React.createElement("span", null, model.get(key));
      }
      return content;
    },
    render: function() {
      var pageCollection, pageCount, pageRecordLength, ref, renderRowButton, sortCollection;
      pageRecordLength = (ref = this.props.pageRecordLength) != null ? ref : 10;
      pageCount = Math.ceil(this.props.collection.length / 10) - 1;
      sortCollection = this.getSortCollection();
      pageCollection = sortCollection.slice(this.state.activePage * 10, +((this.state.activePage + 1) * 10 - 1) + 1 || 9e9);
      renderRowButton = (function(_this) {
        return function() {
          return React.createElement(ButtonGroup, {
            "bsSize": "xsmall"
          }, (function() {
            var btnInfo, i, j, len, len1, ref1, ref2, ref3, ref4, results, results1;
            if (((ref1 = _this.props.rowButtons) != null ? ref1.length : void 0) <= 3) {
              ref2 = _this.props.rowButtons.slice(0, 3);
              results = [];
              for (i = 0, len = ref2.length; i < len; i++) {
                btnInfo = ref2[i];
                if (btnInfo != null) {
                  results.push(React.createElement(Button, {
                    "onClick": btnInfo.onclick
                  }, btnInfo.text));
                }
              }
              return results;
            } else if (((ref3 = _this.props.rowButtons) != null ? ref3.length : void 0) > 3) {
              ref4 = _this.props.rowButtons.slice(0, 2);
              results1 = [];
              for (j = 0, len1 = ref4.length; j < len1; j++) {
                btnInfo = ref4[j];
                results1.push(React.createElement(Button, {
                  "onClick": btnInfo.onclick
                }, btnInfo.text));
              }
              return results1;
            }
          })(), (function() {
            var ref1;
            if (((ref1 = _this.props.rowButtons) != null ? ref1.length : void 0) > 3) {
              return React.createElement(SplitButton, {
                "bsSize": "xsmall",
                "title": _this.props.rowButtons[2].text
              }, (function() {
                var btnInfo, i, len, ref2, results;
                ref2 = _this.props.rowButtons.slice(3);
                results = [];
                for (i = 0, len = ref2.length; i < len; i++) {
                  btnInfo = ref2[i];
                  results.push(React.createElement(MenuItem, null, btnInfo.text));
                }
                return results;
              })());
            }
          })());
        };
      })(this);
      return React.createElement("div", {
        "className": "panel panel-default"
      }, React.createElement("div", {
        "className": "panel-heading clearfix"
      }, React.createElement("div", {
        "className": "pull-right",
        "data-range": "headerButtons",
        "style": {
          minHeight: 20
        }
      }, (function(_this) {
        return function() {
          var btnInfo, i, len, ref1, results;
          ref1 = _this.props.headerButtons;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            btnInfo = ref1[i];
            results.push(React.createElement(Button, {
              "bsStyle": btnInfo.style,
              "onClick": btnInfo.onClick
            }, btnInfo.text));
          }
          return results;
        };
      })(this)())), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered table-hover",
        "style": {
          borderBottomColor: "rgb(221, 221, 221)",
          borderBottomStyle: "solid",
          borderBottomWidth: 1
        }
      }, React.createElement("thead", null, (function(_this) {
        return function() {
          var k, ref1, ths, v;
          ths = (function() {
            var ref1, results;
            ref1 = this.props.collection.model.prototype.schema;
            results = [];
            for (k in ref1) {
              v = ref1[k];
              results.push(React.createElement("th", {
                "onClick": this.sort.bind(this, k)
              }, v.title, (function(_this) {
                return function() {
                  if (_this.state.sortField === k) {
                    if (_this.state.sortDir === "asc") {
                      return React.createElement("i", {
                        "className": 'glyphicon glyphicon-sort-by-attributes pull-right'
                      });
                    } else {
                      return React.createElement("i", {
                        "className": 'glyphicon glyphicon-sort-by-attributes-alt pull-right'
                      });
                    }
                  }
                };
              })(this)()));
            }
            return results;
          }).call(_this);
          if (((ref1 = _this.props.rowButtons) != null ? ref1.length : void 0) > 0) {
            ths.push(React.createElement("th", {
              "style": {
                width: "160px"
              }
            }));
          }
          return ths;
        };
      })(this)()), React.createElement("tbody", null, (function(_this) {
        return function() {
          var i, k, len, model, results, v;
          results = [];
          for (i = 0, len = pageCollection.length; i < len; i++) {
            model = pageCollection[i];
            results.push(React.createElement("tr", {
              "className": (_this.state.selectedRow === model ? "info" : "")
            }, (function() {
              var ref1, results1;
              ref1 = model.schema;
              results1 = [];
              for (k in ref1) {
                v = ref1[k];
                results1.push(React.createElement("td", {
                  "onClick": this.cellClick.bind(this, model, k)
                }, this.getCellContent(model, k)));
              }
              return results1;
            }).call(_this), React.createElement("td", null, (_this.props.rowButtons != null ? renderRowButton() : null))));
          }
          return results;
        };
      })(this)())), React.createElement(Pagination, {
        "prev": true,
        "next": true,
        "first": true,
        "last": true,
        "ellipsis": true,
        "items": pageCount,
        "maxButtons": pageRecordLength,
        "activePage": this.state.activePage,
        "onSelect": this.pageChange
      })));
    }
  });

  console.log("");

}).call(this);
