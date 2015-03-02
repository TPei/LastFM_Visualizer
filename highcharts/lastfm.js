$(document).ready(function(){
    $( "select" ).change(function () {
        run();
    });

    $('#limit').change(function() {
        limit = $('#limit').val();
        run()
    });

    load('topartists');
});

function run() {
    var str = "";
    $( "select option:selected" ).each(function() {
        str += $( this ).text() + " ";
    });
    console.log(str);
    if(str == 'top tracks '){
        load('gettoptracks');
    }
    else if (str == 'top artists ') {
        load('topartists');
    }
    else if (str == 'top albums ') {
        load('gettopalbums')
    }
}

var limit = 10;

var load = function (method) {
    $('#container').empty();
    $('#container').html('<br><br><br><br><br><br><br>' +
    '<div class="col-md-4 col-md-offset-4" ><i class="fa fa-spinner fa-spin" style="font-size: 50px;"></i></div>');

    var base_url = 'http://ws.audioscrobbler.com/2.0/';
    method = 'user.' + method;


    var usernameInput = $('#username').val();
    var username;
    if(usernameInput != ""){
        username = usernameInput;
    }
    else {
        username = 'dragon5689';
    }

    // is taken from another js file
    var api_key = global_api_key;
    var params = {
        'method': method,
        'api_key': api_key,
        'user': username,
        'limit': limit,
        'format': 'json'
    };

    var url = base_url + '?' + 'method=' + method;

    for (var key in params) {
        url += '&' + key + '=' + params[key];
    }
    console.log(url);

    $.getJSON(url, function(json) {

        var dataArray;
        if(method == 'user.topartists'){
            dataArray = json.topartists.artist;
        }
        else if(method == 'user.gettoptracks') {
            dataArray = json.toptracks.track;
        }
        else if (method == 'user.gettopalbums') {
            dataArray = json.topalbums.album
        }

        var bands = [];
        var plays = [];

        jQuery.each(dataArray, function(i, val) {
            if(bands.length < limit) {
                bands.push(val.name);
                plays.push(parseInt(val.playcount));
            }
        });
        var text = "";
        if(method == 'user.topartists'){
            text = "Plays per Band"
        }
        else if (method == 'user.gettoptracks'){
            text = "Plays per Track";
        }
        else if (method == 'user.gettopalbums') {
            text = "Plays per Album";
        }

        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: text
            },
            subtitle: {
                text: 'Source: ' + username + '\'s LastFM data'
            },
            yAxis: {
                title: {
                    text: 'Playcount'
                }
            },
            xAxis: {
                categories: bands
            },
            tooltip: {
                valueSuffix: ' times'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'PlayCount',
                data: plays
            }]
        });
    });
};