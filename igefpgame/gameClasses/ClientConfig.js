var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Rotator.js',
		'./gameClasses/Rotator2.js',
		'./gameClasses/Mover.js',
    './gameClasses/NameBox.js',
		'./gameClasses/SpeechBalloon.js',
		'./gameClasses/Character.js',
		'./gameClasses/PlayerComponent.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }