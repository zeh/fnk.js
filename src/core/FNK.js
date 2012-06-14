/**
 * @author zeh fernando / zehfernando.com
 */

var FNK = FNK || {
	version: "1.0"
};

FNK.getTimer = function() {
	return new Date().valueOf() - this.timeStarted;
};

FNK.timeStarted = (new Date()).valueOf();

FNK.getFormattedTime = function() {
	return "[" + ("00000000" + FNK.getTimer()).substr(-6, 6) + "] " 
};

FNK.log = function(__message) {
	console.log(FNK.getFormattedTime() + __message);
};


FNK.warn = function(__message) {
	console.warn(FNK.getFormattedTime() + __message);
};

FNK.error = function(__message) {
	console.error(FNK.getFormattedTime() + __message);
};

// Move this somewhere else?

FNK.addClassToElement = function(__element, __className) {
	if (__element.classList == undefined) {
		// MSIE
		__element.className = __element.className.split(__className).join("") + " " + __className;
	} else {
		// All other browsers
		__element.classList.add(__className);
	}
};

FNK.removeClassFromElement = function(__element, __className) {
	if (__element.classList == undefined) {
		// MSIE
		__element.className = __element.className.split(__className).join("");
	} else {
		// All other browsers
		__element.classList.remove(__className);
	}
}