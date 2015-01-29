;(function ( $, window, document, undefined ) {

	// define your widget under a namespace of your choice
	//  with additional parameters e.g.
	// $.widget( "namespace.widgetname", (optional) - an
	// existing widget prototype to inherit from, an object
	// literal to become the widget's prototype );

	$.widget( "k3.noise" , {

		//Options to be used as defaults
		options: {
			c1: [255,255,255,255],
			frames: 32,
			frame_rate: 1
		},

		//Setup widget (eg. element creation, apply theming
		// , bind events etc.)
		_create: function () {
			var $el = this.element;
			this._width = $el.width();
			this._height = $el.height();
			this._ctx = this.element[0].getContext("2d");
			this._t = 0;

			this.frame_count = this.option("frames");
			this.rate = this.option("frame_rate") || 1;

			this._noise_frames = [];
			for (var n = this.frame_count; n > 0; n--) {
				this._noise_frames.push(this._renderNoiseFrame());
			}

			this.anim_id = false;
			this._redraw();
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

		_redraw: function() {
			var me = this;

			if (this._t % this.rate === 0) {
				me._render(this._t);
			}
			this._t++;

			me.anim_id = requestAnimationFrame(function() { me._redraw.apply(me); });
		},
		_render: function(t) {
			this._ctx.putImageData(this._noise_frames[t % this.frame_count],0,0);
		},

		// Create a frame of random static
		_renderNoiseFrame: function(c1, c2) {
			var img = this._ctx.createImageData(this._width, this._height);

			c1 = c1 || this.option("c1");
			c2 = c2 || this.option("c2");

			for (var i = 0, n = img.data.length; i < n; i+=4) {
				if (Math.random() < 0.5) {
					this._setPixel(img.data,i,c1);
				}
				else if (c2) {
					img.data.spliceArray(i,4,c2);
				}
			}

			return img;
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

})( jQuery, window, document );
