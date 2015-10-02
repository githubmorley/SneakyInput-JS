var SneakyButton = cc.Node.extend({ // cc.Nodeを継承
	_radius:0, // ボタンの半径
	_radiusSq:0, // ボタンの半径の２乗
	_status:1, // ボタンの有効無効状態、1:有効、0:無効
	_active:false, //　ボタンの処理状態、true:処理中、false:処理受付中
	_value:0, // ボタンのONOFF状態 1:ボタンON 、2:ボタンOFF
	_isHoldable:true, // ホールド機能 true:ボタンを離すまでON、false:"_rateLimit"時間だけON（すぐOFF）
	_isToggleable:false, // トグル機能
	_rateLimit:1 / 120, // ボタンONの時間
	ctor:function(rect){ // コンストラクタ 引数でボタンのサイズを取得
		this._super(); // 親クラスのメソッドを実装
		this.setAnchorPoint(0.5, 0.5); // アンカーポイントを中心に設定
		this.setPosition((rect.width - rect.x) / 2, (rect.height - rect.y) / 2); // 自ノードを中心に配置
		this.setContentSize(rect.width, rect.height); // 自ノードのサイズを設定
		this.setRadius(rect.width / 2); // ボタンの半径を設定
		cc.eventManager.addListener({ // タッチイベントを登録
			event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
			swallowTouches:false, // 以降のノードにタッチイベントを渡す
			onTouchBegan:this.onTouchBegan.bind(this), // タッチ開始時
			onTouchMoved:this.onTouchMoved.bind(this), // タッチ中
			onTouchEnded:this.onTouchEnded.bind(this), // タッチ終了時
			onTouchCanceled:this.onTouchCancelled.bind(this), // タッチキャンセル時
		}, this);
	},
	limiter:function(dt){ // 周期処理
		this.unschedule(this.limiter); // フレーム処理を停止
		this._value = 0; // ボタンをOFFに変更
		this._active = false; // 処理受付中に変更
	},
	onTouchBegan:function(touch, event){ // タッチ開始時処理
		if (this._active) return false; // 処理中の場合、タッチイベントを中断
		var location = touch.getLocation(); // タッチ座標（画面の座標）を取得
		location = this.convertToNodeSpace(location); // 自ノードの座標に変換
		var size = this.getContentSize(); // 自ノードのサイズを取得
		location = cc.p(location.x - size.width / 2, location.y - size.height / 2); // 中心が原点の座標に変換
		var dSq = Math.pow(location.x, 2) + Math.pow(location.y, 2); // 中心からタッチ位置までの距離の２乗を計算
		if (this._radiusSq > dSq) { // ボタン内をタッチした場合
			this._active = true; // 処理中に変更
			if (!this._isHoldable && !this._isToggleable) { // ホールド機能もトグル機能も無効の場合
				this._value = 1; // ボタンをONに変更
				this.schedule(this.limiter, this._rateLimit); // 周期処理を開始
			}
			if (this._isHoldable) this._value = 1; // ホールド機能有効の場合、ボタンをONに変更
			if (this._isToggleable) this._value ^= 1; // トグル機能有効の場合、ボタンのON/OFFを交互に入れ替え
		} else {
			return false; // タッチイベントを中断
		}
		return true; // onTouchBegan()はbooleanを返す必要あり true:タッチイベントを継続
	},
	onTouchMoved:function(touch, event){ // タッチ中の処理
		if (!this._active) return; // 処理中でないなら場合、処理を抜ける
		var location = touch.getLocation(); // タッチ座標を取得（画面の座標）
		location = this.convertToNodeSpace(location); // 自ノードの座標に変換
		var size = this.getContentSize(); // 自ノードのサイズを取得
		location = cc.p(location.x - size.width / 2, location.y - size.height / 2); // 中心が原点の座標に変換
		var dSq = Math.pow(location.x, 2) + Math.pow(location.y, 2); // 中心からタッチ位置までの距離の２乗を計算
		if (this._radiusSq > dSq) { // ボタン内をタッチした場合
			if (this._isHoldable) this._value = 1; // ホールド機能有効の場合、ボタンをONに変更
		} else { // ボタン外にタッチが移動した場合
			if (this._isHoldable) {
				this._value = 0; // ホールド機能有効の場合、ボタンをOFFに変更
				this._active = false; // 処理受付中に変更
			}
		}
	},
	onTouchEnded:function(touch, event){ // タッチ終了時処理
		if (!this._active) return; // 処理中でないなら場合、処理を抜ける
		if (this._isHoldable) this._value = 0; // ホールド機能有効の場合、ボタンをOFFに変更
		if (this._isHoldable || this._isToggleable) this._active = false; // ホールド機能かトグル機能が有効の場合、処理受付中に変更
	},
	onTouchCancelled:function(touch, event){ // タッチキャンセル時処理
		this.onTouchEnded(touch, event); // タッチ終了時処理を実行
	},
	setRadius:function(radius){ // ボタンの半径を設定
		this._radius = radius;
		this._radiusSq = Math.pow(this._radius, 2); // ボタンの半径の２乗を計算
	},
	getRadius:function(){ // ボタンの半径を返す
		return this._radius;
	},
	setStatus:function(status){ // ボタンの有効無効状態を設定
		this._status = status; 
	},
	getStatus:function(){ // ボタンの有効無効状態を返す
		return this._status;
	},
	getValue:function(){ // ボタンのONOFF状態を返す
		return this._value;
	},
	getActive:function(){ // ボタンの処理状態を返す
		return this._active;
	},
	setIsHoldable:function(isHoldable){ // ボタンのホールド機能の状態を設定
		this._isHoldable = isHoldable;
	},
	getIsHoldable:function(){ // ボタンのホールド機能の状態を返す
		return this._isHoldable;
	},
	setIsToggleable:function(isToggleable){ // ボタンのトグル機能の状態を設定
		this._isToggleable = isToggleable;
	},
	getIsToggleable:function(){ // ボタンのトグル機能の状態を返す
		return this._isToggleable;
	},
	setRateLimit:function(rateLimit){ // ボタンONの時間を設定
		this._rateLimit = rateLimit;
	},
	getRateLimit:function(){ // ボタンONの時間を返す
		return this._rateLimit;
	}
});
