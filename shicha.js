function Shicha (opt) {
	this.maxTop = opt.maxTop;
	this.curTop = 0;
	this.tY = [];
	this.fcn = [];

	this.a = 0.001;

	this.onts = false;

	this.init();

	this.canMove = true;
}

Shicha.prototype.init = function() {
	var that = this;

	var startY,
		offsetY,
		curY,
		prevY,
		lastY;

	var curT,
		prevT,
		lastT;

	document.addEventListener('touchstart', function(e) {
		that.canMove = false;
		startY = e.touches[0].pageY;
		offsetY = 0;

		prevY = 0;
		lastY = 0;
		prevT = +new Date();

		that.onts = true;

		that.rmTransition();
	});

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();

		curY = e.touches[0].pageY;
		curT = +new Date();

		offsetY = -(curY - startY);

		lastY = curY - prevY;
		prevY = curY;
		lastT = curT - prevT;
		prevT = curT;

		that.animateTop(that.curTop + offsetY);
	});

	document.addEventListener('touchend', function() {
		that.setTop(that.curTop + offsetY);

		that.animateTop(that.curTop);
		// that.addTransition();
		that.onts = false;
		// that.canMove = true;
		that.inertia(lastY / lastT);
	});
};

Shicha.prototype.animateTY = function(selector, opt) {
	var hasone = false;

	this.tY.forEach(function(item) {
		if (item.selector == selector) {
			item.startTop = opt.startTop;
			item.duration = opt.duration;
			item.from = opt.from;
			item.to = opt.to;
			hasone = true;
		}
	});

	if (!hasone) {
		var o = document.querySelector(selector);
		opt.ele = o;
		opt.selector = selector;

		this.tY.push(opt);
	}

	this.animateTop(this.curTop);
};

Shicha.prototype.animateFcn = function(selector, callback) {
	var hasone = false;

	this.fcn.forEach(function(item) {
		if (item.selector == selector) {
			item.callback = callback;
			hasone = true;
		};
	});

	if (!hasone) {
		var obj = {
			ele: document.querySelector(selector),
			callback: callback
		};
		this.fcn.push(obj);
	}
};

// 惯性
Shicha.prototype.inertia = function(v0) {
	var that = this;

	var t,
		curT,
		prevT = +new Date();
	var s;
	var vt;
	var a;

	if (v0 > 0) {
		a = -Math.abs(this.a);
	} else {
		a = Math.abs(this.a);
	};

	function renderLoop () {
		if (that.onts) return;

		curT = +new Date();
		t = curT - prevT;
		prevT = curT;

		vt = v0 + a * t;

		if (v0 * vt > 0) {
			s = v0 * t + a * t * t / 2;

			that.setTop(that.curTop - s)
			that.animateTop(that.curTop);

			v0 = vt;
			requestAnimationFrame(renderLoop);
		};
	};

	renderLoop();
};

Shicha.prototype.animateTop = function(top) {
	this.tY.forEach(function(item) {
		if (top < item.startTop) {
			item.ele.style.webkitTransform = 'translate3d(0,' + item.from + 'px,0)';
		} else if (top > item.startTop + item.duration) {
			item.ele.style.webkitTransform = 'translate3d(0,' + item.to + 'px,0)';
		} else {
			var tY = (top - item.startTop) / item.duration * (item.to - item.from) + item.from;
			item.ele.style.webkitTransform = 'translate3d(0,' + tY + 'px,0)';
		}
	});

	this.fcn.forEach(function(item) {
		item.callback(top);
	});

	// this.curTop = top;
};

Shicha.prototype.addTransition = function() {
	this.tY.forEach(function(item) {
		item.ele.style.webkitTransition = 'all .4s';
	});

	this.fcn.forEach(function(item) {
		item.ele.style.webkitTransition = 'all .4s';
	});
};

Shicha.prototype.rmTransition = function() {
	this.tY.forEach(function(item) {
		item.ele.style.webkitTransition = 'none';
	});

	this.fcn.forEach(function(item) {
		item.ele.style.webkitTransition = 'none';
	});
};

Shicha.prototype.setTop = function(top) {
	if (top < 0) {
		this.curTop = 0;
	} else if (top > this.maxTop) {
		this.curTop = this.maxTop;
	} else {
		this.curTop = top;
	}
}

