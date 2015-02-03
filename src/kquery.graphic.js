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
			//this.$canvas.appendTo(document.body);
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
