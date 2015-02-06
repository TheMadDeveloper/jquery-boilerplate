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
