// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.MultipleInputNode = function() {
	this.numInputs = 2;
	this.numInputsMin = 2;
	this.numInputsMax = 10;
	this.dataType = "";
	this.anyDataType = false;
	
	FNK.Node.call(this);
};

FNK.MultipleInputNode.prototype = new FNK.Node();
FNK.MultipleInputNode.prototype.constructor = FNK.MultipleInputNode;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.MultipleInputNode.prototype.setInitialData = function() {
	FNK.Node.prototype.setInitialData.call(this);
	
	this.numInputs = 2;
	this.numInputsMin = 2;
	this.numInputsMax = 10;
};

FNK.MultipleInputNode.prototype.populateConnectors = function() {
	this.createInputConnectors();
};

FNK.MultipleInputNode.prototype.createInputConnectors = function() {
	var i;
	if (this.inputConnectors.getNumConnectors() > this.numInputs) {
		// Delete input connectors as needed
		for (i = 0; i < this.inputConnectors.getNumConnectors() - this.numInputs; i++) {
			this.inputConnectors.removeConnectorAt(this.inputConnectors.getNumConnectors() - 1);
		}
		// TODO: test if slice is correctly done
	} else if (this.inputConnectors.getNumConnectors() < this.numInputs) {
		// Create input connectors as needed
		for (i = this.inputConnectors.getNumConnectors(); i < this.numInputs; i++) {
			this.inputConnectors.addConnector(new FNK.Connector(this.dataType, "Input " + (i+1), FNK.Node.CONNECTOR_ID_INPUT + FNK.Node.CONNECTOR_ID_SEPARATOR + i, true, false, this.anyDataType));
			// TODO: connector name must come from localized string
		}
	}
};