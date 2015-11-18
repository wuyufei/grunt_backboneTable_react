(function() {
  var AddItemModal, Breadcrumb, BreadcrumbItem, Button, Col, Grid, Input, ItemModel, ItemModelList, List, MainModel, Modal, ModalForm, Overlay, Page, Popover, Row, SubList, SubModel, cbSelectData, getSelectData, mainList;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover;

  getSelectData = function(code) {
    var array;
    array = [];
    $.ajax({
      url: "/GetSelectData/Get",
      data: "FieldName=" + code,
      async: false,
      success: function(data) {
        return array = data;
      }
    });
    return array;
  };

  cbSelectData = getSelectData("CBBH");

  MainModel = Backbone.Model.extend({
    idAttribute: "DJHM",
    urlRoot: "/api/tbinv_vesworkcardzb",
    schema: {
      DJHM: {
        type: "Text",
        title: "单据号码"
      },
      CBBH: {
        type: "Select",
        title: "船舶",
        options: (function() {
          var i, item, j, len, ref, results;
          results = [];
          for (j = 0, len = cbSelectData.length; j < len; j++) {
            i = cbSelectData[j];
            item = {};
            ref = [i.mc, i.dm], item.label = ref[0], item.val = ref[1];
            results.push(item);
          }
          return results;
        })()
      },
      WXBM: {
        type: "Select",
        title: "部门",
        options: [
          {
            label: "甲板部",
            val: "0"
          }, {
            label: "轮机部",
            val: "1"
          }
        ]
      },
      ZDRQ: {
        type: "Text",
        title: "填报日期"
      },
      ZDR: {
        type: "Text",
        title: "制单人"
      },
      DJZT: {
        type: "Select",
        title: "单据状态",
        options: [
          {
            label: "未审核",
            val: "0"
          }, {
            label: "已审核",
            val: "1"
          }
        ]
      }
    }
  });

  List = Backbone.Collection.extend({
    url: "/api/tbinv_vesworkcardzb",
    model: MainModel
  });

  SubModel = Backbone.RelationalModel.extend({
    schema: {
      XH: {
        type: "Text",
        title: "项目编号",
        readonly: true
      },
      MC: {
        type: "Text",
        title: "项目名称",
        readonly: true
      },
      WCRQ: {
        type: "DateTime",
        title: "完成日期"
      },
      BZ: {
        type: "Text",
        title: "每日事件记录"
      },
      WXBM: {
        type: "Select",
        title: "完成部门",
        options: [
          {
            label: "甲板部",
            val: "0"
          }, {
            label: "轮机部",
            val: "1"
          }
        ],
        readonly: true
      },
      FZR: {
        type: "Text",
        title: "负责人",
        readonly: true
      },
      TQQK: {
        type: "Text",
        title: "天气情况",
        readonly: false
      }
    }
  });

  SubList = Backbone.Collection.extend({
    url: "",
    model: SubModel
  });

  ItemModel = Backbone.Model.extend({
    schema: {
      XH: {
        type: "Text",
        title: "编号",
        sortValue: function(model) {
          var arr, xh;
          xh = model.get("XH");
          arr = xh.split('.');
          xh = arr[0] + arr[1];
          return xh = parseInt(xh);
        },
        readonly: false
      },
      MC: {
        type: "Text",
        title: "项目名称",
        readonly: true
      },
      JHWCSJ: {
        type: "DateTime",
        title: "计划完成日期"
      },
      FZR: {
        type: "Text",
        title: "负责人",
        readonly: true
      }
    }
  });

  ItemModelList = Backbone.Collection.extend({
    url: "",
    model: ItemModel
  });

  mainList = new List();

  $("#btnSearch").click(function() {
    return mainList.fetch({
      reset: true
    });
  });

  Page = React.createClass({
    getInitialState: function() {
      return {
        showModal: false,
        action: null,
        model: null
      };
    },
    componentWillMount: function() {
      return this.props.collection.on("reset", (function(_this) {
        return function() {
          return _this.forceUpdate();
        };
      })(this));
    },
    componentWillReceiveProps: function(nextProps) {},
    closeHanele: function() {
      return this.setState({
        showModal: false,
        action: null
      });
    },
    detailClick: function(model) {
      model.fetch({
        async: false
      });
      return this.setState({
        showModal: true,
        action: "detial",
        model: model
      });
    },
    addClick: function() {
      var model;
      model = new MainModel();
      return this.setState({
        showModal: true,
        action: "add",
        model: model
      });
    },
    editClick: function(model) {
      model.fetch({
        async: false
      });
      return this.setState({
        showModal: true,
        action: "edit",
        model: model
      });
    },
    verifyClick: function(model) {},
    render: function() {
      var modalProps, props, that;
      that = this;
      props = {
        collection: this.props.collection,
        readonly: true,
        headerButtons: [
          {
            text: "新增",
            command: "add",
            onclick: function(e) {
              that.addClick();
              return e.preventDefault();
            }
          }
        ],
        rowButtons: [
          {
            text: "详情",
            command: "detail",
            onclick: function(model, e) {
              that.detailClick(model);
              return e.preventDefault();
            }
          }, {
            text: "编辑",
            command: "edit",
            onclick: function(model, e) {
              that.editClick(model);
              return e.preventDefault();
            }
          }, {
            text: "删除",
            command: "delete"
          }, {
            text: "审核",
            command: "verify"
          }
        ]
      };
      modalProps = {
        showModal: this.state.showModal,
        action: this.state.action,
        closeHanele: this.closeHanele,
        model: this.state.model
      };
      return React.createElement("div", null, React.createElement(ReactTable, React.__spread({}, props)), (this.state.showModal ? (function(_this) {
        return function() {
          return React.createElement(ModalForm, React.__spread({}, modalProps));
        };
      })(this)() : void 0));
    }
  });

  ModalForm = React.createClass({
    getInitialState: function() {
      return {
        CBBH: this.props.model.get("CBBH"),
        WXBM: this.props.model.get("WXBM"),
        showModal: false
      };
    },
    componentWillReceiveProps: function(nextProps) {
      return {
        CBBH: nextProps.model.get("CBBH"),
        WXBM: nextProps.model.get("WXBM")
      };
    },
    valueChangeHandle: function(key, e) {
      var newValue;
      newValue = {};
      newValue[key] = e.target.value;
      return this.setState(newValue);
    },
    addButtonClick: function() {
      return this.setState({
        showModal: true
      });
    },
    render: function() {
      var action, headerTexts, tableProps;
      headerTexts = {
        detail: "月度维修保养计划详情",
        edit: "月度维修保养计划编辑",
        add: "新增月度维修保养计划"
      };
      action = this.props.action;
      this.collection = new SubList(this.props.model.get("tbinv_vesworkcardcbs"));
      tableProps = {
        collection: this.collection,
        readonly: true,
        sortField: "XH"
      };
      if ((action === "edit" || action === "add")) {
        _.extend(tableProps, {
          readonly: false,
          headerButtons: [
            {
              text: "从月度计划选择",
              command: "select",
              onclick: function(e) {
                that.addButtonClick();
                return e.preventDefault();
              }
            }
          ],
          rowButtons: [
            {
              text: "删除",
              command: "delete",
              onclick: function(model, e) {
                that.collection.remove(model);
                that.forceUpdate();
                return e.preventDefault();
              }
            }
          ]
        });
      }
      return React.createElement("div", null, React.createElement(Modal, {
        "bsSize": "large",
        "show": this.props.showModal,
        "onHide": this.props.closeHanele
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, headerTexts[action])), React.createElement(Modal.Body, {
        "ref": "modalBody"
      }, React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "ref": "CBBH",
        "addonBefore": "船舶",
        "disabled": (action === "detail" || action === "edit"),
        "value": this.state.CBBH,
        "onChange": this.valueChangeHandle.bind(this, "CBBH")
      }, (function(_this) {
        return function() {
          var i, j, len, results;
          results = [];
          for (j = 0, len = cbSelectData.length; j < len; j++) {
            i = cbSelectData[j];
            results.push(React.createElement("option", {
              "value": i.dm
            }, i.mc));
          }
          return results;
        };
      })(this)())), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "rel": "WXBM",
        "addonBefore": "部门",
        "disabled": (action === "detail" || action === "edit"),
        "value": this.state.WXBM,
        "onChange": this.valueChangeHandle.bind(this, "WXBM")
      }, React.createElement("option", {
        "value": "1"
      }, "\u7532\u677f\u90e8"), React.createElement("option", {
        "value": "2"
      }, "\u8f6e\u673a\u90e8"))), React.createElement(Col, {
        "xs": 12.
      }, React.createElement(ReactTable, React.__spread({}, tableProps)))))), React.createElement(Modal.Footer, null, (function(_this) {
        return function() {
          if (action !== "detail") {
            return [
              React.createElement(Button, {
                "bsStyle": "primary",
                "onClick": _this.saveButtonHandle
              }, "\u4fdd\u5b58"), React.createElement(Button, {
                "onClick": _this.props.closeHanele
              }, "\u53d6\u6d88")
            ];
          }
        };
      })(this)())), React.createElement(AddItemModal, null));
    }
  });

  AddItemModal = React.createClass({
    componentWillReceiveProps: function(nextProps) {},
    render: function() {
      debugger;
      var tableProps, that;
      that = this;
      tableProps = {
        collection: that.props.collection,
        readonly: true,
        sortField: "XH",
        rowButtons: [
          {
            text: "选择",
            command: "select",
            onclick: function(model) {
              debugger;
              return that.props.selectItemHandle(model);
            }
          }
        ]
      };
      return React.createElement(Modal, {
        "show": this.props.show,
        "onHide": this.props.closeHanele
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u8bf7\u9009\u62e9\u60a8\u8981\u6dfb\u52a0\u7684\u9879\u76ee")), React.createElement(Modal.Body, null, React.createElement(ReactTable, React.__spread({}, tableProps))));
    }
  });

  ReactDOM.render(React.createElement(Page, {
    "collection": mainList
  }), $("#backboneTable")[0]);

  console.log("");

}).call(this);
