// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.ConnectorList = function() {
	this.connectors = {};
	this.ids = [];								// Strings
};

FNK.ConnectorList.prototype = {};
FNK.ConnectorList.prototype.constructor = FNK.ConnectorList;

// ================================================================================================================
// PUBLIC interface ---------------------------------------------------------------------------------------------

FNK.ConnectorList.prototype.addConnector = function(__connector, __value) {
	// Connector:Connector, __value:Array (can be null)
	this.addConnectorAt(this.ids.length, __connector, __value);
};

FNK.ConnectorList.prototype.addConnectorAfter = function(__id, __connector, __value) {
	var i = this.getConnectorPosition(__id);
	if (i < 0) i = this.ids.length-1;
	this.addConnectorAt(i+1, __connector, __value);
};

FNK.ConnectorList.prototype.addConnectorAt = function(__position, __connector, __value) {
	this.ids.splice(__position, 0, __connector.id);
	if (Boolean(__value)) {
		__connector.setValue(__value, __connector.dataType);
	}
	this.connectors[__connector.id] = __connector;
};

FNK.ConnectorList.prototype.removeConnector = function(__id) {
	var i = this.getConnectorPosition(__id);
	if (i > -1) this.removeConnectorAt(i);
};

FNK.ConnectorList.prototype.removeConnectorAt = function(__position) {
	var id = ids[__position];
	this.ids.splice(__position, 1);
	delete this.connectors[id];
};

FNK.ConnectorList.prototype.getConnectorAt = function(__position) {
	return this.connectors[this.ids[__position]];
};

FNK.ConnectorList.prototype.getConnectorPosition = function(__id) {
	return this.ids.indexOf(__id);
};

FNK.ConnectorList.prototype.getConnectorId = function(__position) {
	return this.ids[__position];
};

FNK.ConnectorList.prototype.getConnector = function(__id) {
	return this.connectors[__id];
};

FNK.ConnectorList.prototype.resetChangeFlag = function() {
	for (var id in this.connectors) {
		this.connectors[id].resetChangeFlag();
	}
};


// ================================================================================================================
// ACCESSOR functions ---------------------------------------------------------------------------------------------

FNK.ConnectorList.prototype.getNumConnectors = function() {
	return this.ids.length;
};

FNK.ConnectorList.prototype.getHasChangedAny = function() {
	for (var id in this.connectors) {
		if (this.connectors[id].hasChanged) return true;
	}
	return false;
};