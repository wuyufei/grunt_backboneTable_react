(function() {
  var Breadcrumb, BreadcrumbItem, Button, Col, Grid, Input, ItemModel, ItemModelList, List, MainModel, Modal, Overlay, Page, PageController, Popover, Row, SubList, SubModel, cbSelectData, currentMonth, currentYear, getSelectData, mainList, pageController, vesinfo;

  Grid = ReactBootstrap.Grid, Row = ReactBootstrap.Row, Col = ReactBootstrap.Col, Input = ReactBootstrap.Input, Button = ReactBootstrap.Button, Breadcrumb = ReactBootstrap.Breadcrumb, BreadcrumbItem = ReactBootstrap.BreadcrumbItem, Modal = ReactBootstrap.Modal, Overlay = ReactBootstrap.Overlay, Popover = ReactBootstrap.Popover;

  vesinfo = "1";

  currentMonth = "";

  currentYear = "2015";

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
        title: "填报日期",
        format: "yyyy-mm-dd"
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

  SubModel = Backbone.Model.extend({
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
        title: "完成日期",
        format: "yyyy-mm-dd"
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

  Page = React.createClass({
    getInitialState: function() {
      return {
        showModal: false,
        showAddItemModal: false,
        action: null,
        model: null,
        modalValue: {},
        addItemModalValue: {},
        addItemModalList: new ItemModelList,
        error: {}
      };
    },
    modalValueChange: function(key, e) {
      var obj;
      obj = _.extend({}, this.state.modalValue);
      obj[key] = e.target.value;
      return this.setState({
        modalValue: obj
      });
    },
    addItemModalValueChange: function(key, e) {
      var obj, that;
      that = this;
      obj = _.extend({}, this.state.addItemModalValue);
      obj[key] = e.target.value;
      return this.setState({
        addItemModalValue: obj
      }, function() {
        var data;
        data = this.state.addItemModalValue;
        if (data.CBBH !== "" && data.WXBM !== "" && data.JHND !== "" && data.JHYF !== "") {
          return that.setState({
            addItemModalList: that.props.getAddItemList(data)
          });
        }
      });
    },
    closeModal: function() {
      return this.setState({
        showModal: false,
        action: null
      });
    },
    closeAddItemModal: function() {
      return this.setState({
        showAddItemModal: false
      });
    },
    showAddItemModal: function() {
      var obj;
      obj = {
        CBBH: this.state.model.get("CBBH"),
        WXBM: this.state.model.get("WXBM"),
        JHYF: "11",
        JHND: "2015"
      };
      return this.setState({
        showAddItemModal: true,
        addItemModalValue: obj,
        addItemModalList: this.props.getAddItemList(obj)
      });
    },
    addModalSelectButtonClick: function(model) {
      var subModel;
      if (this.subCollection.findWhere({
        XH: model.get("XH")
      })) {
        alert("列表中已包含该项目，请选择其他项目");
        return;
      }
      subModel = new SubModel({
        XH: model.get("XH"),
        MC: model.get("MC"),
        WXBM: model.get("WXBM"),
        FZR: model.get("FZR")
      });
      this.subCollection.add(subModel);
      return this.setState({
        showAddItemModal: false
      });
    },
    saveClick: function() {
      var data, error;
      data = this.state.modalValue;
      data.tbinv_vesworkcardcbs = this.subCollection.toJSON();
      error = this.props.saveButtonHandle(this.state.model, data);
      if (_.isEmpty(error)) {
        return this.setState({
          showModal: false
        });
      } else {
        return this.setState({
          error: error
        });
      }
    },
    addClick: function() {
      this.subCollection = new SubList();
      return this.setState({
        showModal: true,
        action: "add",
        model: new MainModel({
          CBBH: 1,
          WXBM: 1
        }),
        modalValue: {
          CBBH: "1",
          WXBM: "1"
        }
      });
    },
    detailClick: function(model) {
      this.subCollection = this.props.getSubModelList(model);
      return this.setState({
        showModal: true,
        action: "detail",
        model: model,
        modalValue: {
          CBBH: model.get("CBBH"),
          WXBM: model.get("WXBM")
        }
      });
    },
    editClick: function(model) {
      this.subCollection = this.props.getSubModelList(model);
      return this.setState({
        showModal: true,
        action: "edit",
        model: model,
        modalValue: {
          CBBH: model.get("CBBH"),
          WXBM: model.get("WXBM")
        }
      });
    },
    saveClick: function() {
      var data, error;
      data = this.state.modalValue;
      data.tbinv_vesworkcardcbs = this.collection.toJSON();
      error = this.props.saveButtonHandle(this.state.model, data);
      if (error === null) {
        return this.setState({
          showModal: false,
          error: {}
        });
      } else {
        return this.setState({
          error: error
        });
      }
    },
    verifyClick: function(model) {},
    getMainTableProps: function() {
      var props, that;
      that = this;
      return props = {
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
    },
    getModalTableProps: function() {
      var props, ref, that;
      that = this;
      props = {
        collection: this.subCollection,
        readonly: true,
        sortField: "XH"
      };
      if (((ref = this.state.action) === "edit" || ref === "add")) {
        _.extend(props, {
          readonly: false,
          headerButtons: [
            {
              text: "从月度计划选择",
              command: "select",
              onclick: function(e) {
                that.showAddItemModal();
                return e.preventDefault();
              }
            }
          ],
          rowButtons: [
            {
              text: "删除",
              command: "delete",
              onclick: function(model, e) {
                that.subCollection.remove(model);
                that.forceUpdate();
                return e.preventDefault();
              }
            }
          ]
        });
      }
      return props;
    },
    getAddItemModalTableProps: function() {
      var addItemModalTableProps;
      return addItemModalTableProps = {
        collection: this.state.addItemModalList,
        readonly: true,
        sortField: "XH",
        rowButtons: [
          {
            text: "选择",
            command: "select",
            onclick: function(model) {
              return that.addModalSelectButtonClick(model);
            }
          }
        ]
      };
    },
    render: function() {
      var ref, ref1;
      return React.createElement("div", null, React.createElement(ReactTable, React.__spread({}, this.getMainTableProps())), React.createElement(Modal, {
        "show": this.state.showModal,
        "onHide": this.closeModal,
        "dialogClassName": "large-modal"
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u8239\u8236\u7ef4\u4fee\u6bcf\u65e5\u5de5\u4f5c\u5361")), React.createElement(Modal.Body, {
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
        "disabled": ((ref = this.state.action) === "detail" || ref === "edit"),
        "value": this.state.modalValue.CBBH,
        "onChange": this.modalValueChange.bind(this, "CBBH")
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
        "disabled": ((ref1 = this.state.action) === "detail" || ref1 === "edit"),
        "value": this.state.modalValue.WXBM,
        "onChange": this.modalValueChange.bind(this, "WXBM")
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
        "xs": 12.
      }, React.createElement(ReactTable, React.__spread({}, this.getModalTableProps())))))), React.createElement(Modal.Footer, null, (function(_this) {
        return function() {
          if (_this.state.action !== "detail") {
            return [
              React.createElement(Button, {
                "bsStyle": "primary",
                "onClick": _this.saveClick
              }, "\u4fdd\u5b58"), React.createElement(Button, {
                "bsStyle": "default",
                "onClick": _this.closeModal
              }, "\u53d6\u6d88")
            ];
          }
        };
      })(this)())), React.createElement(Modal, {
        "show": this.state.showAddItemModal,
        "onHide": this.closeAddItemModal,
        "bsSize": "large"
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, null, "\u8bf7\u9009\u62e9\u60a8\u8981\u6dfb\u52a0\u7684\u9879\u76ee")), React.createElement(Modal.Body, null, React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 3.
      }, React.createElement(Input, {
        "type": "select",
        "ref": "JHND",
        "addonBefore": "计划年度",
        "value": this.state.addItemModalValue.JHND,
        "onChange": this.addItemModalValueChange.bind(this, "JHND")
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
        "ref": "CBBH",
        "addonBefore": "船舶",
        "value": this.state.addItemModalValue.CBBH,
        "onChange": this.addItemModalValueChange.bind(this, "CBBH")
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
        "value": this.state.addItemModalValue.WXBM,
        "onChange": this.addItemModalValueChange.bind(this, "WXBM")
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
        "ref": "JHYF",
        "addonBefore": "计划月份",
        "value": this.state.addItemModalValue.JHYF,
        "onChange": this.addItemModalValueChange.bind(this, "JHYF")
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
      }, React.createElement(ReactTable, React.__spread({}, this.getAddItemModalTableProps()))))))));
    }
  });

  PageController = Backbone.View.extend({
    initialize: function(options) {
      return $("#btnSearch").click(this.search.bind(this));
    },
    search: function() {
      var that;
      that = this;
      return mainList.fetch({
        reset: true,
        success: function() {
          return that.render();
        }
      });
    },
    getSubModelList: function(model) {
      model.fetch({
        async: false
      });
      return new SubList(model.get("tbinv_vesworkcardcbs"));
    },
    save: function(model, data) {
      var error, isNew, validated, xhr;
      validated = true;
      error = null;
      isNew = model.isNew();
      model.on("invalid", function(model, error) {
        validated = false;
        return error = error;
      });
      model.set(data, {
        validate: true
      });
      model.off("invalid");
      if (validated) {
        xhr = model.save(null, {
          async: false,
          wait: true
        });
        if (xhr.status === 200) {
          if (isNew) {
            mainList.add(model);
          }
          return {};
        } else {
          return error;
        }
      } else {
        return error;
      }
    },
    getAddItemList: function(data) {
      var itemModelList;
      itemModelList = new ItemModelList;
      itemModelList.fetch({
        url: "/WeiXiuGl/GetMonthPlanData",
        data: data,
        async: false,
        reset: true
      });
      return itemModelList;
    },
    render: function() {
      return ReactDOM.render(React.createElement(Page, {
        "collection": mainList,
        "getSubModelList": this.getSubModelList,
        "getAddItemList": this.getAddItemList,
        "saveButtonHandle": this.save
      }), this.el);
    }
  });

  pageController = new PageController({
    el: $("#backboneTable")[0]
  });

  pageController.render();

  console.log("");

}).call(this);
