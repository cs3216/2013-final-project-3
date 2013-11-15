function ArenaController($scope, $timeout, $location) {

	$scope.time_left = '';
	$scope.total_seconds_left = 300;
	$scope.current_url = window.location.origin;
	$scope.radiant_score = 0;
	$scope.dire_score = 0;

	function seconds_to_string(sec) {
		function less_than_ten(value) {
			return value < 10 ? '0' + value.toString() : value.toString();
		}
		return less_than_ten(Math.floor(sec/60)) + ':' + less_than_ten(sec%60);
	}

	function decrement() {
		if ($scope.total_seconds_left >= 0) {
			$scope.time_left = seconds_to_string($scope.total_seconds_left);
			$scope.total_seconds_left--;
			$timeout(decrement, 1000);
		}
	}

  PubSub.subscribe('game.restart', function () {
    $scope.total_seconds_left = 300;
  });

  PubSub.subscribe('game.score.changed', function (msg, score) {
    $scope.radiant_score = score["red"] || 0;
    $scope.dire_score = score["yellow"] || 0;
  });

	decrement();
}

