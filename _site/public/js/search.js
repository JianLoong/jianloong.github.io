// Own implementation of search as all samples are moronic
function getSearchJSON()
{
    $.getJSON("/search.json", function(e) {
        console.log("[search.json loaded for instant search]");

        $("#search_results").html("");

        searchJSON = e;
    });
}

function doSearch(e)
{
    results = [];

    if (e != "")
    {
        $.each(searchJSON, function(t, n) {
            var r = n.title, i = n.title.toLowerCase(), s = n.href, o = n.date;
            i.indexOf(e)!==-1 && results.push([r, s, o])
        });

        printResults();
    }
    else
    {
        $("#search_results").html();
        results = [];
        printResults();
    }
}

function printResults()
{
    var e = $("#search_results");

    e.html("");

    e.html(function() {
        if (results.length == 0)
        {
            e.append('<li style="padding-top: 3px; padding-bottom: 3px">No results found.</li>');
        }
        else
        {
            $.each(results, function(t, n) {
                e.append('<li style="padding-top: 3px; padding-bottom: 3px">' + n[2].day +' '+ n[2].month +' '+ n[2].year + " &raquo; " + '<a href="' + n[1] + '">' + n[0] + '</a></li>');
            });
        }
    });
}

    // Show the dropdown menu as long as there are characters in the text field
    function checkTextField()
    {
        // If the value of id search_input is not empty show id search_results otherwise hide it
        if ($('#search_input').val() != '')
        {
            $('#search_results').show();
        }
        else
        {
            $('#search_results').hide();
        }
    }

    // Hide the dropdown menu if there is a left mouse click outside of it
    $(document).mouseup(function (e)
    {
        var container = $("#search_results");

        // if the target of the click isn't the
        // container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
            container.hide();
        }
    });

    $(document).ready(function() {
        // Create the search index on page load
        getSearchJSON();

        // Continually update search results as characters are typed
        $("#search_input").keyup(function() {
            // Make search inputs are case insensitive
            var e = $(this).val().toLowerCase();

            // Do the actual search
            doSearch(e);
        });
    });
