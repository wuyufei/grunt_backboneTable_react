(function() {
  var Row,
    hasProp = {}.hasOwnProperty;

  Row = React.createClass({
    mixins: [],
    componentWillMount: function() {},
    getButtonProps: function(buttonInfo) {
      var btnProps, ref, ref1, ref2, that;
      that = this;
      btnProps = {};
      switch (buttonInfo.command) {
        case "detail":
          btnProps.handleClick = this.props.detailButtonClick;
          btnProps.className = "btn btn-xs btn-info";
          btnProps.icon = "glyphicon glyphicon-list";
          break;
        case "edit":
          btnProps.handleClick = this.props.editButtonClick;
          btnProps.className = "btn btn-xs btn-primary";
          btnProps.icon = "glyphicon glyphicon-edit";
          break;
        case "delete":
          btnProps.handleClick = this.props.deleteButtonClick;
          btnProps.className = "btn btn-xs btn-danger";
          btnProps.icon = "glyphicon glyphicon-trash";
          break;
        default:
          btnProps.handleClick = (ref = buttonInfo.onclick) != null ? typeof ref.bind === "function" ? ref.bind(this, this.props.model) : void 0 : void 0;
          btnProps.className = (ref1 = buttonInfo.btnClass) != null ? ref1 : "btn btn-xs btn-info";
          btnProps.icon = (ref2 = buttonInfo.iconClass) != null ? ref2 : "glyphicon glyphicon-list";
      }
      return btnProps;
    },
    render: function() {
      var Cell, btn, btnProps, buttonCell, buttonCellWidth, buttons, buttonsEl, cellProps, cells, editCellStyle, k, list, listEl, ref, schema, splitButton, splitButtonEl, that, v, validation;
      that = this;
      schema = this.props.model.schema;
      validation = this.props.model.validation;
      editCellStyle = {
        padding: 1
      };
      if (((ref = this.props.buttons) != null ? ref.length : void 0) > 0) {
        if (this.props.buttons.length > 3) {
          buttons = this.props.buttons.slice(0, 2);
          splitButton = this.props.buttons[2];
          list = this.props.buttons.slice(3);
        } else {
          buttons = this.props.buttons.slice(0, 3);
        }
        buttonsEl = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = buttons.length; i < len; i++) {
            btn = buttons[i];
            btnProps = that.getButtonProps(btn);
            debugger;
            results.push(React.createElement("button", {
              "className": btnProps.className,
              "style": {
                marginRight: 5
              },
              "onClick": btnProps.handleClick
            }, React.createElement("span", {
              "className": btnProps.icon
            }), " ", btn.text));
          }
          return results;
        })();
        if (list != null) {
          listEl = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = list.length; i < len; i++) {
              btn = list[i];
              btnProps = that.getButtonProps(btn);
              results.push(React.createElement("li", null, React.createElement("a", {
                "href": "#",
                "onClick": btnProps.handleClick
              }, btn.text)));
            }
            return results;
          })();
        }
        if (splitButton != null) {
          btnProps = that.getButtonProps(splitButton);
          splitButtonEl = React.createElement("div", {
            "className": "btn-group"
          }, React.createElement("button", {
            "className": btnProps.className,
            "onClick": btnProps.handleClick
          }, React.createElement("span", {
            "className": btnProps.icon
          }), " ", splitButton.text), React.createElement("button", {
            "type": "button",
            "className": "btn btn-xs btn-default  dropdown-toggle",
            "data-toggle": "dropdown",
            "aria-haspopup": "true",
            "aria-expanded": "false"
          }, React.createElement("span", {
            "className": "caret"
          }), React.createElement("span", {
            "className": "sr-only"
          }, "Toggle Dropdown")), React.createElement("ul", {
            "className": "dropdown-menu",
            "role": "menu"
          }, listEl));
        }
        buttonCellWidth = 70 * (this.props.buttons.length > 3 ? 3 : this.props.buttons.length) + 10;
        buttonCell = React.createElement("td", {
          "style": {
            width: buttonCellWidth
          }
        }, buttonsEl, splitButtonEl);
      }
      cells = (function() {
        var ref1, results;
        results = [];
        for (k in schema) {
          if (!hasProp.call(schema, k)) continue;
          v = schema[k];
          cellProps = {
            ref: k,
            fieldKey: k,
            value: this.props.model.get(k),
            error: this.props.error,
            isEdit: this.props.edit === true && this.props.editCell === k ? true : false,
            cellClick: _.partial(this.props.cellClick, k),
            cellDoubleClick: _.partial(this.props.cellDoubleClick, k),
            cellEndEdit: this.props.cellEndEdit,
            required: validation != null ? (ref1 = validation[k]) != null ? ref1.required : void 0 : void 0,
            schema: v
          };
          debugger;
          Cell = CellClasses[v.type.toLowerCase()];
          results.push(React.createElement(Cell, React.__spread({
            "key": k
          }, cellProps)));
        }
        return results;
      }).call(this);
      return React.createElement("tr", {
        "className": (this.props.selected ? "info" : "")
      }, cells, buttonCell);
    }
  });

  window.Row = Row;

}).call(this);
