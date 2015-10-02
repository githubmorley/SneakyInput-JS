
var SneakyButtonSkinnedBase = cc.Sprite.extend({ // cc.Spriteを継承
	_defaultSprite:null, // デフォルト状態のスプライト
	_activatedSprite:null, // 処理中状態のスプライト
	_disabledSprite:null, // 無効状態のスプライト
	_pressSprite:null, // 押下状態のスプライト
	_button:null, // ボタン（SneakyButton）のインスタンス取得用
	ctor:function(){ // コンストラクタ
		this._super(); // 親クラスのメソッドを実装
		this.schedule(this.watchSelf, 1 / 60); // 周期処理を開始
	},
	watchSelf:function(dt){ // 周期処理 ボタンの状態によりスプライトを変更
		if (this._button){ // ボタンのインスタンスを取得している場合
			if (!this._button.getStatus()) { // ボタンが無効の場合
				this.setVisibleDefActDisPrs(false, false, true, false); // 無効状態のスプライトを表示
			} else { // ボタンが有効の場合
				if (!this._button.getActive()) { // 処理中ではない場合
					if (this._button.getValue() == 0) { // ボタンがOFFの場合
						this.setVisibleDefActDisPrs(true, false, false, false); // デフォルト状態のスプライトを表示
					} else { // ボタンがONの場合
						this.setVisibleDefActDisPrs(false, false, false, true); // 押下状態のスプライトを表示
					}
				} else { // 処理中の場合
					this.setVisibleDefActDisPrs(false, false, false, true); // 処理中状態のスプライトを表示
				}
			}
		}
	},
	setDefaultSprite:function(aSprite){ // デフォルト状態のスプライトを設定
		this.changeNode(this._defaultSprite, aSprite, 0); // スプライトを差し替え
		this._defaultSprite = aSprite; // スプライトを取得
		if (this._defaultSprite) { // スプライトが存在する場合
			var size = this._defaultSprite.getContentSize(); // スプライトのサイズを取得
			this.setContentSize(size); // ステージのサイズを設定
			this._defaultSprite.setPosition(size.width / 2, size.height / 2) // 中央に配置
			this._defaultSprite.setVisible(true);
		}
	},
	setActivatedSprite:function(aSprite){ // 処理中状態のスプライトを設定
		this.changeNode(this._activatedSprite, aSprite, 1); // スプライトを差し替え
		this._activatedSprite = aSprite; // スプライトを取得
	},
	setDisabledSprite:function(aSprite){ // 無効状態のスプライトを設定
		this.changeNode(this._disabledSprite, aSprite, 2); // スプライトを差し替え
		this._disabledSprite = aSprite; // スプライトを取得
	},
	setPressSprite:function(aSprite){ // 押下状態のスプライトを設定
		this.changeNode(this._pressSprite, aSprite, 3); // スプライトを差し替え
		this._pressSprite = aSprite; // スプライトを取得
	},
	setButton:function(aButton){ // ボタンのインスタンスを取得
		this.changeNode(this._button, aButton, 4); // ボタンを差し替え
		this._button = aButton; // ボタンを取得
		if (this._button) { // ボタンがある場合
			var size = this.getContentSize(); // ステージのサイズを取得
			this._button.setRadius(size.width / 2); // ボタンの半径を設定
		}
	},
	changeNode:function(oldNode, newNode, zrOrder){ // ノードを差し替え
		if (oldNode) { // 古いノードがある場合
			var parent = oldNode.getParent(); // 親ノードを取得
			if (parent) { // 親ノードがある場合
				parent.removeChild(oldNode, true); // 古いノードを削除
			}
		}
		if (newNode) { // ボタンが存在する場合
			this.addChild(newNode); // 新しいノードをステージに追加
			newNode.setLocalZOrder(zrOrder); // ボタンのZオーダーを設定
			var size = this.getContentSize(); // ステージのサイズを取得
			newNode.setAnchorPoint(0.5, 0.5);
			newNode.setPosition(size.width / 2, size.height / 2); // ボタンを中央に配置
			newNode.setVisible(false); // 最初は非表示
		}
	},
	setVisibleDefActDisPrs:function(boolDefault, boolActivated, boolDisabled, boolPressed){ // スプライトの表示設定
		if (this._defaultSprite) { // デフォルトのスプライトがある場合
			this._defaultSprite.setVisible(boolDefault); // 表示状態を設定
		}
		if (this._activatedSprite) { // 処理中状態のスプライトをがある場合
			this._activatedSprite.setVisible(boolActivated); // 表示状態を設定
		}
		if (this._disabledSprite) { // 無効状態のスプライトをがある場合
			this._disabledSprite.setVisible(boolDisabled); // 表示状態を設定
		}
		if (this._pressSprite) { // 押下状態のスプライトをがある場合
			this._pressSprite.setVisible(boolPressed); // 表示状態を設定
		}
	}
});
