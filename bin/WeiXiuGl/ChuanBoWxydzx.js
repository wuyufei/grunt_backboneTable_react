(function() {
  var ItemModel, ItemModelList, MainList, MainModel, Page, SubModel, itemModelList, mainList;

  _.extend(window, ReactBootstrap);

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
        title: "船舶"
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

  itemModelList = new ItemModelList;

  Page = React.createClass({
    getInitialState: function() {
      return {
        showModal: false
      };
    },
    close: function() {
      return this.setState({
        showModal: false
      });
    },
    open: function() {
      return this.setState({
        showModal: true
      });
    },
    searchHandle: function() {
      return alert("");
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
              e.preventDefault();
              return that.setState({
                showModal: true
              });
            }
          }
        ],
        rowButtons: [
          {
            text: "详情",
            command: "detail",
            onclick: function(model, e) {
              return e.preventDefault();
            }
          }, {
            text: "编辑",
            command: "edit",
            onclick: function(model, e) {
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
        "addonBefore": "计划年度"
      })), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "船舶"
      })), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Input, {
        "type": "select",
        "addonBefore": "部门"
      })), React.createElement(Col, {
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
      }, React.createElement(ReactTable, React.__spread({}, tableProps)))), React.createElement(Modal, {
        "show": this.state.showModal,
        "onHide": this.close
      }, React.createElement(Modal.Header, {
        "closeButton": true
      }, React.createElement(Modal.Title, {
        "id": "contained-modal-title-lg"
      }, "Modal heading")), React.createElement(Modal.Body, null, React.createElement("h4", null, "Wrapped Text"), React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.")), React.createElement(Modal.Footer, null, React.createElement(Button, {
        "onClick": this.props.onHide
      }, "Close"))));
    }
  });

  React.render(React.createElement(Page, null), $("body")[0]);

}).call(this);
