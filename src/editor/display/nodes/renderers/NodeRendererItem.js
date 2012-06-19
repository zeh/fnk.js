// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNKEditor.NodeRendererItem = function(__visualNode) {
	this.width = 0;
	this.height = 0;

	this.dataType = undefined;
	this.currentContent = undefined;

	this.visualNode = __visualNode;
};

FNKEditor.NodeRendererItem.prototype = {};
FNKEditor.NodeRendererItem.prototype.constructor = FNK.NodeRendererItem;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNKEditor.NodeRendererItem.prototype.setContent = function (__content, __fromType) {
	var newContent = FNK.DataType.convertData(__content, __fromType, this.dataType);
	if (newContent != this.currentContent) this.currentContent = newContent;
	this.updateContentValue();
};

FNKEditor.NodeRendererItem.prototype.getContent = function (__toType) {
	return FNK.DataType.convertData(this.currentContent, this.dataType, __toType);
};

FNKEditor.NodeRendererItem.prototype.setSize = function(__width, __height) {
	this.width = FNK.MathUtils.clamp(__width, 0, 4000);
	this.height = FNK.MathUtils.clamp(__height, 0, 4000);
	this.updateElementSize();
};

FNKEditor.NodeRendererItem.prototype.setAdditionalParameters = function(__items) { // Array
};

FNKEditor.NodeRendererItem.prototype.updateElementSize = function() {
	this.getContentElement().style.width = this.width + "px";
	this.getContentElement().style.height = this.height + "px";
};

FNKEditor.NodeRendererItem.prototype.getContentElement = function() {
	return this.visualNode.getContentElement();
};

FNKEditor.NodeRendererItem.prototype.updateContentValue = function() {
	
};

FNKEditor.NodeRendererItem.prototype.dispose = function() {
};

/*
// ================================================================================================================
// ACCESSOR functions ---------------------------------------------------------------------------------------------

override public function get width():Number {
	return _width;
}
override public function set width(__value:Number):void {
	_width = __value;
	setSize(__value, _height);
}

override public function get height():Number {
	return _height;
}
override public function set height(__value:Number):void {
	_height = __value;
	setSize(_width, __value);
}

public function get dataType():String {
	return _dataType;
}

*/