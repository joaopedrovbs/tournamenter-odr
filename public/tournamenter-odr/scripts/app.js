// v1.01
var TOURNAMENTER_URL = '';

(function() {

	_.mixin({ deepClone: function (p_object) { return JSON.parse(JSON.stringify(p_object)); } });

	var app = angular.module('app', [
		'ngRoute',
		'ngAnimate',
		'ngResource',

		'ui.bootstrap',

		'app.controllers',
		// 'app.directives',

	])

	.config(['$routeProvider', function($routeProvider) {

		return $routeProvider

		.when('/score', {
			templateUrl: 'views/scorer.html'
		})
		.otherwise({
			redirectTo: '/score'
			// templateUrl: 'views/participar/'
		});

	}])

	.factory('Table', ['$resource', function ($resource) {

		return $resource(TOURNAMENTER_URL + '/tables/:id', {id: '@id'}, {
			all: {
				url: TOURNAMENTER_URL + '/tables',
				isArray: true,
			},
		});

	}])

	.factory('Score', ['$resource', function ($resource) {

		return $resource(TOURNAMENTER_URL + '/scores/:id', {id: '@id', number: '@number'}, {
			saveScore: {
				url: TOURNAMENTER_URL + '/scores/:id/:number',
			},
			get: {
				url: TOURNAMENTER_URL + '/scores/:id',
			}
		});

	}])

	.factory('DANTE_ODR', function (){

		var model = {
			torch:0,
			pole:0,
			line:0,
			lineD:3,
			swimmer:0,
			food:0,
			goal:0,
			weight:0,
			trash:0,
			penalties:0,
		};

		var scorings ={
			torch: [0,20],
			pole: [0,30,60],
			line: [0,10,20,30],
			lineD: [10,20,45,0],
			swimmer: [0,20,30,50],
			food: [0,20,40,60,80,100],
			goal: [0,20],
			weight: [0,25],
			trash: [0,15,30,45,60,75],
			penalties: [0,-10,-20,-30,-40,-50],
		}

		return {
			view: 'views/ODR_Scorer.html',
			model: model,
			scorings: scorings,
			score: function (model){
				var scored = {
					total: 0,
				};
				// Usual scoring, based on a table data
				for(var mission in model){
					// console.log(mission);
					if(!scorings[mission]) continue;
					var score = model[mission];
					if(score === false) score = 0;
					if(score === true) score = 1;

					var points = scorings[mission][score];
					scored[mission] = points
					scored.total += points || 0;
				}
				return scored;
			}
		}

	})

	.constant('SW_DELAI', 100)
	.factory('stopwatch', function (SW_DELAI, $timeout) {
	    var data = {
	            value: 150,
	            laps: [],
	            state: 'STOPPED',
	        },
	        stopwatch = null;

	    var start = function () {;
	    	data.state = 'RUNNING';
	    	if(stopwatch) $timeout.cancel(stopwatch);
	        stopwatch = $timeout(function() {
	            data.value--;
	            start();
	        }, SW_DELAI);
	    };

	    var stop = function () {
	    	data.state = 'STOPPED';
	        $timeout.cancel(stopwatch);
	        stopwatch = null;
	    };

	    var reset = function () {
	        stop()
	        data.value = 1500;
	        data.laps = [];
	    };

	    var lap = function () {
	        data.laps.push(data.value);
	    };

	    var increment = function (secs){
	    	data.value += (secs * SW_DELAI) / 10;
	    }

			var	timeOver = function(){
				if (data.value===0){
					data.state = 'STOPPED';
				}
			};

	    return {
	        data: data,
	        start: start,
	        stop: stop,
	        reset: reset,
	        lap: lap,
	        increment: increment
	    };
	});
	;
}).call(this);
