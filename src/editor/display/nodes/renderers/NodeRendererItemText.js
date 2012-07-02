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

	// TODO: this can be an array... must create more items?
	if (this.currentContent == undefined) {
		// No content at all
		this.getContentElement().innerHTML = "[null]";
	} else if (this.currentContent.length == 0) {
		// No items
		this.getContentElement().innerHTML = "[empty]";
	} else if (this.currentContent.length > 1) {
		// Several items
		this.getContentElement().innerHTML = this.currentContent[0] + " (+)";
	} else {
		// One item
		this.getContentElement().innerHTML = this.currentContent[0];
	}
};

FNKEditor.NodeRendererItemText.prototype.dispose = function() {
	FNKEditor.NodeRendererItem.prototype.dispose.call(this);
};