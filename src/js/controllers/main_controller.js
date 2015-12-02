var themap;

angular.module('GeoApp.controllers.Main', [
    'GeoApp.services.Geolocation'

])
        .controller('MainController', function ($scope, getCurrentPosition, localStorageService, $location) {

            $scope.gpsProximity = [10, 100];

            getCurrentPosition(function (position) {
                $scope.currentLocation.lat = position.coords.latitude;
                $scope.currentLocation.lon = position.coords.longitude;

                $scope.currentMapLocation = new google.maps.LatLng($scope.currentLocation.lat, $scope.currentLocation.lon);
                angular.forEach($scope.hotspots, function (value, index) {
                    var spread = 0.003;
                    $scope.smsButton = false;
                    //**TODO calculate by radius not square
                    if (
                            $scope.currentLocation.lat > value.lat - spread
                            && $scope.currentLocation.lat < value.lat + spread
                            && $scope.currentLocation.lon > value.lon - spread
                            && $scope.currentLocation.lon < value.lon + spread
                            ) {

                        tryMessage++;
                        $scope.smsButton = true;
                        $scope.currentMessage = index;
                        $scope.gpsProximity = [spread - Math.abs($scope.currentLocation.lat - value.lat), Math.abs($scope.currentLocation.lat - value.lat)];

                        $scope.currentMessageNumber = $scope.hotspots[$scope.currentMessage].number;
                        $scope.currentMessageText = $scope.hotspots[$scope.currentMessage].message;
                        $scope.currentLocationName = $scope.hotspots[$scope.currentMessage].locationName;
                    }
                })

            });

            $scope.$watch('hotspots', function () {

            }, true);

            $scope.currentLocation = {};
            $scope.map = '';
            $scope.$on('mapInitialized', function (event, evtMap) {
                console.log(evtMap);

                $scope.map = evtMap;
                themap = evtMap;
            });

            var tryMessage = 0;
            var hotspotsStore = localStorageService.get('hotspots');

            $scope.hotspots = hotspotsStore || [];

            $scope.$watch('hotspots', function () {
                localStorageService.set('hotspots', $scope.hotspots);
            }, true);

            $scope.deleteHotspot = function (index) {
                console.log('delete ' + index);
                $scope.hotspots.splice(index, 1);
            }

            $scope.sendSMS = function () {
                var number = $scope.hotspots[$scope.currentMessage].number;
                var message = $scope.hotspots[$scope.currentMessage].message;


                var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                        intent: 'INTENT'  // send SMS with the native android SMS messaging
                                //intent: '' // send SMS without open any other app
                    }
                };
                var smsSuccess = function () {
                };
                var smsFail = function () {
                };

                console.log('called sms ' + number + ' message=' + message);
                if (typeof (sms) !== 'undefined') {
                    sms.send(number, message, options, smsSuccess, smsFail);
                }
            }

            $scope.$watch('currentLocation', function () {

            }, true);

            $scope.addHotspot = function () {

                if ($scope.numberTxt && $scope.messageTxt) {
                    var lat = $scope.currentLocation.lat;
                    var lon = $scope.currentLocation.lon;
                    if ($scope.lat) {
                        lat = $scope.lat;
                    }
                    if ($scope.lon) {
                        lon = $scope.lon;
                    }
                    $scope.hotspots.push(
                            {
                                'lon': lon,
                                'lat': lat,
                                'number': $scope.numberTxt,
                                'message': $scope.messageTxt,
                                'locationName': $scope.locationName
                            });
                    alert('added hotspot!');
                }
                else
                {
                    alert('fill out form');
                }
            }

            $scope.viewHotspot = function (index) {
                var lon = $scope.hotspots[index].lon;
                var lat = $scope.hotspots[index].lat;
                $scope.currentMapLocation = new google.maps.LatLng(lat, lon);
                themap.setCenter($scope.currentMapLocation);
            }

            $scope.updateHotspot = function (index) {
                console.log($scope.hotspots[index]);
               // $scope.hotspots.splice($scope.hotspots[index]);
                $scope.hotspots.push($scope.hotspots[index]);
            }
        });