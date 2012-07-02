// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.NumberAdd = function() {
	FNK.OperationNode.call(this);
};

FNK.NumberAdd.prototype = new FNK.OperationNode();
FNK.NumberAdd.prototype.constructor = FNK.NumberAdd;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Static properties
FNK.NumberAdd.prototype.description = ["+"];
FNK.NumberAdd.prototype.categoryType = FNK.CategoryType.NUMBER;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.NumberAdd.prototype.setInitialData = function() {
	FNK.OperationNode.prototype.setInitialData.call(this);

	//HelpXML = MyHelpXML;
	this.dataType = FNK.DataType.NUMBER;
};


// ================================================================================================================
// PROCESSING functions -------------------------------------------------------------------------------------------

FNK.NumberAdd.prototype.processedInputs = function(__position) {
	var total = Number(this.inputConnectors.getConnectorAt(0).getValueAt(__position));
	for (var i = 1; i < this.inputConnectors.getNumConnectors(); i++) {
		total += Number(this.inputConnectors.getConnectorAt(i).getValueAt(__position));
	}
	return total;
};