var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Rotator', path: './gameClasses/Rotator'},
		{name: 'Rotator2', path: './gameClasses/Rotator2'},
		{name: 'Mover', path: './gameClasses/Mover'},
		{name: 'SpeechBallon', path: './gameClasses/SpeechBalloon'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }