// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.OperationNode = function() {
	FNK.MultipleInputNode.call(this);
};

FNK.OperationNode.prototype = new FNK.MultipleInputNode();
FNK.OperationNode.prototype.constructor = FNK.OperationNode;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.IONode.prototype.setInitialData = function() {
	FNK.MultipleInputNode.prototype.setInitialData.call(this);
	
	this.numInputs = 2;
	this.numInputsMin = 2;
	this.numInputsMax = 10;
	this.dataType = "";
	this.anyDataType = false;
};

FNK.OperationNode.prototype.populateConnectors = function() {
	FNK.MultipleInputNode.prototype.populateConnectors.call(this);

	this.outputConnectors.addConnector(new FNK.Connector(this.dataType, "Output", FNK.Node.CONNECTOR_ID_OUTPUT, true, true));
};


// ================================================================================================================
// PROCESSING functions -------------------------------------------------------------------------------------------

FNK.OperationNode.prototype.innerProcess = function() {
	var i;
	var numItems = 0;
	for (i = 0; i < this.inputConnectors.getNumConnectors(); i++) {
		numItems = Math.max(numItems, this.inputConnectors.getConnectorAt(i).getNumItems());
	}
	var ga = [];
	for (i = 0; i < numItems; i++) {
		ga.push(this.processedInputs(i));
	}
	this.outputConnectors.getConnector(FNK.Node.CONNECTOR_ID_OUTPUT).setValue(ga, this.dataType);
};

FNK.OperationNode.prototype.processedInputs = function(__position) {
	return __position;
};