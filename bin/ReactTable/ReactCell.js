(function() {
  var CellMixin, DateTimeCell, SelectCell, TextCell;

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
          "onBlur": _.partial(this.props.cellEndEdit, this.state.value),
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
          "onBlur": this.props.cellEndEdit.bind(this, this.state.value),
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
    mixins: [CellMixin],
    componentWillMount: function() {
      return this.setState({
        value: this.props.value
      });
    },
    getDisplayValue: function() {
      return this.props.value;
    },
    closeButtonClick: function(e) {
      console.log("close");
      e.preventDefault();
      e.stopPropagation();
      return this.props.cellEndEdit("");
    },
    render: function() {
      var cellStyle, input, inputStyle;
      cellStyle = {
        padding: 0
      };
      inputStyle = {
        marginBottom: 0
      };

      /*<td style={cellStyle}>
         <input style={inputStyle} type="text" ref="input" defaultValue={@getDisplayValue()}
           className='form-control' />
      </td>
       */
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
          "defaultValue": this.getDisplayValue(),
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
          "onMouseDown": this.props.cellClick
        }, this.getDisplayValue());
      }
    },
    componentDidMount: function() {
      var td;
      td = this.getDOMNode();
      return this.width = $(td).innerWidth();
    },
    componentDidUpdate: function() {
      var input, that;
      that = this;
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        $(this.getDOMNode()).width(this.width);
        setTimeout(function() {
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
          return input.datetimepicker('show');
        }, 0);
        input.on("changeDate", function() {
          var value;
          value = input.val();
          return that.props.cellEndEdit(value);
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
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        input.datetimepicker("remove");
        return console.log("remove");
      }
    },
    componentWillUnmount: function() {
      var input;
      if (this.props.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        input.datetimepicker("remove");
        return console.log("remove");
      }
    }
  });

  window.TextCell = TextCell;

  window.SelectCell = SelectCell;

  window.DateTimeCell = DateTimeCell;

}).call(this);
