// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.NumberIONode = function() {
	FNK.IONode.call(this);
};

FNK.NumberIONode.prototype = new FNK.IONode();
FNK.NumberIONode.prototype.constructor = FNK.NumberIONode;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Static properties
FNK.NumberIONode.prototype.description = "IO";
FNK.NumberIONode.prototype.categoryType = FNK.CategoryType.NUMBER;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.NumberIONode.prototype.setInitialData = function() {
	FNK.IONode.prototype.setInitialData.call(this);

	this.dataType = FNK.DataType.NUMBER;
};