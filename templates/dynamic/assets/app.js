(function() {
	var app = angular.module('portroach', []);

        app.controller('OverviewController',['$http', '$scope', function($http, $scope) {
		this.onlyOutdated = false;
		var overview = this;
		overview.maintainers = [];
		overview.summary = [];

	        $scope.loading = true;

		$http.get('./json/totals.json').success(function(data) {
		        var i, l = data.results.length;
		        for (i = 0; i < l; i++) {
			    data.results[i].percentage = parseFloat(data.results[i].percentage);
			    data.results[i].total = parseInt(data.results[i].total, 10);
			    data.results[i].withnewdistfile = parseInt(data.results[i].withnewdistfile, 10);
			}

			overview.maintainers = data.results;
			overview.summary = data.summary;
		        $scope.loading = false;
		});

		this.showOutdated = function(maintainer, onlyOutdated) {
			if (!onlyOutdated) {
				return true;
			} else if (maintainer.withnewdistfile > 0) {
				return true;
			} else {
				return false;
			}
		};

		this.stripEmail = function(maintainer) {
			return maintainer.replace(/\<.*?\>/g, '');
		};
	}]);

	app.controller('MaintainerController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
		this.onlyOutdated = true;
		var maint = this;
		maint.ports = [];

	        $scope.loading = true;

		$scope.$watch("maintainer", function(){
			$http.get('./json/' + $scope.maintainer + '.json').success(function(data) {
				maint.ports = data;
			        $scope.loading = false;
			}).error(function(e) {
			    document.write("Could not retrieve JSON for " + $scope.maintainer);
			    $scope.loading = false;
			});
		});

		this.showOutdated = function(port, onlyOutdated) {
			if (!onlyOutdated) {
				return true;
			} else if (port.newver !== null && port.ignore != 1) {
				return true;
			} else {
				return false;
			}
		};

		this.rowClass = function(newver, ignore) {
			var row;
			if (newver === null || ignore == 1) {
				row = "resultsrow";
			} else {
				row = "resultsrowupdated";
			}
			return row;
		};

		this.parseHomepage = function(homepage, basepkgpath) {
			if (homepage) {
				v = '<a href="%1%">%2%</a>'.replace('%1%', homepage).replace('%2%', basepkgpath);
				return $sce.trustAsHtml(v);
			} else {
				return $sce.trustAsHtml(basepkgpath);
			}
		};
	}]);

	app.controller('RestrictedController', ['$http', function($http) {
		var restricted = this;
		restricted.ports = [];

		$http.get('./json/restricted.json').success(function(data) {
			restricted.ports = data;
		});
	}]);
})();
