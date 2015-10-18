(function() {
  var EditControlMinin, ModalForm,
    hasProp = {}.hasOwnProperty;

  EditControlMinin = {
    getEditControl: function(key, schema) {
      var opt, options;
      switch (schema.type) {
        case "Text":
          return React.createElement("input", {
            "ref": key,
            "type": "text",
            "valueLink": this.linkState(key),
            "className": "form-control",
            "placeholder": schema.title
          });
        case "Select":
          options = (function() {
            var i, len, ref, results;
            ref = schema.options;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              opt = ref[i];
              results.push(React.createElement("option", {
                "value": opt.val
              }, opt.label));
            }
            return results;
          })();
          return React.createElement("select", {
            "ref": key,
            "ref": "input",
            "valueLink": this.linkState(key),
            "className": 'form-control'
          }, options);
        case "DateTime":
          return React.createElement("input", {
            "className": "form-control",
            "ref": key,
            "type": "text",
            "valueLink": this.linkState(key),
            "readOnly": "readonly"
          });
        default:
          return React.createElement("input", {
            "ref": key,
            "type": "text",
            "valueLink": this.linkState(k),
            "className": "form-control",
            "placeholder": schema.title
          });
      }
    },
    componentDidMount: function() {
      debugger;
      var dateTimeEl, k, ref, results, v;
      ref = this.props.model.schema;
      results = [];
      for (k in ref) {
        if (!hasProp.call(ref, k)) continue;
        v = ref[k];
        if (v.type === "DateTime") {
          dateTimeEl = $(React.findDOMNode(this.refs[k]));
          results.push(dateTimeEl.datetimepicker({
            format: v.format,
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
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  ModalForm = React.createClass({
    mixins: [React.addons.LinkedStateMixin, EditControlMinin],
    getInitialState: function() {
      var k, ref, state, v;
      state = {};
      ref = this.props.model.schema;
      for (k in ref) {
        if (!hasProp.call(ref, k)) continue;
        v = ref[k];
        state[k] = this.props.model.get(k);
      }
      return state;
    },
    componentDidMount: function() {
      var el, modalContainer, that;
      that = this;
      el = this.getDOMNode();
      modalContainer = $(el);
      modalContainer.modal("show");
      return modalContainer.on("hidden.bs.modal", function() {
        React.unmountComponentAtNode(modalContainer[0]);
        return modalContainer.parent.remove();
      });
    },
    saveHandle: function() {
      var invalidHandle, k, modalContainer, model, newValue, ref, ref1, ref2, state, that, v;
      ref = [this.props.model, this.state, this], model = ref[0], state = ref[1], that = ref[2];
      modalContainer = $(this.getDOMNode());
      newValue = {};
      ref1 = model.schema;
      for (k in ref1) {
        if (!hasProp.call(ref1, k)) continue;
        v = ref1[k];
        newValue[k] = (ref2 = that.state[k]) != null ? ref2 : void 0;
      }
      invalidHandle = function(model, error) {
        return that.setState({
          fieldError: error
        });
      };
      model.on("invalid", invalidHandle);
      this.props.model.save(newValue, {
        success: function() {
          return modalContainer.modal("hide");
        },
        error: function(model, xhr, error) {
          return that.setState({
            serverError: error.errorThrown
          });
        },
        wait: true
      });
      return model.off("invalid", invalidHandle);
    },
    componentWillUpdate: function(nextProps, nextState) {},
    componentDidUpdate: function() {
      var control, fieldKey, model, ref, ref1, results, saveBtn, schema, state, that;
      ref = [this.props.model, this.state, this], model = ref[0], state = ref[1], that = ref[2];
      saveBtn = $(React.findDOMNode(that.refs.saveBtn));
      if (state.serverError) {
        saveBtn.popover({
          content: state.serverError,
          placement: "auto"
        });
        saveBtn.popover("show");
      } else {
        if (saveBtn.data("bs.popover") != null) {
          saveBtn.popover("destroy");
        }
      }
      if (state.fieldError) {
        ref1 = model.schema;
        results = [];
        for (fieldKey in ref1) {
          if (!hasProp.call(ref1, fieldKey)) continue;
          schema = ref1[fieldKey];
          control = $(React.findDOMNode(that.refs[fieldKey]));
          if (state.fieldError[fieldKey] != null) {
            control.popover({
              content: state.fieldError[fieldKey],
              placement: "auto"
            });
            control.popover("show");
            results.push(control.click(function() {
              return el.popover("destroy");
            }));
          } else {
            if (control.data("bs.popover") != null) {
              results.push(control.popover("destroy"));
            } else {
              results.push(void 0);
            }
          }
        }
        return results;
      }
    },
    render: function() {
      var fieldEls, k, v;
      fieldEls = (function() {
        var ref, results;
        ref = this.props.model.schema;
        results = [];
        for (k in ref) {
          if (!hasProp.call(ref, k)) continue;
          v = ref[k];
          results.push(React.createElement("div", {
            "className": "col-md-6 col-sm-12",
            "style": {
              marginTop: 10
            }
          }, React.createElement("label", {
            "className": "col-sm-4 control-label"
          }, v.title), React.createElement("div", {
            "className": "col-sm-8"
          }, this.getEditControl(k, v))));
        }
        return results;
      }).call(this);
      return React.createElement("div", {
        "className": 'modal fade'
      }, React.createElement("div", {
        "className": "modal-dialog modal-lg"
      }, React.createElement("div", {
        "className": "modal-content"
      }, React.createElement("div", {
        "className": "modal-header"
      }, React.createElement("button", {
        "type": "button",
        "className": "close",
        "data-dismiss": "modal",
        "aria-hidden": "true"
      }, "x"), React.createElement("h4", {
        "className": "modal-title"
      }, this.props.headerText)), React.createElement("div", {
        "className": "modal-body"
      }, React.createElement("div", {
        "className": "container-fluid"
      }, React.createElement("div", {
        "className": "row"
      }, React.createElement("form", {
        "className": "form-horizontal",
        "role": "form"
      }, fieldEls)))), React.createElement("div", {
        "className": "modal-footer"
      }, React.createElement("button", {
        "type": "button",
        "className": "btn btn-default",
        "data-dismiss": "modal"
      }, "\u5173\u95ed"), React.createElement("button", {
        "ref": "saveBtn",
        "type": "button",
        "className": "btn btn-primary",
        "onClick": this.saveHandle
      }, "\u4fdd\u5b58")))));
    }
  });

  window.ModalForm = ModalForm;

}).call(this);
