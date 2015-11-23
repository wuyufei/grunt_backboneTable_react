(function() {
  var BackboneTable, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Col, CreateCellContentMixin, Grid, Input, MenuItem, Modal, Overlay, Pagination, Popover, ReactTable, Row, SplitButton;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover, Pagination = ReactBootstrap.Pagination, ButtonGroup = ReactBootstrap.ButtonGroup, SplitButton = ReactBootstrap.SplitButton, MenuItem = ReactBootstrap.MenuItem;

  window.BackboneTable = BackboneTable = Backbone.View.extend({
    initialize: function(options) {
      return this.options = _.extend({}, options);
    },
    render: function() {
      return ReactDOM.render(React.createElement(ReactTable, React.__spread({}, this.options)), this.el);
    }
  });

  CreateCellContentMixin = {
    getCellContent: function(model, key) {
      var content, isEdit, opt, ref, ref1, schema;
      schema = model.schema[key];
      if (this.props.readonly === true) {
        isEdit = false;
      } else if (schema.edit === true || (model === ((ref = this.state.editCell) != null ? ref.model : void 0) && key === ((ref1 = this.state.editCell) != null ? ref1.key : void 0))) {
        isEdit = true;
      }
      switch (schema.type.toLowerCase()) {
        case "text":
          if (isEdit) {
            content = React.createElement("input", {
              "style": {
                height: 32
              },
              "className": "form-control",
              "type": "text",
              "bsSize": "small",
              "value": model.get(key),
              "autoFocus": "true"
            });
          } else {
            content = React.createElement("span", null, model.get(key));
          }
          break;
        case "select":
          if (isEdit) {
            content = React.createElement("select", {
              "style": {
                height: 32
              },
              "className": "form-control",
              "type": "checkbox",
              "bsSize": "small",
              "value": model.get(key),
              "autoFocus": "true"
            }, (function() {
              var i, len, ref2, results;
              ref2 = schema.options;
              results = [];
              for (i = 0, len = ref2.length; i < len; i++) {
                opt = ref2[i];
                results.push(React.createElement("option", {
                  "value": opt.val
                }, opt.label));
              }
              return results;
            })());
          } else {
            content = React.createElement("span", null, (_.findWhere(schema.options, {
              val: model.get(key)
            }).label));
          }
          break;
        case "checkbox":
          if (isEdit) {
            content = React.createElement("input", {
              "style": {
                height: 32,
                marginTop: 0
              },
              "className": "form-control",
              "type": "checkbox",
              "bsSize": "small",
              "checked": model.get(key) === "1",
              "autoFocus": "true"
            });
          } else if (model.get(key) === "1") {
            content = React.createElement("span", {
              "className": "glyphicon glyphicon-ok"
            });
          }
          break;
        case "datetime":
          if (isEdit) {
            content = React.createElement("div", {
              "className": "input-group input-append date form_datetime"
            }, React.createElement("input", {
              "style": {
                height: 32
              },
              "className": "form-control dtpControl_" + key,
              "autoFocus": "true",
              "value": model.get(key),
              "type": "text",
              "readOnly": "readonly"
            }), React.createElement("span", {
              "className": "input-group-addon add-on"
            }, React.createElement("i", {
              "className": "glyphicon glyphicon-remove"
            })));
          } else {
            content = React.createElement("span", null, model.get(key));
          }
          break;
        default:
          content = React.createElement("span", null, model.get(key));
      }
      return content;
    }
  };

  ReactTable = React.createClass({
    mixins: [CreateCellContentMixin],
    getInitialState: function() {
      return {
        activePage: 1
      };
    },
    componentWillMount: function() {},
    componentDidMount: function() {
      this.getColumnsWidth();
      return this.createDateTimePickerControl();
    },
    componentWillUpdate: function(nextProps, nextState) {
      var el, k, results, schema, v;
      el = $(this.getDOMNode());
      schema = this.props.collection.model.prototype.schema;
      results = [];
      for (k in schema) {
        v = schema[k];
        if (v.type.toLowerCase() === "datetime") {
          results.push(el.find(".dtpControl_" + k).datetimepicker("remove"));
        }
      }
      return results;
    },
    componentDidUpdate: function() {
      this.getColumnsWidth();
      return this.createDateTimePickerControl();
    },
    getColumnsWidth: function() {
      var $el, cellWidths, k, ref, v;
      cellWidths = {};
      ref = this.props.collection.model.prototype.schema;
      for (k in ref) {
        v = ref[k];
        $el = $(this.refs["th_" + k].getDOMNode());
        cellWidths[k] = $el.outerWidth();
      }
      return this.cellWidths = cellWidths;
    },
    createDateTimePickerControl: function() {
      var dtpControls, el, k, ref, results, schema, v;
      schema = this.props.collection.model.prototype.schema;
      el = $(this.getDOMNode());
      results = [];
      for (k in schema) {
        v = schema[k];
        if (!(v.type.toLowerCase() === "datetime")) {
          continue;
        }
        dtpControls = el.find(".dtpControl_" + k);
        dtpControls.datetimepicker({
          format: v.format,
          language: "zh-CN",
          weekStart: 1,
          todayBtn: 1,
          autoclose: 1,
          todayHighLight: 1,
          startView: 2,
          minView: 2,
          forceParse: 0,
          todayBtn: true,
          pickerPosition: "bottom-right"
        });
        if (((ref = this.state.editCell) != null ? ref.key : void 0) === k) {
          results.push(dtpControls.datetimepicker("show"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    cellClick: function(model, key, e) {
      this.setState({
        selectedRow: model
      });
      if (this.props.readonly !== true && model.schema[key].readonly !== true && model.schema[key].edit !== true) {
        return this.setState({
          editCell: {
            model: model,
            key: key
          }
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
        "className": "table table-bordered table-hover table-condensed",
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
                "ref": "th_" + k,
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
                width: 160,
                minWidth: 160
              }
            }));
          }
          return ths;
        };
      })(this)()), React.createElement("tbody", null, (function(_this) {
        return function() {
          var i, k, len, model, results, style, v;
          results = [];
          for (i = 0, len = pageCollection.length; i < len; i++) {
            model = pageCollection[i];
            results.push(React.createElement("tr", {
              "className": (_this.state.selectedRow === model ? "info" : "")
            }, (function() {
              var ref1, ref2, ref3, results1;
              ref1 = model.schema;
              results1 = [];
              for (k in ref1) {
                v = ref1[k];
                if (((ref2 = this.state.editCell) != null ? ref2.model : void 0) === model && this.state.editCell.key === k) {
                  style = {
                    padding: 0,
                    width: this.cellWidths[k]
                  };
                } else if (v.edit === true) {
                  style = {
                    padding: 0,
                    width: (ref3 = v.width) != null ? ref3 : 200
                  };
                } else {
                  style = {};
                }
                results1.push(React.createElement("td", {
                  "style": style,
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
