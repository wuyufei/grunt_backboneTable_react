ListCollection = Backbone.Collection.extend
  defaultOptions:
    sortField:""
    sortDir:"asc"
  initizlize:(options)->
    @.on "reset",(coll,opt)->
      coll.sortDir = "asc"
      coll.sortField = ""
  setSort:(sortField)->
    if sortField is @sortField
      @sortDir = if @sortDir is "asc" then "desc" else "asc"
    @sortField = sortField
    @comparator = (m1,m2)->
      val = if @sortDir is "asc" then 1 else -1
      if m1.get sortField > m2.get sortField
        val
      else if m1.get sortField < m2.get sortField
        -val
      else
        0
    @sort()

$.extend Backbone,{TableCollection:ListCollection}
