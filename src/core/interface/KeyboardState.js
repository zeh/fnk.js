// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.KeyboardState = function() {
	// No constructor
};

FNK.KeyboardState.prototype = {};
FNK.KeyboardState.prototype.constructor = FNK.KeyboardState;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Properties
FNK.KeyboardState.currentState = {};


// ================================================================================================================
// STATIC interface -----------------------------------------------------------------------------------------------

// Meta-key handlers
FNK.KeyboardState.isMultipleSelectionKeyDown = function() {
	// Returns whether the key used for multiple selection (normally, SHIFT) is pressed
	// TODO: verify specific key depending on system?
	return FNK.KeyboardState.isShiftDown();
};

// Normal keys
FNK.KeyboardState.isShiftDown = function() {
	return FNK.KeyboardState.currentState.shiftKey == true;
};

FNK.KeyboardState.isCtrlDown = function() {
	return FNK.KeyboardState.currentState.ctrlKey == true;
};

FNK.KeyboardState.isAltDown = function() {
	return FNK.KeyboardState.currentState.altKey == true;
};

FNK.KeyboardState.isAltGraphDown = function() {
	return FNK.KeyboardState.currentState.altGraph == true;
};


// ================================================================================================================
// EVENT interface ------------------------------------------------------------------------------------------------

FNK.KeyboardState.onKeyChanged = function(__event) {
	FNK.KeyboardState.currentState = __event;

	/*
	altGraphKey: false
	altKey: false
	bubbles: true
	cancelBubble: false
	cancelable: true
	charCode: 0
	clipboardData: undefined
	ctrlKey: false
	currentTarget: null
	defaultPrevented: false
	detail: 0
	eventPhase: 0
	keyCode: 65
	keyIdentifier: "U+0041"
	keyLocation: 0
	layerX: 0
	layerY: 0
	metaKey: false
	pageX: 0
	pageY: 0
	returnValue: true
	shiftKey: false
	srcElement: HTMLBodyElement
	target: HTMLBodyElement
	timeStamp: 1340130106664
	type: "keydown"
	view: Window
	which: 65
	__proto__: KeyboardEvent
	*/
};


// ================================================================================================================
// HOOKS interface ------------------------------------------------------------------------------------------------

document.addEventListener("onkeydown", FNK.KeyboardState.onKeyChanged);
document.addEventListener("onkeyup", FNK.KeyboardState.onKeyChanged);
document.addEventListener("keyup", FNK.KeyboardState.onKeyChanged, false);
document.addEventListener("keydown", FNK.KeyboardState.onKeyChanged, false);
