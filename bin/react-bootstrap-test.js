(function() {
  var Page;

  _.extend(window, ReactBootstrap);

  Page = React.createClass({
    render: function() {
      return React.createElement(Grid, {
        "fluid": true
      }, React.createElement(Row, {
        "className": "show-grid"
      }, React.createElement(Col, {
        "xs": 12.
      }, React.createElement(Breadcrumb, null, React.createElement(BreadcrumbItem, null, "\u60a8\u7684\u4f4d\u7f6e"), React.createElement(BreadcrumbItem, null, "\u8239\u8236\u7ba1\u7406"), React.createElement(BreadcrumbItem, {
        "active": true
      }, "\u8239\u8236\u62b5\u6e2f\u62a5"))), React.createElement(Col, {
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
      }, React.createElement(Button, {
        "bsStyle": "primary",
        "block": true
      }, "\u67e5\u8be2")), React.createElement(Col, {
        "xs": 12.,
        "sm": 6.,
        "md": 2.
      }, React.createElement(Button, {
        "bsStyle": "info",
        "block": true
      }, "\u6253\u5370"))));
    }
  });

  React.render(React.createElement(Page, null), $("body")[0]);

}).call(this);
