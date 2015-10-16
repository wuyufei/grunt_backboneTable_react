(function() {
  var Modal,
    hasProp = {}.hasOwnProperty;

  Modal = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
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
      modalContainer = $(el).parent();
      modalContainer.modal("show");
      return modalContainer.on("hidden.bs.modal", function() {
        React.unmountComponentAtNode(modalContainer[0]);
        return modalContainer.remove();
      });
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
          }, React.createElement("input", {
            "type": "text",
            "valueLink": this.linkState(k),
            "className": "form-control",
            "placeholder": v.title
          }))));
        }
        return results;
      }).call(this);
      return React.createElement("div", {
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
        "type": "button",
        "className": "btn btn-primary",
        "data-dismiss": "save"
      }, "\u4fdd\u5b58"))));
    }
  });

  window.Modal = Modal;

}).call(this);
