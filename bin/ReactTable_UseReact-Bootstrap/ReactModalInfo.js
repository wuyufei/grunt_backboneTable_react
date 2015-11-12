(function() {
  var ModalInfo;

  ModalInfo = React.createClass({
    componentDidMount: function() {
      var modalContainer;
      modalContainer = $(this.getDOMNode());
      modalContainer.modal("show");
      modalContainer.on("hidden.bs.modal", function() {
        React.unmountComponentAtNode(modalContainer.parent()[0]);
        return modalContainer.parent().remove();
      });
      if (this.props.autoClose) {
        return setTimeout(function() {
          return modalContainer.modal("hide");
        }, 2000);
      }
    },
    confirmButtonClick: function(e) {
      debugger;
      var modalContainer, saveBtn;
      this.props.confirmButtonClick(e);
      if (e.isDefaultPrevented()) {
        saveBtn = $(React.findDOMNode(this.refs.saveBtn));
        saveBtn.popover({
          content: e.error,
          placement: "auto"
        });
        return saveBtn.popover("show");
      } else {
        modalContainer = $(this.getDOMNode());
        return modalContainer.modal("hide");
      }
    },
    render: function() {
      return React.createElement("div", {
        "className": 'modal fade'
      }, React.createElement("div", {
        "className": "modal-dialog"
      }, React.createElement("div", {
        "className": "modal-content"
      }, React.createElement("div", {
        "className": "modal-header"
      }, React.createElement("button", {
        "type": "button",
        "className": "close",
        "data-dismiss": "modal",
        "aria-label": "Close"
      }, React.createElement("span", {
        "aria-hidden": "true"
      }, "\u00d7")), React.createElement("h4", {
        "className": "modal-title",
        "id": "mySmallModalLabel"
      }, "\u63d0\u793a")), React.createElement("div", {
        "className": "modal-body text-center"
      }, React.createElement("p", {
        "style": {
          fontSize: 20
        }
      }, this.props.msg)), (this.props.autoClose ? null : React.createElement("div", {
        "className": "modal-footer"
      }, React.createElement("button", {
        "ref": "saveBtn",
        "type": "button",
        "className": "btn btn-danger",
        "onClick": this.confirmButtonClick
      }, "\u786e\u5b9a"), React.createElement("button", {
        "type": "button",
        "className": "btn btn-default",
        "data-dismiss": "modal"
      }, "\u53d6\u6d88"))))));
    }
  });

  window.ModalInfo = ModalInfo;

}).call(this);
