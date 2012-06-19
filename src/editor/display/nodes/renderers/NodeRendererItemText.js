// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNKEditor.NodeRendererItemText = function(__visualNode) {
	FNKEditor.NodeRendererItem.call(this, __visualNode);

	this.dataType = FNK.DataType.STRING;
};

FNKEditor.NodeRendererItemText.prototype = new FNKEditor.NodeRendererItem();
FNKEditor.NodeRendererItemText.prototype.constructor = FNK.NodeRendererItemText;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNKEditor.NodeRendererItemText.prototype.updateElementSize = function() {
	FNKEditor.NodeRendererItem.prototype.updateElementSize.call(this);
};

FNKEditor.NodeRendererItemText.prototype.updateContentValue = function() {
	FNKEditor.NodeRendererItem.prototype.updateContentValue.call(this);

	this.getContentElement().innerHTML = this.currentContent;
};

FNKEditor.NodeRendererItemText.prototype.dispose = function() {
	FNKEditor.NodeRendererItem.prototype.dispose.call(this);
};