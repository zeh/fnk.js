package org.ffnnkk.core.nodes {
	import org.ffnnkk.core.data.Connector;
	import org.ffnnkk.core.nodes.Node;	

	/**
	 * @author zeh
	 * A node that performs similar operations from one or more inputs, and outputs a single value.
	 */
	public class OperationNode extends MultipleInputNode {

		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		public function OperationNode() {
			super();
		}


		// ================================================================================================================
		// INITIALIZATION/DATA functions ----------------------------------------------------------------------------------

		override protected function setInitialData(): void {
			super.setInitialData();
		}

		override protected function populateConnectors() : void {
			super.populateConnectors();
			outputConnectors.addConnector(new Connector(dataType, "Output", CONNECTOR_ID_OUTPUT, true, true));
		}

		// ================================================================================================================
		// PROCESSING functions -------------------------------------------------------------------------------------------

		override protected function innerProcess() : void {
			var i:uint;
			var numItems:uint = 0;
			for (i = 0; i < inputConnectors.numConnectors; i++) {
				numItems = Math.max(numItems, inputConnectors.getConnectorAt(i).numItems);
			}
			var ga:Array = [];
			for (i = 0; i < numItems; i++) {
				ga.push(processedInputs(i));
			}
			outputConnectors.getConnector(CONNECTOR_ID_OUTPUT).setValue(ga, dataType);
		}
		
		protected function processedInputs(__index:uint): * {
			return __index;
		}
	}
}


// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.Node = function() {
	setInitialData();
	createParameters();
	populateParameters();
	createConnectors();
	populateConnectors();
};

// ================================================================================================================
// PROPERTIES -----------------------------------------------------------------------------------------------------

// Static constants
FNK.Node.CONNECTOR_ID_INPUT = "input";
FNK.Node.CONNECTOR_ID_OUTPUT = "output";
FNK.Node.CONNECTOR_ID_SEPARATOR = "-";

// Static properties for rendering purposes
//		public var renderingClass:Class;

FNK.Node.prototype.renderingCaption = "null";			// What's displayed on the node								"+"
FNK.Node.prototype.categoryType = "";					// Node category type (NOT the same as data type)			"Number"
FNK.Node.prototype.selectingCaption = "";				// What's the display name of the node, for selection		"+ (Number)"
		
// Instance properties
FNK.Node.prototype.alwaysProcess = false;				// Whether it should always execute on every frame
FNK.Node.prototype.patch = undefined;					// Patch where this node is in
FNK.Node.prototype.needsProcess = true;					// Whether it needs processing (because something has changed and its result is dirty)

FNK.Node.prototype.inputConnectors = undefined;
FNK.Node.prototype.outputConnectors = undefined;
FNK.Node.prototype.parameters = undefined;
		
		
//		protected var HelpXML:Class;

// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.Node.prototype.setInitialData = function() {
	//renderingClass = VisibleNode;
	//categoryType = CategoryType.SYSTEM;
	//selectingCaption = renderingCaption + " ("+categoryType+")";
};

FNK.Node.prototype.createConnectors = function() {
	// Create lists of connectors
	inputConnectors = new FNK.ConnectorList();
	outputConnectors = new FNK.ConnectorList();
};

FNK.Node.prototype.populateConnectors = function() {
	// Actually populate the connector list with the expected connectors
	
};

FNK.Node.prototype.createParameters = function() {
	// Create list of parameters
	parameters = new FNK.ConnectorList();
};

FNK.Node.prototype.populateParameters = function() {
	// Actually populate the parameter list with the expected parameters
};


// ================================================================================================================
// PUBLIC interface -----------------------------------------------------------------------------------------------

FNK.Node.prototype.getConnector = function(__id, __isOutput) {
	return (__isOutput ? outputConnectors : inputConnectors).getConnector(__id);
};

FNK.Node.prototype.getConnectorAt = function(__index, __isOutput) {
	return (__isOutput ? outputConnectors : inputConnectors).getConnectorAt(__index);
};

FNK.Node.prototypedispose = function() {
	//dispatchEvent(new NodeEvent(NodeEvent.DISPOSE, this));
	patch = undefined;
	renderingClass = undefined;
	inputConnectors = undefined;
	outputConnectors = undefined;
};


// ================================================================================================================
// PROCESSING interface -------------------------------------------------------------------------------------------

FNK.Node.prototype.process = function() {
	if (alwaysProcess || inputConnectors.hasChangedAny || needsProcess) {
		// Actual processing
		innerProcess();
		dispatchValueChanges();
		resetChangeFlags();
	}
};

FNK.Node.prototype.innerProcess = function() {
	// Process the node, using the input and creating the output
};

FNK.Node.prototype.resetChangeFlags = function() {
	needsProcess = false;
	inputConnectors.resetChangeFlag();
	outputConnectors.resetChangeFlag();
};

FNK.Node.prototype.dispatchValueChanges = function() {
	dispatchChange();

	var i;
	var cn;
	for (i = 0; i < outputConnectors.numConnectors; i++) {
		cn = outputConnectors.getConnectorAt(i); 
		if (alwaysProcess || cn.hasChanged) {
			//dispatchEvent(new NodeEvent(NodeEvent.OUTPUT_CONNECTOR_VALUE_CHANGE, this, cn.id));
		}
	}
};

FNK.Node.prototype.dispatchChange = function() {
	//dispatchEvent(new NodeEvent(NodeEvent.VALUE_CHANGE, this));
};


// ================================================================================================================
// GENERIC interface ----------------------------------------------------------------------------------------------

FNK.Node.prototype.toString = function() {
	//return "[" + getQualifiedClassName(this) + "]";
	return "[" + this.renderingCaption + "]";
};


/*
// TODO: remove this? expose connectors?
public function get numInputConnectors(): uint {
	return inputConnectors.numConnectors;
}

public function get numOutputConnectors(): uint {
	return outputConnectors.numConnectors;
}

public function get hasHelpPatch(): Boolean {
	return Boolean(HelpXML);
}

public function get helpPatchSource(): XML {
	if (hasHelpPatch) {
		var patchXML:XML = XML(new HelpXML());
		return patchXML;
	}
	return null;
}
*/
