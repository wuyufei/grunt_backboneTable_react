(function() {
  var ActionMixin, Table,
    hasProp = {}.hasOwnProperty;

  ActionMixin = {
    cellClick: function(model, key, e) {
      var base, editCell, editKey, editRow, editValue, eidtModel, schema;
      if (this.props.readonly !== true) {
        schema = model.schema[key];
        if (schema.readonly === true) {
          if (this.state.editRow) {
            editRow = this.refs[this.state.editRow];
            editCell = editRow.refs[this.state.editCell];
            eidtModel = editRow.props.model;
            editKey = editCell.props.fieldKey;
            editValue = editCell.state.value;
            this.cellEndEdit(eidtModel, editKey, editValue);
          }
        } else {
          this.cellBeginEdit(model, key);
          e.preventDefault();
          e.stopPropagation();
        }
      }
      debugger;
      this.setState({
        selectedRow: model.cid
      });
      return typeof (base = this.props).cellClick === "function" ? base.cellClick(model, key) : void 0;
    },
    cellDoubleClick: function(model, key) {
      debugger;
      var base;
      return typeof (base = this.props).cellDoubleClick === "function" ? base.cellDoubleClick(model, key) : void 0;
    },
    addButtonClick: function(e) {
      debugger;
      var buttonHandle, model, ref;
      buttonHandle = (ref = _.findWhere(this.props.headerButtons, {
        command: "add"
      })) != null ? ref.onclick : void 0;
      if (typeof buttonHandle === "function") {
        buttonHandle(e);
      }
      if ((typeof this.cellEndEdit === "function" ? this.cellEndEdit() : void 0) === false || e.isDefaultPrevented()) {
        return;
      }
      model = new this.props.collection.model;
      return React.render(React.createElement(ModalForm, {
        "model": model,
        "headerText": "新增",
        "customTemplate": this.props.customTemplate
      }), $("<div>").appendTo($("body"))[0]);
    },
    detailButtonClick: function(model, e) {
      var buttonHandle, ref;
      buttonHandle = (ref = _.findWhere(this.props.rowButtons, {
        command: "detail"
      })) != null ? ref.onclick : void 0;
      if (typeof buttonHandle === "function") {
        buttonHandle(model, e);
      }
      if ((typeof this.cellEndEdit === "function" ? this.cellEndEdit() : void 0) === false || e.isDefaultPrevented()) {
        return;
      }
      return React.render(React.createElement(ModalForm, {
        "readonly": true,
        "model": model,
        "headerText": "详情",
        "customTemplate": this.props.customTemplate
      }), $("<div>").appendTo($("body"))[0]);
    },
    editButtonClick: function(model, e) {
      var buttonHandle, ref;
      buttonHandle = (ref = _.findWhere(this.props.rowButtons, {
        command: "edit"
      })) != null ? ref.onclick : void 0;
      if (typeof buttonHandle === "function") {
        buttonHandle(model, e);
      }
      if ((typeof this.cellEndEdit === "function" ? this.cellEndEdit() : void 0) === false || e.isDefaultPrevented()) {
        return;
      }
      return React.render(React.createElement(ModalForm, {
        "model": model,
        "headerText": "编辑",
        "customTemplate": this.props.customTemplate
      }), $("<div>").appendTo($("body"))[0]);
    },
    deleteButtonClick: function(model, e) {
      var base, buttonHandle, modalInfoProps, ref;
      buttonHandle = (ref = _.findWhere(this.props.rowButtons, {
        command: "delete"
      })) != null ? ref.onclick : void 0;
      if (typeof buttonHandle === "function") {
        buttonHandle(model, e);
      }
      if ((typeof this.cellEndEdit === "function" ? this.cellEndEdit() : void 0) === false || e.isDefaultPrevented()) {
        return;
      }
      if (typeof (base = this.props).deleteButtonClick === "function") {
        base.deleteButtonClick(e, model);
      }
      if (!e.isDefaultPrevented()) {
        modalInfoProps = {
          msg: "是否确认删除？",
          confirmButtonClick: function(event) {
            model.destroy({
              success: function() {
                var props;
                props = {
                  msg: "删除成功",
                  autoClose: true
                };
                return React.render(React.createElement(ModalInfo, React.__spread({}, props)), $("<div>").appendTo($("body"))[0]);
              },
              error: function(model, response, options) {
                event.preventDefault();
                return event.error = options.errorThrown;
              },
              wait: true,
              async: false
            });
          }
        };
        return React.render(React.createElement(ModalInfo, React.__spread({}, modalInfoProps)), $("<div>").appendTo($("body"))[0]);
      }
    }
  };

  Table = React.createClass({
    mixins: [ActionMixin],
    getInitialState: function() {
      return {
        selectedRow: (function(_this) {
          return function() {
            if (_this.props.collection.length > 0) {
              return _this.props.collection.at(0).cid;
            } else {
              return null;
            }
          };
        })(this)(),
        sortField: null,
        sortDir: "asc",
        currentPage: 0,
        editRow: null,
        editCell: null,
        cellError: null
      };
    },
    getDefaultProps: function() {
      return {
        enableSort: true
      };
    },
    componentWillMount: function() {
      var that;
      that = this;
      this.sortedModels = this.sortCollection();
      return this.props.collection.on("add", function() {
        return this.forceUpdate();
      });
    },
    componentWillUpdate: function(nextProps, nextState) {},
    componentDidUpdate: function(prevProps, prevState) {
      var model;
      if (prevState.selectedRow !== this.state.selectedRow) {
        model = this.props.collection.get(this.state.selectedRow);
        return this.props.tableView.selectedRowChange(model);
      }
    },
    pageChange: function(page) {
      return this.setState({
        currentPage: page,
        editRow: null,
        editCell: null,
        cellError: null,
        selectedRow: null
      });
    },
    columnHeaderClickHandler: function(e) {
      var key, sortDir;
      if (!this.props.enableSort) {
        return;
      }
      key = e.target.dataset.column;
      if (key === this.state.sortField) {
        sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
      } else {
        sortDir = "asc";
      }
      return this.setState({
        sortField: key,
        sortDir: sortDir,
        currentPage: 0,
        editRow: null,
        editCell: null,
        cellError: null
      });
    },
    sortCollection: function() {
      debugger;
      var sortModels, that;
      that = this;
      sortModels = _.clone(this.props.collection.models);
      if (this.state.sortField) {
        sortModels.sort(function(a, b) {
          a = a.get(that.state.sortField);
          b = b.get(that.state.sortField);
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
    cellBeginEdit: function(model, key) {
      if (this.state.editRow) {
        if (this.cellEndEdit()) {
          return this.setState({
            editRow: model.cid,
            editCell: key,
            cellError: null
          });
        }
      } else {
        return this.setState({
          editRow: model.cid,
          editCell: key,
          cellError: null
        });
      }
    },
    cellEndEdit: function() {
      var editCell, editRow, error, invalidHandle, key, model, value;
      if (this.state.editRow) {
        editRow = this.refs[this.state.editRow];
        editCell = editRow.refs[this.state.editCell];
        model = editRow.props.model;
        key = editCell.props.fieldKey;
        value = editCell.state.value;
        error = null;
        invalidHandle = function(model, er) {
          return error = er;
        };
        model.on("invalid", invalidHandle);
        model.set(key, value, {
          validate: true
        });
        model.off("invalid", invalidHandle);
        if (error != null) {
          this.setState({
            editRow: model.cid,
            editCell: key,
            cellError: error
          });
          return false;
        } else {
          this.setState({
            editRow: null,
            editCell: null,
            cellError: null
          });
          return true;
        }
      } else {
        return true;
      }
    },
    renderColumns: function() {
      var addColumnIcon, columnHeaders, k, ref, schema, sortDir, sortField, v;
      sortField = this.state.sortField;
      sortDir = this.state.sortDir;
      schema = this.props.collection.model.prototype.schema;
      addColumnIcon = function(field) {
        if (field === sortField) {
          if (sortDir === "asc") {
            return React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes pull-right'
            });
          } else {
            return React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes-alt pull-right'
            });
          }
        } else {
          return React.createElement("i", null);
        }
      };
      columnHeaders = (function() {
        var results;
        results = [];
        for (k in schema) {
          if (!hasProp.call(schema, k)) continue;
          v = schema[k];
          results.push(React.createElement("th", {
            "data-column": k,
            "onClick": this.columnHeaderClickHandler
          }, v.title, addColumnIcon(k)));
        }
        return results;
      }).call(this);
      if (((ref = this.props.buttons) != null ? ref.length : void 0) > 0) {
        columnHeaders.push(React.createElement("th", null));
      }
      return columnHeaders;
    },
    renderHeaderButtons: function() {
      var btn, btns, buttons, props;
      btns = this.props.headerButtons;
      if (btns != null) {
        buttons = (function() {
          var i, len, ref, ref1, ref2, results;
          results = [];
          for (i = 0, len = btns.length; i < len; i++) {
            btn = btns[i];
            props = {};
            debugger;
            if ((btn.command != null) && btn.command === "add") {
              props.handleClick = this.addButtonClick;
              props.className = "btn btn-primary btn-sm";
              props.icon = "glyphicon glyphicon-plus";
            } else {
              props.handleClick = (ref = btn.onclick) != null ? ref : _.noop();
              props.className = (ref1 = btn.btnClass) != null ? ref1 : "btn btn-sm btn-info";
              props.icon = (ref2 = btn.iconClass) != null ? ref2 : "glyphicon glyphicon-list";
            }
            results.push(React.createElement("button", {
              "className": props.className,
              "style": {
                marginRight: 5
              },
              "onClick": props.handleClick
            }, React.createElement("span", {
              "className": props.icon
            }), " ", btn.text));
          }
          return results;
        }).call(this);
      }
      return buttons;
    },
    render: function() {
      var containerStyle, model, pageCollection, rowProps, rows, sortModels, that;
      that = this;
      debugger;
      sortModels = this.sortCollection();
      pageCollection = sortModels.slice(this.state.currentPage * 10, +((this.state.currentPage + 1) * 10 - 1) + 1 || 9e9);
      rows = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = pageCollection.length; i < len; i++) {
          model = pageCollection[i];
          rowProps = {
            model: model,
            cellClick: that.cellClick.bind(this, model),
            cellEndEdit: that.cellEndEdit,
            edit: that.state.editRow === model.cid ? true : false,
            editCell: that.state.editRow === model.cid ? that.state.editCell : null,
            error: that.state.editRow === model.cid ? this.state.cellError : null,
            detailButtonClick: that.detailButtonClick.bind(this, model),
            editButtonClick: that.editButtonClick.bind(this, model),
            deleteButtonClick: that.deleteButtonClick.bind(this, model),
            buttons: that.props.rowButtons,
            selected: that.state.selectedRow === model.cid ? true : false,
            cellDoubleClick: this.cellDoubleClick.bind(this, model)
          };
          results.push(React.createElement(Row, React.__spread({
            "ref": model.cid,
            "key": model.cid
          }, rowProps)));
        }
        return results;
      }).call(this);
      containerStyle = {
        marginBottom: 10,
        borderBottomStyle: "none"
      };
      return React.createElement("div", {
        "className": "panel panel-default",
        "style": containerStyle
      }, React.createElement("div", {
        "className": "panel-heading clearfix"
      }, React.createElement("div", {
        "className": "pull-right",
        "data-range": "headerButtons",
        "style": {
          minHeight: 20
        }
      }, this.renderHeaderButtons())), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered table-hover",
        "style": {
          borderBottomColor: "rgb(221, 221, 221)",
          borderBottomStyle: "solid",
          borderBottomWidth: 1
        }
      }, React.createElement("thead", null, this.renderColumns()), React.createElement("tbody", null, rows)), React.createElement(Page, {
        "collection": this.props.collection,
        "currentPage": this.state.currentPage,
        "pageChange": this.pageChange
      })));
    }
  });

  window.ReactTable = Table;

}).call(this);
