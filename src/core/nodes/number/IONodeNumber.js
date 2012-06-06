// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.IONodeNumber = function() {
	FNK.log("IONodeNumber()");

	FNK.IONode.call(this);
};

FNK.IONodeNumber.prototype = new FNK.IONode();
FNK.IONodeNumber.prototype.constructor = FNK.IONodeNumber;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.IONodeNumber.prototype.setInitialData = function() {
	FNK.log("IONodeNumber :: setInitialData()");
	
	FNK.IONode.prototype.setInitialData.call(this);

	this.dataType = FNK.DataType.NUMBER;
	//categoryType = CategoryType.NUMBER;
	//selectingCaption = "IO Box ("+_categoryType+")";
	this.selectingCaption = "IO Box (Number)";
};