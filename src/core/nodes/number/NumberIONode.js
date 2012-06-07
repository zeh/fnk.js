// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.NumberIONode = function() {
	FNK.IONode.call(this);
};

FNK.NumberIONode.prototype = new FNK.IONode();
FNK.NumberIONode.prototype.constructor = FNK.NumberIONode;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.NumberIONode.prototype.setInitialData = function() {
	FNK.IONode.prototype.setInitialData.call(this);

	this.dataType = FNK.DataType.NUMBER;
	//categoryType = CategoryType.NUMBER;
	//selectingCaption = "IO Box ("+_categoryType+")";
	this.selectingCaption = "IO Box (Number)";
};