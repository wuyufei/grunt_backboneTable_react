(function() {
  var Page;

  Page = React.createClass({
    pageClick: function(e) {
      var info, pageLength, pageNum;
      e.preventDefault();
      e.stopPropagation();
      pageLength = Math.ceil(this.props.collection.length / 10) - 1;
      info = e.target.dataset.number;
      if (info === "prev") {
        pageNum = this.props.currentPage - 1;
      } else if (info === "next") {
        pageNum = this.props.currentPage + 1;
      } else {
        pageNum = parseInt(info);
      }
      if (pageNum < 0) {
        pageNum = 0;
      }
      if (pageNum > pageLength) {
        pageNum = pageLength;
      }
      if (pageNum !== this.props.currentPage) {
        return this.props.pageChange(pageNum);
      }
    },
    getPageArray: function() {
      var currPage, j, k, length, numbers, pages, results, results1;
      length = Math.ceil(this.props.collection.length / 10) - 1;
      currPage = this.props.currentPage;
      pages = [];
      numbers = (function() {
        results = [];
        for (var j = 0; 0 <= length ? j <= length : j >= length; 0 <= length ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this);
      if (length > 0) {
        if (length > 10) {
          if (this.props.currentPage >= 4) {
            pages.push(0);
            pages.push("......");
            if (currPage < length - 4) {
              pages = pages.concat(numbers.slice(currPage - 2, +(currPage + 2) + 1 || 9e9));
              if (currPage + 2 < length - 5) {
                pages.push("......");
              }
            }
            pages = pages.concat(numbers.slice(-5));
          } else {
            pages = pages.concat(numbers.slice(0, 5));
            pages.push("......");
            pages = pages.concat(numbers.slice(length - 4));
          }
        } else {
          pages = (function() {
            results1 = [];
            for (var k = 0; 0 <= length ? k <= length : k >= length; 0 <= length ? k++ : k--){ results1.push(k); }
            return results1;
          }).apply(this);
        }
      }
      return pages;
    },
    render: function() {
      var i, length, pageArray, pages;
      pageArray = this.getPageArray();
      length = Math.ceil(this.props.collection.length / 10) - 1;
      pages = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = pageArray.length; j < len; j++) {
          i = pageArray[j];
          results.push(React.createElement("li", {
            "className": (this.props.currentPage === i ? "active" : void 0)
          }, (i === "......" ? React.createElement("span", null, "......") : React.createElement("a", {
            "href": "#",
            "data-number": i,
            "onClick": this.pageClick
          }, i + 1))));
        }
        return results;
      }).call(this);
      return React.createElement("nav", null, React.createElement("ul", {
        "className": "pagination",
        "style": {
          marginTop: 10,
          marginLeft: 5,
          marginBottom: 5
        }
      }, React.createElement("li", {
        "className": (this.props.currentPage === 0 ? "disabled" : void 0)
      }, React.createElement("a", {
        "href": "#",
        "data-number": "prev",
        "onClick": this.pageClick
      }, "\u4e0a\u4e00\u9875")), pages, React.createElement("li", {
        "className": (this.props.currentPage === length ? "disabled" : void 0)
      }, React.createElement("a", {
        "href": "#",
        "data-number": "next",
        "onClick": this.pageClick
      }, "\u4e0b\u4e00\u9875"))));
    }
  });

  window.Page = Page;

}).call(this);
