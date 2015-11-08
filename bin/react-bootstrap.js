(function() {
  var CustomTable, Test;

  Test = React.createClass({
    render: function() {
      var wellStyles;
      wellStyles = {
        maxWidth: 400,
        margin: '0 auto 10px'
      };
      return React.createElement("div", {
        "className": "well",
        "style": wellStyles
      }, React.createElement(Button, {
        "bsStyle": "primary",
        "bsSize": "large",
        "block": true
      }, "Block level button"), React.createElement(Button, {
        "bsSize": "large",
        "block": true
      }, "Block level button"));
    }
  });

  CustomTable = React.createClass({
    render: function() {
      return React.createElement(Table, {
        "responsive": true
      }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Table heading"), React.createElement("th", null, "Table heading"), React.createElement("th", null, "Table heading"), React.createElement("th", null, "Table heading"), React.createElement("th", null, "Table heading"), React.createElement("th", null, "Table heading"))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, "1"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell")), React.createElement("tr", null, React.createElement("td", null, "2"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell")), React.createElement("tr", null, React.createElement("td", null, "3"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"), React.createElement("td", null, "Table cell"))));
    }
  });

  React.render(React.createElement(CustomTable, null), $("#container")[0]);

}).call(this);
