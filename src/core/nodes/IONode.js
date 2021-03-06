// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.IONode = function() {
	FNK.Node.call(this);
};

FNK.IONode.prototype = new FNK.Node();
FNK.IONode.prototype.constructor = FNK.IONode;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.IONode.prototype.setInitialData = function() {
	FNK.Node.prototype.setInitialData.call(this);
	
	//renderingClass = VisibleListNode;

	this.dataType = "";		// String
};

FNK.IONode.prototype.populateConnectors = function() {
	// Actually populate the connector list with the expected connectors
	this.inputConnectors.addConnector(new FNK.Connector(this.dataType, "Input", FNK.Node.CONNECTOR_ID_INPUT));
	this.outputConnectors.addConnector(new FNK.Connector(this.dataType, "Output", FNK.Node.CONNECTOR_ID_OUTPUT, true, true));
};


// ================================================================================================================
// PROCESSING interface -------------------------------------------------------------------------------------------

FNK.IONode.prototype.innerProcess = function() {
	// Process the node, using the input and creating the output
	// TODO: setting the value like this is wrong
	this.outputConnectors.getConnector(FNK.Node.CONNECTOR_ID_OUTPUT).setValue(this.inputConnectors.getConnector(FNK.Node.CONNECTOR_ID_INPUT).getValue(), this.dataType);

	// Update display description
	this.setDescription(this.inputConnectors.getConnector(FNK.Node.CONNECTOR_ID_INPUT).getValue());
};


// ================================================================================================================
// GENERIC interface ----------------------------------------------------------------------------------------------

// ================================================================================================================
// ADDITIONAL interface -------------------------------------------------------------------------------------------

/*
public function getValue(): Array {
	var outputConnector:Connector = outputConnectors.getConnector(CONNECTOR_ID_OUTPUT);
	return outputConnector.getValue();
}

public function getType(): String {
	return dataType;
}

public function getValueAt(__index:uint):* {
	var outputConnector:Connector = outputConnectors.getConnector(CONNECTOR_ID_OUTPUT);
	return outputConnector.getValueAt(__index);
}

public function setValueAt(__index:uint, __value:*, __fromType:String):void {
	var inputConnector:Connector = inputConnectors.getConnector(CONNECTOR_ID_INPUT);
	inputConnector.setValueAt(__index, __value, __fromType);
}

public function getAdditionalParameters():Array {
	return [];
}
*/

// ================================================================================================================
// GENERIC interface ----------------------------------------------------------------------------------------------

//FNK.IONode.prototype.getContentDescription = function() {
//	// Returns a description of the content it holds
//	return this.containedValue;
//};
