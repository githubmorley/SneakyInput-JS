
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);
     
        // 画像を使用した方法
        var joystickSkin = new SneakyJoystickSkinnedBase(); // ジョイスティックスキンのインスタンスを作成
        joystickSkin.setPosition(160, 120); // ジョイスティックスキンを配置
        joystickSkin.setBackgroundSprite(new cc.Sprite(res.joystick_background_png)); // 背景部分のスプライトを設定
        joystickSkin.setThumbSprite(new cc.Sprite(res.joystick_thumb_png)); // 親指部分のスプライトを設定
        var joystick = new SneakyJoystick(cc.rect(0, 0, 128, 128)); // ジョイスティックのインスタンスを作成
        joystick.setIsDPad(true); // デジタルジョイパッドを有効
        joystick.setNumberOfDirections(4); // デジタルジョイパッドの方向数を設定
        joystick.setHasDeadzone(true); // デッドゾーンを有効
        joystick.setDeadRadius(10); // デッドゾーンの半径を設定
        joystick.setAutoCenter(true); // 自動センター復帰機能を有効
        joystickSkin.setJoystick(joystick); // ジョイスティックスキンにジョイスティックのインスタンスを渡す
        this.addChild(joystickSkin); // 自ノードにジョイスティックスキンを追加

        var buttonSkin = new SneakyButtonSkinnedBase(); // ボタンスキンのインスタンスを作成
        buttonSkin.setPosition(480, 120); // ボタンスキンを配置
        buttonSkin.setDefaultSprite(new cc.Sprite(res.button_normal_png)); // デフォルト状態のスプライトを設定
        buttonSkin.setPressSprite(new cc.Sprite(res.button_pressed_png)); // 押下状態のスプライトを設定
        buttonSkin.setActivatedSprite(new cc.Sprite(res.button_disabled_png)); // 処理中状態のスプライトを設定
        var button = new SneakyButton(cc.rect(0, 0, 64, 64)); // ボタンのインスタンスを作成
        button.setIsHoldable(false); // ホールド機能を無効
        button.setRateLimit(1 / 120); // ホールド機能無効時のボタンON時間を設定
        button.setIsToggleable(false); // トグル機能を無効
        buttonSkin.setButton(button); // ボタンスキンにボタンのインスタンスを渡す
        this.addChild(buttonSkin); // 自ノードにボタンを追加
        
        /*
        // ColoredCircleSpriteを使用した方法
        var joystickSkin = new SneakyJoystickSkinnedBase(); // ジョイスティックスキンのインスタンスを作成
        joystickSkin.setPosition(160, 120); // ジョイスティックスキンを配置
        joystickSkin.setBackgroundSprite(new ColoredCircleSprite(cc.color(255, 50, 50, 255), 64)); // バックグラウンドのスプライトを設定
        joystickSkin.setThumbSprite(new ColoredCircleSprite(cc.color(50, 50, 255, 255), 32)); // 親指部分のスプライトを設定
        var joystick = new SneakyJoystick(cc.rect(0, 0, 128, 128)); // ジョイスティック機能を作成
        joystickSkin.setJoystick(joystick); // ジョイスティックスキンにジョイスティックのインスタンスを渡す
        this.addChild(joystickSkin); // 自ノードにジョイスティックスキンを追加
        
        var buttonSkin = new SneakyButtonSkinnedBase(); // ボタンスキンのインスタンスを作成
        buttonSkin.setPosition(480, 120); // ボタンスキンを配置
        buttonSkin.setDefaultSprite(new ColoredCircleSprite(cc.color(128, 255, 128, 128), 32)); // デフォルト状態のスプライトを設定
        buttonSkin.setActivatedSprite(new ColoredCircleSprite(cc.color(255, 255, 255, 255), 32)); // 処理中状態のスプライトを設定
        buttonSkin.setPressSprite(new ColoredCircleSprite(cc.color(255, 0, 0, 255), 32)); // 押下状態のスプライトを設定
        var button = new SneakyButton(cc.rect(0, 0, 64, 64)); // ボタンのインスタンスを作成
        buttonSkin.setButton(button); // ボタンスキンにボタンのインスタンスを渡す
        this.addChild(buttonSkin); // 自ノードにボタンを追加
        */
        
        // ボールを作成
        var ball = new ColoredCircleSprite(cc.color(255, 255, 0, 255), 32); // ボールを作成
        this.addChild(ball); // 自ノードに追加
        ball.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2); // 自ノードの中心に配置
        var rate = 20; // 速度の係数を設定
        var tick = function(dt){ // 周期処理
        	if ( button.getValue() == 1 ) { // ボタンが押された場合
        		ball.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2); // 自ノードの中心に配置
        	}
        	var velocity = joystick.getVelocity(); // スティックの値を取得
        	var pos = ball.getPosition(); // ボールの現在の位置を取得
        	ball.setPosition(pos.x + velocity.x * rate, pos.y + velocity.y * rate); // ボールを移動
        }
        this.schedule(tick, 1 / 60); // 周期処理を開始
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

