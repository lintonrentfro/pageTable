var settings = {
    "dataURL" : "testdata.json",
    "rowsPerPage" : 10,
    "paginationLinksPerGroup" : 5,
    "paginationDiv" : "pagetable_pagination",
    "tableDiv" : "pagetable_table"
};

pageTable = {
    /*
    JS module for fetching a json object of homogenous data and display it in a sortable table with pagination.
    Bootstrap CSS classes are used by default.
    Requires jQuery.

    Example of use:
    1) Include the pageTable module in your application's js.
    2) When the table of data is needed, create a settings obj (shown above) and, after the DOM has loaded,
        "pageTable.startup(settings);" will take care of everything.
    3) The default format for the JSON table data should be:
        { "data" :
            [
                {
                    "Property A" : "Data A",
                    "Property B" : "Data B",
                    "Property C" : "Data C"
                    ...
                },
                ...
            ]
        }
    */

    getData : function(callback) {
    	/*
        Use AJAX to grab a JSON object expected to consist of an array of file names, dates, and URLs.
        */
        $.ajax({
            url: pageTable.settings.dataURL,
            type: "GET",
            dataType : "json",
            success: function( json ) {
                pageTable.currentData = json.data;
            },
            error: function( xhr, status ) {
                console.log("fileData error");
            },
            complete: function() {
                /*
                Set pagination and display row values.
                */
                pageTable.currentPage = 1;
                pageTable.currentGroup = 1;
                pageTable.totalPages = Math.ceil( pageTable.currentData.length / pageTable.settings.rowsPerPage );
                pageTable.totalPaginationGroups = Math.ceil( pageTable.totalPages / pageTable.settings.paginationLinksPerGroup );
                callback();
            }
        });
    },
    analyzeData : function(callback) {
        /*
        Analyze the json object returned by pageTable.getData to determine table headings.
        */
        var firstElement = pageTable.currentData[0];
        var tableHeadings = [];
        for (var key in firstElement) {
            tableHeadings.push(key);
        };

        /*
        Save table heading data.
        */
        pageTable.tableHeadings = tableHeadings;

        callback();
    },
    createHtml : function(callback) {
        /*
        Setup.
        */
        var rowsPerPage = pageTable.settings.rowsPerPage;
        var paginationLinksPerGroup = pageTable.settings.paginationLinksPerGroup;

        /*
        Current page information.
        */
        var currentPage = pageTable.currentPage;

        /*
        Current pagination group information.
        */
        var currentPaginationGroup = pageTable.currentGroup;

        /*
        Determine the first and last rows to be displayed based on the current pagination page.
        */
        var firstRow = ( currentPage - 1 ) * rowsPerPage;
        var lastRow = firstRow + rowsPerPage;

        /*
        Begin the table html.
        */
        var tableHtml = "<table class=\"table\"><thead><tr>";

        /*
        Add the table headings.
        */
        for(var i = 0; i < pageTable.tableHeadings.length; i++) {
            tableHtml += "<th class=\"sort_by\">" + pageTable.tableHeadings[i] + " <span class=\"glyphicon glyphicon-sort\"></span></th>";
        };
        tableHtml += "</tr></thead><tbody>";

        /*
        Add a row to the table for each row of data to be displayed.
        */
        for(var i = firstRow; i < lastRow; i++) {
            if(pageTable.currentData[i]){
                tableHtml += "<tr>";
                var thisRow = pageTable.currentData[i];
                for (var value in thisRow) {
                    if (thisRow.hasOwnProperty(value)) {
                        tableHtml += "<td>" + thisRow[value] + "</td>";
                    };
                };
                tableHtml += "</tr>";
            };
        };

        /*
        End the table html.
        */
        tableHtml += "</tbody></table>";

        /*
        Save table html.
        */
        pageTable.tableHtml = tableHtml;

        /*
        Begin pagination html.
        */
        var paginationHtml = "<ul class=\"pagination\"><li id=\"previous_page_group\"><a href=\"javascript:;\">&laquo;</a></li>";

        /*
        Determine the first and last pagination pages to be displayed based on current pagination group.
        */
        var firstPage = ( ( currentPaginationGroup - 1 ) * paginationLinksPerGroup ) + 1;
        var maxLastPage = firstPage + paginationLinksPerGroup - 1;
        if(maxLastPage < pageTable.totalPages) {
            var lastPage = maxLastPage;
        } else {
            var lastPage = pageTable.totalPages;
        };

        /*
        Add a page link for each possible page of data.
        */
        for(var i=firstPage;i<=lastPage;i++) {
            if(i == currentPage) {
                paginationHtml += "<li class=\"active page\"><a href=\"javascript:;\">" + i + "</a></li>";
            } else {
                paginationHtml += "<li class=\"page\"><a href=\"javascript:;\">" + i + "</a></li>";
            };
        };

        /*
        End pagination html.
        */
        paginationHtml += "<li id=\"next_page_group\"><a href=\"javascript:;\">&raquo;</a></li></ul>";

        /*
        Save pagination html.
        */
        pageTable.paginationHtml = paginationHtml;

        callback();
    },
    insertHtml : function(callback) {
        /*
        Insert pagination html into DOM.
        */
        $("#" + pageTable.settings.paginationDiv).html(pageTable.paginationHtml);

        /*
        Insert table html into DOM.
        */
        $("#" + pageTable.settings.tableDiv).html(pageTable.tableHtml);

        callback();
    },
    createEvents : function(callback) {
        /*
        Listeners for pagination page and group switching.
        */
        $(".page").click(function() {
            pageTable.currentPage = parseInt($(this).text());
            pageTable.refreshPage();
        });
        $("#previous_page_group").click(function() {
            if(pageTable.currentGroup != 1) {
                pageTable.currentGroup = pageTable.currentGroup - 1;
                pageTable.currentPage = ( ( pageTable.currentGroup - 1 ) * pageTable.settings.paginationLinksPerGroup ) + 1;
                pageTable.refreshPage();
            };
        });
        $("#next_page_group").click(function() {
            if(pageTable.currentGroup < pageTable.totalPaginationGroups) {
                pageTable.currentGroup = pageTable.currentGroup + 1;
                pageTable.currentPage = ( ( pageTable.currentGroup - 1 ) * pageTable.settings.paginationLinksPerGroup ) + 1;
                pageTable.refreshPage();
            };
        });

        /*
        Listeners for sorting.
        */
        $(".sort_by").click(function() {

            // function to trim spaces from beginning and end of string
            function trim1 (str) {
                return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            };

            // ascending and descending sorting functions
            function descending(a,b) {
                var property = pageTable.sortBy;
                if (a[property] < b[property]) {
                    return -1;
                };
                if (a[property] > b[property]) {
                    return 1;
                };
                return 0;
            };
            function ascending(a,b) {
                var property = pageTable.sortBy;
                if (a[property] < b[property]) {
                    return 1;
                };
                if (a[property] > b[property]) {
                    return -1;
                };
                return 0;
            };

            // set how the table should be sorted
            var sortBy = trim1($(this).text());

            // if table already sorted by this value, switch sort order
            if(sortBy == pageTable.sortBy) {
                if(pageTable.sortOrder == "descending") {
                    pageTable.sortOrder = "ascending";
                    var newData = pageTable.currentData.sort(ascending);
                } else {
                    pageTable.sortOrder = "descending";
                    var newData = pageTable.currentData.sort(descending);
                }
            } else {
                pageTable.sortBy = sortBy;
                pageTable.sortOrder = "descending";
                var newData = pageTable.currentData.sort(descending);
            };

            // save the newly sorted table
            pageTable.currentData = newData;

            pageTable.refreshPage();
        });

        callback();
    },
    refreshPage : function() {
        pageTable.createHtml(function() {
            pageTable.insertHtml(function() {
                pageTable.createEvents(function() {
                });
            });
        });
    },
    startup : function(settings) {
        pageTable.settings = settings;
        pageTable.getData(function() {
            pageTable.analyzeData(function() {
                pageTable.createHtml(function() {
                    pageTable.insertHtml(function() {
                        pageTable.createEvents(function() {
                        });
                    });
                });
            });
        });
    }
}

pageTable.startup(settings);
