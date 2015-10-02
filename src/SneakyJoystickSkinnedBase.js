
var SneakyJoystickSkinnedBase = cc.Sprite.extend({ // cc.Spriteを継承
	_backgroundSprite:null, // 背景部分のスプライト
	_thumbSprite:null, // 親指部分のスプライト
	_joystick:null, // ジョイスティック（SneakyJoyStick）のインスタンス取得用
	ctor:function(){ // コンストラクタ
		this._super(); // 親クラスのメソッドを実装
		this.schedule(this.updatePositions, 1 / 60); // 周期処理を開始
	},
	updatePositions:function(dt){ // 周期処理
		if(this._joystick && this._thumbSprite){ // ジョイスティックのインスタンスと、親指部分のスプライトがある場合
			this._thumbSprite.setPosition(this._joystick.getStickPosition()); // 親指部分の位置を設定
		}
	},
	setBackgroundSprite:function(aSprite){ // 背景部分のスプライトを設定
		this.removeNode(this._backgroundSprite); // 既存のスプライトを除外
		this._backgroundSprite = aSprite; // 新しいスプライトを取得
		if (aSprite) { // 新しいスプライトがある場合
			this.addChild(this._backgroundSprite, 0); // 新しいスプライトを設定
			var size = this._backgroundSprite.getContentSize(); // 背景部分のスプライトのサイズを取得
			this.setContentSize(size); // 自ノードのサイズを設定
			this._backgroundSprite.setAnchorPoint(0.5, 0.5);
			this._backgroundSprite.setPosition(size.width / 2, size.height / 2); // 中心に配置
			if (this._joystick) { // ジョイスティックが設定されている場合
				this._joystick.setJoystickRadius(size.width / 2); // ジョイスティックの半径を設定
			}
		}
	},
	setThumbSprite:function(aSprite){ // 親指部分のスプライトを設定		
		this.removeNode(this._thumbSprite); // 既存のスプライトを除外
		this._thumbSprite = aSprite; // 新しいスプライトを取得
		if (aSprite) {  // 新しいスプライトを取得
			this.addChild(this._thumbSprite, 1);
			var size = this.getContentSize(); // 自ノードのサイズを取得
			this._thumbSprite.setAnchorPoint(0.5, 0.5);
			this._thumbSprite.setPosition(size.width / 2, size.height / 2); // 中心に配置
			if (this._joystick) { // ジョイスティックが設定されている場合
				this._joystick.setThumbRadius(this._thumbSprite.getContentSize().width / 2); // 親指部分の半径を設定
			}
		}
	},
	setJoystick:function(aJoystick){ // ジョイスティックのインスタンスを取得
		this.removeNode(this._joystick); // 既存のジョイスティックを除外
		this._joystick = aJoystick; // 新しいジョイスティックを取得
		if (aJoystick) { // 新しいジョイスティックがある場合
			this.addChild(this._joystick, 2);
			if (this._thumbSprite) { // 親指部分のスプライトがある場合
				this._joystick.setThumbRadius(this._thumbSprite.getContentSize().width / 2); // 親指部分の半径を設定
			} else {
				this._joystick.setThumbRadius(0); // 親指部分の半径を設定
			}
			if (this._backgroundSprite) { // バックグラウンドのスプライトがある場合
				this._joystick.setJoystickRadius(this._backgroundSprite.getContentSize().width / 2); // 親指部分の半径を設定
			}
		}
	},
	removeNode:function(aNode){ // ノードを除外
		if (aNode) { // ノードがある場合
			var parent = aNode.getParent(); // 親ノードを取得
			if (parent) { // 親ノードがある場合
				parent.removeChild(aNode, true); // 親ノードから除外
			}
		}
	}
});
