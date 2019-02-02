var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Rotator', path: './gameClasses/Rotator'},
		{name: 'Rotator2', path: './gameClasses/Rotator2'},
		{name: 'Mover', path: './gameClasses/Mover'},
        {name: 'NameBox', path: './gameClasses/NameBox'},
		{name: 'SpeechBalloon', path: './gameClasses/SpeechBalloon'},
		{name: 'Character', path: './gameClasses/Character'},
		{name: 'PlayerComponent', path: './gameClasses/PlayerComponent'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }