(function() {
  var Table,
    hasProp = {}.hasOwnProperty;

  Table = React.createClass({
    getInitialState: function() {
      return {
        selectRow: null,
        sortField: null,
        sortDir: "asc",
        currentPage: 0,
        editRow: null,
        editCell: null,
        cellError: null
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
    componentWillUpdate: function(nextProps, nextState) {
      if (nextState.sortField !== this.state.sortField || nextState.sortDir !== this.state.sortDir) {
        return this.sortedmodels = this.sortCollection();
      }
    },
    pageChange: function(page) {
      return this.setState({
        currentPage: page,
        editRow: null,
        editCell: null,
        cellError: null
      });
    },
    columnHeaderClickHandler: function(e) {
      var key, sortDir;
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
      var sortDir, sortField, sortModels;
      if (this.state.sortField != null) {
        sortField = this.state.sortField;
        sortDir = this.state.sortDir;
        return sortModels = this.props.collection.models.sort(function(a, b) {
          a = a.get(sortField);
          b = b.get(sortField);
          if (a > b) {
            if (sortDir === "asc") {
              return 1;
            } else {
              return -1;
            }
          } else if (a === b) {
            return 0;
          } else {
            if (sortDir === "asc") {
              return -1;
            } else {
              return 1;
            }
          }
        });
      } else {
        return this.props.collection.models;
      }
    },
    cellClick: function(model, key) {
      var editCell, editKey, editRow, editValue, eidtModel, schema;
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
      }
      return this.setState({
        selectRow: model.cid
      });
    },
    cellBeginEdit: function(model, key) {
      var editCell, editKey, editRow, editValue, eidtModel;
      if (this.state.editRow) {
        editRow = this.refs[this.state.editRow];
        editCell = editRow.refs[this.state.editCell];
        eidtModel = editRow.props.model;
        editKey = editCell.props.fieldKey;
        editValue = editCell.state.value;
        debugger;
        if (this.cellEndEdit(eidtModel, editKey, editValue)) {
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
    cellEndEdit: function(model, key, value) {
      var error, invalidHandle;
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
    },
    addButtonClick: function(e) {
      var model;
      if (this.props.addButtonClick) {
        addButtonClick(e);
      }
      if (!e.isDefaultPrevented()) {
        model = this.props.collection.create({}, {
          wait: true
        });
        return React.render(React.createElement(ModalForm, {
          "model": model,
          "headerText": "新增"
        }), $("<div>").appendTo($("body"))[0]);
      }
    },
    detailButtonClick: function(model, e) {
      var base;
      if (typeof (base = this.props).detailButtonClick === "function") {
        base.detailButtonClick(e, model);
      }
      if (!e.isDefaultPrevented()) {
        return React.render(React.createElement(ModalForm, {
          "model": model,
          "headerText": "详情"
        }), $("<div>").appendTo($("body"))[0]);
      }
    },
    editButtonClick: function(model, e) {
      var base;
      if (typeof (base = this.props).detailButtonClick === "function") {
        base.detailButtonClick(e, model);
      }
      if (!e.isDefaultPrevented()) {
        return React.render(React.createElement(ModalForm, {
          "model": model,
          "headerText": "编辑"
        }), $("<div>").appendTo($("body"))[0]);
      }
    },
    deleteButtonClick: function(model, e) {
      var modalInfoProps;
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
              return React.render(React.createElement(ModalInfo, React.__spread({}, modalInfoProps)), $("<div>").appendTo($("body"))[0]);
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
    render: function() {
      var containerStyle, model, pageCollection, rowProps, rows, that;
      that = this;
      pageCollection = this.sortedModels.slice(this.state.currentPage * 10, +((this.state.currentPage + 1) * 10 - 1) + 1 || 9e9);
      rows = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = pageCollection.length; i < len; i++) {
          model = pageCollection[i];
          rowProps = {
            model: model,
            cellClick: that.cellClick.bind(this, model),
            cellEndEdit: that.cellEndEdit.bind(this, model),
            edit: that.state.editRow === model.cid ? true : false,
            editCell: that.state.editRow === model.cid ? that.state.editCell : null,
            error: that.state.editRow === model.cid ? this.state.cellError : null,
            detailButtonClick: that.detailButtonClick.bind(this, model),
            editButtonClick: that.editButtonClick.bind(this, model),
            deleteButtonClick: that.deleteButtonClick.bind(this, model),
            buttons: that.props.buttons,
            selected: that.state.selectRow === model.cid ? true : false
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
      }, React.createElement("button", {
        "className": "btn btn-primary btn-sm",
        "data-command": "add",
        "onClick": this.addButtonClick
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-plus"
      }), " \u65b0\u589e"))), React.createElement("div", {
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
