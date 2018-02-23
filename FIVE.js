var app = angular.module('myFIVE', []);
app.controller('FIVE', function ($rootScope, $scope, $controller, $filter) {
	//初始
	$scope.init = function(){
		$scope.list = [];
		
		//Y軸
		for(var i = 0; i < 19; i++){
			$scope.list.push({dataY : [], row : i});
			//X軸
			for(var j = 0; j < 19; j++){
				$scope.list[i].dataY.push({dataX : j, STATUS : ''});
			}
		}
		$scope.OX = 'O';
		$scope.result = '';
		$scope.lock = false;
	}
	$scope.init();
	
	//點擊
	$scope.go = function(Y,X){
		if($scope.lock){
			return;
		}
		
		//判斷位置
		for(var i = 0; i < $scope.list[Y].dataY.length; i++){
			if($scope.list[Y].dataY[i].dataX == X && $scope.list[Y].dataY[i].STATUS == ''){
				$scope.list[Y].dataY[i].STATUS = $scope.OX;
				
				//判斷連線
				var checkA = 0;	/**	判斷:-	**/
				var checkB = 0;	/**	判斷:|	**/
				var checkC = 0;	/**	判斷:/	**/
				var checkD = 0;	/**	判斷:\	**/
				
				for(var j = -4; j < 5; j++){
					if(Number(i + j) >= 0 && Number(i + j) < 19){
						if($scope.list[Y].dataY[i + j].STATUS == $scope.OX){
							checkA++;
						}
					}
					if(Number(Y + j) >= 0 && Number(Y + j) < 19){
						if($scope.list[Y + j].dataY[i].STATUS == $scope.OX){
							checkB++;
						}
					}
					if(Number(i + j) >= 0 && Number(Y + j) >= 0 && Number(i + j) < 19 && Number(Y + j) < 19){
						if($scope.list[Y + j].dataY[i + j].STATUS == $scope.OX){
							checkC++;
						}
					}
					if(Number(i - j) >= 0 && Number(Y + j) >= 0 && Number(i - j) < 19 && Number(Y + j) < 19){
						if($scope.list[Y + j].dataY[i - j].STATUS == $scope.OX){
							checkD++;
						}
					}
				}
				if(checkA >= 5 || checkB >= 5 || checkC >= 5 || checkD >= 5){
					$scope.result = $scope.OX + ' WIN';
					$scope.lock = true;
				}
				
				//OX調換
				if($scope.OX == 'O'){
					$scope.OX = 'X';
				}else if($scope.OX == 'X'){
					$scope.OX = 'O';
				}
				return;
			}
		}
		

	}

});
