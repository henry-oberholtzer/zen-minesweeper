export const setLocalStorage = (objectName) => {
	return (object) => localStorage.setItem(objectName, JSON.stringify(object));
};
export const getLocalStorage = (objectName) => localStorage.getItem(objectName);
export const getLocalStorageObject = (objectName) =>
	JSON.parse(getLocalStorage(objectName));
