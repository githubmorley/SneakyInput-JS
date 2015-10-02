var res = {
    HelloWorld_png : "res/HelloWorld.png",
    MainScene_json : "res/MainScene.json",
    joystick_background_png : "res/joystick_background.png", // ジョイスティックの背景部分の画像
    joystick_thumb_png : "res/joystick_thumb.png", // ジョイスティックの親指部分の画像
    button_normal_png : "res/button_normal.png", // ボタンの通常時の画像
    button_pressed_png : "res/button_pressed.png", // ボタンの押下時の画像
    button_disabled_png : "res/button_disabled.png" // ボタンの使用不可時の画像
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
