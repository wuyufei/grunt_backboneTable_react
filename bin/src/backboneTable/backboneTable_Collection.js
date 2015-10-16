(function() {
  var ListCollection;

  ListCollection = Backbone.Collection.extend({
    defaultOptions: {
      sortField: "",
      sortDir: "asc"
    },
    initizlize: function(options) {
      return this.on("reset", function(coll, opt) {
        coll.sortDir = "asc";
        return coll.sortField = "";
      });
    },
    setSort: function(sortField) {
      if (sortField === this.sortField) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      }
      this.sortField = sortField;
      this.comparator = function(m1, m2) {
        var val;
        val = this.sortDir === "asc" ? 1 : -1;
        if (m1.get(sortField > m2.get(sortField))) {
          return val;
        } else if (m1.get(sortField < m2.get(sortField))) {
          return -val;
        } else {
          return 0;
        }
      };
      return this.sort();
    }
  });

  $.extend(Backbone, {
    TableCollection: ListCollection
  });

}).call(this);
