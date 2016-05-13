$(function () {

    var map = initializeMap();
    var $addItemButton = $('#options-panel').find('button');

    var $listGroups = {
        hotel: $('#hotel-list').children('ul'),
        restaurant: $('#restaurant-list').children('ul'),
        activity: $('#activity-list').children('ul')
    };

    var $itinerary = $('#itinerary');

    var $addDayButton = $('#day-add');
    var $dayTitle = $('#day-title').children('span');
    var $removeDayButton = $('#day-title').children('button');
    var $dayButtonList = $('.day-buttons');


    var currentDay = 1;

    var currentItinerary = []; //[{type, name, marker}];

    /*
    --------------------------
    END VARIABLE DECLARATIONS
    --------------------------
     */

    makeDaysButtons();
    renderDay();

    function makeDaysButtons () {
        $.get('/api/days')
        .then(function(numDays) {
            reRenderDayButtons(numDays);
        })
        .fail(console.error.bind(console));
    }


    function addtoDay (num, type, item) {
        return $.post('/api/days/' + type, {
            day: num,
            item: item
        });
    }
    
    $addItemButton.on('click', function () {

        var $this = $(this);
        var $select = $this.siblings('select');
        var item = $select.val();
        var type = $select.attr('data-type');
        var $list = $listGroups[type];
        $list.append(create$item(item));

        addtoDay(currentDay, type, item)
        .then(function() {
            renderDay();
        })
        // $.get('/api/location?type='+type+'&name='+item)
        // .then(function(location) {
        //     currentItinerary.push({
        //         type: type,
        //         name: item,
        //         marker: drawMarker(map, type, location)
        //     })
        // })    
        
        mapFit();

    });

    $itinerary.on('click', 'button.remove', function () {

        var $this = $(this);
        var $item = $this.parent();
        var itemName = $item.children('span').text();
        // var day = days[currentDayNum - 1];
        // var indexOfItemOnDay = findIndexOnDay(day, itemName);
        // var itemOnDay = day.splice(indexOfItemOnDay, 1)[0];

        // itemOnDay.marker.setMap(null);
        // $item.remove();

        mapFit();

    });

    $addDayButton.on('click', function () {

        var newDayNum = $('.day-buttons').children().length;
        var $newDayButton = createDayButton(newDayNum);
        $addDayButton.before($newDayButton);
        switchDay(newDayNum);
        map = initializeMap();

    });

    $dayButtonList.on('click', '.day-btn', function () {
        var dayNumberFromButton = parseInt($(this).text(), 10);
        switchDay(dayNumberFromButton);
    });

    $removeDayButton.on('click', function () {

        wipeDay();
        // days.splice(currentDayNum - 1, 1);

        // if (days.length === 0) {
        //     days.push([]);
        // }

        reRenderDayButtons();
        switchDay(1);

    });

   
    /*
    --------------------------
    END NORMAL LOGIC
    --------------------------
     */

    // Create element functions ----

    function create$item(item) {
        var $li = $('<li />');
        var $div = $('<div />').addClass('itinerary-item');
        var $span = $('<span />').text(item).addClass("title");
        var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

        return $li.append($div.append($span).append($removeButton))

    }

    function createDayButton(number) {
        return $('<button class="btn btn-circle day-btn">' + number + '</button>');
    }

    // End create element functions ----


    function switchDay(dayNum) {
        wipeDay();
        currentDay = dayNum;
        $dayTitle.text('Day ' + dayNum);
        
        renderDay()
        .then(function() {
            mapFit();
        }) 
    }

    function makeItinerary(dayNum) {
        currentItinerary = [];
        return $.get('/api/days/'+dayNum)
        .then(function(itinerary) {
            for (var type in itinerary) {
                var attraction = itinerary[type];
                attraction.forEach(function(item) {
                    if (item) {
                        currentItinerary.push({
                            type: type,
                            name: item.name,
                            marker: drawMarker(map, type, item.place.location)
                        });
                    }
                })
            }
        })
        .fail();
    }


    function renderDay() {
        makeItinerary(currentDay)
        .then(function() {
            currentItinerary.forEach(function(attraction) {
                var $listToAddTo = $listGroups[attraction.type];
                $listToAddTo.append(create$item(attraction.name));
            })

            $dayButtonList
            .children('button')
            .eq(currentDay-1)
            .addClass('current-day');
        })
    }

    function wipeDay() {

        $dayButtonList.children('button').removeClass('current-day');

        Object.keys($listGroups).forEach(function (key) {
           $listGroups[key].empty();
        });

        currentItinerary.forEach(function (attraction) {
            attraction.marker.setMap(null);
        });


    }

    function reRenderDayButtons(numberOfDays) {

        $dayButtonList.children('button').not($addDayButton).remove();

        for (var i = 0; i < numberOfDays; i++) {
            $addDayButton.before(createDayButton(i + 1));
        }

    }

    function mapFit() {

        var bounds = new google.maps.LatLngBounds();

        currentItinerary.forEach(function (attraction) {
            bounds.extend(attraction.marker.position);
        });

        map.fitBounds(bounds);

    }


});
