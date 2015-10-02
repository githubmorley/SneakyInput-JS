
var SneakyJoystick = cc.Node.extend({ // cc.Nodeを継承
	SJ_PI_X_2:Math.PI * 2, // ２π
	SJ_DEG2RAD:Math.PI / 180, // 角度からラジアンへの変換係数
	SJ_RAD2DEG:180 / Math.PI, // ラジアンから角度への変換係数
	_stickPosition:null, // スティックの表示位置
	_degrees:0, // ジョイスティックの角度
	_velocity:cc.p(0, 0), // スティックの値
	_autoCenter:true, // 自動センター復帰機能、true:有効、false:無効
	_isDPad:null, // デジタルジョイスティック機能の有効無効、true:有効、false:無効
	_hasDeadzone:null, // デッドゾーンの有効無効、true:有効、false:無効
	_numberOfDirections:0, // デジタルジョイスティックの分解能
	_joystickRadius:0, // ジョイスティックの半径
	_joystickRadiusSq:0, // ジョイスティックの半径の２乗
	_thumbRadius:0, // 親指部分の半径
	_thumbRadiusSq:0, // 親指部分の半径の２乗
	_deadRadius:0, // デッドゾーンの半径
	_deadRadiusSq:0, // デッドゾーンの半径の２乗
	_centerPosition:cc.p(0, 0), // ジョイスティックの中心座標
	ctor:function(rect){
		this._super(); // 親クラスのメソッドを実装
		this._centerPosition = cc.p(rect.width / 2, rect.height / 2); // 自ノードの中央の座標を保持
		this._stickPosition = this._centerPosition; // スティックを中央に配置
		this.setAnchorPoint(0.5, 0.5); // アンカーポイントを中央に設定
		this.setPosition((rect.width - rect.x) / 2, (rect.height - rect.y) / 2); // 自ノードを中央に配置
		this.setContentSize(rect.width, rect.height); // ノードのサイズを設定
		this.setJoystickRadius(rect.width / 2); // ジョイスティックの半径を設定
		this.setHasDeadzone(true); // デッドゾーンを有効
		this.setDeadRadius(10); // デッドゾーンの半径を設定
		this.setIsDPad(true); // デジタルジョイスティックを有効
		this.setNumberOfDirections(4); // デジタルジョイスティックの分解能を設定
		cc.eventManager.addListener({ // タッチイベントを登録
			event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
			swallowTouches:false, // 以降のノードにタッチイベントを渡す
			onTouchBegan:this.onTouchBegan.bind(this), // タッチ開始
			onTouchMoved:this.onTouchMoved.bind(this), // タッチ中
			onTouchEnded:this.onTouchEnded.bind(this), // タッチ終了
			onTouchCanceled:this.onTouchCanceled.bind(this), // タッチをキャンセル
		}, this);
	},
	onTouchBegan:function(touch, event){ // タッチ開始時処理
		var location = touch.getLocation(); // タッチ座標を取得（画面の座標）
		location = this.convertToNodeSpace(location); // 自ノードの座標に変換
		var size = this.getContentSize(); // 自ノードのサイズを取得
		location = cc.p(location.x - size.width / 2, location.y - size.height / 2); // 中心が原点の座標に変換
		var dSq = Math.pow(location.x, 2) + Math.pow(location.y, 2); // 中心からタッチ位置までの距離の２乗を計算
		if (this._joystickRadiusSq > dSq) {  // タッチが範囲外の場合
			this.updateVelocity(location); // スティックの値の更新処理
		} else {
			return false; // タッチイベントを中断
		}
		return true; // onTouchBegan()はbooleanを返す必要あり true:タッチイベントを継続
	},
	onTouchMoved:function(touch, event){ // タッチ中の処理
		var location = touch.getLocation(); // タッチ座標を取得（画面の座標）
		location = this.convertToNodeSpace(location); // 自ノードの座標に変換
		var size = this.getContentSize(); // 自ノードのサイズを取得
		location = cc.p(location.x - size.width / 2, location.y - size.height / 2); // 中心が原点の座標に変換
		this.updateVelocity(location); // スティックの値の更新処理
	},
	onTouchEnded:function(touch, event){ // タッチ終了時処理
		var location = cc.p(0, 0); // （0, 0）の変数を作成
		if (!this._autoCenter) { // 自動センター復帰機能が無効の場合
			location = touch.getLocation(); // タッチ座標を取得（画面の座標）
			location = this.convertToNodeSpace(location); // 自ノードの座標に変換
			var size = this.getContentSize(); // 自ノードのサイズを取得
			location = cc.p(location.x - size.width / 2, location.y - size.height / 2); // 中心が原点の座標に変換
		}
		this.updateVelocity(location); // スティックの値の更新処理
	},
	onTouchCanceled:function(touch, event){ //タッチキャンセル時処理
		this.onTouchEnded(touch, event); // タッチ終了時処理を実行
	},
	updateVelocity:function(point){ // スティックの値の更新処理
		var dx = point.x; // スティックの値のx座標
		var dy = point.y; // スティックの値のy座標
		var dSq = Math.pow(dx, 2) + Math.pow(dy, 2); // 中心からの距離の２乗を計算
		if (dSq <= this._deadRadiusSq) { // デッドゾーンの範囲内の場合
			this._velocity = cc.p(0, 0); // スティックの値に（0,0）を設定
			this._degrees = 0; // スティックの角度を0に設定
			this._stickPosition = this._centerPosition; // スティックの表示位置を中心にする
			return;
		}
		var angle = Math.atan2(dy, dx); // x軸+方向からのラジアンを計算
		if (angle < 0){ // 負の値の場合
			angle += this.SJ_PI_X_2; // ２πを加算して、正の値にする
		}
		if (this._isDPad) { // デジタルジョイスティック有効の場合
			var anglePerSector = 360 / this._numberOfDirections * this.SJ_DEG2RAD; // 分解能１セクション分のラジアンを計算
			angle = Math.floor(angle / anglePerSector + 0.5) * anglePerSector; // 属するセクションの境界の角度に丸める
		}
		var cosAngle = Math.cos(angle); // cos値の計算
		var sinAngle = Math.sin(angle); // sin値の計算
		if (dSq > this._joystickRadiusSq || this._isDPad) { 
			dx = cosAngle * this._joystickRadius; // ジョイスティック表示位置のx座標を計算
			dy = sinAngle * this._joystickRadius; // ジョイスティック表示位置のy座標を計算
		}
		this._velocity = cc.p(cosAngle, sinAngle); // スティックの値を設定（値の範囲 x:-1.0〜1.0, y:-1.0〜1.0）
		this._degrees = angle * this.SJ_RAD2DEG; // ラジアンから角度を計算
		this._stickPosition = cc.p(dx + this._centerPosition.x, dy + this._centerPosition.y); // ジョイスティックの表示位置を設定
	},
	getStickPosition:function(){ // スティックの表示位置を返す
		return this._stickPosition;
	},
	getDegrees:function(){ // スティックの角度を返す
		return this._degrees;
	},
	getVelocity:function(){ // スティックの値を返す
		return this._velocity;
	},
	setAutoCenter:function(autoCenter){ // 自動センター復帰機能の有効無効を設定
		this._autoCenter = autoCenter;
	},
	getAutoCenter:function(){ // 自動センター機能の有効無効を返す
		return this._autoCenter;
	},
	setIsDPad:function(isDPad){ // デジタルジョイスティック機能の有効無効を設定
		this._isDPad = isDPad;
	},
	getIsDPad:function(){ // デジタルジョイスティック機能の有効無効を返す
		return this._isDPad;
	},
	setHasDeadzone:function(hasDeadzone){ // デッドゾーンの有効無効を設定
		this._hasDeadzone = hasDeadzone;
	},
	getHasDeadzone:function(){ // デッドゾーンの有効無効を返す
		return this._hasDeadzone;
	},
	setNumberOfDirections:function(numberOfDirections){ // ジョイスティックの分解能を設定
		this._numberOfDirections = numberOfDirections;
	},
	getNumberOfDirections:function(){ // ジョイスティックの分解能を返す
		return this._numberOfDirections;
	},
	setJoystickRadius:function(joystickRadius){ // ジョイスティックの半径を設定
		this._joystickRadius = joystickRadius;
		this._joystickRadiusSq = Math.pow(joystickRadius, 2); // ジョイスティックの半径の２乗を計算
	},
	getJoystickRadius:function(){ // ジョイスティックの半径を返す
		return this._joystickRadius;
	},
	setThumbRadius:function(thumbRadius){ // 親指部分の半径を設定
		this._thumbRadius = thumbRadius;
		this._thumbRadiusSq = Math.pow(thumbRadius, 2); // 親指部分の半径の２乗を計算
	},
	getThumbRadius:function(){ // 親指部分の半径を返す
		return this._thumbRadius;
	},
	setDeadRadius:function(deadRadius){ // デッドゾーンの半径を返す
		this._deadRadius = deadRadius; 
		this._deadRadiusSq = Math.pow(deadRadius, 2); // デッドゾーンの半径の２乗を計算
	},
	getDeadRadius:function(){ // デッドゾーンの半径を返す
		return this._deadRadius;
	}
});
