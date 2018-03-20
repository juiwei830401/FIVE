var app = angular.module('myFIVE', []);
app.controller('FIVE', function ($rootScope, $scope, $controller, $filter) {
	
	/**
	 * ===================================初始===================================
	 */
	 
	var canvas = document.getElementById("chess");
	var context = canvas.getContext("2d");
	var count = 0;					// 贏法統計記數
	$scope.wins = [];				// 贏法統計數據
	
	$scope.OWin = [];				// 黑子連線可能統計
	$scope.XWin = [];				// 白子連線可能統計
	$scope.over = false;				// 判斷是否結束
	$scope.chessBoard = [];				// 棋盤初始
	$scope.OX = 'O';				// 黑白子順序
	$scope.AI_status = false;			// AI設定
	//var chess_len = 19;	
	
	$scope.init = function(){
		$scope.chessBoard = [];
		$scope.OX = 'O';
		count = 0;
		$scope.wins = [];
		$scope.OWin = [];
		$scope.XWin = [];
		$scope.over = false;
		
		//清除棋盤
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		//繪製棋盤
		for (var i = 0; i < 15; i++) {
			$scope.chessBoard[i] = [];
			for (var j = 0; j < 15; j++) {
				$scope.chessBoard[i][j] = 0;
			}
			context.strokeStyle = "#BFBFBF";
			context.beginPath();
			context.moveTo(15 + i *30, 15);
			context.lineTo(15 + i *30, canvas.height - 15);
			context.closePath();
			context.stroke();
			context.beginPath();
			context.moveTo(15, 15 + i *30);
			context.lineTo(canvas.width - 15, 15 + i * 30);
			context.closePath();
			context.stroke();
		}
		
		// 初始化赢法統計數據
		for (var i = 0; i < 15; i++) {
			$scope.wins[i] = [];
			for (var j = 0; j < 15; j++) {
				$scope.wins[i][j] = []
			}
		}

		// 連線方向: | 
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[i][j + k][count] = true;
				}
				count++;
			}
		}

		// 連線方向: - 
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[j + k][i][count] = true;
				}
				count++;
			}
		}

		// 連線方向: / 
		for (var i = 0; i < 11; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[i + k][j + k][count] = true;
				}
				count++;
			}
		}

		// 連線方向: \ 
		for (var i = 0; i < 11; i++) {
			for (var j = 14; j > 3; j--) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[i + k][j - k][count] = true;
				}
				count++;
			}
		}
		
		// 初始化黑白子連線可能統計
		for (var i = 0; i < count; i++) {
			$scope.OWin[i] = 0;
			$scope.XWin[i] = 0;
		}
		console.log(count)
	}
		
	$scope.init();
	
	/**
	 * ===================================點擊===================================
	 */
	$scope.doClick = function(e) {
		if ($scope.over) {
			return;
		}
		
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);

		// 如果該位置沒有棋子，則允許落子
		if($scope.chessBoard[i][j] == 0) {
			//繪製棋子
			$scope.oneStep(i, j);
			//改變棋盤訊息
			$scope.chessBoard[i][j] = 1;

			//贏法統計數據
			for (var k = 0; k < count; k ++) {
				if ($scope.wins[i][j][k]) {
					if($scope.OX == 'O'){
						//黑子此連線子數 + 1(子數為5取勝)
						$scope.OWin[k] ++;
						//白子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
						$scope.XWin[k] = 6;
						//連線子數 = 5，該方獲勝
						if ($scope.OWin[k] == 5) {
							window.alert("玩家(黑子)獲勝");
							//遊戲結束
							$scope.over = true;
						}
					}else{
						//白子此連線子數 + 1(子數為5取勝)
						$scope.XWin[k] ++;
						//黑子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
						$scope.OWin[k] = 6;
						//連線子數 = 5，該方獲勝
						if ($scope.XWin[k] == 5) {
							window.alert("玩家(白子)獲勝");
							//遊戲結束
							$scope.over = true;
						}
					}
				}
			}

			//如果遊戲未結束，換另一方
			if (!$scope.over) {
				if($scope.OX == 'O'){
					$scope.OX = 'X';
				}else{
					$scope.OX = 'O';
				}
				
				//輪到AI
				if($scope.AI_status){
					$scope.AI();
				}
			}
		}
	};
	
	/**
	 * ===================================落下棋子===================================
	 * @param x     棋子x軸位置
	 * @param y     棋子y軸位置
	 */
	$scope.oneStep = function(x, y) {
		context.beginPath();
		context.arc(15 + x * 30, 15 + y * 30, 15 - 2, 0, 2 * Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 15 - 2, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);
		//黑子
		if ($scope.OX == 'O') {
			gradient.addColorStop(0, "#0A0A0A");
			gradient.addColorStop(1, "#636766");
		}
		//白子
		else if($scope.OX == 'X'){
			gradient.addColorStop(0, "#D1D1D1");
			gradient.addColorStop(1, "#F9F9F9");
		}
		context.fillStyle = gradient;
		context.fill();
	}
	
	/**
	 * ===================================開始===================================
	 */
	$scope.start = function(type){
		if(type == 'O'){
			$scope.AI_status = true;
			//AI黑子先手:固定第一子在[7,7]位置
			$scope.oneStep(7, 7);
			$scope.chessBoard[7][7] = 2;
			//黑白子順序調換
			$scope.OX = 'X';
		}
		else if(type == 'X'){
			//AI白子後手:待玩家點擊後再判斷
			$scope.AI_status = true;
		}
	}
	
	/**
	 * ===================================AI===================================
	 */
	$scope.AI = function(){
		if ($scope.over) {
			return;
		}

		var u = 0;			// 電腦預計落子的x位置
		var v = 0;			// 電腦預計落子的y位置
		var myScore = [];		// 玩家的分數
		var aiScore = [];		// 電腦的分數
		var max = 0;			// 最優位置的分數
		var myWin = [];			// 玩家連線可能統計
		var aiWin = [];			// 電腦連線可能統計
		
		// 初始化分数的二维數組
		for (var i = 0; i < 15; i++) {
			myScore[i] = [];
			aiScore[i] = [];
			for (var j = 0; j < 15; j++) {
				myScore[i][j] = 0;
				aiScore[i][j] = 0;
			}
		}
		
		//AI是黑子
		if($scope.OX == 'O'){
			aiWin = $scope.OWin;
			myWin = $scope.XWin;
		}
		//AI是白子
		else{
			aiWin = $scope.XWin;
			myWin = $scope.OWin;
		}
		
		// 透過贏法統計數組 為兩個二維數組分別計分
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if ($scope.chessBoard[i][j] == 0) {
					for (var k = 0; k < count; k++) {
						if ($scope.wins[i][j][k]) {
							if (myWin[k] == 1) {
								myScore[i][j] += 100;
							} else if (myWin[k] == 2) {
								myScore[i][j] += 200;
							} else if (myWin[k] == 3) {
								myScore[i][j] += 1000;
							} else if (myWin[k] == 4) {
								myScore[i][j] += 10000;
							}
							if (aiWin[k] == 1) {
								aiScore[i][j] += 110;
							} else if (aiWin[k] == 2) {
								aiScore[i][j] += 220;
							} else if (aiWin[k] == 3) {
								aiScore[i][j] += 2200;
							} else if (aiWin[k] == 4) {
								aiScore[i][j] += 20000;
							}
						}
					}
					
					//如果[i,j]處 玩家的分數比目前最優位置的分數大
					if (myScore[i][j] > max) {
						//則落子在[i,j]處，並更新最優位置
						max = myScore[i][j];
						u = i;
						v = j;
					} 
					//如果玩家[i,j]處 和目前最優位置的分數相同
					else if (myScore[i][j] == max) {
						//如果[i,j]處 電腦的分數比預計落下的位置分數大
						if (aiScore[i][j] > aiScore[u][v]) {
							//則落子在[i,j]處
							u = i;
							v = j;
						}
					}
					
					//如果[i,j]處 電腦的分數比目前最優位置的分數大
					if (aiScore[i][j] > max) {
						//則落子在[i,j]處，並更新最優位置
						max  = aiScore[i][j];
						u = i;
						v = j;
					} 
					//如果電腦[i,j]處 和目前最優位置的分數相同
					else if (aiScore[i][j] == max) {
						//如果[i,j]處 玩家的分數比預計落下的位置分數大
						if (myScore[i][j] > myScore[u][v]) {
							//則落子在[i,j]處
							u = i;
							v = j;
						}
					}
				}
			}
		}
		
		$scope.oneStep(u, v);
		$scope.chessBoard[u][v] = 2;
		
		for (var k = 0; k < count; k++) {
			if ($scope.wins[u][v][k]) {
				if($scope.OX == 'O'){
					//黑子此連線子數 + 1(子數為5取勝)
					$scope.OWin[k] ++;
					//白子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
					$scope.XWin[k] = 6;
					//連線子數 = 5，該方獲勝
					if ($scope.OWin[k] == 5) {
						window.alert("AI(黑子)獲勝");
						$scope.over = true;
					}
				}else{
					//白子此連線子數 + 1(子數為5取勝)
					$scope.XWin[k] ++;
					//黑子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
					$scope.OWin[k] = 6;
					//連線子數 = 5，該方獲勝
					if ($scope.XWin[k] == 5) {
						window.alert("AI(白子)獲勝");
						$scope.over = true;
					}
				}
			}
		}
		
		//如果遊戲未結束，換另一方
		if (!$scope.over) {
			if($scope.OX == 'O'){
				$scope.OX = 'X';
			}else{
				$scope.OX = 'O';
			}
		}
	}
});
