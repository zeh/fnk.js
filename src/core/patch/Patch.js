// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNK.Patch = function() {
	this.nodes = [];					// [Node]
	this.links = [];					// [Link]

	this.lastProcessTime = 0;			// int (ms)
	this.currentTime = 0;				// int (ms)
	this.currentFrame = 0;				// int (frames)
};

FNK.Patch.prototype = {};
FNK.Patch.prototype.constructor = FNK.Patch;


// ================================================================================================================
// PUBLIC interface ---------------------------------------------------------------------------------------------

FNK.Patch.prototype.addNode = function(__node) {
	this.nodes.push(__node);
	__node.patch = this;
	//__node.addEventListener(NodeEvent.OUTPUT_CONNECTOR_VALUE_CHANGE, onNodeOutputConnectorChanged);
};

FNK.Patch.prototype.removeNode = function(__node) {
	var i = this.nodes.indexOf(__node);
	if (i > -1) {
		this.nodes.splice(i, 1);
		__node.patch = undefined;
		//__node.removeEventListener(NodeEvent.OUTPUT_CONNECTOR_VALUE_CHANGE, onNodeOutputConnectorChanged);
	}
};

FNK.Patch.prototype.addLink = function(__link) {
	this.links.push(__link);
};

FNK.Patch.prototype.removeLink = function(__link) {
	var i = this.links.indexOf(__link);
	if (i > -1) {
		this.links.splice(i, 1);
	}
};

FNK.Patch.prototype.process = function() {
	// Process the patch. This is where the magic happens

	this.currentTime = FNK.getTimer();
	this.currentFrame++;

	FNK.log("Processing patch; currentTime = " + this.currentTime + ", frame = " + this.currentFrame);

	var i, j;
	
	var canProcess; // Boolean
	var tNode; // Node
	
	// Starts a node cycle
	i = 0;
	var cycles = 0; // TODO: sanity check; remove this
	while (i < this.nodes.length && cycles < 100) {
		FNK.log("  Processing node " + i + "/" + this.nodes.length + ": " + this.nodes[i] + " (" + cycles + " cycles done so far)");

		cycles++;

		// Tries to process a given node

		tNode = this.nodes[i];

		canProcess = true;

		for (j = 0; j < this.links.length; j++) {
			// TODO: optimize this with a dictionary lookup for nodes -> links?
			if (this.links[j].outputNode == tNode && this.nodes.indexOf(this.links[j].inputNode) > i) {
				if (this.links[j].delayed) {
					if (this.links[j].needsOutputting) {
						FNK.log("Processing delayed link");
						this.links[j].doOutput();
					}
				} else {
					canProcess = false;
					break;
				}
			}
		}
		
		if (canProcess) {
			// Can process, do it and continue					
			// Process all related links first
			// TODO - onlyu process nodes that need processing? Because the events have been removed from the actionscript version, it's brute-forcing all updates
			for (j = 0; j < this.links.length; j++) {
				if (this.links[j].outputNode == tNode) {
					//FNK.log("      Processing input link " + i);
					this.links[j].process();
				}
			}

			tNode.process();
			
			i++;
		} else {
			// Can't process, move to end of list
			FNK.warn("    Cannot process node ["+i+"] ["+tNode+"] yet -- shouldn't be here, moving to end of list");
			cycles++;

			this.nodes.splice(i, 1);
			this.nodes.push(tNode);
		}
	}
	
//			Console.getInstance().echo("  Ended node cycle in " + (getTimer() - _lastProcessTime) + "ms");
	
	this.lastProcessTime = FNK.getTimer() - this.currentTime;

	FNK.log("Done; spent " + this.lastProcessTime + "ms processing the patch.");
	
	if (cycles >= 100) FNK.error("Error: timeout after "+cycles+" cycles");
};

FNK.Patch.prototype.isNodeConnected = function(__node, __connectorId, __connectorIsOutput) {
	for (var i = 0; i < this.links.length; i++) {
		if (__connectorIsOutput) {
			if (__connectorId == this.links[i].inputConnectorId && __node == this.links[i].inputNode) return true;
		} else {
			if (__connectorId == this.links[i].outputConnectorId && __node == this.links[i].outputNode) return true;
		}
	}
	return false;
};


// ================================================================================================================
// EVENT functions ------------------------------------------------------------------------------------------------

/*
protected function onNodeOutputConnectorChanged(e:NodeEvent): void {
	// TODO: optimize this with a dictionary lookup for nodes -> links?
	for (var i:Number = 0; i < links.length; i++) {
		if (links[i].inputNode == e.node && links[i].inputConnector == e.outputConnector) {
			links[i].process();
		}
	}
}
*/
