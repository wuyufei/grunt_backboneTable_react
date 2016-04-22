(function() {
  var Form, List, Model, cbSelectData, getSelectData, list, table, tableOption;

  $("#startTime,#endTime").datetimepicker({
    format: "yyyy-mm-dd",
    language: "zh-CN",
    weekStart: 1,
    autoclose: 1,
    todayHighLight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    todayBtn: true,
    pickerPosition: "bottom-right"
  });

  $("#btnSearch").click(function() {
    var data;
    data = {
      cbbh: $("#sltCb").val(),
      startTime: $("#startTime").val(),
      endTime: $("#endTime").val()
    };
    return list.fetch({
      reset: true,
      data: data
    });
  });

  $("#btnPrint").click(function() {
    table.options.allowPage = false;
    table.render();
    setTimeout(function() {
      return $("#backboneTable").printArea({
        popTitle: "港口驶费登记"
      });
    }, 1000);
    return setTimeout(function() {
      table.options.allowPage = true;
      return table.render();
    }, 5000);
  });

  getSelectData = function(code) {
    var array;
    array = [];
    $.ajax({
      url: "/GetSelectData/Get",
      data: "FieldName=" + code,
      async: false,
      success: function(data) {
        return array = data;
      }
    });
    return array;
  };

  cbSelectData = getSelectData("CBBH");

  Model = Backbone.Model.extend({
    idAttribute: "ID",
    urlRoot: "/api/tbinv_gksfdj",
    validation: {
      KBSJ: {
        required: true,
        msg: "请输入靠泊时间"
      },
      CBBH: {
        required: true,
        msg: "请输入船舶编号"
      },
      HCBH: {
        required: true,
        msg: "请选择航次编号"
      },
      JE: {
        required: true,
        pattern: "number",
        msg: "请输入正确的数字"
      },
      LPJE: {
        pattern: "number",
        msg: "请输入正确的数字"
      },
      CE: {
        pattern: "number",
        msg: "请输入正确的数字"
      }
    },
    schema: {
      KBSJ: {
        title: "靠泊日期",
        type: "DateTime",
        format: "yyyy-mm-dd"
      },
      CBBH: {
        title: "船舶",
        type: "Select",
        options: (function() {
          var i, item, j, len, ref, results;
          results = [];
          for (j = 0, len = cbSelectData.length; j < len; j++) {
            i = cbSelectData[j];
            item = {};
            ref = [i.mc, i.dm], item.label = ref[0], item.val = ref[1];
            results.push(item);
          }
          return results;
        })()
      },
      HCBH: {
        title: "航次",
        type: "Text"
      },
      GK: {
        title: "港口",
        type: "Text"
      },
      HX: {
        title: "航线",
        type: "Text"
      },
      JE: {
        title: "预付款",
        type: "Text"
      },
      LPJE: {
        title: "来票金额",
        type: "Text"
      },
      CE: {
        title: "差额",
        type: "Text"
      },
      FKNR: {
        title: "付款内容",
        type: "Text"
      },
      LPSJ: {
        title: "来票时间",
        type: "DateTime"
      },
      FKDW: {
        title: "付款单位",
        type: "Text"
      },
      URL: {
        title: "文件",
        type: "fileinput",
        url: "/ChuanBoGl/FileUpload",
        fileCategory: "gksfdj"
      }
    }
  });

  List = Backbone.Collection.extend({
    url: "/api/tbinv_gksfdj",
    model: Model
  });

  list = new List();

  tableOption = {
    el: $("#backboneTable"),
    collection: list,
    readonly: true,
    displayedPageRecordLength: 10,
    displayedPagesLength: 10,
    allowPage: true,
    buttons: {
      headerButtons: {
        add: {
          text: "新增",
          onclick: function(model, e) {
            var form;
            model = new Model();
            model.collection = list;
            e.preventDefault();
            form = new Form({
              model: model,
              action: "add"
            });
            return form.render();
          }
        }
      },
      rowButtons: {
        detail: {
          text: "详情",
          onclick: function(model, e) {
            var form;
            e.preventDefault();
            form = new Form({
              model: model,
              action: "detail"
            });
            return form.render();
          }
        },
        edit: {
          text: "编辑"
        },
        "delete": {
          text: "删除"
        }
      }
    }
  };

  Form = ModalFormView.extend({
    renderComplete: function() {
      debugger;
      var cbbhInput, fileInput, fileInputContainer, fuOpt, hcbhInput, schema, that;
      that = this;
      cbbhInput = this.$el.find("[data-field=CBBH]");
      hcbhInput = this.$el.find("[data-field=HCBH]");
      cbbhInput.change(function() {
        var array, i, j, len, results, val;
        hcbhInput = that.$el.find("[data-field=HCBH]");
        hcbhInput.empty();
        val = $(this).val();
        array = getSelectData("hcbh|" + val);
        results = [];
        for (j = 0, len = array.length; j < len; j++) {
          i = array[j];
          results.push(hcbhInput.append("<option value=\"" + i.dm + "\">" + i.mc + "</option> "));
        }
        return results;
      });
      if (this.options.action === "add") {
        hcbhInput.replaceWith("<select data-field='HCBH' class='form-control' />");
        cbbhInput.trigger("change");
      } else if (this.options.action === "edit") {
        cbbhInput.attr("disabled", "disabled");
        hcbhInput.attr("disabled", "disabled");
      }
      fileInputContainer = this.$el.find("[data-container=fileinput]");
      fileInput = this.$el.find("[data-field=URL]");
      schema = this.model.schema["URL"];
      fuOpt = {
        baseUrl: schema.url,
        dataType: "string",
        chooseFile: function(files, mill) {
          return fileInput.val(files[0].name);
        },
        beforeUpload: function(files, nill) {},
        uploadSuccess: function(resp) {
          return fileInput.data("url", resp.url);
        },
        uploadFail: function(resp) {
          debugger;
        },
        param: {
          fileCategory: schema.fileCategory
        }
      };
      return ReactDOM.render(React.createElement(FileUpload, {
        "options": fuOpt,
        "style": {
          height: 20
        }
      }, React.createElement("button", {
        "className": "btn btn-default btn-xs",
        "ref": "uploadBtn"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon glyphicon-upload",
        "aria-hidden": "true"
      }), "  \u4e0a\u4f20"), React.createElement("button", {
        "className": "btn btn-info btn-xs",
        "ref": "chooseBtn"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon glyphicon-folder-open",
        "aria-hidden": "true"
      }), "  \u6d4f\u89c8")), fileInputContainer[0]);
    }
  });

  if (sa.Search === false) {
    delete tableOption.buttons.rowButtons.detail;
  }

  if (sa.Edit === false) {
    delete tableOption.buttons.headerButtons.add;
    delete tableOption.buttons.rowButtons.edit;
  }

  if (sa.Delete === false) {
    delete tableOption.buttons.rowButtons["delete"];
  }

  if (sa.Verify === false) {
    delete tableOption.buttons.rowButtons.verify;
  }

  table = new BackboneTable(tableOption);

  table.render();

}).call(this);
