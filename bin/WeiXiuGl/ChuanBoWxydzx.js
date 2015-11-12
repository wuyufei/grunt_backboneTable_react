(function() {
  var AddItemModal, Breadcrumb, BreadcrumbItem, Button, Col, DetailModal, Grid, Input, ItemModel, ItemModelList, MainList, MainModel, Modal, Page, PageControl, Row, SubList, SubModel, mainList, pageView;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal;

  MainModel = Backbone.Model.extend({
    idAttribute: "DJHM",
    urlRoot: "/api/tbinv_cbwxydjhzb",
    schema: {
      DJHM: {
        type: "Select",
        title: "单据号码"
      },
      CBBH: {
        type: "Select",
        title: "船舶",
        options: []
      },
      WXBM: {
        type: "Select",
        title: "部门",
        options: [
          {
            label: "甲板部",
            val: "1"
          }, {
            label: "轮机部",
            val: "2"
          }
        ]
      },
      JHND: {
        type: "Text",
        title: "计划年度"
      },
      JHYF: {
        type: "Text",
        title: "计划月份"
      },
      ZDRQ: {
        type: "Text",
        title: "制单日期"
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

  MainList = Backbone.Collection.extend({
    url: "/api/tbinv_cbwxydjhzb",
    model: MainModel
  });

  mainList = new MainList;

  SubModel = Backbone.Model.extend({
    schema: {
      XH: {
        type: "Text",
        title: "编号",
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

  SubList = Backbone.Collection.extend({
    url: "",
    model: SubModel
  });

  ItemModel = Backbone.Model.extend({
    idAttribute: "BH",
    schema: {
      XH: {
        type: "Text",
        title: "编号",
        readonly: false
      },
      MC: {
        type: "Text",
        title: "设备名称"
      },
      SBFL: {
        type: "Text",
        title: "设备分类"
      },
      WHZQ: {
        type: "Text",
        title: "维护周期"
      },
      FZR: {
        type: "Text",
        title: "负责人"
      },
      BZ: {
        type: "Text",
        title: "备注"
      }
    }
  });

  ItemModelList = Backbone.Collection.extend({
    url: "",
    model: ItemModel
  });

  PageControl = Backbone.View.extend({
    initialize: function() {},
    searchButtonClick: function(data) {
      debugger;
      alert("");
      mainList.fetch({
        reset: true,
        data: data,
        async: true
      });
      return this.render();
    },
    render: function() {
      return ReactDOM.render(React.createElement(Page, {
        "searchButtonClick": this.searchButtonClick.bind(this)
      }), $("#iframePageContainer")[0]);
    }
  });

  Page = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return {
        showModal: false,
        action: ""
      };
    },
    closeHanele: function() {
      return this.setState({
        showModal: false
      });
    },
    addButtonHandle: function() {
      var model;
      model = new MainModel;
      return this.setState({
        showModal: true,
        action: "add",
        model: model
      });
    },
    detailButtonHandle: function(model) {
      model.fetch({
        wait: true
      });
      return this.setState({
        showModal: true,
        action: "detail",
        model: model
      });
    },
    editButtonHandle: function() {
      return this.setState({
        showModal: true,
        action: "edit",
        model: model
      });
    },
    verifyButtonHandle: function() {},
    searchHandle: function() {
      var bm, cb, jhnd, obj, ref;
      ref = this.state, jhnd = ref.jhnd, cb = ref.cb, bm = ref.bm;
      obj = {
        jhnd: jhnd,
        cb: cb,
        bm: bm
      };
      return this.props.searchButtonClick(obj);
    },
    render: function() {
      var tableProps, that;
      that = this;
      tableProps = {
        collection: mainList,
        readonly: true,
        headerButtons: [
          {
            text: "新增",
            command: "add",
            onclick: function(e) {
              that.addButtonHandle();
              return e.preventDefault();
            }
          }
        ],
        rowButtons: [
          {
            text: "详情",
            command: "detail",
            onclick: function(model, e) {
              that.detailButtonHandle();
              return e.preventDefault();
            }
          }, {
            text: "编辑",
            command: "edit",
            onclick: function(model, e) {
              that.editButtonHandle();
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
      debugger;
      return React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, React.createElement(Col, {
        "xs": 12.
      }, React.createElement(Breadcrumb, null, React.createElement(BreadcrumbItem, null, "\u60a8\u7684\u4f4d\u7f6e"), React.createElement(BreadcrumbItem, null, "\u8bbe\u5907\u7ef4\u4fee\u4fdd\u517b\u7ba1\u7406"), React.createElement(BreadcrumbItem, {
        "active": true
      }, "\u8239\u8236\u7ef4\u4fee\u6708\u5ea6\u8ba1\u5212\u6267\u884c"))), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "计划年度",
        "valueLink": this.linkState("jhnd")
      }, React.createElement("option", {
        "value": "2015",
        "selected": ""
      }, "2015"), React.createElement("option", {
        "value": "2016"
      }, "2016"), React.createElement("option", {
        "value": "2016"
      }, "2017"), React.createElement("option", {
        "value": "2016"
      }, "2018"), React.createElement("option", {
        "value": "2016"
      }, "2019"))), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "船舶",
        "valueLink": this.linkState("cb")
      })), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "部门",
        "valueLink": this.linkState("bm")
      }, React.createElement("option", {
        "value": "1"
      }, "\u7532\u677f\u90e8"), React.createElement("option", {
        "value": "2"
      }, "\u8f6e\u673a\u90e8"))), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Button, {
        "bsStyle": "primary",
        "onClick": this.searchHandle,
        "block": true
      }, "\u67e5\u8be2")), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Button, {
        "bsStyle": "info",
        "block": true
      }, "\u6253\u5370")), React.createElement(Col, {
        "xs": 12.,
        "id": "mainTable"
      }, React.createElement(ReactTable, React.__spread({}, tableProps)))), (function(_this) {
        return function() {
          var detailModalProps;
          if (_this.state.action !== "") {
            detailModalProps = {
              model: _this.state.model,
              show: _this.state.showModal,
              action: _this.state.action,
              closeHanele: _this.closeHanele
            };
            return React.createElement(DetailModal, React.__spread({}, detailModalProps));
          }
        };
      })(this)());
    }
  });

  DetailModal = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return {
        showModal: false,
        JHND: this.props.model.get("JHND"),
        CBBH: this.props.model.get("CBBH"),
        WXBM: this.props.model.get("WXBM"),
        JHYF: this.props.model.get("JHYF")
      };
    },
    closeModal: function() {
      return this.setState({
        showModal: false
      });
    },
    addButtonClick: function() {
      var CBBH, JHND, JHYF, WXBM, data, itemModelList, ref;
      itemModelList = new ItemModelList();
      ref = this.state, JHND = ref.JHND, CBBH = ref.CBBH, WXBM = ref.WXBM, JHYF = ref.JHYF;
      data = {
        JHND: JHND,
        CBBH: CBBH,
        WXBM: WXBM,
        JHYF: JHYF
      };
      itemModelList.fetch({
        url: "/WeiXiuGl/GetYearPlanData/",
        data: data,
        type: "GET",
        reset: true,
        async: false
      });
      return this.setState({
        showModal: true,
        itemModelList: itemModelList
      });
    },
    addItem: function(model) {
      return this.setState({
        showModal: false
      });
    },
    componentWillReceiveProps: function(nextProps) {},
    save: function() {},
    render: function() {
      var action, collection, headerTexts, tableProps, that;
      that = this;
      action = this.props.action;
      headerTexts = {
        detail: "月度维修保养计划详情",
        edit: "月度维修保养计划编辑",
        add: "新增月度维修保养计划"
      };
      if (action === "add") {
        collection = new SubList();
      } else {
        collection = new SubList(this.props.model.get("tbinv_cbwxydjhcbs"));
      }
      tableProps = {
        collection: collection,
        readonly: true
      };
      if ((action === "edit" || action === "add")) {
        _.extend(tableProps, {
          headerButtons: [
            {
              text: "新增",
              command: "add",
              onclick: function(e) {
                that.addButtonClick();
                return e.preventDefault();
              }
            }
          ],
          rowButtons: [
            {
              text: "删除",
              command: "delete"
            }
          ]
        });
      }
      debugger;
      return React.createElement("div", null, React.createElement(Modal, {
        "bsSize": "large",
        "show": this.props.show,
        "onHide": this.props.closeHanele
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, headerTexts[this.props.action])), React.createElement(Modal.Body, null, React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, React.createElement(Col, {
        "xs": 12.
      }), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "计划年度",
        "disabled": action === "detail",
        "valueLink": this.linkState("jhnd")
      }, React.createElement("option", {
        "value": "2015",
        "selected": ""
      }, "2015"), React.createElement("option", {
        "value": "2016"
      }, "2016"), React.createElement("option", {
        "value": "2016"
      }, "2017"), React.createElement("option", {
        "value": "2016"
      }, "2018"), React.createElement("option", {
        "value": "2016"
      }, "2019"))), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "船舶",
        "disabled": action === "detail",
        "valueLink": this.linkState("cb")
      })), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "部门",
        "disabled": action === "detail",
        "valueLink": this.linkState("bm")
      }, React.createElement("option", {
        "value": "1"
      }, "\u7532\u677f\u90e8"), React.createElement("option", {
        "value": "2"
      }, "\u8f6e\u673a\u90e8"))), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "计划月份",
        "disabled": action === "detail",
        "valueLink": this.linkState("yf")
      }, React.createElement("option", {
        "value": "1",
        "selected": true
      }, "1\u6708"), React.createElement("option", {
        "value": "2"
      }, "2\u6708"), React.createElement("option", {
        "value": "3"
      }, "3\u6708"), React.createElement("option", {
        "value": "4"
      }, "4\u6708"), React.createElement("option", {
        "value": "5"
      }, "5\u6708"), React.createElement("option", {
        "value": "6"
      }, "6\u6708"), React.createElement("option", {
        "value": "7"
      }, "7\u6708"), React.createElement("option", {
        "value": "8"
      }, "8\u6708"), React.createElement("option", {
        "value": "9"
      }, "9\u6708"), React.createElement("option", {
        "value": "10"
      }, "10\u6708"), React.createElement("option", {
        "value": "11"
      }, "11\u6708"), React.createElement("option", {
        "value": "12"
      }, "12\u6708"))), React.createElement(Col, {
        "xs": 12.
      }, React.createElement(ReactTable, React.__spread({}, tableProps)))))), React.createElement(Modal.Footer, null, (function(_this) {
        return function() {
          if (action !== "detail") {
            return [
              React.createElement(Button, {
                "bsStyle": "primary",
                "onClick": _this.save
              }, "\u4fdd\u5b58"), React.createElement(Button, {
                "onClick": _this.props.closeHanele
              }, "\u53d6\u6d88")
            ];
          }
        };
      })(this)())), (function(_this) {
        return function() {
          var addItemModalProps;
          if (_this.state.showModal === true) {
            addItemModalProps = {
              show: _this.state.showModal,
              closeHanele: _this.closeModal,
              selectItemHandle: _this.addItem,
              collection: _this.state.itemModelList
            };
            return React.createElement(AddItemModal, React.__spread({}, addItemModalProps));
          }
        };
      })(this)());
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
        rowButtons: [
          {
            text: "选择",
            command: "select",
            onClick: that.props.selectItemHandle
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

  pageView = new PageControl().render();

}).call(this);
