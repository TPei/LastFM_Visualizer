$(document).ready(function(){
    $( "select" ).change(function () {
        run();
    });

    $('#limit').change(function() {
        limit = $('#limit').val();
        run();
    });

    $('#username').change(function(){
       run();
    });

    load('gettopartists');
});

function run() {
    var str = "";
    $("select option:selected" ).each(function() {
        str += $( this ).text() + " ";
    });
    console.log(str);
    if(str == 'top tracks '){
        load('gettoptracks');
    }
    else if (str == 'top artists ') {
        load('gettopartists');
    }
    else if (str == 'top albums ') {
        load('gettopalbums')
    }
    else if(str == 'weekly tracks '){
        load('getweeklytrackchart');
    }
    else if (str == 'weekly artists ') {
        load('getweeklyartistchart');
    }
    else if (str == 'weekly albums ') {
        load('getweeklyalbumchart')
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
        'limit': 100,
        'format': 'json'
    };

    var url = base_url + '?' + 'method=' + method;

    for (var key in params) {
        url += '&' + key + '=' + params[key];
    }

    $.getJSON(url, function(json) {

        var dataArray;
        if(method == 'user.gettopartists'){
            dataArray = json.topartists.artist;
        }
        else if(method == 'user.gettoptracks') {
            dataArray = json.toptracks.track;
        }
        else if (method == 'user.gettopalbums') {
            dataArray = json.topalbums.album;
        }
        else if(method == 'user.getweeklyartistchart'){
            dataArray = json.weeklyartistchart.artist;
        }
        else if(method == 'user.getweeklytrackchart') {
            dataArray = json.weeklytrackchart.track;
        }
        else if (method == 'user.getweeklyalbumchart') {
            dataArray = json.weeklyalbumchart.album;
        }

        var d = {};
        var bands = [];
        var plays = [];
        var playsThisWeek = [];
        var playsThisMonth = [];

        var bandsRecent = [];
        var playsRecent = [];
        jQuery.each(dataArray, function(i, val) {
            if(bands.length < limit) {
                bands.push(val.name);
                //console.log(val.artist.name);
                plays.push(parseInt(val.playcount));
            }
        });


        var params = {
            'method': method,
            'api_key': api_key,
            'user': username,
            'limit': 100,
            'period': '1month',
            'format': 'json'
        };

        var url = base_url + '?' + 'method=' + method;

        for (var key in params) {
            url += '&' + key + '=' + params[key];
        }
        console.log(url);

        $.getJSON(url, function(json) {

            var dataArray;
            if (method == 'user.gettopartists') {
                dataArray = json.topartists.artist;
            }
            else if (method == 'user.gettoptracks') {
                dataArray = json.toptracks.track;
            }
            else if (method == 'user.gettopalbums') {
                dataArray = json.topalbums.album
            }

            if(dataArray != null) {
                jQuery.each(dataArray, function (i, val) {
                    bandsRecent.push(val.name);
                    playsRecent.push(parseInt(val.playcount));
                });

                for(var i = 0; i < bands.length; i++) {
                    var recentCount = bandsRecent.indexOf(bands[i]);
                    if(recentCount == -1){
                        playsThisMonth.push(0);
                    }
                    else {
                        playsThisMonth.push(playsRecent[recentCount]);
                    }
                }
            }

            bandsRecent = [];
            playsRecent = [];

            var params = {
                'method': method,
                'api_key': api_key,
                'user': username,
                'limit': 100,
                'period': '7day',
                'format': 'json'
            };

            var url = base_url + '?' + 'method=' + method;

            for (var key in params) {
                url += '&' + key + '=' + params[key];
            }

            $.getJSON(url, function(json) {
                var dataArray;
                if (method == 'user.gettopartists') {
                    dataArray = json.topartists.artist;
                }
                else if (method == 'user.gettoptracks') {
                    dataArray = json.toptracks.track;
                }
                else if (method == 'user.gettopalbums') {
                    dataArray = json.topalbums.album
                }
                if(dataArray != null) {
                    jQuery.each(dataArray, function (i, val) {
                        bandsRecent.push(val.name);
                        playsRecent.push(parseInt(val.playcount));
                    });

                    for (var i = 0; i < bands.length; i++) {
                        var recentCount = bandsRecent.indexOf(bands[i]);
                        if (recentCount == -1) {
                            playsThisWeek.push(0);
                        }
                        else {
                            playsThisWeek.push(playsRecent[recentCount]);
                        }
                    }
                }

                var text = "";
                if(method == 'user.gettopartists'){
                    text = "Plays per Band"
                }
                else if (method == 'user.gettoptracks'){
                    text = "Plays per Track";
                }
                else if (method == 'user.gettopalbums') {
                    text = "Plays per Album";
                }
                else if(method == 'user.getweeklyartistchart'){
                    text = "Plays per Band this week"
                }
                else if(method == 'user.getweeklytrackchart') {
                    text = "Plays per Track this week";
                }
                else if (method == 'user.getweeklyalbumchart') {
                    text = "Plays per Band this week"
                }

                series = [];

                if(plays.length != 0){
                    series.push({
                        name: 'all time',
                        data: plays
                    })
                };
                if(playsThisMonth.length != 0){
                    series.push({
                        name: 'this month',
                        data: playsThisMonth
                    })
                };
                if(playsThisWeek.length != 0){
                    series.push({
                        name: 'this week',
                        data: playsThisWeek
                    })
                };

                console.log(series);

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
                    series: series
                });
            });
        });

    });
};
