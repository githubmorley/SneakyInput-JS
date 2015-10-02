
var ColoredCircleSprite = cc.DrawNode.extend({ // cc.DrawNodeクラスを継承
	radius_:10, // 円の半径
	numberOfSegments:36, // 円の描画の精度
	color_:null, // 塗りつぶしの色
	circleVertices_:[], // 円作成用の座標値の配列
	ctor:function(color, radius){ 
		this._super(); // 親クラスのメソッドを継承
		this.color_ = color; // 色を取得
		this.setRadius(radius); // 半径を設定
	},
	setRadius:function(radius){
		this.radius_ = radius; // 半径を取得
		var theta_inc = 2 * Math.PI / this.numberOfSegments; // 座標の計算間隔を計算
		var theta = 0; // ラジアン計算用
		for (var i = 0; i < this.numberOfSegments; i++) {
			var j = this.radius_ * Math.cos(theta) + this.getPositionX(); // 円周上のx座標を計算
			var k = this.radius_ * Math.sin(theta) + this.getPositionY(); // 円周上のy座標を計算
			this.circleVertices_[i] = cc.p(j, k); // 配列に格納
			theta = theta + theta_inc; // 次の位置を計算
		}
		this.setContentSize(this.radius_ * 2, this.radius_ * 2); // 自ノードのサイズを設定
		this.draw(); // 円を描画
	},
	draw:function(){
		this.clear(); // 描画をクリア
		this.drawPoly(this.circleVertices_, this.color_, 0, this.color_); // 円（ポリゴン）の描画
		
		// drawDotで円を描画する場合
		//var pos = cc.p(this.getPositionX(), this.getPositionY());
		//this.drawDot(pos, this.radius_, this.color_)
	}
});
