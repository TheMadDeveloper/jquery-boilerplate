/*
 *  jQuery Noise - v0.2.0
 *  A widget for rendering and displaying noise/static animations via html5 canvas. Depends on the jQueryUI widget factory.
 *  
 *
 *  Made by Keith Kerlan
 *  Under MIT License
 */
;(function ($, window, document, undefined) {

	// define your widget under a namespace of your choice
	//  with additional parameters e.g.
	// $.widget( "namespace.widgetname", (optional) - an
	// existing widget prototype to inherit from, an object
	// literal to become the widget's prototype );

	$.widget("k3.graphic", {

		//Options to be used as defaults
		options: {
			animates: false
		},

		//Setup widget
		_create: function () {
			var $el = this.element;

			this._width = $el.width();
			this._height = $el.height();

			if (this._is("IMG")) {
				this._initImg();
			}
			else if (this._is("CANVAS")) {
				this.$canvas = $el;
			}
		},

		_initImg: function () {
			this.$img = this.element;
		},

		_initCanvas: function (with_image) {
			var $canvas = $("<canvas>").attr({
				width: this._width,
				height: this._height
			});
			if (with_image && this.$img) {
				$canvas.get(0).getContext("2d").drawImage(this.$img[0], 0, 0);
			}

			return $canvas;
		},

		draw: function() {
			if (this.option("animates")) {
				this._t = 0;
				this._rate = this.option("frame_rate") || 1;
				this.redraw();
			}
			else {
				this._render();
			}
		},

		redraw: function() {
			var me = this;

			if (this._t % this._rate === 0) {
				me._render(this._t);
			}
			this._t++;

			me.anim_id = requestAnimationFrame(function() { me.redraw.apply(me); });
		},

		_render: function() {},

		convertCanvas: function() {
			if (this._is("CANVAS")) {
				return;
			}

			this.$canvas = this._createCanvas();
			this.element.replaceWith(this.$canvas);

			this.element = this.$canvas;
			this._ctx = this.$canvas.get(0).getContext("2d");
		},

		_createCanvas: function () {
			return $("<canvas>").attr({
				width: this._width,
				height: this._height
			});
		},

		_is: function (tag) {
			return tag === this.element.prop("tagName");
		},

		getImageData: function () {
			var ctx = this.getContext();

			ctx.drawImage(this.$img[0], 0, 0);
			return ctx.getImageData(0, 0, this._width, this._height);
		},

		getContext: function () {

			if (this._is("CANVAS")) {
				if (!this._ctx) {
					this._ctx = this.element.get(0).getContext("2d");
				}
				return this._ctx;
			}

			if (this._is("IMG")) {
				return this._createCanvas().get(0).getContext("2d");
			}
		},

		// Destroy an instantiated plugin and clean up
		// modifications the widget has made to the DOM
		destroy: function () {

			// this.element.removeStuff();
			// For UI 1.8, destroy must be invoked from the
			// base widget
			$.Widget.prototype.destroy.call(this);
			// For UI 1.9, define _destroy instead and don't
			// worry about
			// calling the base widget
		},

		_canvasImage: function () {
			var image_data = $canvas.get(0).toDataURL();

			$img.attr("src", image_data);
			this.element.trigger("svg:rendered", [image_data, $img]);

			return $img;
		},

		_getContext: function () {
			// from cache
			if (this._ctx) {
				return this._ctx;
			}

			// from image
			if (this.$img) {
				this.$canvas = this._initCanvas(true);
			}

			// from canvas
			if (this.$canvas) {
				this._ctx = this.$canvas[0].getContext("2d");

				return this._ctx;
			}
		},

		_setPixel: function(data, i, rgba) {
			for(var n = 0; n < 4; n++) {
				data[i+n] = rgba[n];
			}
		}

		// Respond to any changes the user makes to the
		// option method
		//_setOption: function ( key, value ) {
		//	switch (key) {
		//		case "someValue":
		//			//this.options.someValue = doSomethingWith( value );
		//			break;
		//		default:
		//			//this.options[ key ] = value;
		//			break;
		//	}
		//
		//	// For UI 1.8, _setOption must be manually invoked
		//	// from the base widget
		//	$.Widget.prototype._setOption.apply( this, arguments );
		//	// For UI 1.9 the _super method can be used instead
		//	// this._super( "_setOption", key, value );
		//}
	});

})(jQuery, window, document);

;(function ( $, window, document, undefined ) {

	// define your widget under a namespace of your choice
	//  with additional parameters e.g.
	// $.widget( "namespace.widgetname", (optional) - an
	// existing widget prototype to inherit from, an object
	// literal to become the widget's prototype );

	$.widget( "k3.noise" , $.k3.graphic, {

		//Options to be used as defaults
		options: {
			c1: [255,255,255,255],
			c2: [0,0,0,255],
			frames: 32,
			animates: {}
		},

		//Setup widget
		_create: function () {
			this._super();

			this.frame_count = this.option("frames");

			this._noise_frames = [];
			for (var n = this.frame_count; n > 0; n--) {
				this._noise_frames.push(this._renderNoiseFrame());
			}

			this.draw();
		},

		_initImg: function() {
			this._super();
			this.option("mask", this.getImageData());
			this.convertCanvas();
		},

		// Destroy an instantiated plugin and clean up
		// modifications the widget has made to the DOM
		destroy: function () {

			// this.element.removeStuff();
			// For UI 1.8, destroy must be invoked from the
			// base widget
			$.Widget.prototype.destroy.call(this);
			// For UI 1.9, define _destroy instead and don't
			// worry about
			// calling the base widget
		},

		//_initImageMask: function() {
		//	var ctx = this._getContext(),
		//			img = ctx.getImageData(0, 0, this._width, this._height);
        //
		//	this.mask = img.data;
        //
		//},

		//_initImageMask: function() {
		//	var ctx = this._getContext(),
		//			img = ctx.getImageData(0,0, this._width, this._height),
		//			mask_ranges = [],
		//			alpha0 = 0;
        //
		//	// Scan image
		//	for (var i = 0, n = img.data.length; i < n; i+=4) {
		//		var alpha = img.data[i+3];
        //
		//		if (alpha > 0 ) {
		//			if (alpha0 == 0) {
		//				mask_ranges.push(i);
		//			}
        //
		//			//this._setPixel(img.data,i,[255,0,0,alpha]);
		//		}
		//		else {
		//			if (alpha0 > 0) {
		//				mask_ranges.push(i);
		//			}
		//		}
        //
		//		alpha0 = alpha;
		//	}
        //
		//	this._mask_ranges = mask_ranges;
        //
		//	console.log(mask_ranges);
		//	var r,l;
		//	for (r = 0, l = mask_ranges.length; r < l; r++) {
		//		for (i = mask_ranges[r], n = r+1 >= l ? img.data.length : mask_ranges[r+1]; i < mask_ranges[r+1]; i+=4) {
		//			alpha = img.data[i+3];
		//			this._setPixel(img.data,i,[255,0,0,alpha]);
		//		}
		//	}
		//	ctx.putImageData(img,0,0);
		//},

		//_draw: function() {
		//	this._render();
		//},
        //
		//_redraw: function() {
		//	var me = this;
        //
		//	if (this._t % this.rate === 0) {
		//		me._render(this._t);
		//	}
		//	this._t++;
        //
		//	me.anim_id = requestAnimationFrame(function() { me.redraw.apply(me); });
		//},
		_render: function(t) {
			t = t || 0;
			this.getContext().putImageData(this._noise_frames[t % this.frame_count],0,0);
		},

		// Create a frame of random static
		_renderNoiseFrame: function(c1, c2) {
			var img = this.getContext().createImageData(this._width, this._height);
			var mask = this.option("mask");
			c1 = c1 || this.option("c1");
			c2 = c2 || this.option("c2");

			for (var i = 0, n = img.data.length; i < n; i+=4) {
				if (mask) {
					if(mask.data[i+3] > 0) {
						this._setPixel(img.data, i, Math.random() < 0.5 ? c1 : c2);
					}
				}
				else {
					this._setPixel(img.data, i, Math.random() < 0.5 ? c1 : c2);
				}
			}
			return img;
		}

		// Respond to any changes the user makes to the
		// option method
		//_setOption: function ( key, value ) {
		//	switch (key) {
		//		case "someValue":
		//			//this.options.someValue = doSomethingWith( value );
		//			break;
		//		default:
		//			//this.options[ key ] = value;
		//			break;
		//	}
        //
		//	// For UI 1.8, _setOption must be manually invoked
		//	// from the base widget
		//	$.Widget.prototype._setOption.apply( this, arguments );
		//	// For UI 1.9 the _super method can be used instead
		//	// this._super( "_setOption", key, value );
		//}
	});

})( jQuery, window, document );
