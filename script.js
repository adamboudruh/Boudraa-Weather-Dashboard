$(function () {
    $('#search-btn').on('click', function (event) {
        var sampleSearch = $('<button>').addClass(' btn-block p-2 m-2 rounded past-search w-100');
        event.preventDefault();
        var cityName = $('#city-name').val().trim();
        if (cityName !== ''){
            sampleSearch.text(cityName);
            sampleSearch.attr('data-city', cityName);
            sampleSearch.appendTo($('#search-history'));
            displayWeather(cityName);
        }
    });

    $('#clear-btn').on('click', function(){ $('#search-history').empty(); })


    $('#search-history').on('click', '.past-search', function (event) { handleCityClick(event);});

    function handleCityClick(event){
        var clicked = $(event.target);
        var city = clicked.data('city');
        displayWeather(city);
    }

    function displayWeather(city){
        console.log("Displaying " + city + "'s weather information.");
        $('#date0').text(city + " ");

        //for 5-day forecast:
        //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

        //for coorinates:
        //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

        var apiKey= 'eba75ff06396bfdcd29274654ae005af'
        var geocodeURL = 'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=1&appid='+apiKey;
        var cityLon; var cityLat;
        fetch(geocodeURL)
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                cityLon = data[0].lon;
                cityLat = data[0].lat;
                console.log("Coordinates of " + city + ": \n\t Long: "+cityLon+"\n\t Lat: " + cityLat);
                var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+cityLat+'&lon='+cityLon+'&appid='+apiKey+'&units=imperial';
                return fetch(forecastURL);
            })
            .then(function (response){
                console.log(response);
                return response.json();
            })
            .then(function (data){
                console.log(data);
                for (var i = 0; i <= 5; i++){
                    index = (i*8);
                        if (index > 0) index--;
                    var temp = data.list[index].main.temp;
                    var wind = data.list[index].wind.speed;
                    var humid = data.list[index].main.humidity;
                    var time = data.list[index].dt;
                    var icon = data.list[index].weather[0].icon;
                    $('#temp'+i).text("Temp: "+temp+" °F");
                    $('#wind'+i).text("Wind: "+wind+" MPH");
                    $('#humid'+i).text("Humid: "+humid+"%");
                    $('#icon'+i).attr('src', 'https://openweathermap.org/img/wn/'+icon+'@2x.png').addClass('smaller');
                    if (i === 0) { $('#date0').append('('+convertDate(time)+')') }
                    else {$('#date'+i).text(convertDate(time));}
                }

            });

        var cityImageURL = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + city;
        fetch(cityImageURL)
            .then(function(response){
                console.log(response);
                return response.json();
            })
            .then(function(data){
                console.log(data);
                var imgLink = data.thumbnail.source;
                $('#city-image').attr('src', imgLink);  
            })
            .catch(function(error){ $('#city-image').attr('src', ''); })
            
    }

    function convertDate(unixDate){
        var date = new Date(unixDate*1000);
        return dayjs(date).format('M/D/YYYY');
    }

});