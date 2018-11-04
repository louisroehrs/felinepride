var SpeechBalloon = IgeEntity.extend({
	classId: 'SpeechBalloon',

	init: function (text) {
		IgeEntity.prototype.init.call(this);
		this._text = text;

		var self = this;

		if (ige.isClient) {
			// Define the texture this entity will use
			this._tex = new IgeTexture('/Users/lroehrs/awork/felinepride/igefpgame/assets/speechballoon.jpeg');

			// Wait for the texture to load
			this._tex.on('loaded', function () {
				self.texture(self._tex)
					.dimensionsFromCell();
				self.width(400)
					.height(100);
			});

      this.text = new IgeUiLabel()
        .height(30)
        .width(200)
        .value(text)
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'custom1']);
	},

	streamCreateData: function () {
		return this._text;
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'custom1') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._customProperty = data;
			} else {
				// Return current data
				return this._customProperty;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		// Only process rotation on the server, the stream will bring
		// transform updates to the client automatically
		if (ige.isServer) {
			// Rotate this entity by 0.1 degrees.
//			this.rotateBy(0, 0, (this._rotateSpeed * ige._tickDelta) * Math.PI / 180);
		}

		// Call the IgeEntity (super-class) tick() method
		IgeEntity.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SpeechBalloon; }