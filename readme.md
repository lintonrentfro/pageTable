# pageTable
=========

pageTable is a JS module for fetching a JSON object of homogeneously structure data and display it in a sortable table with pagination.

## About pageTable
  * 3.6Kb
  * works anywhere js can run
  * easy to customize

## Dependencies
  * Default version works with Bootstrap v3 classes, but this can be customized easily.
  * jQuery

## Usage
  * Include the pageTable module somewhere in your js.
  * For each table you need, create a settings object like this:
      var settings = {
        "dataURL" : "http://domain.com/api/data",
        "rowsPerPage" : 10,
        "paginationLinksPerGroup" : 5,
        "paginationDiv" : "the_div_where_you_want_the_pagination_to_go",
        "tableDiv" : "the_div_where_you_want_the_table_to_go"
      };
  * On the page where you want that table to appear, use this after the DOM has loaded:
      pageTable.startup(settings);
