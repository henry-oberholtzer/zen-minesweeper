let gameOver = true;
let intervalID;
if (gameOver === false) {
	intervalID = setInterval(count, 1000);
}

let totalTime = 0;
const count = () => {
	if (gameOver === true) {
		clearInterval();
	}
};
