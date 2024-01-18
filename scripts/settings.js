import { getLocalStorageObject, setLocalStorage } from './local-storage.js';

const scrubInput = (e) => {
	const input = e.target.value;
	const clean = input.replace(/[^0-9]/g, '');
	e.target.value = clean;
	return parseInt(clean);
};

const createDefaultSettings = () => {
	const innerHeight = window.innerHeight;
	const widthMargin = (innerWidth) => {
		if (innerWidth <= 480) {
			return 0;
		} else if (innerWidth <= 640) {
			return 32 * 2;
		} else if (innerWidth <= 768) {
			return 32 * 3;
		} else if (innerWidth <= 1269) {
			return 32 * 4;
		} else {
			return 32 * 20;
		}
	};
	const heightMargin = (innerHeight) => {
		const margin = 128;
		if (innerHeight > 900) {
			return margin + 32 * 1;
		}
		return margin;
	};
	const innerWidth = window.innerWidth;
	const xDimension =
		2 * Math.floor((innerWidth - widthMargin(innerWidth)) / 32 / 2);
	const yDimension =
		2 * Math.floor((innerHeight - heightMargin(innerHeight)) / 32 / 2);
	return {
		xDimension: xDimension,
		yDimension: yDimension,
		mines: Math.round(xDimension * yDimension * 0.2),
	};
};

const updateSettings = (setting) => {
	return (value) => {
		const oldSettings = getLocalStorageObject('settings');
		if (oldSettings) {
			setLocalStorage('settings')({ ...oldSettings, [setting]: value });
		} else {
			setLocalStorage('settings')({ ...createDefaultSettings() });
		}
	};
};
const updateXDimension = updateSettings('xDimension');
const updateYDimension = updateSettings('yDimension');

const updateMines = (difficulty) => {
	const oldSettings = getLocalStorageObject('settings');
	const percentage = () => {
		switch (difficulty) {
			case 2:
				return 0.2;
			case 3:
				return 0.25;
			default:
				return 0.15;
		}
	};
	if (oldSettings) {
		const { xDimension, yDimension } = oldSettings;
		const mineCount =
			2 * Math.floor((xDimension * yDimension * percentage(difficulty)) / 2);
		setLocalStorage('settings')({ ...oldSettings, mines: mineCount });
	} else {
		const newSettings = createDefaultSettings();
		const { xDimension, yDimension } = newSettings;
		const mineCount =
			2 * Math.floor((xDimension * yDimension * percentage(difficulty)) / 2);
		setLocalStorage('settings')({ ...newSettings, mines: mineCount });
	}
};

export const enableSettings = (resetFunction) => {
	const settings = createDefaultSettings();
	setLocalStorage('settings')(settings);
	const widthInput = document.getElementById('width-input');
	widthInput.value = settings.xDimension;
	widthInput.addEventListener('change', (e) => updateXDimension(scrubInput(e)));
	const heightInput = document.getElementById('height-input');
	heightInput.value = settings.yDimension;
	heightInput.addEventListener('change', (e) =>
		updateYDimension(scrubInput(e))
	);

	document.getElementById('generate').addEventListener('click', () => {
		updateMines(parseInt(document.getElementById('difficulty').value));
		resetFunction();
	});
	document.getElementById('defaults').addEventListener('click', () => {
		setLocalStorage('settings')(createDefaultSettings());
		updateMines(parseInt(document.getElementById('difficulty').value));
		resetFunction();
	});
};
