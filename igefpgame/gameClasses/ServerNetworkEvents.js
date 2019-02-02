var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onTest: function (data, clientId) {
		console.log('Client test command received from client id "' + clientId + '" with data:', data);
		console.log('Sending back to client!');
		ige.network.send('test', {moo:'here\'s some data right back at ya!'}, clientId);
	},

	_onTestRequest: function (requestId, data, clientId) {
		console.log('Client testRequest command received from client id "' + clientId + '" with data:', data);
		ige.network.response(requestId, {serverSaid:'moo!'});
  },
  
	_onPlayerConnect: function (socket) {
		// Don't reject the client connection
		return false;
	},

	_onPlayerDisconnect: function (clientId) {
		if (ige.server.players[clientId]) {
			// Remove the player from the game
			ige.server.players[clientId].destroy();

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[clientId];
		}
	},

	_onPlayerEntity: function (data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Character(clientId)
				.addComponent(PlayerComponent)
				.streamMode(1)
				.mount(ige.server.foregroundScene);

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
		}
	},

	_onPlayerLeftDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.left = true;
	},

	_onPlayerLeftUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.left = false;
	},

	_onPlayerRightDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.right = true;
	},

	_onPlayerRightUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.right = false;
	},

	_onPlayerUpDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.up = true;
	},

	_onPlayerUpUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.up = false;
	},
	
	_onPlayerDownDown: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.down = true;
	},

	_onPlayerDownUp: function (data, clientId) {
		ige.server.players[clientId].playerControl.controls.down = false;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
