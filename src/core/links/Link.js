// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.Link = function() {
	this.inputNode = undefined;			// Node
	this.inputConnectorId = "";			// String
	
	this.outputNode = undefined;		// Node
	this.outputConnectorId = "";		// String

	this.delayed = false;				// Boolean

	this.previousValue = undefined;		// Array
	this.needsOutputting = false;		// Boolean
};

FNK.Link.prototype = {};
FNK.Link.prototype.constructor = FNK.Link;


// ================================================================================================================
// PROCESSING interface ---------------------------------------------------------------------------------------------

FNK.Link.prototype.process = function() {
	//FNK.log("Processing link: inputNode = " + this.inputNode + ":" + this.inputConnectorId + " --> " + this.outputNode + ":" + this.outputConnectorId);
	if (!this.delayed) {
		this.outputNode.getInputConnector(this.outputConnectorId).setValue(this.inputNode.getOutputConnector(this.inputConnectorId).getValue(), this.inputNode.getOutputConnector(this.inputConnectorId).dataType);
		//this.outputNode.setInputValue(this.outputConnectorId, this.inputNode.getOutputValue(this.inputConnectorId), this.inputNode.getOutputType(this.inputConnectorId));
		this.needsOutputting = false;
	} else {
		if (this.needsOutputting) this.doOutput();
		// TODO: SPECIAL CASE for bitmaps - fix this?
		/*
		if (inputNode.getOutputType(this.inputConnectorId) == DataType.IMAGE) {
			previousValue = [];
			var prevValues:Array = inputNode.getOutputValue(this.inputConnectorId);
			var i:uint;
			var newBmp:BitmapData;
			var oldBmp:BitmapData;
			//var np:Point = new Point(0,0);
			for (i = 0; i < prevValues.length; i++) {
				oldBmp = BitmapData(prevValues[i]);
				newBmp = oldBmp.clone();
				//newBmp = new BitmapData(oldBmp.width, oldBmp.height, true, 0x00000000);
				//newBmp.copyPixels(oldBmp, newBmp.rect, np);
				previousValue.push(newBmp);
			}
			oldBmp = null;
			newBmp = null;
		} else {
			// Normal
			previousValue = inputNode.getOutputValue(this.inputConnectorId);
		}
		*/
		this.previousValue = this.inputNode.getOutputValue(this.inputConnectorId);
		this.needsOutputting = true;
		// TODO: deep copy instead? 
	}
};

FNK.Link.prototype.doOutput = function() {
	this.needsOutputting = false;
	this.outputNode.setInputValue(this.outputConnectorId, this.previousValue, this.inputNode.getOutputType(this.inputConnectorId));
};

FNK.Link.prototype.dispose = function() {
	//dispatchEvent(new LinkEvent(LinkEvent.DISPOSE, this));
	// TODO: SPECIAL CASE for bitmaps - fix this?
	/*
	if (this.inputNode.getConnector(this.inputConnectorId, true).dataType == FNK.DataType.IMAGE && Boolean(previousValue)) {
		for (var i:uint = 0; i < previousValue.length; i++) {
			BitmapData(previousValue[i]).dispose();
		}
	}
	*/
	this.previousValue = null;
	this.inputNode = null;
	this.outputNode = null;
};

// ================================================================================================================
// PUBLIC interface -----------------------------------------------------------------------------------------------

FNK.Link.prototype.setInputNode = function(__node, __connectorId) {
	this.inputNode = __node;
	this.inputConnectorId = __connectorId;
};

FNK.Link.prototype.setOutputNode = function(__node, __connectorId) {
	this.outputNode = __node;
	this.outputConnectorId = __connectorId;
};