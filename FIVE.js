var app = angular.module('myFIVE', []);
app.controller('FIVE', function ($rootScope, $scope, $controller, $filter, $timeout) {
	
	/**
	 * ===================================初始===================================
	 */
	 
	var canvas = document.getElementById("chess");
	var context = canvas.getContext("2d");
	var count = 0;						// 贏法統計記數
	$scope.wins = [];					// 贏法統計數據
	
	$scope.OWin = [];					// 黑子連線可能統計
	$scope.XWin = [];					// 白子連線可能統計
	$scope.start = false;					// 判斷是否開始
	$scope.over = false;					// 判斷是否結束
	$scope.chessBoard = [];					// 棋盤初始
	var len = 15 ;						// 棋盤格線
	$scope.OX = 'O';					// 黑白子順序
	$scope.AI_status = false;				// AI設定
	$scope.TEST_status = false;				// 測試設定
	
	
	$scope.init = function(){
		$scope.chessBoard = [];
		$scope.OX = 'O';
		count = 0;
		$scope.wins = [];
		$scope.OWin = [];
		$scope.XWin = [];
		$scope.start = false;
		$scope.over = false;
		$scope.AI_status = false;
		$scope.TEST_status = false;
		
		//清除棋盤
		context.fillStyle = "#F3A440";
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		//繪製棋盤
		for (var i = 0; i < len; i++) {
			$scope.chessBoard[i] = [];
			
			//棋盤初始
			for (var j = 0; j < len; j++) {
				$scope.chessBoard[i][j] = 0;
			}
			
			context.strokeStyle = "#444444";
			
			//縱線
			context.beginPath();
			context.moveTo(15 + i * 30, 15);
			context.lineTo(15 + i *30, canvas.height - 15);
			context.closePath();
			context.stroke();
			
			//橫線
			context.beginPath();
			context.moveTo(15, 15 + i * 30);
			context.lineTo(canvas.width - 15, 15 + i * 30);
			context.closePath();
			context.stroke();
		}
		
		// 初始化赢法統計數據
		for (var i = 0; i < len; i++) {
			$scope.wins[i] = [];
			for (var j = 0; j < len; j++) {
				$scope.wins[i][j] = []
			}
		}

		// 連線方向: | 
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len-4; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[i][j + k][count] = true;
				}
				count++;
			}
		}

		// 連線方向: - 
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len-4; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[j + k][i][count] = true;
				}
				count++;
			}
		}

		// 連線方向: / 
		for (var i = 0; i < len-4; i++) {
			for (var j = 0; j < len-4; j++) {
				for (var k = 0; k < 5; k++) {
					$scope.wins[i + k][j + k][count] = true;
				}
				count++;
			}
		}

		// 連線方向: \ 
		for (var i = 0; i < len-4; i++) {
			for (var j = len-1; j > 3; j--) {
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
							alert("玩家(黑子)獲勝");
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
							alert("玩家(白子)獲勝");
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
		//棋子CSS樣式
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
	$scope.START = function(type){
		$scope.start = true;
		
		//AI對下
		if(type == 'OX'){
			$scope.TEST_status = true;
			//AI黑子先手:固定第一子在中間位置
			var first = Math.floor(len/2);
			$scope.oneStep(first, first);
			$scope.chessBoard[first][first] = 2;
			
			for (var k = 0; k < count; k ++) {
				if ($scope.wins[first][first][k]) {
					if($scope.OX == 'O'){
						//黑子此連線子數 + 1(子數為5取勝)
						$scope.OWin[k] ++;
						//白子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
						$scope.XWin[k] = 6;
					}
				}
			}
			
			//黑白子順序調換
			$scope.OX = 'X';
			$scope.AI();
		}
		else if(type == 'O'){
			$scope.AI_status = true;
			//AI黑子先手:固定第一子在中間位置
			var first = Math.floor(len/2);
			$scope.oneStep(first, first);
			$scope.chessBoard[first][first] = 2;
			
			for (var k = 0; k < count; k ++) {
				if ($scope.wins[first][first][k]) {
					if($scope.OX == 'O'){
						//黑子此連線子數 + 1(子數為5取勝)
						$scope.OWin[k] ++;
						//白子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
						$scope.XWin[k] = 6;
					}
				}
			}
			
			//黑白子順序調換
			$scope.OX = 'X';
		}
		else if(type == 'X'){
			//AI白子後手:待玩家點擊後再判斷
			$scope.AI_status = true;
		}
		else{
			$scope.AI_status = false;
		}
	}
	
	/**
	 * ===================================AI===================================
	 */
	$scope.AI = function(){
		if ($scope.over) {
			return;
		}

		var u = 0;				// 電腦預計落子的x位置
		var v = 0;				// 電腦預計落子的y位置
		var myScore = [];			// 玩家的分數
		var aiScore = [];			// 電腦的分數
		var max = 0;				// 最優位置的分數
		var myWin = [];				// 玩家連線可能統計
		var aiWin = [];				// 電腦連線可能統計
		
		// 初始化分数的二维數組
		for (var i = 0; i < len; i++) {
			myScore[i] = [];
			aiScore[i] = [];
			for (var j = 0; j < len; j++) {
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
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if ($scope.chessBoard[i][j] == 0) {
					for (var k = 0; k < count; k++) {
						if ($scope.wins[i][j][k]) {
							if (myWin[k] == 1) {
								myScore[i][j] += 75;
							} else if (myWin[k] == 2) {
								myScore[i][j] += 290;
							} else if (myWin[k] == 3) {
								myScore[i][j] += 3050;
							} else if (myWin[k] == 4) {
								myScore[i][j] += 15000;
							}
							if (aiWin[k] == 1) {
								aiScore[i][j] += 85;
							} else if (aiWin[k] == 2) {
								aiScore[i][j] += 300;
							} else if (aiWin[k] == 3) {
								aiScore[i][j] += 3200;
							} else if (aiWin[k] == 4) {
								aiScore[i][j] += 16000;
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
		
		//如果AI已經判斷認定全部空位皆為0，判定和局
		if(myScore[u][v] == 0 && aiScore[u][v] == 0){
			alert('和局');
			return;
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
						alert("AI(黑子)獲勝");
						$scope.over = true;
					}
				}else{
					//白子此連線子數 + 1(子數為5取勝)
					$scope.XWin[k] ++;
					//黑子此連線子數 = 6(代表永遠無法等於5，永遠無法以此方向連線取勝)
					$scope.OWin[k] = 6;
					//連線子數 = 5，該方獲勝
					if ($scope.XWin[k] == 5) {
						alert("AI(白子)獲勝");
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
			if($scope.TEST_status){
				$scope.TEST();
			}
		}
	}
	
	/**
	 * ===================================AI===================================
	 */
	$scope.TEST = function(){
		setTimeout(function(){$scope.AI();},400);
	}
});
