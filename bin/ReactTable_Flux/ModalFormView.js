(function() {
  var ModalFormView;

  ModalFormView = Backbone.View.extend({
    tagName: "div",
    className: "modal fade",
    events: {
      "click [data-command=save]": "save",
      "hidden.bs.modal": "remove",
      "shown.bs.modal": "modalShown"
    },
    initialize: function(options) {
      return this.options = _.extend({}, options);
    },
    close: function() {
      return this.$el.modal("hide");
    },
    modalShown: function() {
      return this.$el.find("[data-command=colse]").focus();
    },
    bindingData: function() {
      var control, dateFormat, displayValue, format, i, item, k, len, ref, ref1, ref2, ref3, results, that, v;
      that = this;
      ref = this.model.schema;
      results = [];
      for (k in ref) {
        v = ref[k];
        control = this.$el.find("[data-field=" + k + "]");
        switch (v.type.toLowerCase()) {
          case "text":
            results.push(control.val(this.model.get(k)));
            break;
          case "select":
            ref1 = this.model.schema[k].options;
            for (i = 0, len = ref1.length; i < len; i++) {
              item = ref1[i];
              control.append("<option value=\"" + item.val + "\">" + item.label + "</option> ");
            }
            results.push(control.val(this.model.get(k)));
            break;
          case "checkbox":
            if (this.model.get(k) === "1") {
              results.push(control.prop("checked", true));
            } else {
              results.push(void 0);
            }
            break;
          case "datetime":
            dateFormat = ((ref2 = v.format) != null ? ref2 : "YYYY-MM-DD").toUpperCase();
            displayValue = $.trim(this.model.get(k)) === "" ? "" : moment(this.model.get(k)).format(dateFormat);
            format = (ref3 = this.model.schema[k].format) != null ? ref3 : "yyyy-mm-dd";
            control.val(displayValue);
            results.push(control.datetimepicker({
              format: format,
              language: "zh-CN",
              weekStart: 1,
              todayBtn: 1,
              autoclose: 1,
              todayHighLight: 1,
              startView: 2,
              minView: 2,
              forceParse: 0,
              pickerPosition: "bottom-right"
            }));
            break;
          default:
            results.push(control.val(this.model.get(k)));
        }
      }
      return results;
    },
    _getFormValues: function() {
      var el, k, ref, v, val;
      val = {};
      ref = this.model.schema;
      for (k in ref) {
        v = ref[k];
        el = this.$el.find("[data-field=" + k + "]");
        el.popover("destroy");
        if (el.length > 0) {
          val[k] = el.val();
        }
      }
      if (this.getFormValue != null) {
        _.extend(val, this.getFormValue());
      }
      return val;
    },
    _validate: function(values) {
      var el, error, isValidate, k, tmpError, v;
      isValidate = true;
      error = this.model.validate(values);
      if (this.validate != null) {
        tmpError = this.validate();
        if (!_.isEmpty(tmpError)) {
          _.extend(error, tmpError);
          isValidate = false;
        }
      }
      if (error) {
        isValidate = false;
        window.scroll(0, 0);
        for (k in error) {
          v = error[k];
          el = this.$el.find("[data-field=" + k + "]");
          if (el.length > 0) {
            el.popover({
              content: v,
              placement: "auto right"
            });
            el.popover("show");
            el.click(function(e) {
              return $(this).popover("destroy");
            });
          }
        }
      }
      return isValidate;
    },
    save: function() {
      var formValues, isNew, that;
      that = this;
      debugger;
      formValues = this._getFormValues();
      if (this._validate(formValues)) {
        isNew = this.model.isNew();
        return this.model.save(formValues, {
          success: function() {
            that.$el.modal("hide");
            if (isNew) {
              return that.model.collection.add(that.model);
            }
          },
          error: function(model, xhr, options) {
            var $el;
            $el = that.$el.find("[data-command=save]");
            $el.popover({
              content: xhr.responseJSON.ExceptionMessage,
              placement: "auto"
            });
            return $el.popover("show");
          }
        });
      }
    },
    template: _.template("<div class=\"modal-dialog modal-lg\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <button type=\"button\" class=\"close\" data-command=\"colse\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n      <h4 class=\"modal-title\">详情</h4>\n    </div>\n    <div class=\"modal-body\">\n    </div>\n  </div>\n</div>"),
    formTemplate: _.template("<div class=\"container-fluid\">\n     <div class=\"row\">\n         <%_.each(model.schema,function(v,k){ %>\n         <div class=\"col-md-6 col-sm-6 col-xs-12\">\n             <div class=\"form-group\">\n                 <div class=\"input-group\">\n                     <span class=\"input-group-addon\"><%= v.title %></span>\n                     <%= getControl(v.type,k) %>\n                 </div>\n             </div>\n         </div>\n         <% }) %>\n     </div>\n</div>"),
    footerTemplate: _.template("<div class=\"modal-footer\">\n  <button type=\"button\" class=\"btn btn-primary\" data-command=\"save\">保存</button>\n  <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>\n</div> "),
    getControl: function(type, key) {
      switch (type.toLowerCase()) {
        case "text":
          return "<input type=\"text\" class=\"form-control\" data-field=" + key + " />";
        case "select":
          return "<select  class=\"form-control\" data-field=" + key + " />";
        case "checkbox":
          return "<input type=\"checkbox\" class=\"form-control\" data-field=" + key + " />";
        case "datetime":
          return "<input type=\"text\" class=\"form-control\" data-field=" + key + " readonly/>";
        case "fileinput":
          return "<input type=\"text\"  className=\"form-control\"/>\n  <span className=\"input-group-addon\" data-container=\"fileinput\">\n</span>";
      }
    },
    render: function() {
      var modalContent;
      this.$el.append(this.template());
      this.$el.find(".modal-body").append(this.formTemplate({
        model: this.model,
        getControl: this.getControl
      }));
      modalContent = this.$el.find(".modal-content");
      if (this.options.action !== "detail") {
        modalContent.append(this.footerTemplate());
      }
      if (this.width != null) {
        this.$el.find(".modal-dialog").css("minWidth", this.width);
      }
      this.$el.modal({
        backdrop: "static"
      });
      this.$el.modal("show");
      if (this.model != null) {
        this.bindingData();
      }
      if (this.options.action === "detail") {
        this.$el.find("fieldset").attr("disabled", "disabled");
      }
      if (this.title != null) {
        this.$el.find(".modal-title").text(this.title);
      }
      if (typeof this.renderComplete === "function") {
        this.renderComplete();
      }
      return this.el.focus();
    }
  });

  window.ModalFormView = ModalFormView;

}).call(this);
