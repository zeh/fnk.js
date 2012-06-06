// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.Connector = function(__dataType, __description, __id, __allowsArray, __allowsMultipleOutputs, __allowAnyDataType) {
	// TODO:localization: default connector description
	this.dataType = __dataType;									// String
	this.anyDataType = __allowAnyDataType;						// Default false
	this.description = __description; 							// String
	this.id = __id;												// String
	this.allowsArray = __allowsArray;							// Default true
	this.allowsMultipleOutputs = __allowsMultipleOutputs;		// Default false
	this.value = [FNK.DataType.getDefaultValue(this.dataType)];
	this.hasChanged = true;
};

FNK.Connector.prototype = {};
FNK.Connector.prototype.constructor = FNK.Connector;

// ================================================================================================================
// PUBLIC interface ---------------------------------------------------------------------------------------------

FNK.Connector.prototype.resetChangeFlag = function() {
	// Marks this connector's values as not changed
	_hasChanged = false;
};

FNK.Connector.prototype.setValue = function(__value, __fromType) {
	// Set the value of this connector to a new array of a specific type
	if (this.anyDataType) {
		this.value = __value.slice(0); // Duplicated array
		this.dataType = __fromType;
	} else {
		this.value = FNK.DataType.convertDataArray(__value, __fromType, this.dataType);
	}
	this.hasChanged = true;
};

FNK.Connector.prototype.setValueAt = function(__position, __value, __fromType) {
	// Set the value at a particular position
	this.value[__position] = DataType.convertData(__value, __fromType, this.dataType);
	this.hasChanged = true;
};

FNK.Connector.prototype.getValue = function() {
	// Return the array of values
	return this.value.slice(0);
};

FNK.Connector.prototype.getValueAt = function(__position) {
	return this.value[__position % this.value.length];
};
