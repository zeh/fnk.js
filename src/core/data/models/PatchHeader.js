// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.PatchHeader = function() {
	this.version = 0;
	this.title = "";
	this.description = "";
	this.authorCreated = "";
	this.authorModified = "";
	this.dateCreated = this.dateModified = this.getDateNow();
};

FNK.PatchHeader.prototype = {};
FNK.PatchHeader.prototype.constructor = FNK.PatchHeader;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNK.PatchHeader.prototype.getDateNow = function() {
	return (new Date().valueOf());
};


// ================================================================================================================
// PUBLIC interface -----------------------------------------------------------------------------------------------

FNK.PatchHeader.prototype.touch = function() {
	this.version++
	this.authorModified = ""; // TODO: add author data here
	this.dateModified = this.getDateNow();
};