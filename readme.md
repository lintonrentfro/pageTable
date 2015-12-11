# pageTable
=========

pageTable is a JS module for fetching a JSON object of homogeneously structured data and display it in a sortable table with pagination.

## About pageTable
  * 3.6Kb minified
  * works anywhere js can run
  * easy to customize

## Dependencies
  * Default version works with Bootstrap v3 classes, but this can be customized easily.
  * jQuery

## Usage
  * Include the pageTable module somewhere in your js.
  * For each table you need, create a settings object like the example provided in pagetable.js.
  * On the page where you want that table to appear, use this after the DOM has loaded:
      pageTable.startup(settings);
