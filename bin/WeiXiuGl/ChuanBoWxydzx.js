(function() {
  var AddItemModal, Breadcrumb, BreadcrumbItem, Button, Col, DetailModal, Grid, Input, ItemModel, ItemModelList, MainList, MainModel, Modal, Overlay, Page, PageControl, Popover, Row, SubList, SubModel, cbSelectData, getSelectData, mainList, pageView;

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
    urlRoot: "/api/tbinv_cbwxydjhzb",
    defaults: {
      CBBH: "1",
      WXBM: "1",
      JHND: "2015",
      JHYF: "1"
    },
    validation: {
      CBBH: {
        required: true,
        msg: "请选择船舶"
      },
      WXBM: {
        required: true,
        msg: "请选择部门"
      },
      JHND: {
        required: true,
        msg: "请选择计划年度"
      },
      JHYF: {
        required: true,
        msg: "请选择计划月份"
      }
    },
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
        readonly: true,
        sortValue: function(model) {
          var arr, xh;
          xh = model.get("XH");
          arr = xh.split('.');
          xh = arr[0] + arr[1];
          return xh = parseInt(xh);
        }
      },
      MC: {
        type: "Text",
        title: "项目名称",
        readonly: true
      },
      JHWCSJ: {
        type: "DateTime",
        title: "计划完成日期",
        readonly: false
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
    initialize: function() {
      return this.listenTo(this.collection, "add remove reset", this.render);
    },
    save: function(model, data) {
      var isNew, that, validated;
      that = this;
      validated = true;
      isNew = model.isNew();
      model.on("invalid", function(model, error) {
        validated = false;
        return that.trigger("setError", error);
      });
      model.set(data, {
        validate: true
      });
      model.off("invalid");
      if (validated) {
        return model.save(null, {
          success: function() {
            that.trigger("saveSuccess");
            if (isNew) {
              return that.collection.add(model);
            }
          },
          error: function(e) {
            return that.trigger("saveError");
          }
        });
      }
    },
    searchButtonClick: function(data) {
      this.collection.fetch({
        reset: true,
        data: data,
        async: false
      });
      return this.render();
    },
    getAddCollection: function(data) {},
    render: function() {
      return ReactDOM.render(React.createElement(Page, {
        "collection": this.collection,
        "searchButtonClick": this.searchButtonClick.bind(this)
      }), $("#iframePageContainer")[0]);
    }
  });

  Page = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return {
        showModal: false,
        action: "",
        JHND: "2015",
        CBBH: "1",
        WXBM: "1"
      };
    },
    componentWillReceiveProps: function() {
      return this.setState({
        showModal: false,
        action: ""
      });
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
        wait: true,
        async: false
      });
      return this.setState({
        showModal: true,
        action: "detail",
        model: model
      });
    },
    editButtonHandle: function(model) {
      model.fetch({
        wait: true,
        async: false
      });
      return this.setState({
        showModal: true,
        action: "edit",
        model: model
      });
    },
    verifyButtonHandle: function() {},
    searchHandle: function() {
      debugger;
      var obj;
      obj = _.pick(this.state, "JHND", "CBBH", "WXBM");
      return this.props.searchButtonClick(obj);
    },
    render: function() {
      var tableProps, that;
      that = this;
      tableProps = {
        collection: this.props.collection,
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
              that.detailButtonHandle(model);
              return e.preventDefault();
            }
          }, {
            text: "编辑",
            command: "edit",
            onclick: function(model, e) {
              that.editButtonHandle(model);
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
        "valueLink": this.linkState("JHND")
      }, React.createElement("option", {
        "value": "2015"
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
        "valueLink": this.linkState("CBBH")
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
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "部门",
        "valueLink": this.linkState("WXBM")
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
        JHND: this.props.model.get("JHND"),
        CBBH: this.props.model.get("CBBH"),
        WXBM: this.props.model.get("WXBM"),
        JHYF: this.props.model.get("JHYF"),
        error: {}
      };
    },
    closeModal: function() {
      return this.setState({
        showModal: false
      });
    },
    addButtonClick: function() {
      var data, itemModelList;
      itemModelList = new ItemModelList();
      data = _.pick(this.state, "JHND", "CBBH", "WXBM", "JHYF");
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
    valueChangeHandle: function(key, e) {
      debugger;
      var newValue;
      newValue = {};
      newValue[key] = e.target.value;
      return this.setState(newValue, (function(_this) {
        return function() {
          _this.collection = _this.getNewCollection();
          return _this.forceUpdate();
        };
      })(this));
    },
    getNewCollection: function() {
      var collection, val;
      collection = new SubList();
      val = _.pick(this.state, "JHND", "CBBH", "WXBM", "JHYF");
      if (val.JHND !== "" && val.CBBH !== "" && val.WXBM !== "" && val.JHYF !== "") {
        collection.fetch({
          url: "/WeiXiuGl/GetNewMonthPlanData/",
          data: val,
          type: "GET",
          reset: true,
          async: false
        });
      } else {
        collection.reset();
      }
      return collection;
    },
    addItem: function(model) {
      debugger;
      return this.setState({
        showModal: false
      });
    },
    componentWillMount: function() {
      debugger;
      var that;
      that = this;
      if (this.props.action === "add") {
        this.collection = this.getNewCollection();
      } else {
        this.collection = new SubList(this.props.model.get("tbinv_cbwxydjhcbs"));
      }
      pageView.on("setError", function(error) {
        debugger;
        return that.setState({
          error: error
        });
      });
      pageView.on("saveError", function(error) {
        return that.setStatevv({
          error: error
        });
      });
      return pageView.on("saveSuccess", function() {
        return that.props.closeHanele();
      });
    },
    componentWillUnmount: function() {
      pageView.off("setError");
      pageView.off("saveError");
      return pageView.off("saveSuccess");
    },
    componentWillReceiveProps: function(nextProps) {
      return this.setState({
        JHND: nextProps.model.get("JHND"),
        CBBH: nextProps.model.get("CBBH"),
        WXBM: nextProps.model.get("WXBM"),
        JHYF: nextProps.model.get("JHYF")
      }, (function(_this) {
        return function() {
          if (_this.props.action === "add") {
            return _this.collection = _this.getNewCollection();
          } else {
            return _this.collection = new SubList(nextProps.model.get("tbinv_cbwxydjhcbs"));
          }
        };
      })(this));
    },
    saveButtonHandle: function() {
      var data;
      data = _.pick(this.state, "JHND", "WXBM", "JHYF", "CBBH");
      data.tbinv_cbwxydjhcbs = this.collection.toJSON();
      return pageView.save(this.props.model, data);
    },
    render: function() {
      var action, headerTexts, tableProps, that;
      that = this;
      action = this.props.action;
      headerTexts = {
        detail: "月度维修保养计划详情",
        edit: "月度维修保养计划编辑",
        add: "新增月度维修保养计划"
      };
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
              text: "从年度计划添加项目",
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
      debugger;
      return React.createElement("div", null, React.createElement(Modal, {
        "bsSize": "large",
        "show": this.props.show,
        "onHide": this.props.closeHanele
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, headerTexts[this.props.action])), React.createElement(Modal.Body, {
        "ref": "modalBody"
      }, React.createElement(Grid, {
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
        "ref": "JHND",
        "addonBefore": "计划年度",
        "disabled": (action === "detail" || action === "edit"),
        "value": this.state.JHND,
        "onChange": this.valueChangeHandle.bind(this, "JHND")
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
      }, "2019")), (function(_this) {
        return function() {
          if (_this.state.error.JHND != null) {
            return React.createElement(Overlay, {
              "show": true,
              "target": (function() {
                return ReactDOM.findDOMNode(_this.refs.JHND);
              }),
              "container": _this.refs.modalBody,
              "placement": "bottom"
            }, React.createElement(Popover, null, _this.state.error.JHND));
          }
        };
      })(this)()), React.createElement(Col, {
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
      })(this)()), (function(_this) {
        return function() {
          if (_this.state.error.CBBH != null) {
            return React.createElement(Overlay, {
              "show": true,
              "target": (function() {
                return ReactDOM.findDOMNode(_this.refs.CBBH);
              }),
              "container": _this.refs.modalBody,
              "placement": "bottom"
            }, React.createElement(Popover, null, _this.state.error.CBBH));
          }
        };
      })(this)()), React.createElement(Col, {
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
      }, "\u8f6e\u673a\u90e8")), (function(_this) {
        return function() {
          if (_this.state.error.WXBM != null) {
            return React.createElement(Overlay, {
              "show": true,
              "target": (function() {
                return ReactDOM.findDOMNode(_this.refs.WXBM);
              }),
              "container": _this.refs.modalBody,
              "placement": "bottom"
            }, React.createElement(Popover, null, _this.state.error.WXBM));
          }
        };
      })(this)()), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "ref": "JHYF",
        "addonBefore": "计划月份",
        "disabled": (action === "detail" || action === "edit"),
        "value": this.state.JHYF,
        "onChange": this.valueChangeHandle.bind(this, "JHYF")
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
      }, "12\u6708")), (function(_this) {
        return function() {
          if (_this.state.error.JHYF != null) {
            return React.createElement(Overlay, {
              "show": true,
              "target": (function() {
                return ReactDOM.findDOMNode(_this.refs.JHYF);
              }),
              "container": _this.refs.modalBody,
              "placement": "bottom"
            }, React.createElement(Popover, null, _this.state.error.JHYF));
          }
        };
      })(this)()), React.createElement(Col, {
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

  pageView = new PageControl({
    collection: mainList
  });

  pageView.render();

}).call(this);
