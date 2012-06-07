/**
 * @author zeh fernando / zehfernando.com
 */


// http://www.codeproject.com/Articles/396959/Mario5

var FNK = FNK || {
	version: "1.0"
}

FNK.getTimer = function() {
	return new Date().valueOf() - this.timeStarted;
};

FNK.timeStarted = (new Date()).valueOf();

FNK.getFormattedTime = function() {
	return "[" + ("00000000" + FNK.getTimer()).substr(-6, 6) + "] " 
};

FNK.error = function(__message) {
	console.error(FNK.getFormattedTime() + __message);
};

FNK.log = function(__message) {
	console.log(FNK.getFormattedTime() + __message);
};
