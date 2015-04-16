require('../model/point');  
  
var Point = require('mongoose').model('Point'),
    bodyParser = require('body-parser'),
    request = require('request'),
    https = require('https'),
    moment = require('moment'),
    _ = require('lodash'),
    jsonParser = bodyParser.json(),
    Firebase = require("firebase");

var heaterControl = new Firebase("https://heater-control.firebaseio.com/");

function broadcastSavedPoint(server, point) {
   
    server.connections.forEach(function (connection) {

        if(connection.username && point.userid === connection.username) {
            connection.sendText(JSON.stringify(initPoint(point)));
        }

    });

}

var levelMap = {
    1 : 'first',
    2 : 'second',
    3 : 'third',
    4 : 'forth',
    5 : 'fifth'
}

function getLocations(locations) {

    var modifiedLocations = [];

    if(locations && locations.length) {

        _.forEach(locations, function(location, key) {

            modifiedLocations.push({

                name : location.name,
                types : location.types,
                geometry : location.geometry,
                vicinity : location.vicinity,
                place_id : location.place_id

            });

        });

    }

    return modifiedLocations;
}

function initPoint(point, lightRequest) {
    var initialStressLevel = point['stress-level'],
        time = moment(point.timestamp).format("HH:mm"),
        date = moment(point.timestamp).format("MMM DD YYYY"),
        mobileEvent = point['mobile-event'] ? point['mobile-event'] : '';

    var modifiedPoint = {};

    if(lightRequest) {

        modifiedPoint = {
            id : point.id,
            stressLevel : initialStressLevel,
            geolocation : point.geolocation,
            markerOptions : {
                draggable : false
            }
        };

    } else {

        if(!mobileEvent && point['car-event']) {
            mobileEvent = point['car-event'];
        } else if(!mobileEvent) {
            mobileEvent = 'Event N/A';
        }

        modifiedPoint = {
            id : point.id,
            stressLevel : initialStressLevel,
            status : levelMap[initialStressLevel] + '-level-status',
            timestamp : point.timestamp,
            weather : point.weather,
            stressLevelChangeState : point['stress-level-change-state'],
            markerOptions : {
                draggable : false
            },
            marker : {
                description : mobileEvent,
                time : {
                    time: moment(point.timestamp).format("HH:mm"),
                    date : moment(point.timestamp).format("MMM DD YYYY")
                }
            },
            time : {
                time: time,
                date : moment(point.timestamp).format("MMM DD YYYY")
            },
            travelType : point['travel-type'],
            carEvent : point['car-event'],
            geolocation : point.geolocation,
            locations : getLocations(point.locations),
            weather : point.weather,
            lastEvent : {
                time : time,
                description : mobileEvent
            },
            previousEvents : []
        };

    }  

    return modifiedPoint;
}

function processPoints(points, request) {
    var modifiedPoints = [];

    if(points.length) {

        var modifiedPoint = initPoint(points[0], request.query['light']);
        initialStressLevel = modifiedPoint.stressLevel,
        pushed = false;

        _.forEach(points, function(point, key) {

            if(!request.query['light'] && 
                initialStressLevel === point['stress-level'] && key > 0 
                && (!request.query['stress'] || request.query['stress'] === 'all')) {


                var mobileEvent = point['mobile-event'] ? point['mobile-event'] : '';

                if(!mobileEvent && point['car-event']) {
                    mobileEvent = point['car-event'];
                } else if(!mobileEvent) {
                    mobileEvent = 'Event N/A';
                }

                var eventInfo = {
                    time : {
                        time: moment(point.timestamp).format("HH:mm"),
                        date : moment(point.timestamp).format("MMM DD YYYY")
                    },
                    description : mobileEvent
                };

                modifiedPoint.previousEvents.push(modifiedPoint.marker);

                modifiedPoint.geolocation = point.geolocation;

                modifiedPoint.stressLevelChangeState = point['stress-level-change-state'];

                modifiedPoint.marker = eventInfo;

                // if(point.locations) {
                //     modifiedPoint.locations = modifiedPoint.locations.concat(getLocations(point.locations));
                // }

                pushed = false;

            } else if(key > 0) {
                pushed = true;
                modifiedPoints.push(modifiedPoint);
                modifiedPoint = initPoint(point, request.query['light']);
                initialStressLevel = modifiedPoint.stressLevel;
            }
            
        });

        if(!pushed) {
            modifiedPoints.push(modifiedPoint);
        }

    }

    return {points : modifiedPoints};
}

function buildGetQuery(request, periodParam) {

    var today = new Date(),

        query = {}, 
        gtParam = today, 
        ltParam = today, 
        fromParam = request.query['from'],
        userid = request.query['userid'],
        gplusid = request.query['gplusid'],
        stressLevelChange = request.query['stressLevelChange'],
        stress = request.query['stress'],
        toParam = request.query['to'];

    if(periodParam) {
        switch(periodParam) {
            case 'lastday' :
                gtParam = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                ltParam = today;
            break;
            case 'lastweek' :
                gtParam = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                ltParam = today;
            break;

            case 'lastmonth' :
                gtParam = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 31);
                ltParam = today;
            break;

            case 'lastyear' :
                gtParam = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                ltParam = today;
            break;
        }
    } else if (toParam) {
        var toDate = new Date(toParam);
        gtParam = fromParam ? fromParam : new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() - 1);
        ltParam = toParam;
    }

    var query = {
        'timestamp' : {
            '$gte': gtParam, 
            '$lt': ltParam
        }
    };

    if(userid && userid !== 'all') {
        query['userid'] = userid;
    }

    if(gplusid) {
        query['gplusid'] = gplusid;
    }

    if(stressLevelChange && stressLevelChange !== 'all') {
        query['stress-level-change-state'] = stressLevelChange;
    }

    if(stress && stress !== 'all') {
        query['stress-level'] = stress;
    }

    return query;
}

function processGetResponse(request, response, periodParam, points) {

    var period = periodParam || 'lastday';

    if(periodParam && (points && points.length === 0) || !points) {

        switch(periodParam) {

            case 'lastday' :
                period = 'lastweek';
            break;

            case 'lastweek' :
                period = 'lastmonth';
            break;

            case 'lastmonth' :
                period = 'lastyear';
            break;

            case 'lastyear' :
                response.send(processPoints(points, request));
            return;
        }

        var limitedQuery = {};

        if(request.query['light']) {
            limitedQuery = Point.find(buildGetQuery(request, period), { 
                weather : 0,
                timestamp : 0,
                'travel-type' : 0,
                'car-event' : 0,
                'mobile-event' : 0,
                locations : 0 
            } ).sort({'timestamp': -1});
        } else {
            limitedQuery = Point.find(buildGetQuery(request, period)).sort({'timestamp': -1}).limit(100);
        }

        limitedQuery.exec(function(err, points) {

            if (err) {
                throw err;
                response.status(500);
                response.send(err);
            } else {
                response.status(200);
                processGetResponse(request, response, period, points);

            }

        });

    } else {
        response.send(processPoints(points, request)); 
    }
}

function getNearPoints (point, callback) {

    https.get('https://maps.googleapis.com/maps/api/place/search/json?location='
        + point.geolocation.latitude + ','  + point.geolocation.longitude + '&radius=30&sensor=true&key=AIzaSyDpjf0kqOGkazLuGauZIBjAxCsaBnz_KQw',

    function(response) {

        var body = '';

        response.on('data', function(data) {
            body += data;
        });

        response.on('end', function() {
            point.locations = JSON.parse(body).results;
            callback(point);
        });
        
    }).on('error', function(e) {
        point.locations = [];
        callback(point);
    });

}

function getTravelType(point, callback) {

    var travelType = 'onFoot';

    heaterControl.child("profile/activeUserId").on("value", function(snapshot) {

        if(snapshot) {

            var activeUserId = snapshot.val();

            if(activeUserId) {

                heaterControl.child("profile/user_" + activeUserId).on("value", function(snapshot) {
                    if(snapshot) {

                        var activeUser = snapshot.val();

                        if(activeUser.userid === point.userid) {
                            point['travel-type'] = 'car';
                            callback(point);
                        } else {
                            callback(point);
                        }
                        
                    } else {
                        callback(point);
                    }

                });

            } else {
                callback(point);
            }

        } else {
            callback(point);
        }
        
    });

}

function getWeather (point, callback) {

    https.get('https://api.worldweatheronline.com/free/v2/past-weather.ashx?q='
        + point.geolocation.latitude + ','  + point.geolocation.longitude + 
        '&format=json&date=' + moment(point.timestamp).format("YYYY-MM-DD") + '&tp=24&key=f3e93fca2634472f5951308d5db33',

    function(response) {

        var body = '';

        response.on('data', function(data) {
           
            body += data;
        });

        response.on('end', function() {
            point.weather = JSON.parse(body).data.weather[0].hourly[0];
            callback(point);
        });
        
    }).on('error', function(e) {
        console.log(e);
        point.weather = {};
        callback(point);
    });

}


function getStressLevelChangeState(point, callback) {
        
    var limitedQuery = {};

    limitedQuery = Point.find({

        userid : point.userid

    }, {

        'stress-level' : 1,
        timestamp : 1

    } ).sort({'timestamp': -1}).limit(1);

    limitedQuery.exec(function(err, points) {

        if (err) {
            callback(point);
        } else {

            if(points.length) {
                var previousPoint = points[0],
                    oldStressLevel = previousPoint['stress-level'];

                if(oldStressLevel > point['stress-level']) {
                    point['stress-level-change-state'] = 'decreased';
                } else if(oldStressLevel < point['stress-level']) {
                    point['stress-level-change-state'] = 'increased';
                }

            }

            callback(point);

        }

    });
}

function savePoint(pointParam, response, socketServer) {
    var point = new Point(pointParam);

    point.save(function(err) {

        if (err) {
            response.status(500);
            response.send(err);
        } else {
            broadcastSavedPoint(socketServer, point);
        }

    });

}

module.exports = function(app, socketServer) {

    app.post('/api/point', jsonParser, function (request, response) {

        if(request.body && request.body.point) {

            try {

                if(request.body.point.geolocation) {
                    getNearPoints(request.body.point, function(pointWithLocation) {

                        getWeather(pointWithLocation, function(pointWithWeather) {

                            getTravelType(pointWithWeather, function(pointWithTravelType) {

                                getStressLevelChangeState(pointWithTravelType, function(pointWithChangeState) {
                                    savePoint(pointWithChangeState, response, socketServer);
                                    response.status(200);
                                    response.send( 'Point saved successfully!' );
                                });

                            });

                        });

                    });

                } else {
                    response.send( 'Point saved without geolocation' );
                    savePoint(request.body.point, response, socketServer);
                }

            } catch(schemaErr) {
                response.status(500);
                response.send('Point is incorrect! ' + schemaErr)
            }

        } else {
            response.status(500);
            response.send('Point is empty!');  
        }
        
    });

    //byperiod?period=lastweek, from=date1&to=date2
    app.get('/api/point/byperiod', function (request, response) {

        var periodParam = request.query['period'];

        var query = buildGetQuery(request, periodParam), limitedQuery;

         if(request.query['light']) {
            limitedQuery = Point.find(query, { 
                weather : 0,
                timestamp : 0,
                'travel-type' : 0,
                'car-event' : 0,
                'mobile-event' : 0,
                locations : 0 
            } ).sort({'timestamp': -1});
        } else {
            limitedQuery = Point.find(query).sort({'timestamp': -1}).limit(100);
        }         

        limitedQuery.exec(function(err, points) {

            if (err) {
                throw err;
                response.status(500);
                response.send(err);
            } else {
                response.status(200);

                processGetResponse(request, response, periodParam, points);

            }

        });
             
    });

}