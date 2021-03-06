(function() {
  var BackboneTable, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Col, CreateCellContentMixin, DateTimeCellMixin, Dropdown, Glyphicon, Grid, Input, MenuItem, Modal, Overlay, Pagination, Popover, ReactTable, Row, SplitButton;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover, Pagination = ReactBootstrap.Pagination, ButtonGroup = ReactBootstrap.ButtonGroup, SplitButton = ReactBootstrap.SplitButton, MenuItem = ReactBootstrap.MenuItem, Glyphicon = ReactBootstrap.Glyphicon, Dropdown = ReactBootstrap.Dropdown;

  window.BackboneTable = BackboneTable = Backbone.View.extend({
    initialize: function(options) {
      this.options = _.extend({}, options);
      return this.listenTo(this.collection, "sync destroy add remove", this.render);
    },
    getSortList: function(field, dir) {
      var getSortValue, schema, sortModels, that;
      that = this;
      sortModels = _.clone(this.collection.models);
      schema = this.collection.model.prototype.schema;
      if (field) {
        getSortValue = schema[field].sortValue;
        sortModels.sort(function(a, b) {
          var ref1, ref2;
          a = (ref1 = typeof getSortValue === "function" ? getSortValue(a) : void 0) != null ? ref1 : a.get(field);
          b = (ref2 = typeof getSortValue === "function" ? getSortValue(b) : void 0) != null ? ref2 : b.get(field);
          if (_.isString(a)) {
            return a.localeCompare(b);
          } else {
            return a - b;
          }
        });
        if (dir === "desc") {
          sortModels.reverse();
        }
      }
      return sortModels;
    },
    getNewModel: function() {
      return new this.collection.model();
    },
    deleteModel: function(model) {
      var er;
      er = "";
      model.destroy({
        async: false,
        success: function() {
          return er = "";
        },
        error: function(msg) {
          return er = msg;
        }
      });
      return er;
    },
    saveModel: function(model, props) {
      var isNew, that;
      that = this;
      isNew = model.isNew();
      return model.save(props, {
        success: function() {
          if (isNew) {
            that.collection.add(model);
          }
          return that.render();
        },
        error: function() {}
      });
    },
    render: function() {
      return ReactDOM.render(React.createElement(ReactTable, React.__spread({}, this.options, {
        "saveModel": this.saveModel.bind(this),
        "deleteModel": this.deleteModel,
        "getSortList": this.getSortList,
        "getNewModel": this.getNewModel
      })), this.el);
    }
  });

  DateTimeCellMixin = {
    componentWillUpdate: function(nextProps, nextState) {
      var el, k, modalBody, results, schema, v;
      el = $(this.getDOMNode());
      modalBody = $(React.findDOMNode(this.refs.modalBody));
      schema = this.props.collection.model.prototype.schema;
      results = [];
      for (k in schema) {
        v = schema[k];
        if (!(v.type.toLowerCase() === "datetime")) {
          continue;
        }
        el.find(".dtpControl_" + k).datetimepicker("remove");
        results.push(modalBody.find(".dtpControl_" + k).datetimepicker("remove"));
      }
      return results;
    },
    componentDidMount: function() {
      return this.createDateTimePickerControl();
    },
    componentDidUpdate: function() {
      return this.createDateTimePickerControl();
    },
    createDateTimePickerControl: function() {
      var dtpControls, el, k, modalBody, ref1, results, schema, that, v;
      that = this;
      schema = this.props.collection.model.prototype.schema;
      if (this.state.showModal) {
        modalBody = $(React.findDOMNode(this.refs.modalBody));
        for (k in schema) {
          v = schema[k];
          if (!(v.type.toLowerCase() === "datetime")) {
            continue;
          }
          debugger;
          dtpControls = modalBody.find(".dtpControl_" + k);
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
          dtpControls.off("changeDate");
          dtpControls.on("changeDate", (function(k) {
            return function(e) {
              var $el, model;
              $el = $(e.currentTarget);
              model = that.state.modalFormModel;
              e = {
                target: {
                  value: $el.val()
                }
              };
              return that.onModalFieldValueChange(model, k, e);
            };
          })(k));
        }
      }
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
    }
  };

  CreateCellContentMixin = {
    componentDidMount: function() {
      return this.getColumnsWidth();
    },
    componentDidUpdate: function() {
      return this.getColumnsWidth();
    },
    getCellContent: function(model, key) {
      var content, displayValue, error, format, isEdit, opt, ref, ref1, ref2, ref3, ref4, ref5, schema;
      schema = model.schema[key];
      ref = key + model.cid;
      if (this.props.readonly === true) {
        isEdit = false;
      } else if (schema.edit === true || (model === ((ref1 = this.state.editCell) != null ? ref1.model : void 0) && key === ((ref2 = this.state.editCell) != null ? ref2.key : void 0))) {
        isEdit = true;
      } else {
        isEdit = false;
      }
      if (isEdit) {
        content = (function() {
          var ref3;
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
                "value": this.state.editCell.value,
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
                "value": this.state.editCell.value,
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              }, (function() {
                var i, len, ref3, ref4, results;
                ref3 = schema.options;
                results = [];
                for (i = 0, len = ref3.length; i < len; i++) {
                  opt = ref3[i];
                  results.push(React.createElement("option", {
                    "value": (ref4 = opt.val) != null ? ref4 : " "
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
                "checked": this.state.editCell.value === "1",
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              });
            case "datetime":
              format = ((ref3 = schema.format) != null ? ref3 : "YYYY-MM-DD").toUpperCase();
              displayValue = $.trim(this.state.editCell.value) === "" ? "" : moment(this.state.editCell.value).format(format);
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
                "value": displayValue,
                "type": "text",
                "onChange": this.onCellValueChange.bind(this, model, key),
                "readOnly": "readonly"
              }), React.createElement("span", {
                "className": "input-group-addon add-on",
                "onClick": this.onCellEndEdit.bind(this, model, key)
              }, React.createElement("i", {
                "className": "glyphicon glyphicon-remove"
              })));
            default:
              return React.createElement("input", {
                "style": {
                  height: 32
                },
                "ref": ref,
                "className": "form-control",
                "type": "text",
                "bsSize": "small",
                "value": this.state.editCell.value,
                "onChange": this.onCellValueChange.bind(this, model, key),
                "onBlur": this.onCellEndEdit.bind(this, model, key),
                "autoFocus": "true"
              });
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
          content = React.createElement("span", null, ((ref3 = _.findWhere(schema.options, {
            val: model.get(key)
          })) != null ? ref3.label : void 0));
        } else if (schema.type.toLowerCase() === "datetime") {
          format = ((ref4 = schema.format) != null ? ref4 : "YYYY-MM-DD").toUpperCase();
          displayValue = $.trim(model.get(key)) === "" ? "" : moment(model.get(key)).format(format);
          content = React.createElement("span", null, displayValue);
        } else if (schema.type.toLowerCase() === "fileinput") {
          if (model.get(key)) {
            content = React.createElement("a", {
              "href": model.get(key),
              "target": "_blank",
              "className": "btn btn-xs btn-info"
            }, React.createElement("span", {
              "className": "glyphicon glyphicon-download"
            }), " \u4e0b\u8f7d");
          } else {
            content = null;
          }
        }
      }
      if (((ref5 = this.state.error) != null ? ref5.model : void 0) === model && this.state.error.key === key) {
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
      var addonBefore, content, dateFormat, displayValue, emptyValue, error, fuOpt, opt, options, ref, ref1, ref2, ref3, schema, that, timeClearButton, type;
      that = this;
      ref = "modalForm" + key + model.cid;
      schema = model.schema[key];
      type = schema.type.toLowerCase();
      emptyValue = {
        target: {
          value: ""
        }
      };
      timeClearButton = React.createElement(Button, {
        "onClick": this.onModalFieldValueChange.bind(this, model, key, emptyValue)
      }, React.createElement(Glyphicon, {
        "glyph": "remove"
      }));
      if ((model != null ? (ref1 = model.validation) != null ? (ref2 = ref1[key]) != null ? ref2.required : void 0 : void 0 : void 0) === true) {
        addonBefore = schema.title + "*";
      } else {
        addonBefore = schema.title;
      }
      content = (function() {
        var ref3;
        switch (type) {
          case "text":
            return React.createElement(Input, {
              "type": "text",
              "ref": ref,
              "addonBefore": addonBefore,
              "value": this.state.modalFormValues[key],
              "onChange": this.onModalFieldValueChange.bind(this, model, key)
            });
          case "select":
            return React.createElement(Input, {
              "type": "select",
              "ref": ref,
              "addonBefore": schema.title,
              "value": this.state.modalFormValues[key],
              "onChange": this.onModalFieldValueChange.bind(this, model, key)
            }, (options = (function() {
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
            })()));
          case "datetime":
            dateFormat = ((ref3 = schema.format) != null ? ref3 : "YYYY-MM-DD").toUpperCase();
            displayValue = $.trim(this.state.modalFormValues[key]) === "" ? "" : moment(this.state.modalFormValues[key]).format(dateFormat);
            return React.createElement(Input, {
              "type": "text",
              "ref": ref,
              "data-cid": model.cid,
              "className": "dtpControl_" + key + " form_datetime",
              "addonBefore": schema.title,
              "buttonAfter": timeClearButton,
              "value": displayValue
            });
          case "checkbox":
            return React.createElement(Input, {
              "type": "checkbox",
              "ref": ref,
              "bsSize": "small",
              "label": schema.title,
              "checked": this.state.modalFormValues[key] === "1",
              "onChange": this.onModalFieldValueChange.bind(this, model, key)
            });
          case "fileinput":
            fuOpt = {
              baseUrl: schema.url,
              dataType: "string",
              chooseFile: function(files, mill) {
                return that.refs.fileInputText.value = files[0].name;
              },
              beforeUpload: function(files, nill) {},
              uploadSuccess: function(resp) {
                return that.onModalFieldValueChange(model, key, resp.url);
              },
              uploadFail: function(resp) {
                debugger;
              },
              param: {
                fileCategory: schema.fileCategory
              }
            };
            return React.createElement("div", {
              "className": "input-group"
            }, React.createElement("span", {
              "className": "input-group-addon"
            }, addonBefore), React.createElement("input", {
              "type": "text",
              "ref": "fileInputText",
              "className": "form-control"
            }), React.createElement("span", {
              "className": "input-group-addon"
            }, React.createElement(FileUpload, {
              "options": fuOpt,
              "style": {
                height: 20
              }
            }, React.createElement("button", {
              "className": "btn btn-default btn-xs",
              "ref": "uploadBtn"
            }, React.createElement("span", {
              "className": "glyphicon glyphicon glyphicon-upload",
              "aria-hidden": "true"
            }), "  \u4e0a\u4f20"), React.createElement("button", {
              "className": "btn btn-info btn-xs",
              "ref": "chooseBtn"
            }, React.createElement("span", {
              "className": "glyphicon glyphicon glyphicon-folder-open",
              "aria-hidden": "true"
            }), "  \u6d4f\u89c8"))));
          default:
            return React.createElement(Input, {
              "type": "text",
              "addonBefore": schema.title,
              "ref": ref,
              "value": this.state.modalFormValues[key],
              "onChange": this.onModalFieldValueChange.bind(this, model, key)
            });
        }
      }).call(this);
      if (((ref3 = this.state.modalFormError) != null ? ref3[key] : void 0) != null) {
        error = React.createElement(Overlay, {
          "show": true,
          "target": ((function(_this) {
            return function() {
              return ReactDOM.findDOMNode(_this.refs[ref]);
            };
          })(this)),
          "container": this,
          "placement": "top"
        }, React.createElement(Popover, {
          "style": {
            zIndex: 99999
          }
        }, this.state.modalFormError[key]));
        content = [content, error];
      }
      return content;
    },
    onModalFieldValueChange: function(model, key, e) {
      var error, formValues, value;
      if (model.schema[key].type.toLowerCase() === "fileinput") {
        value = e;
      } else {
        value = model.schema[key].type.toLowerCase() === "checkbox" ? (e.target.checked === true ? "1" : "0") : e.target.value;
      }
      formValues = this.state.modalFormValues;
      formValues[key] = value;
      this.setState({
        modalFormValues: formValues
      });
      error = model.validate(formValues);
      return this.setState({
        modalFormError: error
      });
    },
    onCellValueChange: function(model, key, e) {
      var error, obj, value;
      value = model.schema[key].type.toLowerCase() === "checkbox" ? (e.target.checked === true ? "1" : "0") : e.target.value;
      obj = {};
      obj[key] = value;
      error = model.validate(obj);
      if (error) {
        return this.setState({
          error: {
            model: model,
            key: key,
            msg: error[key]
          },
          editCell: {
            model: model,
            key: key,
            value: value
          }
        });
      } else {
        model.set(obj);
        return this.setState({
          error: null,
          editCell: {
            model: model,
            key: key,
            value: value
          }
        });
      }
    },
    onCellEndEdit: function(model, key, e) {
      var error, obj, value;
      value = model.schema[key].type.toLowerCase() === "checkbox" ? (e.target.checked === true ? "1" : "0") : e.target.value;
      obj = {};
      obj[key] = value;
      error = model.validate(obj);
      if (error) {
        this.setState({
          error: {
            model: model,
            key: key,
            msg: error[key]
          },
          editCell: {
            model: model,
            key: key,
            value: value
          },
          editCellIsValidate: false
        });
      } else {
        model.set(obj);
        this.setState({
          error: null,
          editCellIsValidate: true,
          editCell: null
        });
      }
      e.preventDefault();
      return e.stopPropagation();
    },
    getButtonProps: function(buttonInfo) {
      var btnProps, ref1, ref2;
      btnProps = {};
      switch (buttonInfo.command) {
        case "detail":
          btnProps.clickHandle = this.buttonClickHandle.bind(this, "detail");
          btnProps.bsStyle = "info";
          btnProps.icon = "list";
          break;
        case "edit":
          btnProps.clickHandle = this.buttonClickHandle.bind(this, "edit");
          btnProps.bsStyle = "primary";
          btnProps.icon = "edit";
          break;
        case "delete":
          btnProps.clickHandle = this.buttonClickHandle.bind(this, "delete");
          btnProps.bsStyle = "danger";
          btnProps.icon = "trash";
          break;
        case "add":
          btnProps.clickHandle = this.buttonClickHandle.bind(this, "add");
          btnProps.bsStyle = "primary";
          btnProps.icon = "plus";
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
        if (!(v.visible !== false)) {
          continue;
        }
        $el = $(this.refs["th_" + k].getDOMNode());
        cellWidths[k] = $el.outerWidth() === 0 ? 120 : $el.outerWidth();
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
    mixins: [DateTimeCellMixin, CreateCellContentMixin],
    getInitialState: function() {
      var ref1, ref2;
      return {
        activePage: 1,
        selectedRow: null,
        showModal: false,
        showConfirmModal: false,
        sortField: (ref1 = this.props.sortField) != null ? ref1 : null,
        sortDir: (ref2 = this.props.sortDir) != null ? ref2 : "asc",
        editCell: {
          model: null,
          key: null,
          error: null
        },
        modalFormValues: null,
        modalFormModel: null,
        editCellIsValidate: true,
        error: {
          model: null,
          key: null,
          msg: null
        }
      };
    },
    componentWillMount: function() {
      return this.sortList = this.props.getSortList(this.state.sortField, this.state.sortDir);
    },
    componentWillReceiveProps: function(nextProps) {
      this.sortList = this.props.getSortList(this.state.sortField, this.state.sortDir);
      return this.setState({
        showModal: false,
        showConfirmModal: false
      });
    },
    hideModalHandle: function() {
      return this.setState({
        showModal: false
      });
    },
    hideConfirmModalHandle: function() {
      return this.setState({
        showConfirmModal: false
      });
    },
    deleteConfirmButtonClickHandle: function() {
      debugger;
      var error;
      error = this.props.deleteModel(this.state.selectedRow);
      this.hideConfirmModalHandle();
      if (error) {
        return alert(error);
      }
    },
    saveButtonHandle: function() {
      debugger;
      var error, k, obj, schemas, v, values;
      schemas = this.props.collection.model.prototype.schema;
      obj = {};
      for (k in schemas) {
        v = schemas[k];
        obj[k] = void 0;
      }
      values = _.extend(obj, this.state.modalFormValues);
      error = this.state.modalFormModel.validate(values);
      if (error) {
        return this.setState({
          modalFormError: error
        });
      } else {
        return this.props.saveModel(this.state.modalFormModel, this.state.modalFormValues);
      }
    },
    cellClickHandle: function(model, key, e) {
      var ref1;
      if (this.setState.selectedRow !== model) {
        this.setState({
          selectedRow: model
        });
      }
      if (this.props.readonly !== true && model.schema[key].readonly !== true && model.schema[key].edit !== true && this.state.editCellIsValidate === true) {
        if (!(((ref1 = this.state.editCell) != null ? ref1.model : void 0) === model && this.state.editCell.key === key)) {
          return this.setState({
            editCell: {
              model: model,
              key: key,
              value: model.get(key)
            }
          });
        }
      }
    },
    columnHeaderClickHandle: function(name) {
      debugger;
      var dir;
      if (this.props.allowSorting !== false) {
        dir = this.state.sortField === name && this.state.sortDir === "asc" ? dir = "desc" : dir = "asc";
        this.setState({
          sortField: name,
          sortDir: dir
        });
        return this.sortList = this.props.getSortList(name, dir);
      }
    },
    pageChangeHandle: function(event, selectedEvent) {
      return this.setState({
        activePage: selectedEvent.eventKey
      });
    },
    buttonClickHandle: function(command, model, e) {
      var ref1, ref2, ref3, ref4, ref5, ref6;
      if ((ref1 = this.props.buttons) != null) {
        if ((ref2 = ref1.rowButtons) != null) {
          if ((ref3 = ref2[command]) != null) {
            if (typeof ref3.onclick === "function") {
              ref3.onclick(model, e);
            }
          }
        }
      }
      if ((ref4 = this.props.buttons) != null) {
        if ((ref5 = ref4.headerButtons) != null) {
          if ((ref6 = ref5[command]) != null) {
            if (typeof ref6.onclick === "function") {
              ref6.onclick(model, e);
            }
          }
        }
      }
      if ((e != null ? typeof e.isDefaultPrevented === "function" ? e.isDefaultPrevented() : void 0 : void 0) !== true) {
        switch (command) {
          case "add":
            model = this.props.getNewModel();
            return this.setState({
              showModal: true,
              action: command,
              modalFormModel: model,
              modalFormValues: _.extend({}, model.attributes),
              modalFormError: null
            });
          case "edit":
            return this.setState({
              selectedRow: model,
              showModal: true,
              action: command,
              modalFormModel: model,
              modalFormValues: _.extend({}, model.attributes),
              modalFormError: null
            });
          case "detail":
            return this.setState({
              selectedRow: model,
              showModal: true,
              action: command,
              modalFormModel: model,
              modalFormValues: _.extend({}, model.attributes),
              modalFormError: null
            });
          case "delete":
            return this.setState({
              selectedRow: model,
              showConfirmModal: true,
              action: command
            });
        }
      }
    },
    render: function() {
      var btnInfo, btnProps, buttonCellWidth, buttons, columns, displayedPageRecordLength, displayedPagesLength, fieldsetProps, k, model, obj, pageCollection, pageCount, ref1, ref2, ref3, result, sortCollection, style, tmp1, v;
      if (this.props.allowPage !== false) {
        displayedPageRecordLength = (ref1 = this.props.displayedPageRecordLength) != null ? ref1 : 10;
        displayedPagesLength = (ref2 = this.props.displayedPagesLength) != null ? ref2 : 10;
        pageCount = Math.ceil(this.props.collection.length / displayedPageRecordLength);
        sortCollection = this.sortList;
        pageCollection = sortCollection.slice((this.state.activePage - 1) * displayedPageRecordLength, +(this.state.activePage * displayedPageRecordLength - 1) + 1 || 9e9);
      } else {
        pageCollection = this.sortList;
      }
      if (this.state.action === "detail") {
        fieldsetProps = {
          disabled: "disabled"
        };
      } else {
        fieldsetProps = {};
      }
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
      }, (buttons = (function() {
        var ref3, results;
        ref3 = this.props.buttons.headerButtons;
        results = [];
        for (k in ref3) {
          v = ref3[k];
          obj = _.extend({}, v);
          obj.command = k;
          results.push(obj);
        }
        return results;
      }).call(this), (buttons != null ? buttons.length : void 0) > 0 ? React.createElement(ButtonGroup, null, (function() {
        var i, len, ref3, results;
        results = [];
        for (i = 0, len = buttons.length; i < len; i++) {
          btnInfo = buttons[i];
          btnProps = this.getButtonProps(btnInfo);
          results.push(React.createElement(Button, {
            "onClick": (ref3 = btnProps.clickHandle) != null ? ref3.bind(this, null) : void 0,
            "bsSize": "small",
            "bsStyle": btnProps.bsStyle
          }, React.createElement(Glyphicon, {
            "glyph": btnProps.icon
          }), " " + btnInfo.text));
        }
        return results;
      }).call(this)) : void 0))), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered table-hover table-condensed",
        "style": {
          borderBottomColor: "rgb(221, 221, 221)",
          borderBottomStyle: "solid",
          borderBottomWidth: 1
        }
      }, React.createElement("thead", null, (columns = (function() {
        var ref3, results;
        ref3 = this.props.collection.model.prototype.schema;
        results = [];
        for (k in ref3) {
          v = ref3[k];
          if (v.visible !== false) {
            results.push(React.createElement("th", {
              "style": {
                whiteSpace: "nowrap"
              },
              "ref": "th_" + k,
              "onClick": this.columnHeaderClickHandle.bind(this, k)
            }, v.title, (this.state.sortField === k ? this.state.sortDir === "asc" ? React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes pull-right'
            }) : React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes-alt pull-right'
            }) : void 0)));
          }
        }
        return results;
      }).call(this), buttons = (function() {
        var ref3, results;
        ref3 = this.props.buttons.rowButtons;
        results = [];
        for (k in ref3) {
          v = ref3[k];
          obj = _.extend({}, v);
          obj.command = k;
          results.push(obj);
        }
        return results;
      }).call(this), buttonCellWidth = 70 * (buttons.length > 3 ? 3 : buttons.length) + 10, (this.props.buttons.rowButtons != null) && _.size(this.props.buttons.rowButtons) > 0 ? columns.push(React.createElement("th", {
        "style": {
          width: buttonCellWidth
        }
      })) : void 0, columns)), React.createElement("tbody", null, (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = pageCollection.length; i < len; i++) {
          model = pageCollection[i];
          results.push(React.createElement("tr", {
            "className": (this.state.selectedRow === model ? "info" : "")
          }, (function() {
            var ref3, ref4, ref5, results1;
            ref3 = model.schema;
            results1 = [];
            for (k in ref3) {
              v = ref3[k];
              if (!(v.visible !== false)) {
                continue;
              }
              if (((ref4 = this.state.editCell) != null ? ref4.model : void 0) === model && this.state.editCell.key === k) {
                style = {
                  padding: 0,
                  width: this.cellWidths[k]
                };
              } else if (v.edit === true) {
                style = {
                  padding: 0,
                  width: (ref5 = v.width) != null ? ref5 : 200
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
          }).call(this), React.createElement("td", null, React.createElement(ButtonGroup, {
            "bsSize": "xsmall"
          }, ((function() {
            var j, len1, ref3, ref4, results1;
            buttons = (function() {
              var ref3, results1;
              ref3 = this.props.buttons.rowButtons;
              results1 = [];
              for (k in ref3) {
                v = ref3[k];
                obj = _.extend({}, v);
                obj.command = k;
                results1.push(obj);
              }
              return results1;
            }).call(this);
            if (buttons.length <= 3) {
              ref3 = buttons.slice(0, +buttons.length + 1 || 9e9);
              results1 = [];
              for (j = 0, len1 = ref3.length; j < len1; j++) {
                btnInfo = ref3[j];
                btnProps = this.getButtonProps(btnInfo);
                results1.push(React.createElement(Button, {
                  "onClick": btnProps.clickHandle.bind(this, model),
                  "bsStyle": btnProps.bsStyle
                }, React.createElement(Glyphicon, {
                  "glyph": btnProps.icon
                }), " " + btnInfo.text));
              }
              return results1;
            } else if (buttons.length > 3) {
              result = (function() {
                var l, len2, ref4, ref5, results2;
                ref4 = buttons.slice(0, 2);
                results2 = [];
                for (l = 0, len2 = ref4.length; l < len2; l++) {
                  btnInfo = ref4[l];
                  btnProps = this.getButtonProps(btnInfo);
                  results2.push(React.createElement(Button, {
                    "onClick": (ref5 = btnProps.clickHandle) != null ? ref5.bind(this, model) : void 0,
                    "bsStyle": btnProps.bsStyle
                  }, React.createElement(Glyphicon, {
                    "glyph": btnProps.icon
                  }), " " + btnInfo.text));
                }
                return results2;
              }).call(this);
              btnProps = this.getButtonProps(buttons[2]);
              tmp1 = React.createElement(Dropdown, {
                "id": "dropdown-custom-2",
                "bsSize": "xsmall"
              }, React.createElement(Button, {
                "onClick": (ref4 = btnProps.clickHandle) != null ? ref4.bind(this, model) : void 0,
                "bsStyle": btnProps.bsStyle
              }, React.createElement(Glyphicon, {
                "glyph": btnProps.icon
              }), " " + buttons[2].text), React.createElement(Dropdown.Toggle, {
                "bsStyle": "default"
              }), React.createElement(Dropdown.Menu, null, (function() {
                var l, len2, ref5, ref6, results2;
                ref5 = buttons.slice(3);
                results2 = [];
                for (l = 0, len2 = ref5.length; l < len2; l++) {
                  btnInfo = ref5[l];
                  btnProps = this.getButtonProps(btnInfo);
                  results2.push(React.createElement(MenuItem, {
                    "eventKey": btnInfo.command,
                    "onClick": (ref6 = btnProps.clickHandle) != null ? ref6.bind(this, model) : void 0
                  }, btnInfo.text));
                }
                return results2;
              }).call(this)));
              result.push(tmp1);
              return result;
            }
          }).call(this))))));
        }
        return results;
      }).call(this))), (this.props.allowPage !== false ? React.createElement(Pagination, {
        "prev": true,
        "next": true,
        "first": true,
        "last": true,
        "ellipsis": true,
        "items": pageCount,
        "maxButtons": displayedPagesLength,
        "activePage": this.state.activePage,
        "onSelect": this.pageChangeHandle
      }) : void 0)), React.createElement(Modal, {
        "show": this.state.showModal,
        "onHide": this.hideModalHandle,
        "bsSize": "large",
        "backdrop": "static"
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u8be6\u60c5")), React.createElement(Modal.Body, {
        "ref": "modalBody"
      }, React.createElement("form", null, React.createElement("fieldset", React.__spread({}, fieldsetProps), React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, ((function() {
        var ref3, results;
        if (this.state.modalFormValues != null) {
          model = this.state.modalFormModel;
          debugger;
          ref3 = model.schema;
          results = [];
          for (k in ref3) {
            v = ref3[k];
            results.push(React.createElement(Col, {
              "xs": 12.,
              "sm": 6.,
              "md": 6.
            }, this.getModalFieldContent(model, k)));
          }
          return results;
        }
      }).call(this))))))), React.createElement(Modal.Footer, null, ((ref3 = this.state.action) === "add" || ref3 === "edit" ? React.createElement("div", null, React.createElement(Button, {
        "bsStyle": "primary",
        "onClick": this.saveButtonHandle
      }, "\u4fdd\u5b58"), React.createElement(Button, {
        "bsStyle": "default",
        "onClick": this.hideModalHandle
      }, "\u53d6\u6d88")) : void 0))), React.createElement(Modal, {
        "show": this.state.showConfirmModal,
        "onHide": this.hideConfirmModalHandle,
        "bsSize": "sm"
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u63d0\u793a")), React.createElement(Modal.Body, null, React.createElement("h4", {
        "className": "text-center"
      }, "\u786e\u8ba4\u5220\u9664\u5417\uff1f")), React.createElement(Modal.Footer, null, React.createElement(Button, {
        "bsStyle": "primary",
        "onClick": this.deleteConfirmButtonClickHandle
      }, "\u786e\u5b9a"), React.createElement(Button, {
        "bsStyle": "default",
        "onClick": this.hideConfirmModalHandle
      }, "\u53d6\u6d88"))));
    }
  });

  console.log("");

}).call(this);
