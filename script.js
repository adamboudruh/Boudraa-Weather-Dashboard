$(function () {

    var sampleSearch = $('<p>').addClass('p-2 m-4 rounded');

    $('#search-btn').on('click', function (event) {
        event.preventDefault();
        var cityName = $('#city-name').val();
        console.log(cityName);
        sampleSearch.text(cityName);
        sampleSearch.attr('data-city', cityName);
        sampleSearch.appendTo($('#search-history'));
        
    });

});