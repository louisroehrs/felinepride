var Mover = IgeEntity.extend({
	classId: 'Mover',
  
	init: function (username) {
	  IgeEntity.prototype.init.call(this);

	  this._value = '';
    if (username !== undefined) {
			this._value = username;
		} else {
			this._value= "movernameless";
		}

    var self = this;
    
		if (ige.isClient) {
			// Define the texture this entity will use
      //			this._tex = new IgeTexture('/Users/lroehrs/awork/felinepride/igefpgame/assets/caturday.jpg');
      this._tex = new IgeTexture('/Users/lroehrs/awork/felinepride/igefpgame/assets/OrangeAvatar(aKaFred).svg');
      
			// Wait for the texture to load
			this._tex.on('loaded', function () {
				self.texture(self._tex)
					.dimensionsFromCell();
				self.width(100)
					.height(100);
			});

			this._namebox = new NameBox(this._value)
				.width(100)
				.translateBy(0,50,-1)
				.height(50)
				.value(this._value)
				.streamMode(1)
				.mount(self);
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform','value']);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling

		if (sectionId === 'value') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._value = data;
        this._namebox.value(data);
			} else {
				// Return current data
				return this._name;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},
  	/**
	 * Gets / sets the text value of the input box.
	 * @param {String=} val The text value.
	 * @return {*}
	 */

	stuff: function (val) {
		if (val !== undefined) {
			if (this._value !== val) {
				this._value = val;
	
				if (!val) {
					// Assign placeholder text and color
					this._namebox.value(this._value);
        }
				this.$emit('change', this._value);
			}
			return this;
		}
		return this._value;

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
			if (this._moveDir) {
				this.translateBy(0.35 * ige._tickDelta, 0, 0);

				if (this._translate.x > 300) {
					this._translate.x = 300;
					this._moveDir = 0;
				}
			} else {
				this.translateBy(-0.35 * ige._tickDelta, 0, 0);

				if (this._translate.x < -300) {
					this._translate.x = -300;
					this._moveDir = 1;
				}
			}
		}

		// Call the IgeEntity (super-class) tick() method
		IgeEntity.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Mover; }
