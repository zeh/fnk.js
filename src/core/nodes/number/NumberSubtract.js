// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.NumberSubtract = function() {
	FNK.OperationNode.call(this);
};

FNK.NumberSubtract.prototype = new FNK.OperationNode();
FNK.NumberSubtract.prototype.constructor = FNK.NumberSubtract;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Static properties
FNK.NumberSubtract.prototype.description = "-";
FNK.NumberSubtract.prototype.categoryType = FNK.CategoryType.NUMBER;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.NumberSubtract.prototype.setInitialData = function() {
	FNK.OperationNode.prototype.setInitialData.call(this);

	//HelpXML = MyHelpXML;
	this.dataType = FNK.DataType.NUMBER;
};


// ================================================================================================================
// PROCESSING functions -------------------------------------------------------------------------------------------

FNK.NumberSubtract.prototype.processedInputs = function(__position) {
	var total = Number(this.inputConnectors.getConnectorAt(0).getValueAt(__position));
	for (var i = 1; i < this.inputConnectors.getNumConnectors(); i++) {
		total -= Number(this.inputConnectors.getConnectorAt(i).getValueAt(__position));
	}
	return total;
};