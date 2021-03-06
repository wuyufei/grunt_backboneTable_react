(function() {
  var CellMixin, CheckBoxCell, DateTimeCell, SelectCell, TextCell;

  CellMixin = {
    componentWillMount: function() {
      return this.setState({
        value: this.props.value
      });
    },
    componentDidMount: function() {
      var td;
      td = this.getDOMNode();
      return this.width = $(td).innerWidth();
    },
    componentDidUpdate: function() {
      var input;
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        $(this.getDOMNode()).width(this.width);
        if (this.props.error) {
          input.popover({
            content: this.props.error[this.props.fieldKey],
            placement: "auto"
          });
          return input.focus().popover("show");
        }
      }
    }
  };

  TextCell = React.createClass({
    mixins: [React.addons.LinkedStateMixin, CellMixin],
    render: function() {
      var cellStyle, inputStyle;
      cellStyle = {
        padding: 0
      };
      inputStyle = {
        marginBottom: 0
      };
      if (this.props.isEdit) {
        return React.createElement("td", {
          "style": cellStyle
        }, React.createElement("input", {
          "style": inputStyle,
          "ref": "input",
          "autoFocus": "true",
          "type": 'text',
          "valueLink": this.linkState("value"),
          "onBlur": this.props.cellEndEdit,
          "className": 'form-control'
        }));
      } else {
        return React.createElement("td", {
          "onDoubleClick": this.props.cellDoubleClick,
          "onClick": this.props.cellClick
        }, this.state.value);
      }
    }
  });

  CheckBoxCell = React.createClass({
    mixins: [React.addons.LinkedStateMixin, CellMixin],
    componentWillMount: function() {
      return this.setState({
        value: this.props.value === "1" ? true : false
      });
    },
    render: function() {
      var cellStyle, style;
      cellStyle = {
        textAlign: "center"
      };
      if (this.props.isEdit) {
        style = {
          margin: 0,
          height: "100%",
          padding: 0,
          border: 0
        };
        return React.createElement("td", {
          "style": cellStyle
        }, React.createElement("input", {
          "type": "checkbox",
          "className": "input-lg",
          "style": style,
          "checkedLink": this.linkState("value"),
          "onBlue": this.props.cellEndEdit
        }));
      } else {
        debugger;
        if (this.state.value) {
          return React.createElement("td", {
            "style": cellStyle,
            "onClick": this.props.cellClick
          }, React.createElement("span", {
            "className": "glyphicon glyphicon-ok"
          }));
        } else {
          return React.createElement("td", {
            "style": cellStyle,
            "onClick": this.props.cellClick
          });
        }
      }
    }
  });

  SelectCell = React.createClass({
    mixins: [React.addons.LinkedStateMixin, CellMixin],
    getDisplayValue: function() {
      var displayValue, i, len, opt, ref;
      ref = this.props.schema.options;
      for (i = 0, len = ref.length; i < len; i++) {
        opt = ref[i];
        if (opt.val === this.state.value) {
          displayValue = opt.label;
        }
      }
      return displayValue != null ? displayValue : displayValue = "";
    },
    render: function() {
      var cellStyle, inputStyle, opt, options;
      cellStyle = {
        padding: 0
      };
      inputStyle = {
        marginBottom: 0
      };
      options = (function() {
        var i, len, ref, results;
        ref = this.props.schema.options;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          opt = ref[i];
          results.push(React.createElement("option", {
            "value": opt.val
          }, opt.label));
        }
        return results;
      }).call(this);
      if (this.props.isEdit) {
        return React.createElement("td", {
          "style": cellStyle
        }, React.createElement("select", {
          "style": inputStyle,
          "ref": "input",
          "valueLink": this.linkState("value"),
          "onBlur": this.props.cellEndEdit,
          "className": 'form-control',
          "autoFocus": "true"
        }, options));
      } else {
        return React.createElement("td", {
          "onClick": this.props.cellClick
        }, this.getDisplayValue());
      }
    }
  });

  DateTimeCell = React.createClass({
    mixins: [React.addons.LinkedStateMixin, CellMixin],
    componentWillMount: function() {
      return this.setState({
        value: this.props.value
      });
    },
    closeButtonClick: function(e) {
      debugger;
      var that;
      that = this;
      this.setState({
        value: ""
      }, function() {
        return that.props.cellEndEdit();
      });
      e.preventDefault();
      return e.stopPropagation();
    },
    render: function() {
      var cellStyle, input, inputStyle;
      cellStyle = {
        padding: 0
      };
      inputStyle = {
        marginBottom: 0
      };
      if (this.props.required) {
        input = React.createElement("input", {
          "style": inputStyle,
          "type": "text",
          "ref": "input",
          "defaultValue": this.getDisplayValue(),
          "className": 'form-control',
          "autoFocus": "true"
        });
      } else {
        input = React.createElement("div", {
          "className": "input-group input-append date form_datetime",
          "ref": "datetimepicker"
        }, React.createElement("input", {
          "size": "16",
          "className": "form-control",
          "autoFocus": "true",
          "ref": "input",
          "type": "text",
          "valueLink": this.linkState("value"),
          "readOnly": "readonly"
        }), React.createElement("span", {
          "onClick": this.closeButtonClick,
          "className": "input-group-addon add-on"
        }, React.createElement("i", {
          "className": "glyphicon glyphicon-remove"
        })));
      }
      if (this.props.isEdit) {
        return React.createElement("td", {
          "style": cellStyle
        }, input);
      } else {
        return React.createElement("td", {
          "onClick": this.props.cellClick
        }, this.state.value);
      }
    },
    componentDidUpdate: function() {
      var input, that;
      that = this;
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        if (input.data("datetimepicker")) {
          input.datetimepicker("show");
        } else {
          input.datetimepicker({
            format: that.props.schema.format,
            language: "zh-CN",
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighLight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            todayBtn: true,
            pickerPosition: "bottom-right"
          });
          input.datetimepicker('show');
        }
        input.off("changeDate");
        input.one("changeDate", function() {
          debugger;
          return that.setState({
            value: input.val()
          }, function() {
            return that.props.cellEndEdit();
          });
        });
        if (!this.props.required) {
          input.on("hide", function() {
            return console.log("hide");
          });
        }
        if (this.props.error) {
          return input.popover({
            content: this.props.error[this.props.fieldKey],
            placement: "auto"
          });
        }
      }
    },
    componentWillUpdate: function(nextProps, nextState) {
      var input;
      if (this.props.isEdit === true && nextProps.isEdit !== true) {
        input = $(React.findDOMNode(this.refs.input));
        return input.datetimepicker("remove");
      }
    },
    componentWillUnmount: function() {
      var input;
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        if (input.data("datetimepicker")) {
          input.datetimepicker("remove");
          return console.log("remove");
        }
      }
    }
  });

  window.CellClasses = {
    text: TextCell,
    select: SelectCell,
    datetime: DateTimeCell,
    checkbox: CheckBoxCell
  };

}).call(this);
