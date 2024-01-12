const handleContextMenu = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (!classes.contains('flag') && !classes.contains('revealed')) {
		classes.add('flag');
	} else if (classes.contains('flag')) {
		classes.remove('flag');
	}
};

const handleClick = (e) => {
	const classes = document.getElementById(e.target.id).classList;
	if (!classes.contains('revealed'))
		if (classes.contains('tile') && !classes.contains('flag')) {
			console.log(
				'checks the type with the game data, updates game data and adds the appropriate revealed!'
			);
			classes.add('revealed');
		}
};

const game = document.getElementById('game');
game.addEventListener('click', (e) => handleClick(e));
game.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	handleContextMenu(e);
});
