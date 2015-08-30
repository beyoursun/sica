function Shicha () {
	this.maxTop;
	this.curTop = 0;

	this.tY = [];
	this.tX = [];
	this.scale = [];
	this.rotate = [];
	this.opacity = [];
	this.fcn = [];

	this.flows = document.querySelectorAll('.sc-flow'); // 基础滚动流

	this.a = 0.002;

	this.onts = false;

	this.on = true;

	this.init();
	this.refresh();
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
		if (!that.on) return;

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
		if (!that.on) return;

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
		if (!that.on) return;

		if (Math.abs(offsetY) > 20 & that.setTop(that.curTop + offsetY) == 0) {
			that.onts = false;
			that.inertia(lastY / lastT);
		};

		that.animateTop(that.curTop);
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
		};
	});

	if (!hasone) {
		var o = document.querySelector(selector);
		opt.ele = o;
		opt.selector = selector;

		this.tY.push(opt);
	}

	this.animateTop(this.curTop);
}

Shicha.prototype.animateTX = function(selector, opt) {
	var hasone = false;

	this.tX.forEach(function(item) {
		if (item.selector == selector) {
			item.startTop = opt.startTop;
			item.duration = opt.duration;
			item.from = opt.from;
			item.to = opt.to;
			hasone = true;
		}
	});

	if (!hasone) {
		var tX = document.querySelector(selector);
		opt.ele = tX;
		opt.selector = selector;
		this.tX.push(opt);
	}

	this.animateTop(this.curTop);
}

Shicha.prototype.animateScale = function(selector, opt) {
	var hasone = false;

	this.scale.forEach(function(item) {
		if (item.selector == selector) {
			item.startTop = opt.startTop;
			item.duration = opt.duration;
			item.from = opt.from;
			item.to = opt.to;
			hasone = true;
		}
	});

	if (!hasone) {
		var scale = document.querySelector(selector);
		opt.ele = scale;
		opt.selector = selector;
		this.scale.push(opt);
	}

	this.animateTop(this.curTop);
}

Shicha.prototype.animateRotate = function(selector, opt) {
	var hasone = false;

	this.rotate.forEach(function(item) {
		if (item.selector == selector) {
			item.startTop = opt.startTop;
			item.duration = opt.duration;
			item.from = opt.from;
			item.to = opt.to;
			hasone = true;
		}
	});

	if (!hasone) {
		var rotate = document.querySelector(selector);
		opt.ele = rotate;
		opt.selector = selector;
		this.rotate.push(opt);
	}

	this.animateTop(this.curTop);
}

Shicha.prototype.animateOpacity = function(selector, opt) {
	var hasone = false;

	this.opacity.forEach(function(item) {
		if (item.selector == selector) {
			item.startTop = opt.startTop;
			item.duration = opt.duration;
			item.from = opt.from;
			item.to = opt.to;
			hasone = true;
		}
	});

	if (!hasone) {
		var opacity = document.querySelector(selector);
		opt.ele = opacity;
		opt.selector = selector;
		this.opacity.push(opt);
	}

	this.animateTop(this.curTop);
}

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
	};
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

			that.setTop(that.curTop - s);
			that.rmTransition();
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
		};
	});

	this.tX.forEach(function(item) {
		if (top < item.startTop) {
			item.ele.style.webkitTransform = 'translate3d(' + item.from + 'px,0,0)';
		} else if (top > item.startTop + item.duration) {
			item.ele.style.webkitTransform = 'translate3d(' + item.to + 'px,0,0)';
		} else {
			var tX = (top - item.startTop) / item.duration * (item.to - item.from) + item.from;
			item.ele.style.webkitTransform = 'translate3d(' + tX + 'px,0,0)';
		};
	});

	this.scale.forEach(function(item) {
		if (top < item.startTop) {
			item.ele.style.webkitTransform = 'scale(' + item.from + ')';
		} else if (top > item.startTop + item.duration) {
			item.ele.style.webkitTransform = 'scale(' + item.to + ')';
		} else {
			var scale = (top - item.startTop) / item.duration * (item.to - item.from) + item.from;
			item.ele.style.webkitTransform = 'scale(' + scale + ')';
		};
	});

	this.rotate.forEach(function(item) {
		if (top < item.startTop) {
			item.ele.style.webkitTransform = 'rotate3d(0,0,1,' + item.from + 'deg)';
		} else if (top > item.startTop + item.duration) {
			item.ele.style.webkitTransform = 'rotate3d(0,0,1,' + item.to + 'deg)';
		} else {
			var rotate = (top - item.startTop) / item.duration * (item.to - item.from) + item.from;
			item.ele.style.webkitTransform = 'rotate3d(0,0,1,' + rotate + 'deg)';
		};
	});

	this.opacity.forEach(function(item) {
		if (top < item.startTop) {
			item.ele.style.opacity = item.from;
		} else if (top > item.startTop + item.duration) {
			item.ele.style.opacity = item.to;
		} else {
			var opacity = (top - item.startTop) / item.duration * (item.to - item.from) + item.from;
			item.ele.style.opacity = opacity;
		};
	});

	this.fcn.forEach(function(item) {
		item.callback(top);
	});
};

Shicha.prototype.addTransition = function() {
	this.tY.forEach(function(item) {
		item.ele.style.webkitTransition = 'all .2s';
	});

	this.fcn.forEach(function(item) {
		item.ele.style.webkitTransition = 'all .2s';
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
		this.addTransition();
		return -1;
	} else if (top > this.maxTop) {
		this.curTop = this.maxTop;
		this.addTransition();
		return 1;
	} else {
		this.curTop = top;
		return 0;
	};
};

Shicha.prototype.stop = function() {
	this.on = false;
};

Shicha.prototype.start = function() {
	this.on = true;
};

// 基础滚动流重绘
Shicha.prototype.refresh = function() {
	var that = this;
	var h = window.innerHeight;
	that.maxTop = -h;

	for (var i = 0; i < that.flows.length; i++) {
		that.flows[i].classList.add('sc-flow' + i);
		that.flows[i].h = getAllHeight(that.flows[i], getNum);
		that.maxTop += that.flows[i].h;
		
		var startTop = -h;
		for (var j = 0; j < i; j++) {
			startTop += that.flows[j].h;
		};

		var duration = h + that.flows[i].h;

		var from = h;

		var to = -that.flows[i].h

		that.animateTY('.sc-flow' + i, {
			startTop: startTop,
			duration: duration,
			from: from,
			to: to
		});
	};

	// 获取元素所占区域高度
	function getAllHeight (ele, callback) {
		var style = window.getComputedStyle(ele);
		return callback(style.height)
			+ callback(style.paddingTop)
			+ callback(style.paddingBottom)
			+ callback(style.borderTopWidth)
			+ callback(style.borderBottomWidth)
			+ callback(style.marginTop)
			+ callback(style.marginBottom);
	};

	// 获取数字
	function getNum (string) {
		return +string.substring(0, string.length - 2);
	};
};