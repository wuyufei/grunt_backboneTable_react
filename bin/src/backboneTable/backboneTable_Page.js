(function() {
  var pageView;

  pageView = Backbone.View.extend({
    tagName: "ul",
    className: "list-group",
    attributes: {
      style: "margin-bottom:0px;"
    },
    currPage: 1,
    pageNum: 10,
    events: {
      "click a": "pageClick"
    },
    initialize: function(options) {
      var viewOptions;
      viewOptions = ["pageNum"];
      _.extend(this, _.pick(options, viewOptions));
      return this.listenTo(this.collection, "sort add remove reset", this.sort, this);
    },
    _getPagesArray: function() {
      var i, pageArray, pageCount;
      pageCount = Math.ceil(this.collection.length / this.pageNum);
      if (pageCount > 0) {
        pageArray = (function() {
          var j, ref, results;
          results = [];
          for (i = j = 1, ref = pageCount; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
            results.push(i);
          }
          return results;
        })();
      }
      return pageArray != null ? pageArray : [];
    },
    template: _.template("<li class=\"list-group-item\" style=\"padding-top:0px;padding-bottom:0px;\">\n  <ul class=\"pagination square\">\n    <li data-button=\"prev\">\n      <a href=\"#\">上一页</a>\n    </li>\n  <% _.each(items,function(item,index){ %>\n    <li <%= index+1 === currPage ? 'class=\"active\"':'' %>>\n      <a href=\"#\"><%= item %></a>\n    </li>\n  <% }); %>\n    <li data-button=\"next\">\n      <a href=\"#\">下一页</a>\n    </li>\n  </ul>\n</li> "),
    render: function() {
      var pageCount, pages, ref, that;
      that = this;
      pages = this._getPagesArray();
      if (pages.length > 0) {
        pageCount = (ref = _.last(pages)) != null ? ref : 0;
        if (this.currPage > pageCount) {
          this.currPage = pageCount;
        }
        this.$el.html(this.template({
          items: pages,
          currPage: this.currPage
        }));
        if (this.currPage === 1) {
          $("[data-button=prev]").addClass("disabled");
        }
        if (this.currPage === pageCount) {
          $("[data-button=next]").addClass("disabled");
        }
      }
      return this;
    },
    sort: function(e) {
      this.currPage = 1;
      return this.render();
    },
    pageClick: function(e) {
      var $target, txt;
      e.preventDefault();
      $target = $(e.currentTarget);
      txt = $.trim($target.text());
      if ($target.parent().hasClass("disabled") || parseInt(txt) === this.currPage) {
        return;
      }
      switch (txt) {
        case "上一页":
          this.trigger("pageChange", --this.currPage);
          break;
        case "下一页":
          this.trigger("pageChange", ++this.currPage);
          break;
        default:
          this.currPage = parseInt(txt);
          this.trigger("pageChange", txt);
      }
      return this.render();
    }
  });

  $.extend(Backbone.TableView, {
    Page: pageView
  });

}).call(this);
