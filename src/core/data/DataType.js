// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.DataType = function() {
	// No constructor
};

FNK.DataType.prototype = {};
FNK.DataType.prototype.constructor = FNK.DataType;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Constants
FNK.DataType.NUMBER = "Number";
FNK.DataType.STRING = "String";
FNK.DataType.COLOR = "Color";
//FNK.DataType.GRAPHIC = "Graphic"; // TODO: review this
//FNK.DataType.IMAGE = "Image"; // TODO: review this
//FNK.DataType.SOUND = "Sound"; // TODO: review this
//FNK.DataType.FILTER = "Filter"; // TODO: review this
FNK.DataType.NULL = "None";


// ================================================================================================================
// STATIC interface -----------------------------------------------------------------------------------------------

FNK.DataType.getDefaultValue = function(__type) {
	switch (__type) {
		case this.NUMBER:
			return 0;
		case this.STRING:
			return "";
		case this.COLOR:
			return 0;
//		case GRAPHIC:
//		case IMAGE:
//		case SOUND:
//		case FILTER:
		case this.NULL:
			return null;
	}
};

FNK.DataType.convertDataArray = function(__value, __fromType, __toType) {
	// Converts an entire array of data from one type to the other
	var newValue = [];
	for (var i = 0; i < __value.length; i++) {
		newValue[i] = this.convertData(__value[i], __fromType, __toType);
	}
	return newValue;
}

FNK.DataType.convertData = function(__value, __fromType, __toType) {
	// Converts one item of data from one type to the other
	var tempN;
	if (__fromType == __toType) {
		// Same type, no need for conversion
		return __value;
	} else {
		// Different types
		if (__fromType == DataType.STRING) {
			// From string...
			if (__toType == DataType.NUMBER || __toType == DataType.COLOR) {
				// ...to number
				tempN = parseFloat(String(__value));
				if (isNaN(tempN)) tempN = 0;
				return tempN;
			} else if (__toType == DataType.COLOR) {
				// ...to color
				tempN = parseFloat(String(__value));
				if (isNaN(tempN)) tempN = 0;
				return tempN;
			}
		} else if (__fromType == DataType.NUMBER || __fromType == DataType.COLOR) {
			// From number...
			if (__toType == DataType.STRING) {
				// ...to string
				return Number(__value).toString(10);
			}
		}
	}
		
	FNK.error("Undefined item type conversion: trying to convert [" + __value + "] from " + __fromType + " to " + __toType);
};

FNK.DataType.canSerialize = function(__dataType) {
	// Whether this data can be serialized (i.e. saved on the XML)
	return (__dataType == NUMBER || __dataType == STRING || __dataType == COLOR);
};

FNK.DataType.canEdit = function(__dataType) {
	// Whether it can be directly edited
	return (__dataType == NUMBER || __dataType == STRING);
};

FNK.DataType.shouldRemoveFromNode = function(__dataType) {
	// Whether some object should be de-linked from node upon removal
	return (__dataType == GRAPHIC || __dataType == IMAGE || __dataType == SOUND);
};

FNK.DataType.isNumberTrue = function(__value) {
	// Whether a number is bool true or false
	return __value >= 1;
};

FNK.DataType.serialize = function(__value, __fromType) {
	// Serializes an array, converting it to strings that can be saved
	if (canSave(__fromType)) {
		if (__fromType == DataType.STRING) {
			// TODO: this is ugly. redo this, need to escape semicolons
			for (var i = 0; i < __value.length; i++) {
				__value[i] = String(__value[i]).split(";").join(",");
			}
		}
		return convertDataArray(__value, __fromType, DataType.STRING).join(";");
	}
	return null;
};

FNK.DataType.deSerialize = function(__value, __toType) {
	// Deserializes an array, converting a string to an array
	if (canSave(__toType)) {
		return convertDataArray(__value.split(";"), DataType.STRING, __toType);
	}
	return [];
};

FNK.DataType.getTooltipText = function(__description, __value, __dataType) {
	// Based on a data type, get the tooltip string
	var txt = "";
	txt += __description + " (" + __dataType + "): "; 
	if (canSerialize(__dataType)) {
		txt += convertData(__value[0], __dataType, DataType.STRING);
	} else {
		txt += (Boolean(__value[0]) ? "[Object]": "[Null]");  
	}
	if (__value.length > 1) {
		txt += " [" + __value.length+" items]";
	}
	return txt;
};