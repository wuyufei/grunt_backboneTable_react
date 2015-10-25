(function() {
  var modalView;

  modalView = Backbone.View.extend({
    tagName: "div",
    className: "modal fade",
    attributes: {
      "data-method": "modal",
      "style": "display:none"
    },
    events: {
      "hidden.bs.modal": "remove",
      "hide.bs.modal": "destroy",
      "click button[data-method=save]": "save"
    },
    defaultOptions: {
      readonly: false,
      headerText: "详情",
      acceptText: "保存",
      cancelText: "取消"
    },
    destroy: function() {
      return _.each(this.cells, function(control, key) {
        return control.destroy();
      });
    },
    initialize: function(options) {
      var that;
      that = this;
      this.$el.html("<div class=\"modal-dialog modal-lg\">\n  <div class=\"modal-content\"></div>\n</div>");
      this.options = $.extend(true, {}, this.defaultOptions, options);
      return _.each(this.model.schema, function(value, key) {
        var obj;
        if (key !== "buttons" && value.showOnModal !== false) {
          obj = {};
          obj[key] = Backbone.TableView.CellMaker.factory(key, that.model, that);
          return _.extend(that.cells, obj);
        }
      });
    },
    headerTemplate: _.template("<div class=\"modal-header\">\n<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" >×</button>\n<h4 class=\"modal-title\"><%= headerText %></h4>\n  									           </div> "),
    bodyTemplate: _.template("<div class=\"modal-body\">\n              									<div class=\"row\">\n              										<form class=\"form-horizontal\" role=\"form\">\n              										</form>\n              									</div>\n</div> "),
    footTemplate: _.template("<div class=\"modal-footer\">\n              									<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">\n              											关闭</button>\n              										<% if (!readonly) { %>\n              									<button type=\"button\" class=\"btn btn-primary\" data-method=\"save\">\n              										保存</button>\n              									<% } %>\n</div> "),
    render: function() {
      var form, mContent, that;
      that = this;
      mContent = this.$el.find("div.modal-content");
      mContent.append(this.headerTemplate(this.options));
      mContent.append(this.bodyTemplate());
      form = mContent.find("form");
      $.each(this.model.schea, function(key, value) {
        value.key = key;
        if (value.showOnModal !== false && key !== "button") {
          if (that.model.isNew()) {
            if (value.showOnNew !== false) {
              return form.append(that.cells[key].renderModalField(that));
            }
          } else {
            return form.append(that.cells[key].renderModalField(that));
          }
        }
      });
      mContent.append(this.footTemplate(this.options));
      $("body").append(this.$el);
      this.$el.modal("show");
      return this;
    },
    save: function() {
      var nVal, that, validPrompt;
      that = this;
      validPrompt = new $.Deferred();
      validPrompt.done(function() {
        var errorFlag, xhr;
        that.$el.find("[data-field]").popover("destroy");
        errorFlag = false;
        that.model.on("error", function(model, xhr, options) {
          var $el;
          errorFlag = true;
          $el = that.$el.find("[data-method=save]");
          $el.popover({
            content: xhr.responseText,
            placement: "auto"
          });
          return $el.popover("show");
        });
        that.model.on("sync", function() {
          var $el;
          that.model.off("error");
          $el = that.$el.find("[data-method=save]");
          $el.popover("hide");
          $el.popover("destroy");
          return $(that.el).modal("hide");
        });
        return xhr = that.model.isNew() ? that.model.collection.create(that.model, {
          wait: true
        }) : that.model.save({
          wait: true
        });
      });
      validPrompt.fail(function(model, error) {
        return $.each(error, function(key, val) {
          var $el;
          $el = that.$el.find("[data-field=" + key + "]");
          $el.popover({
            content: val,
            placement: "auto"
          });
          $el.popover("show");
          return $el.click(function() {
            return $(this).popover("destroy");
          });
        });
      });
      nVal = [];
      _.each(that.cells, function(cell, key) {
        return nVal[key] = cell.getModalValue();
      });
      that.model.once("invalid", validPrompt.reject);
      that.model.set(nVal, {
        validate: true
      });
      return validPrompt.resolve();
    }
  });

  $.extend(Backbone.TableView, {
    Modal: modalView
  });

}).call(this);
