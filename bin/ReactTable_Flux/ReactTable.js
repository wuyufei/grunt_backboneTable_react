(function() {
  var BackboneTable, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Col, CreateCellContentMixin, Dropdown, Glyphicon, Grid, Input, MenuItem, Modal, Overlay, Pagination, Popover, ReactTable, Row, SplitButton;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover, Pagination = ReactBootstrap.Pagination, ButtonGroup = ReactBootstrap.ButtonGroup, SplitButton = ReactBootstrap.SplitButton, MenuItem = ReactBootstrap.MenuItem, Glyphicon = ReactBootstrap.Glyphicon, Dropdown = ReactBootstrap.Dropdown;

  window.BackboneTable = BackboneTable = Backbone.View.extend({
    initialize: function(options) {
      return this.options = _.extend({}, options);
    },
    setModel: function(model, key, value) {
      var error, invalidHandle;
      error = null;
      invalidHandle = function(model, er) {
        error = er;
        return model.set(key, value, {
          silent: true
        });
      };
      model.on("invalid", invalidHandle);
      model.set(key, value, {
        validate: true,
        silent: true
      });
      model.off("invalid", invalidHandle);
      if ((error != null ? error[key] : void 0) != null) {
        return error;
      } else {
        return null;
      }
    },
    render: function() {
      return ReactDOM.render(React.createElement(ReactTable, React.__spread({}, this.options, {
        "setModel": this.setModel
      })), this.el);
    }
  });

  CreateCellContentMixin = {
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
    componentDidMount: function() {
      this.getColumnsWidth();
      return this.createDateTimePickerControl();
    },
    componentDidUpdate: function() {
      this.getColumnsWidth();
      return this.createDateTimePickerControl();
    },
    getCellContent: function(model, key) {
      var content, error, isEdit, opt, ref, ref1, ref2, ref3, schema;
      schema = model.schema[key];
      ref = key + model.cid;
      if (this.props.readonly === true) {
        isEdit = false;
      } else if (schema.edit === true || (model === ((ref1 = this.state.editCell) != null ? ref1.model : void 0) && key === ((ref2 = this.state.editCell) != null ? ref2.key : void 0))) {
        isEdit = true;
      }
      if (isEdit) {
        content = (function() {
          switch (schema.type.toLowerCase()) {
            case "text":
              return React.createElement("input", {
                "style": {
                  height: 32
                },
                "ref": ref,
                "className": "form-control",
                "type": "text",
                "bsSize": "small",
                "value": model.get(key),
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              });
            case "select":
              return React.createElement("select", {
                "style": {
                  height: 32
                },
                "ref": ref,
                "className": "form-control",
                "bsSize": "small",
                "value": model.get(key),
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              }, (function() {
                var i, len, ref3, results;
                ref3 = schema.options;
                results = [];
                for (i = 0, len = ref3.length; i < len; i++) {
                  opt = ref3[i];
                  results.push(React.createElement("option", {
                    "value": opt.val
                  }, opt.label));
                }
                return results;
              })());
            case "checkbox":
              return React.createElement("input", {
                "style": {
                  height: 32,
                  marginTop: 0
                },
                "className": "form-control",
                "type": "checkbox",
                "bsSize": "small",
                "checked": model.get(key) === "1",
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              });
            case "datetime":
              return React.createElement("div", {
                "className": "input-group input-append date form_datetime"
              }, React.createElement("input", {
                "ref": ref,
                "style": {
                  height: 32
                },
                "className": "form-control dtpControl_" + key,
                "autoFocus": "true",
                "data-cid": model.cid,
                "value": model.get(key),
                "type": "text",
                "onChange": this.onCellValueChange.bind(this, model, key),
                "readOnly": "readonly"
              }), React.createElement("span", {
                "className": "input-group-addon add-on",
                "onClick": this.onCellEndEdit.bind(this, model, key)
              }, React.createElement("i", {
                "className": "glyphicon glyphicon-remove"
              })));
          }
        }).call(this);
      } else {
        content = React.createElement("span", null, model.get(key));
        if (schema.type.toLowerCase() === "checkbox") {
          if (model.get(key) === "1") {
            content = React.createElement("span", {
              "className": "glyphicon glyphicon-ok"
            });
          } else {
            content = React.createElement("span", null);
          }
        } else if (schema.type.toLowerCase() === "select") {
          content = React.createElement("span", null, (_.findWhere(schema.options, {
            val: model.get(key)
          }).label));
        }
      }
      if (((ref3 = this.state.error) != null ? ref3.model : void 0) === model && this.state.error.key === key) {
        error = React.createElement(Overlay, {
          "show": true,
          "target": ((function(_this) {
            return function() {
              return ReactDOM.findDOMNode(_this.refs[ref]);
            };
          })(this)),
          "placement": "right"
        }, React.createElement(Popover, null, this.state.error.msg));
        content = [content, error];
      }
      return content;
    },
    getModalFieldContent: function(model, key) {
      var opt, options, schema, type;
      schema = model.schema[key];
      type = schema.type.toLowerCase();
      switch (type) {
        case "text":
          return React.createElement(Input, {
            "type": "text",
            "addonBefore": schema.title,
            "value": model.get(key)
          });
        case "select":
          return React.createElement(Input, {
            "type": "select",
            "addonBefore": schema.title,
            "value": model.get(key)
          }, (options = (function() {
            var i, len, ref1, results;
            ref1 = schema.options;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
              opt = ref1[i];
              results.push(React.createElement("option", {
                "value": opt.val
              }, opt.label));
            }
            return results;
          })()));
        case "datetime":
          return React.createElement(Input, {
            "type": "text",
            "disabled": true,
            "addonBefore": schema.title,
            "buttonAfter": React.createElement(Button, null, React.createElement(Glyphicon, {
              "glyph": "remove"
            })),
            "value": model.get(key)
          });
        case "checkbox":
          return React.createElement(Input, {
            "type": "checkbox",
            "bsSize": "small",
            "label": schema.title,
            "value": model.get(key)
          });
        default:
          return React.createElement(Input, {
            "type": "text",
            "addonBefore": schema.title,
            "value": model.get(key)
          });
      }
    },
    onCellValueChange: function(model, key, e) {
      var error, value;
      value = model.schema[key].type.toLowerCase() === "checkbox" ? (e.target.checked === true ? "1" : "0") : e.target.value;
      error = this.props.setModel(model, key, value);
      if (error) {
        return this.setState({
          error: {
            model: model,
            key: key,
            msg: error[key]
          }
        });
      } else {
        return this.setState({
          error: null
        });
      }
    },
    onCellEndEdit: function(model, key, e) {
      var error, value;
      value = model.schema[key].type.toLowerCase() === "checkbox" ? (e.target.checked === true ? "1" : "0") : e.target.value;
      error = this.props.setModel(model, key, value);
      if (error) {
        this.setState({
          error: {
            model: model,
            key: key,
            msg: error[key]
          },
          editCellIsValidate: false
        });
      } else {
        this.setState({
          error: null,
          editCellIsValidate: true,
          editCell: null
        });
      }
      e.preventDefault();
      return e.stopPropagation();
    },
    createDateTimePickerControl: function() {
      var dtpControls, el, k, ref1, results, schema, that, v;
      that = this;
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
        dtpControls.on("changeDate", (function(k) {
          return function(e) {
            var $el, model, ref1;
            $el = $(e.currentTarget);
            model = that.props.collection.get($el.data("cid"));
            e = {
              target: {
                value: $el.val()
              }
            };
            that.onCellEndEdit(model, k, e);
            if (((ref1 = that.state.editCell) != null ? ref1.model : void 0) === model && that.state.editCell.key === k) {
              return that.setState({
                editCell: null
              });
            }
          };
        })(k));
        if (((ref1 = this.state.editCell) != null ? ref1.key : void 0) === k) {
          results.push(dtpControls.datetimepicker("show"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    getButtonProps: function(buttonInfo) {
      debugger;
      var btnProps, ref1, ref2, that;
      that = this;
      btnProps = {};
      switch (buttonInfo.command) {
        case "detail":
          btnProps.clickHandle = this.detailButtonHandle;
          btnProps.bsStyle = "info";
          btnProps.icon = "list";
          break;
        case "edit":
          btnProps.clickHandle = this.editButtonHandle;
          btnProps.bsStyle = "primary";
          btnProps.icon = "edit";
          break;
        case "delete":
          btnProps.clickHandle = this.deleteButtonHandle;
          btnProps.bsStyle = "danger";
          btnProps.icon = "trash";
          break;
        default:
          btnProps.clickHandle = buttonInfo.onclick;
          btnProps.bsStyle = (ref1 = buttonInfo.btnClass) != null ? ref1 : "info";
          btnProps.icon = (ref2 = buttonInfo.iconClass) != null ? ref2 : "list";
      }
      return btnProps;
    },
    getColumnsWidth: function() {
      var $el, cellWidths, k, ref1, v;
      cellWidths = {};
      ref1 = this.props.collection.model.prototype.schema;
      for (k in ref1) {
        v = ref1[k];
        $el = $(this.refs["th_" + k].getDOMNode());
        cellWidths[k] = $el.outerWidth();
      }
      return this.cellWidths = cellWidths;
    },
    getSortCollection: function() {
      var getSortValue, schema, sortModels, that;
      that = this;
      sortModels = _.clone(this.props.collection.models);
      schema = this.props.collection.model.prototype.schema;
      if (this.state.sortField) {
        getSortValue = schema[this.state.sortField].sortValue;
        sortModels.sort(function(a, b) {
          var ref1, ref2;
          a = (ref1 = typeof getSortValue === "function" ? getSortValue(a) : void 0) != null ? ref1 : a.get(that.state.sortField);
          b = (ref2 = typeof getSortValue === "function" ? getSortValue(b) : void 0) != null ? ref2 : b.get(that.state.sortField);
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
    }
  };

  ReactTable = React.createClass({
    mixins: [CreateCellContentMixin],
    getInitialState: function() {
      return {
        activePage: 1,
        editCellIsValidate: true,
        showModal: false
      };
    },
    componentWillMount: function() {},
    componentDidMount: function() {},
    componentWillUpdate: function(nextProps, nextState) {},
    componentDidUpdate: function() {},
    showModalHandle: function() {
      return this.setState({
        showModal: true
      });
    },
    hideModalHandle: function() {
      return this.setState({
        showModal: false
      });
    },
    cellClickHandle: function(model, key, e) {
      this.setState({
        selectedRow: model
      });
      if (this.props.readonly !== true && model.schema[key].readonly !== true && model.schema[key].edit !== true && this.state.editCellIsValidate === true) {
        return this.setState({
          editCell: {
            model: model,
            key: key
          }
        });
      }
    },
    columnHeaderClickHandle: function(name) {
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
    pageChangeHandle: function(event, selectedEvent) {
      return this.setState({
        activePage: selectedEvent.eventKey
      });
    },
    detailButtonHandle: function(model, e) {
      return alert("");
    },
    editButtonHandle: function(model, e) {},
    addButtonHandle: function(model, e) {},
    deleteButtonHandle: function(model, e) {},
    selectButtonClick: function(model, e, eventKey) {
      return alert(eventKey);
    },
    render: function() {
      var pageCollection, pageCount, pageRecordLength, ref1, sortCollection;
      pageRecordLength = (ref1 = this.props.pageRecordLength) != null ? ref1 : 10;
      pageCount = Math.ceil(this.props.collection.length / 10);
      sortCollection = this.getSortCollection();
      pageCollection = sortCollection.slice((this.state.activePage - 1) * 10, +(this.state.activePage * 10 - 1) + 1 || 9e9);
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
          var btnInfo, i, len, ref2, results;
          ref2 = _this.props.headerButtons;
          results = [];
          for (i = 0, len = ref2.length; i < len; i++) {
            btnInfo = ref2[i];
            results.push(React.createElement(Button, {
              "bsStyle": "primary",
              "bsSize": "small",
              "onClick": btnInfo.onClick,
              "onClick": _this.showModalHandle
            }, React.createElement(Glyphicon, {
              "glyph": "plus"
            }), " " + btnInfo.text));
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
          var k, ref2, ths, v;
          ths = (function() {
            var ref2, results;
            ref2 = this.props.collection.model.prototype.schema;
            results = [];
            for (k in ref2) {
              v = ref2[k];
              results.push(React.createElement("th", {
                "ref": "th_" + k,
                "onClick": this.columnHeaderClickHandle.bind(this, k)
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
          if (((ref2 = _this.props.rowButtons) != null ? ref2.length : void 0) > 0) {
            ths.push(React.createElement("th", {
              "style": {
                width: 160,
                minWidth: 200
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
              var ref2, ref3, ref4, results1;
              ref2 = model.schema;
              results1 = [];
              for (k in ref2) {
                v = ref2[k];
                if (((ref3 = this.state.editCell) != null ? ref3.model : void 0) === model && this.state.editCell.key === k) {
                  style = {
                    padding: 0,
                    width: this.cellWidths[k]
                  };
                } else if (v.edit === true) {
                  style = {
                    padding: 0,
                    width: (ref4 = v.width) != null ? ref4 : 200
                  };
                } else {
                  style = {};
                }
                results1.push(React.createElement("td", {
                  "style": style,
                  "onClick": this.cellClickHandle.bind(this, model, k)
                }, this.getCellContent(model, k)));
              }
              return results1;
            }).call(_this), React.createElement("td", null, React.createElement(ButtonGroup, {
              "bsSize": "xsmall"
            }, (function() {
              var btnInfo, btnProps, j, len1, ref2, ref3, ref4, result, tmp1;
              if (((ref2 = _this.props.rowButtons) != null ? ref2.length : void 0) <= 3) {
                ref3 = _this.props.rowButtons.slice(0, 3);
                for (j = 0, len1 = ref3.length; j < len1; j++) {
                  btnInfo = ref3[j];
                  if (!(btnInfo != null)) {
                    continue;
                  }
                  btnProps = _this.getButtonProps(btnInfo);
                  React.createElement(Button, {
                    "onClick": btnProps.clickHandle.bind(_this, model),
                    "bsStyle": btnProps.bsStyle
                  }, React.createElement(Glyphicon, {
                    "glyph": btnProps.icon
                  }), " " + btnInfo.text);
                }
              } else if (((ref4 = _this.props.rowButtons) != null ? ref4.length : void 0) > 3) {
                result = (function() {
                  var l, len2, ref5, ref6, results1;
                  ref5 = this.props.rowButtons.slice(0, 2);
                  results1 = [];
                  for (l = 0, len2 = ref5.length; l < len2; l++) {
                    btnInfo = ref5[l];
                    btnProps = this.getButtonProps(btnInfo);
                    results1.push(React.createElement(Button, {
                      "onClick": (ref6 = btnProps.clickHandle) != null ? ref6.bind(this, model) : void 0,
                      "bsStyle": btnProps.bsStyle
                    }, React.createElement(Glyphicon, {
                      "glyph": btnProps.icon
                    }), " " + btnInfo.text));
                  }
                  return results1;
                }).call(_this);
                btnProps = _this.getButtonProps(_this.props.rowButtons[2]);
                tmp1 = React.createElement(Dropdown, {
                  "id": "dropdown-custom-2",
                  "bsSize": "xsmall",
                  "onSelect": _this.selectButtonClick.bind(_this, model)
                }, React.createElement(Button, {
                  "onClick": btnProps.clickHandle.bind(_this, model),
                  "bsStyle": btnProps.bsStyle
                }, React.createElement(Glyphicon, {
                  "glyph": btnProps.icon
                }), " " + _this.props.rowButtons[2].text), React.createElement(Dropdown.Toggle, {
                  "bsStyle": "default"
                }), React.createElement(Dropdown.Menu, null, (function() {
                  var l, len2, ref5, results1;
                  ref5 = _this.props.rowButtons.slice(3);
                  results1 = [];
                  for (l = 0, len2 = ref5.length; l < len2; l++) {
                    btnInfo = ref5[l];
                    btnProps = _this.getButtonProps(btnInfo);
                    results1.push(React.createElement(MenuItem, {
                      "eventKey": btnInfo.command
                    }, btnInfo.text));
                  }
                  return results1;
                })()));
              }
              result.push(tmp1);
              return result;
            })()))));
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
        "onSelect": this.pageChangeHandle
      })), React.createElement(Modal, {
        "show": this.state.showModal,
        "onHide": this.hideModalHandle,
        "bsSize": "large"
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u8be6\u60c5")), React.createElement(Modal.Body, null, React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, (function(_this) {
        return function() {
          var k, model, ref2, results, v;
          if (_this.state.selectedRow != null) {
            model = _this.state.selectedRow;
            ref2 = model.schema;
            results = [];
            for (k in ref2) {
              v = ref2[k];
              results.push(React.createElement(Col, {
                "xs": 12.,
                "sm": 6.,
                "md": 6.
              }, _this.getModalFieldContent(model, k)));
            }
            return results;
          }
        };
      })(this)()))), React.createElement(Modal.Footer, null, React.createElement(Button, {
        "bsStyle": "primary"
      }, "\u4fdd\u5b58"), React.createElement(Button, {
        "bsStyle": "default",
        "onClick": this.hideModalHandle
      }, "\u53d6\u6d88"))));
    }
  });

  console.log("");

}).call(this);
