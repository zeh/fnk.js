// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNKEditor.PatchViewer = function() {

	this.patch = null;			// TYPE: FNK.patch.Patch;
	this.header = null;		// TYPE: FNK.data.models.PatchHeader

	this.visibleNodes = [];			// TYPE: [VisibleNode]
	this.visibleLinks = [];			// TYPE: [VisibleLink]
	this.visibleComments = [];		// TYPE: [VisibleComment]

	this.paused = false;			// TYPE: Boolean

	this.element = null;

	this.selectedVisibleNodes = [];
	this.selectedVisibleLinks = [];
	this.selectedVisibleComments = [];

	this.lastNodeLevel = 0;
	this.lastLinkLevel = 0;
	this.lastCommentLevel = 0;

	this.resetSelection(); // Same as above...

	/*
	protected var _scrollX:Number;
	protected var _scrollY:Number;
	
	protected var minScrollX:Number;
	protected var maxScrollX:Number;
	protected var minScrollY:Number;
	protected var maxScrollY:Number;
	*/

	this.linkContainer = null;
	this.nodeContainer = null;
	this.commentContainer = null;
	
	this.width = 100;					// TYPE: int
	this.height = 100;					// TYPE: int

	this.lastMousePosition = null;
	this.isMovingSelection = false;

	
	/*
	protected var _frameRate:Number;
	
	protected var timer:Timer;
	
	
	// Instances
	_frameRate = 30;
	*/

	this.reset();

	// Create stuff
	this.createElement();

	// Final visual update
	this.updateElementPosition();
	this.updateElementSize();

	/*	
	loadConfig();
	Config.addEventListener(Event.CHANGE, onConfigChange);

	timer = new Timer(1000/_frameRate);
	timer.addEventListener(TimerEvent.TIMER, processPatch);
	processPatch();
	resume(true);
	*/
};

FNKEditor.PatchViewer.prototype = {};
FNKEditor.PatchViewer.prototype.constructor = FNKEditor.PatchViewer;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Constants
FNKEditor.PatchViewer.CANVAS_MARGIN = 1000;
FNKEditor.PatchViewer.NODE_MARGIN = 20;

// Static properties
//FNKEditor.PatchViewer.prototype.description = "null";
//FNKEditor.PatchViewer.prototype.categoryType = FNK.CategoryType.OTHER;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNKEditor.PatchViewer.prototype.createElement = function () {
	// Creates the element container

	// Create document element
	this.element = document.createElement("div");
	this.element.className = "fnk-viewer";

	document.body.appendChild(this.element);

	this.commentContainer = document.createElement("div");
	this.element.appendChild(this.commentContainer);

	this.linkContainer = document.createElement("div");
	this.element.appendChild(this.linkContainer);

	this.nodeContainer = document.createElement("div");
	this.element.appendChild(this.nodeContainer);
};

FNKEditor.PatchViewer.prototype.reset = function() {
	// Removes everything from this patch view
	// TODO: remove existing nodes/patches if needed

	this.visibleNodes = [];
	this.visibleLinks = [];
	this.visibleComments = [];
	
	// Create patch
	this.patch = new FNK.Patch();
	this.header = new FNK.PatchHeader();
	
	//setScroll(0, 0);
};

FNKEditor.PatchViewer.prototype.updateElementPosition = function() {
	this.element.style.left = this.x + "px";
	this.element.style.top = this.y + "px";
};

FNKEditor.PatchViewer.prototype.updateElementSize = function() {
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
};


/*

protected function redrawBackground(): void {
	background.graphics.clear();
	background.graphics.lineStyle();
	background.graphics.beginFill(0xf2f2f2, 1);
	//background.graphics.beginFill(0xffffff, 1);
	background.graphics.drawRect(-0.5, -0.5, Math.ceil(_width)+0.5, Math.ceil(_height)+0.5); // TODO: this is a bit crappy because it's extending the background into other territory.. but it's need for the mouse to work on the first pixel column  
	background.graphics.endFill();
}

protected function getVisibleNodeIdFromNode(__node:Node): Number {
	// TODO: this lookup must be faster.. use dictionary? moving just one node makes things really slower			
	for (var i:uint = 0; i < visibleNodes.length; i++) {
		if (visibleNodes[i].node == __node) {
			return i;
		}
	}
	return NaN;
}

protected function getVisibleNodeFromNode(__node:Node): VisibleNode {
	// TODO: this lookup must be faster.. use dictionary? moving just one node makes things really slower
//			var i:Number = getVisibleNodeIdFromNode(__node);
//			return isNaN(i) ? null : visibleNodes[i];
	for (var i:uint = 0; i < visibleNodes.length; i++) {
		if (visibleNodes[i].node == __node) {
			return visibleNodes[i];
		}
	}
	return null;
}

protected function createVisibleNode(__class:String): VisibleNode {
	//var nodeClass:Class = Class(getDefinitionByName(__class));
	//var newNode:Node = new nodeClass();
	var newNode:Node = NodeList.createNode(__class);
	
	if (Boolean(newNode)) {
		var visibleNodeClass:Class = Class(newNode.renderingClass);
		var newVisibleNode:VisibleNode = new visibleNodeClass(newNode);

		return newVisibleNode;
	} else {
		Logger.getInstance().addMessage("Error: tried creating a node with undefined class ["+__class+"]", LogMessage.TYPE_ERROR, this);
	}
	
	return null;

}

protected function getSpecificSource(__nodes:Vector.<int>, __links:Vector.<int>, __texts:Vector.<int>): XML {
	var i:Number;
	
	// Main wrapper and header
	var src:XML = getHeaderSource();
	
	// Nodes			
	for (i = 0; i < __nodes.length; i++) {
		src.appendChild(getVisibleNodeSource(__nodes[i]));
	}
	
	// Links
	for (i = 0; i < __links.length; i++) {
		src.appendChild(getVisibleLinkSource(__links[i]));
	}

	// Comments
	for (i = 0; i < __texts.length; i++) {
		src.appendChild(getVisibleCommentSource(__texts[i]));
	}

	return src;
}

protected function getHeaderSource(): XML {
	var p:XML = XML('<patch title="' + header.title + '" description="' + header.description + '" author-created="' + header.authorCreated + '" date-created="' + header.dateCreated + '" author-modified="' + header.authorModified + '" date-modified="' + header.dateModified + '" version="' + header.version + '" />');
	return p;
}

protected function getVisibleNodeSource(__index:Number): XML {
	// Gets the source for one specific visible node
	
	var vnode:VisibleNode = visibleNodes[__index];

	var nodeClassName:String;
	nodeClassName = getQualifiedClassName(vnode.node).split("::").join(".");

	var nodeXML:XML = <node id={__index}/>;
	nodeXML.appendChild(<class>{nodeClassName}</class>);
	nodeXML.appendChild(<left>{vnode.x}</left>);
	nodeXML.appendChild(<top>{vnode.y}</top>);
	nodeXML.appendChild(<width>{vnode.width}</width>);
	nodeXML.appendChild(<height>{vnode.height}</height>);
		
	var connectors:XML = <connectors/>;
	var connectorId:String;
	var connector:Connector;
	var connectorValue:String;

	for (var i:Number = 0; i < vnode.node.numInputConnectors; i++) {
		connectorId = vnode.node.getConnectorId(i);
		connector = vnode.node.getConnector(connectorId);
		if (DataType.canSave(connector.dataType)) {
			connectorValue = StringUtils.CDATA(DataType.serialize(connector.getValue(), connector.dataType));
			connectors.appendChild(new XML("<connector id=\"" + connectorId + "\">" + connectorValue + "</connector>"));
		}
	}
		
	nodeXML.appendChild(connectors);
	
	return nodeXML;
}

protected function getVisibleLinkSource(__index:Number): XML {
	// Gets the source for one specific visible link
	
	var vlink:VisibleLink = visibleLinks[__index];
	
	var nodeNum:Number;
	var connectorId:String;

	// Container
	var linkXML:XML = <link/>;

	// Delayed, if true
	if (vlink.link.delayed) linkXML.appendChild(<delayed>true</delayed>);
	
	// Line type
	var vtype:String = vlink.type;
	if (Boolean(vtype)) linkXML.appendChild(<type>{vtype}</type>);
	
	// Line parameters, if any
	var params:String = vlink.getLineProperties();
	if (Boolean(params)) linkXML.appendChild(<points>{params}</points>);

	// Input nodes
	var linkInput:XML = <input/>;

	nodeNum = getVisibleNodeIdFromNode(vlink.link.inputNode);
	linkInput.appendChild(<node>{nodeNum}</node>);

	connectorId = vlink.link.inputConnector;
	linkInput.appendChild(<connector>{connectorId}</connector>);

	linkXML.appendChild(linkInput);

	// Output nodes
	var linkOutput:XML = <output/>;

	nodeNum = getVisibleNodeIdFromNode(vlink.link.outputNode);
	linkOutput.appendChild(<node>{nodeNum}</node>);

	connectorId = vlink.link.outputConnector;
	linkOutput.appendChild(<connector>{connectorId}</connector>);

	linkXML.appendChild(linkOutput);

	return linkXML;
}

protected function getVisibleCommentSource(__index:Number): XML {
	// Gets the source for one specific text comment
	
	var ta:VisibleComment = visibleComments[__index];

	var textXML:XML = <comment/>;
	textXML.appendChild(new XML("<text>" + StringUtils.CDATA(ta.value) + "</text>"));
	textXML.appendChild(<left>{ta.x}</left>);
	textXML.appendChild(<top>{ta.y}</top>);
	if (!isNaN(ta.defaultWidth)) textXML.appendChild(<width>{ta.defaultWidth}</width>);
	textXML.appendChild(<font-size>{ta.textSize}</font-size>);
		
	return textXML;
}
*/

FNKEditor.PatchViewer.prototype.addVisibleNode = function(__visibleNode) {
	this.patch.addNode(__visibleNode.node);
	this.visibleNodes.push(__visibleNode);

	this.nodeContainer.appendChild(__visibleNode.getElement());
	this.bringNodeToFront(__visibleNode);

	__visibleNode.startMovingSignal.add(this.onVisibleNodeShouldStartMoving, this, [__visibleNode]);

	//__visibleNode.addEventListener(VisibleNodeEvent.MOVE, onVisibleNodeMove);
	//__visibleNode.addEventListener(VisibleNodeEvent.RESIZE, onVisibleNodeMove);
};

/*
protected function removeVisibleNode(__visibleNode:VisibleNode): void {
	var i:Number = visibleNodes.indexOf(__visibleNode);
	var j:Number;
	if (i > -1) {
		patch.removeNode(__visibleNode.node);
		visibleNodes.splice(i, 1);
		nodeContainer.removeChild(__visibleNode);
		__visibleNode.removeEventListener(VisibleNodeEvent.MOVE, onVisibleNodeMove);
		__visibleNode.removeEventListener(VisibleNodeEvent.RESIZE, onVisibleNodeMove);
		
		var linksToDelete:Vector.<VisibleLink> = new Vector.<VisibleLink>();

		for (j = 0; j < visibleLinks.length; j++) {
			if (visibleLinks[j].link.outputNode == __visibleNode.node || visibleLinks[j].link.inputNode == __visibleNode.node) {
				linksToDelete.push(visibleLinks[j]);
			}
		}
		
		for (j = 0; j < linksToDelete.length; j++) {
			removeVisibleLink(linksToDelete[j]);
		}
		
		__visibleNode.dispose();
		
	}
}

protected function addVisibleLink(__visibleLink:VisibleLink): void {
	visibleLinks.push(__visibleLink);
	linkContainer.addChild(__visibleLink);
	if (Boolean(__visibleLink.link)) {
		redrawVisibleLink(__visibleLink);
		
		// TODO: creation of visible link must be dependent on successfull creation of link
		// The way it's set now, am invalid link sets connectors as highlighted as if they were linked when
		// opening a patch with an invalid link
	
		// Setup connectors
		var vn:VisibleNode;
		
		// Link input
		vn = visibleNodes[getVisibleNodeIdFromNode(__visibleLink.link.inputNode)];
		if (Boolean(vn)) {
			vn.setConnectorStateLinked(true, __visibleLink.link.inputConnector, true);
		}
		
		// Link output
		vn = visibleNodes[getVisibleNodeIdFromNode(__visibleLink.link.outputNode)];
		if (Boolean(vn)) {
			vn.setConnectorStateLinked(true, __visibleLink.link.outputConnector);
		}
	}
}

protected function removeVisibleLink(__visibleLink:VisibleLink): void {
	var i:Number = visibleLinks.indexOf(__visibleLink);
	var ic:Connector;
	if (i > -1) {

		visibleLinks.splice(i, 1);
		linkContainer.removeChild(__visibleLink);
		
		if (Boolean(__visibleLink.link)) { 
			patch.removeLink(__visibleLink.link);

			// Setup connectors
			var vn:VisibleNode;
			var j:Number;
			
			// Link input
			j = getVisibleNodeIdFromNode(__visibleLink.link.inputNode);
			if (!isNaN(j)) {
				vn = visibleNodes[j];
				if (Boolean(vn)) {
					vn.setConnectorStateLinked(isNodeConnected(vn, __visibleLink.link.inputConnector, true), __visibleLink.link.inputConnector, true);
					// TODO: make this a more generic catch-all function?
				}
			}
			
			// Link output
			j = getVisibleNodeIdFromNode(__visibleLink.link.outputNode);
			if (!isNaN(j)) {
				vn = visibleNodes[j];
				if (Boolean(vn)) {
					if (DataType.shouldRemoveFromNode(vn.node.getConnector(__visibleLink.link.outputConnector, false).dataType)) {
						//vn.node.setInputValue(__visibleLink.link.outputConnector, null, DataType.NULL);
						ic = vn.node.getConnector(__visibleLink.link.outputConnector);
						vn.node.setInputValue(__visibleLink.link.outputConnector, [DataType.getDefaultValue(ic.dataType)], ic.dataType);
					}
					vn.setConnectorStateLinked(isNodeConnected(vn, __visibleLink.link.outputConnector, false), __visibleLink.link.outputConnector);
					// TODO: make this a more generic catch-all function?
				}
			}

		}

		__visibleLink.dispose();
	}
}

protected function addVisibleComment(__visibleComment:VisibleComment): void {
	visibleComments.push(__visibleComment);
	commentContainer.addChild(__visibleComment);
}

protected function removeVisibleComment(__visibleComment:VisibleComment): void {
	var i:Number = visibleComments.indexOf(__visibleComment);
	if (i > -1) {
		visibleComments.splice(i, 1);
		commentContainer.removeChild(__visibleComment);
	}
}

protected function isNodeConnected(__visibleNode:VisibleNode, __connectorId:String, __connectorIsOutput:Boolean = false): Boolean {
	// Find whether a visible node already has a connector on a position

	return patch.isNodeConnected(__visibleNode.node, __connectorId, __connectorIsOutput);
}

protected function createLink(__node1:Node, __connectorId1:String, __node2:Node, __connectorId2:String): Link {
	// Creates a link, removes links from other nodes where needed
	// TODO: maybe automatically move this to patch
	var newLink:Link = new Link();
	var cn:Connector;

	// Remove from inputs (max one input link per connector)
	removeLinksFromNode(__node2, __connectorId2, false);
	
	// Remove from outputs if only one output is allowed
	cn = __node1.getConnector(__connectorId1, true);
	if (!Boolean(cn)) {
		Logger.getInstance().addMessage("Error: output connector ["+__connectorId1+"] not found on ["+__node1+"] when creating link", LogMessage.TYPE_ERROR, this);
		return null;
	}
	if (!cn.allowsMultipleOutputs) removeLinksFromNode(__node1, __connectorId1, true);

	newLink.inputNode = __node1;
	newLink.inputConnector = __connectorId1;
	newLink.outputNode = __node2;
	newLink.outputConnector = __connectorId2;

	newLink.delayed = areNodesLinked(newLink.outputNode, newLink.inputNode);
	
	return newLink;
}

protected function removeLinksFromNode(__node:Node, __connectorId:String, __connectorIsOutput:Boolean):void {
	var visibleLinksToDelete:Vector.<VisibleLink> = new Vector.<VisibleLink>();
	var i:Number;
	for (i = 0; i < visibleLinks.length; i++) {
		if (__connectorIsOutput) {
			if (Boolean(visibleLinks[i].link) && __node == visibleLinks[i].link.inputNode && __connectorId == visibleLinks[i].link.inputConnector) {
				visibleLinksToDelete.push(visibleLinks[i]);
			}
		} else {
			if (Boolean(visibleLinks[i].link) && __node == visibleLinks[i].link.outputNode && __connectorId == visibleLinks[i].link.outputConnector) {
				visibleLinksToDelete.push(visibleLinks[i]);
			}
		}
	}
	for (i = 0; i < visibleLinksToDelete.length; i++) {
		removeVisibleLink(visibleLinksToDelete[i]);
	}
	visibleLinksToDelete = null;
}

protected function areNodesLinked(__node1:Node, __node2:Node):Boolean {
	// Checks whether two nodes are linked somehow
	if (__node1 == __node2) return true;

	var i:Number;
	var lnk:Link;
	
	// Check primary and secondary connections
	for (i = 0; i < visibleLinks.length; i++) {
		lnk = visibleLinks[i].link;
		if (Boolean(lnk) && !lnk.delayed) {
			if (lnk.inputNode == __node1) {
				if (lnk.outputNode == __node2) {
					return true;
				} else {
					if (areNodesLinked(lnk.outputNode, __node2)) {
						return true;
					}
				}
			}
		}
	}
	
	return false;
}

protected function isLinkingAllowed(__vNode1:VisibleNode, __cId1:String, __cIsOutput1:Boolean, __vNode2:VisibleNode, __cId2:String, __cIsOutput2:Boolean): Boolean {

	// No output to output or input to input
	if (__cIsOutput1 == __cIsOutput2) return false; 

	// Check node origin
	if (__vNode1 == __vNode2) return false;
	// TODO: allow self-links in the future, with delays!
	
	// Check datatype
	var c1:Connector = __cIsOutput1 ? __vNode1.node.getConnector(__cId1, __cIsOutput1) : __vNode2.node.getConnector(__cId2, __cIsOutput2);
	var c2:Connector = !__cIsOutput1 ? __vNode1.node.getConnector(__cId1, __cIsOutput1) : __vNode2.node.getConnector(__cId2, __cIsOutput2);
	if (c1.dataType != c2.dataType && !c2.anyDataType) return false; // TODO: allow certain types! (number -> string)...
	
	return true;
}

protected function updateScrollBoundaries(): void {
	
	//Logger.getInstance().addMessage("updateScrollBoundaries");
	
	// TODO: it's actually wrong because it doesn't take the canvas size with and without scrollbars in consideration
	
	var minNodeX:Number = 0;
	var maxNodeX:Number = _width;
	var minNodeY:Number = 0;
	var maxNodeY:Number = _height;

	if (Boolean(visibleNodes) && visibleNodes.length > 0) {

		var vn:VisibleNode = visibleNodes[0];

		minNodeX = vn.x;
		maxNodeX = vn.x + vn.width;
		minNodeY = vn.y;
		maxNodeY = vn.height;
	
		for (var i:Number = 1; i < visibleNodes.length; i++) {
			vn = visibleNodes[i];
			minNodeX = Math.min(vn.x, minNodeX);
			maxNodeX = Math.max(vn.x + vn.width, maxNodeX);
			minNodeY = Math.min(vn.y, minNodeY);
			maxNodeY = Math.max(vn.y + vn.height, maxNodeY);
		}
	
	}

	minScrollX = Math.min(-CANVAS_MARGIN, minNodeX - NODE_MARGIN);
	maxScrollX = Math.max(_width + CANVAS_MARGIN, maxNodeX + NODE_MARGIN);

	minScrollY = Math.min(-CANVAS_MARGIN, minNodeY - NODE_MARGIN);
	maxScrollY = Math.max(_height + CANVAS_MARGIN, maxNodeY + NODE_MARGIN);

}

protected function redrawVisibleLink(__visibleLink:VisibleLink): void {
	var pIn:Point = getConnectorCenter(__visibleLink.link.inputNode, __visibleLink.link.inputConnector, true);
	var pOut:Point = getConnectorCenter(__visibleLink.link.outputNode, __visibleLink.link.outputConnector);
	// TODO: faster lookup, ask visibleNode directly
	__visibleLink.xIn = pIn.x;
	__visibleLink.yIn = pIn.y;
	__visibleLink.xOut = pOut.x;
	__visibleLink.yOut = pOut.y;
}
*/

FNKEditor.PatchViewer.prototype.bringNodeToFront = function(__visibleNode) {
	__visibleNode.getElement().style.zIndex = ++this.lastNodeLevel;
};

FNKEditor.PatchViewer.prototype.startMovingSelection = function(__event) {
	// From this point on, all mouse movements will drag the currently selected elements
	// TODO: support touch events

	document.onmousemove = this.onContinueMovingSelection;
	document.onmouseup = this.onStopMovingSelection;
	document.fnkTargetPatch = this;

	this.lastMousePosition = null;
	this.isMovingSelection = true;
	this.onContinueMovingSelection(__event);

	/*
	function startElementDrag(e) {
		draggingElement = e.target;
		document.onmousemove = continueElementDrag;
		document.onmouseup = stopElementDrag;
		
		e.preventDefault();
		
		draggingOffsetX = e.pageX - e.target.offsetLeft;
		draggingOffsetY = e.pageY - e.target.offsetTop;
		updatePosition(e.pageX, e.pageY);
	}
	function continueElementDrag(e) {
		updatePosition(e.pageX, e.pageY);
		
		e.preventDefault();
	}
	function stopElementDrag(e) {
		updatePosition(e.pageX, e.pageY);
		
		e.preventDefault();

		draggingElement = undefined;
		document.onmousemove = undefined;
		document.onmouseup = undefined;
	}
	function updatePosition(x, y) {
		draggingElement.style.left = x - draggingOffsetX + "px";
		draggingElement.style.top = y - draggingOffsetY + "px";
		
		// document.body.scrollLeft
		
		updateLines();
	}
	*/
};

FNKEditor.PatchViewer.prototype.continueMovingSelection = function(__mouseX, __mouseY) {
	if (this.lastMousePosition != null) {
		this.moveSelection(__mouseX - this.lastMousePosition.x, __mouseY - this.lastMousePosition.y);
	}

	this.lastMousePosition = {x:__mouseX, y:__mouseY};
};

FNKEditor.PatchViewer.prototype.stopMovingSelection = function(__event) {
	this.lastMousePosition = null;
	this.isMovingSelection = false;
	document.fnkTargetPatch = null;

	document.onmousemove = null;
	document.onmouseup = null;
};

FNKEditor.PatchViewer.prototype.onContinueMovingSelection = function(__event) {
	document.fnkTargetPatch.continueMovingSelection.apply(document.fnkTargetPatch, [__event.clientX, __event.clientY]);
	if (__event != undefined) __event.preventDefault();
};

FNKEditor.PatchViewer.prototype.onStopMovingSelection = function(__event) {
	document.fnkTargetPatch.onContinueMovingSelection(__event);
	document.fnkTargetPatch.stopMovingSelection.apply(document.fnkTargetPatch);
};

FNKEditor.PatchViewer.prototype.moveSelection = function(__offsetX, __offsetY) {
	if (__offsetX == 0 && __offsetY == 0) return;
	if (this.selectedVisibleNodes.length == 0 && this.selectedVisibleLinks.length == 0 && this.selectedVisibleComments.length == 0) return;
	var i;
	var selectedNodes = [];
	for (i = 0; i < this.selectedVisibleNodes.length; i++) {
		this.selectedVisibleNodes[i].setPosition(this.selectedVisibleNodes[i].x + __offsetX, this.selectedVisibleNodes[i].y + __offsetY);
		selectedNodes.push(this.selectedVisibleNodes[i].node);
	}
	for (i = 0; i < this.selectedVisibleLinks.length; i++) {
		this.selectedVisibleLinks[i].moveLineProperties(__offsetX, __offsetY);
	}

	// Verifies if non-selected links must be moved too (when both nodes are selected)
	/*
	for (i = 0; i < this.visibleLinks.length; i++) {
		if (!visibleLinks[i].isSelected && selectedNodes.indexOf(visibleLinks[i].link.inputNode) > -1 && selectedNodes.indexOf(visibleLinks[i].link.outputNode) > -1) {
			visibleLinks[i].moveLineProperties(__offsetX, __offsetY);
		} 
	}
	for (i = 0; i < selectedVisibleComments.length; i++) {
		selectedVisibleComments[i].x += __offsetX;
		selectedVisibleComments[i].y += __offsetY;
	}

	updateScrollBoundaries();
	dispatchChangeEvent();
	*/
};

/*
// ================================================================================================================
// PUBLIC interface -----------------------------------------------------------------------------------------------

public function resume(__forced:Boolean = false):void {
	if (_paused || __forced) {
		timer.start();
		_paused = false;
	}
}

public function pause():void {
	if (!_paused) {
		timer.stop();
		_paused = true;
	}
}

public function step():void {
	processPatch();
}


// Moves the canvas
public function moveCanvas(__offsetX:Number, __offsetY:Number): void {
	setScroll(_scrollX + __offsetX, _scrollY + __offsetY);
}

public function setScroll(__scrollX:Number, __scrollY:Number): void {
	_scrollX = MathUtils.clamp(__scrollX, minScrollX, maxScrollX - _width);
	_scrollY = MathUtils.clamp(__scrollY, minScrollX, maxScrollX - _height);
	redrawScroll();
}
*/

FNKEditor.PatchViewer.prototype.setSize = function(__width, __height) {
	this.width = __width; // TODO: clamp?
	this.height = __height; // TODO: clamp?
	//redrawBackground();
	//redrawScroll();

	this.updateElementSize();
};

/*
public function redrawScroll(): void {
	nodeContainer.scrollRect = linkContainer.scrollRect = commentContainer.scrollRect = new Rectangle(Math.round(_scrollX), Math.round(_scrollY), Math.round(_width), Math.round(_height));
}

public function getConnectorCenter(__node:Node, __connector:String, __isOutput:Boolean = false): Point {
	var vni:Number = getVisibleNodeIdFromNode(__node);

	if (isNaN(vni)) return null;

	var vn:VisibleNode = visibleNodes[vni];
	var pt:Point = vn.getConnectorCenter(__connector, __isOutput);
	
	pt.x += vn.x;
	pt.y += vn.y;
	
	return pt;
}

public function centerContent(): void {
	// Set new centered node positions
	
	// TODO: maybe this shouldn't be done because it fucks up the position of nodes... and grids

	var i:Number;
	
	var nx1:Number, nx2:Number, ny1:Number, ny2:Number;

	var minX:Number, maxX:Number, minY:Number, maxY:Number;

	for (i = 0; i < visibleNodes.length; i++) {

		nx1 = visibleNodes[i].x;
		nx2 = nx1 + visibleNodes[i].width;
		ny1 = visibleNodes[i].y;
		ny2 = ny1 + visibleNodes[i].height;
		
		minX = isNaN(minX) ? nx1 : Math.min(nx1, minX);
		maxX = isNaN(maxX) ? nx2 : Math.max(nx2, maxX);
		minY = isNaN(minY) ? ny1 : Math.min(ny1, minY);
		maxY = isNaN(maxY) ? ny2 : Math.max(ny2, maxY);
	}

	for (i = 0; i < visibleComments.length; i++) {

		nx1 = visibleComments[i].x;
		nx2 = nx1 + visibleComments[i].width;
		ny1 = visibleComments[i].y;
		ny2 = ny1 + visibleComments[i].height;
		
		minX = isNaN(minX) ? nx1 : Math.min(nx1, minX);
		maxX = isNaN(maxX) ? nx2 : Math.max(nx2, maxX);
		minY = isNaN(minY) ? ny1 : Math.min(ny1, minY);
		maxY = isNaN(maxY) ? ny2 : Math.max(ny2, maxY);
	}

	var offsetX:Number = ((_width/2) - ((maxX-minX)/2)) - minX; 
	var offsetY:Number = ((_height/2) - ((maxY-minY)/2)) - minY;

	for (i = 0; i < visibleNodes.length; i++) {
		visibleNodes[i].setPosition(Math.round(visibleNodes[i].x + offsetX), Math.round(visibleNodes[i].y + offsetY));
	}
	for (i = 0; i < visibleLinks.length; i++) {
		visibleLinks[i].moveLineProperties(offsetX, offsetY);
	}
	for (i = 0; i < visibleComments.length; i++) {
		visibleComments[i].x += offsetX;
		visibleComments[i].y += offsetY;
	}
	
	updateScrollBoundaries();
}

public function setSource(__xml:XML): void {
	// Load a patch from XML data
	reset();
	
	// Update header
	header.title = String(__xml.attribute("title"));
	header.description = String(__xml.attribute("description"));
	header.authorCreated = String(__xml.attribute("author-created"));
	header.dateCreated = String(__xml.attribute("date-created"));
	header.authorModified = String(__xml.attribute("author-modified"));
	header.dateModified = String(__xml.attribute("date-modified"));
	header.version = parseInt(__xml.attribute("version"));

	// Update content
	addFromSource(__xml);

	centerContent();

	//updateScrollBoundaries();
}

public function addFromSource(__xml:XML, __center:Boolean = false): void {

	var nx:Number, ny:Number, nw:Number, nh:Number;
	var nx2:Number, ny2:Number;
	var minX:Number, maxX:Number, minY:Number, maxY:Number;

	// Create nodes			

	var connectorData:XML;
	var nodeList:XMLList = __xml.child("node");
	var nodeData:XML;

	var newVisibleNode:VisibleNode;
	var tempNodeList:Array = new Array();

	for each (nodeData in nodeList) {
		if (nodeData.child("class") != null) {
			newVisibleNode = createVisibleNode(nodeData.child("class").toString());
			
			if (Boolean(newVisibleNode)) {

				for each (connectorData in nodeData.child("connectors").child("connector")) {
					newVisibleNode.node.setInputValue(connectorData.@id, DataType.deSerialize(connectorData.toString(), DataType.STRING), DataType.STRING);
				}

				nx = parseInt(nodeData.child("left"), 10);
				ny = parseInt(nodeData.child("top"), 10);
				nw = parseInt(nodeData.child("width"), 10);
				nh = parseInt(nodeData.child("height"), 10);
				
				nx2 = nx + nw;
				ny2 = ny + nh;
			
				minX = isNaN(minX) ? nx : Math.min(nx, minX);
				maxX = isNaN(maxX) ? nx2 : Math.max(nx2, maxX);
				minY = isNaN(minY) ? ny : Math.min(ny, minY);
				maxY = isNaN(maxY) ? ny2 : Math.max(ny2, maxY);
				
				newVisibleNode.setPosition(nx, ny);
				newVisibleNode.setSize(nw, nh);

				tempNodeList[parseInt(nodeData.@id, 10)] = newVisibleNode;

				addVisibleNode(newVisibleNode);
			}
			
		}

	}

	// Create comments			

	var commentList:XMLList = __xml.child("comment");
	var commentData:XML;
	var cs:Number;
	var newComment:VisibleComment;
	var tempCommentList:Array = new Array();

	for each (commentData in commentList) {
		newComment = new VisibleComment();

		nx = parseInt(commentData.child("left"), 10);
		ny = parseInt(commentData.child("top"), 10);
		nw = parseInt(commentData.child("width"), 10);
		cs = parseInt(commentData.child("font-size"), 10);

		newComment.x = nx;
		newComment.y = ny;
		if (!isNaN(nw)) newComment.defaultWidth = nw;
		if (!isNaN(cs)) newComment.textSize = cs;
		newComment.value = String(commentData.child("text"));
		
		addVisibleComment(newComment);
		
		nx2 = nx + newComment.width;
		ny2 = ny + newComment.height;
		
		minX = isNaN(minX) ? nx : Math.min(nx, minX);
		maxX = isNaN(maxX) ? nx2 : Math.max(nx2, maxX);
		minY = isNaN(minY) ? ny : Math.min(ny, minY);
		maxY = isNaN(maxY) ? ny2 : Math.max(ny2, maxY);
		
		tempCommentList.push(newComment);
		
	}

	// Center
	var offsetX:Number = ((_width/2) - ((maxX-minX)/2)) - minX; 
	var offsetY:Number = ((_height/2) - ((maxY-minY)/2)) - minY;
	if (__center) {
		var vn:VisibleNode;
		var vc:VisibleComment;

		for each (vn in tempNodeList) {
			vn.setPosition(Math.round(vn.x + offsetX), Math.round(vn.y + offsetY));
		}
		for each (vc in tempCommentList) {
			vc.x = Math.round(vc.x + offsetX);
			vc.y = Math.round(vc.y + offsetY);
		}
	}

	// Create links
	var linkList:XMLList = __xml.child("link");
	var linkData:XML;

	var newLink:Link;
	var newVisibleLink:VisibleLink;
	
	var node1:VisibleNode;
	var node2:VisibleNode;

	for each (linkData in linkList) {

		//newLink = new Link();
		node1 = tempNodeList[parseInt(linkData.child("input").child("node").toString(),10)];
		node2 = tempNodeList[parseInt(linkData.child("output").child("node").toString(),10)];
		if (Boolean(node1) && Boolean(node2)) {
			newLink = createLink(node1.node, linkData.child("input").child("connector").toString(), node2.node, linkData.child("output").child("connector").toString());
			if (Boolean (newLink)) {
				newLink.delayed = newLink.delayed || String(linkData.child("delayed")) == "true";
				//newLink.forcedDelay = isLi
				//newLink.inputNode = tempNodeList[parseInt(linkData.child("input").child("node").toString(),10)].node;
				//newLink.inputConnector = linkData.child("input").child("connector").toString();
				//newLink.outputNode = tempNodeList[parseInt(linkData.child("output").child("node").toString(),10)].node;
				//newLink.outputConnector = linkData.child("output").child("connector").toString();
				
				patch.addLink(newLink);
				
				newVisibleLink = new VisibleLink(newLink);
				if (Boolean(String(linkData.child("type")))) newVisibleLink.type = String(linkData.child("type"));
				if (Boolean(String(linkData.child("points")))) newVisibleLink.setLineProperties(String(linkData.child("points")));
				//newVisibleLink.visiblePatch = this;
				
				addVisibleLink(newVisibleLink);
				
				if (__center) {
					newVisibleLink.moveLineProperties(offsetX, offsetY);
				}
			}
		} else {
			if (!Boolean(node1)) {
				Logger.getInstance().addMessage("Error: tried to create a link from a node id ["+parseInt(linkData.child("input").child("node").toString(),10)+"] that does not exit", LogMessage.TYPE_ERROR, this);
			} else {
				Logger.getInstance().addMessage("Error: tried to create a link to a node id ["+parseInt(linkData.child("output").child("node").toString(),10)+"] that does not exit", LogMessage.TYPE_ERROR, this);
			}
		}
	}
	
}

public function getSource(): XML {

	header.touch();
	
	// Add all
	var i:Number;
	var snodes:Vector.<int> = new Vector.<int>();
	var slinks:Vector.<int> = new Vector.<int>();
	var stexts:Vector.<int> = new Vector.<int>();
	
	// Nodes
	for (i = 0; i < visibleNodes.length; i++) {
		snodes.push(i);
	}
	
	// Links
	for (i = 0; i < visibleLinks.length; i++) {
		slinks.push(i);
	}
	
	// Comments
	for (i = 0; i < visibleComments.length; i++) {
		stexts.push(i);
	}

	var src:XML = getSpecificSource(snodes, slinks, stexts);
				
	return src;
}

public function dispose(): void {
	timer.stop();
	timer = null;
	Config.removeEventListener(Event.CHANGE, onConfigChange);
	removeAllLinks();
	removeAllNodes();
}

public function removeAllLinks(): void {
	var i:Number;
	var linksToDelete:Vector.<VisibleLink> = new Vector.<VisibleLink>();
	for (i = 0; i < visibleLinks.length; i++) {
		linksToDelete.push(visibleLinks[i]);
	}
	for (i = 0; i < linksToDelete.length; i++) {
		removeVisibleLink(linksToDelete[i]);
	}
}

public function removeAllNodes(): void {
	var i:Number;
	var nodesToDelete:Vector.<VisibleNode> = new Vector.<VisibleNode>();
	for (i = 0; i < visibleNodes.length; i++) {
		nodesToDelete.push(visibleNodes[i]);
	}
	for (i = 0; i < nodesToDelete.length; i++) {
		removeVisibleNode(nodesToDelete[i]);
	}
}
*/

FNKEditor.PatchViewer.prototype.selectAll = function() {
	var i;
	for (i = 0; i < this.visibleNodes.length; i++) {
		if (!this.visibleNodes[i].getSelected()) {
			this.selectVisibleNode(this.visibleNodes[i]);
		}
	}

	for (i = 0; i < visibleLinks.length; i++) {
		if (!this.visibleLinks[i].getSelected()) {
			this.selectVisibleLink(this.visibleLinks[i]);
		}
	}

	for (i = 0; i < visibleComments.length; i++) {
		if (!this.visibleComments[i].getSelected()) {
			this.selectVisibleComment(this.visibleComments[i]);
		}
	}

};

FNKEditor.PatchViewer.prototype.selectNone = function() {
	var i;
	for (i = 0; i < this.selectedVisibleNodes.length; i++) {
		this.selectedVisibleNodes[i].setSelected(false);
	}

	for (i = 0; i < this.selectedVisibleLinks.length; i++) {
		this.selectedVisibleLinks[i].setSelected(false);
	}

	for (i = 0; i < this.selectedVisibleComments.length; i++) {
		this.selectedVisibleComments[i].setSelected(false);
	}

	this.resetSelection();
};

FNKEditor.PatchViewer.prototype.resetSelection = function() {
	this.selectedVisibleNodes = [];
	this.selectedVisibleLinks = [];
	this.selectedVisibleComments = [];
};

FNKEditor.PatchViewer.prototype.selectVisibleNode = function(__visibleNode, __allowToggle) {
	if (!__visibleNode.getSelected()) {
		this.selectedVisibleNodes.push(__visibleNode);
		__visibleNode.setSelected(true);
	} else {
		if (__allowToggle) this.deselectVisibleNode(__visibleNode);
	}
};

FNKEditor.PatchViewer.prototype.deselectVisibleNode = function(__visibleNode) {
	if (__visibleNode.getSelected()) {
		var i = this.selectedVisibleNodes.indexOf(__visibleNode);
		if (i > -1) this.selectedVisibleNodes.splice(i, 1);
		__visibleNode.setSelected(false);
	}
};

/*
// ================================================================================================================
// EVENT functions ------------------------------------------------------------------------------------------------

protected function processPatch(e:Event = null): void {
	if (patch != null) patch.process();
	// TODO: make this respond to actual TIME instead of framerate!
}
*/

FNKEditor.PatchViewer.prototype.onVisibleNodeShouldStartMoving = function(__visibleNode) {
	//if (isMovingFreely) {
	//	hideCurrentTooltip();
		var canStartMoving = true;
	//	if (selectedVisibleNodes.indexOf(__visibleNode) > -1) {
	//		// Already selected
	//		if (KeyboardUtils.isShiftDown()) {
	//			deselectVisibleNode(e.visibleNode);
	//			canStartMoving = false;
	//		}
	//	} else {
	//		// Not selected
	//		if (!KeyboardUtils.isAdditionalSelectionModifierDown()) selectNone();
			this.selectNone();
			this.bringNodeToFront(__visibleNode);
			this.selectVisibleNode(__visibleNode);
	//	}
		if (canStartMoving) this.startMovingSelection(__visibleNode.getLastMouseEvent());
	//}
};

/*
protected function onVisibleNodeMove(e:VisibleNodeEvent): void {
	// A node has been moved. Update the related links
	for (var i:Number = 0; i < visibleLinks.length; i++) {
		if (visibleLinks[i].link.inputNode == e.visibleNode.node || visibleLinks[i].link.outputNode == e.visibleNode.node) {
			redrawVisibleLink(visibleLinks[i]);
			//visibleLinks[i].redraw();
		}
		// TODO: update link internal positions based on the position of the new node 
	}
}

// ================================================================================================================
// ACCESSOR functions ---------------------------------------------------------------------------------------------

public function get scrollX(): Number {
	return _scrollX;
}
public function set scrollX(__value:Number): void {
	setScroll(__value, _scrollY);
}

public function get scrollY(): Number {
	return _scrollY;
}
public function set scrollY(__value:Number): void {
	setScroll(_scrollX, __value);
}

override public function get width(): Number {
	return _width;
}
override public function set width(__value:Number): void {
	setSize(__value, _height);
}

override public function get height(): Number {
	return _height;
}
override public function set height(__value:Number): void {
	setSize(_width, __value);
}

public function get paused(): Boolean {
	return _paused;
}
*/