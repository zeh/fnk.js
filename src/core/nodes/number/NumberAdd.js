// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.NumberAdd = function() {
	FNK.OperationNode.call(this);
};

FNK.NumberAdd.prototype = new FNK.OperationNode();
FNK.NumberAdd.prototype.constructor = FNK.NumberAdd;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.NumberAdd.prototype.setInitialData = function() {
	FNK.OperationNode.prototype.setInitialData.call(this);

	//HelpXML = MyHelpXML;
	this.dataType = FNK.DataType.NUMBER;
	this.renderingCaption = "+";
	//this.categoryType = CategoryType.NUMBER;
	//this.selectingCaption = _renderingCaption + " ("+_categoryType+")";
	this.selectingCaption = this.renderingCaption + " (Number)";
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