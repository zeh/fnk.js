// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNKEditor.VisibleNode = function(__node) {
	/*
	protected var caption:String;
public var node:Node;
// TODO: this must be protected...

protected var _resizable:Boolean;
protected var hasMoveHandle:Boolean;
protected var hasResizeHandle:Boolean;
protected var hasText:Boolean;

protected var _isSelected:Boolean;

protected var isEditing:Boolean;
protected var editingField:NodeEditor;
protected var editingConnectorId:String;

protected var _x:Number;
protected var _y:Number;

// Visual instances
protected var connectorContainer:Sprite;
protected var textFieldCaption:TextField;

protected var mouseOverInputConnector:Number;
protected var mouseOverOutputConnector:Number;

protected var resizeHandle:SkinnedBackground;
protected var moveHandle:SkinnedBackground;

protected var inputConnectors:Vector.<VisibleConnector>;
protected var outputConnectors:Vector.<VisibleConnector>;

// Ugh
protected var inputConnectorsLinked:Vector.<Boolean>;
protected var outputConnectorsLinked:Vector.<Boolean>;

protected var inputConnectorsHighlighted:Vector.<Boolean>;
protected var outputConnectorsHighlighted:Vector.<Boolean>;
	*/

	// Properties
	
	this.x = 0;
	this.y = 0;
	
	this.resizable = true; // TODO: use this!
	this.hasMoveHandle = true;
	this.hasResizeHandle = true;
	this.entireNodeMoves = false; // TODO: make this work with the resize handle
	
	this.width = this.DEFAULT_WIDTH;
	this.height = this.DEFAULT_HEIGHT;
	
	this.isSelected = false;

	this.node = __node;
	
	this.hasText = true;

	this.element = undefined;
	this.contentElement = undefined;
	this.lastMouseEvent = null;

	// Create stuff
	this.createElement();

	// Final visual update
	this.updateElementPosition();
	this.updateElementSize();
	this.updateElementSelection();

	// Signals for events
	this.startMovingSignal = new SimpleSignal();
	this.startResizingSignal = new SimpleSignal();

	this.renderer = undefined; // NodeRendererItem*
	
	/*
	inputConnectorsLinked = new Vector.<Boolean>(node.numInputConnectors);
	outputConnectorsLinked = new Vector.<Boolean>(node.numOutputConnectors);
	inputConnectorsHighlighted = new Vector.<Boolean>(node.numInputConnectors);
	outputConnectorsHighlighted = new Vector.<Boolean>(node.numOutputConnectors);
	*/
};

FNKEditor.VisibleNode.prototype = {};
FNKEditor.VisibleNode.prototype.constructor = FNK.VisibleNode;


// ================================================================================================================
// STATIC properties ----------------------------------------------------------------------------------------------

// Constants
/*
FNKEditor.VisibleNode.MINIMUM_WIDTH = 30;
FNKEditor.VisibleNode.MAXIMUM_WIDTH = 1000;
FNKEditor.VisibleNode.MINIMUM_HEIGHT = 15;
FNKEditor.VisibleNode.MAXIMUM_HEIGHT = 1001;
*/
FNKEditor.VisibleNode.CLASS_SELECTED = "fnk-node-selected";
FNKEditor.VisibleNode.CLASS_UNSELECTED = "fnk-node-unselected";
FNKEditor.VisibleNode.DEFAULT_WIDTH = 80;
FNKEditor.VisibleNode.DEFAULT_HEIGHT = 15;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNKEditor.VisibleNode.prototype.createElement = function () {
	// Creates the element container

	// Create document element
	this.element = document.createElement("div");
	this.element.className = "fnk-node";

	var moveBar = document.createElement("div");
	moveBar.className = "fnk-node-bar-move";
	this.element.appendChild(moveBar);

	var resizeBar = document.createElement("div");
	resizeBar.className = "fnk-node-bar-resize";
	this.element.appendChild(resizeBar);

	this.contentElement = document.createElement("div");
	this.contentElement.className = "fnk-node-content";
	this.element.appendChild(this.contentElement);

	moveBar.targetVisualNode = this;
	moveBar.onmousedown = this.onMouseDownStartMoving;

	resizeBar.targetVisualNode = this;
	resizeBar.onmousedown = this.onMouseDownStartResizing;

	if (!this.hasMoveHandle) {
		moveBar.style.visibility = "hidden";
	} else {
		FNK.addClassToElement(this.contentElement, "fnk-node-content-movable");
	}

	if (!this.hasResizeHandle) {
		resizeBar.style.visibility = "hidden";
	} else {
		FNK.addClassToElement(this.contentElement, "fnk-node-content-resizable");
	}

	if (this.entireNodeMoves) {
		FNK.addClassToElement(this.element, "fnk-node-movable");
		this.element.targetVisualNode = this;
		this.element.onmousedown = this.onMouseDownStartMoving;
	}

	this.renderer = new FNKEditor.NodeRendererItemText(this);
	this.renderer.setContent(this.node.getContentDescription(), FNK.DataType.STRING);

};

FNKEditor.VisibleNode.prototype.updateElementPosition = function() {
	this.element.style.left = this.x + "px";
	this.element.style.top = this.y + "px";
};

FNKEditor.VisibleNode.prototype.updateElementSize = function() {
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
};

FNKEditor.VisibleNode.prototype.updateElementSelection = function() {
	if (this.isSelected) {
		FNK.removeClassFromElement(this.element, FNKEditor.VisibleNode.CLASS_UNSELECTED);
		FNK.addClassToElement(this.element, FNKEditor.VisibleNode.CLASS_SELECTED);
	} else {
		FNK.addClassToElement(this.element, FNKEditor.VisibleNode.CLASS_UNSELECTED);
		FNK.removeClassFromElement(this.element, FNKEditor.VisibleNode.CLASS_SELECTED);
	}
};

/*
override protected function createAssets(): void {
	super.createAssets();
	createConnectors();
	createText();
}

override protected function redraw(): void {
	super.redraw();
	if (drawn) {
		redrawHandles();
		redrawText();
		redrawConnectors();
		redrawSelection();
	}
}

override protected function removeAssets(): void {
	removeHandles();
	removeText();
	removeConnectors();
	super.removeAssets();
}

protected function redrawSelection(): void {
	if (Boolean(backgroundContainer)) {
		if (_isSelected) {
			backgroundContainer.transform.colorTransform = new ColorTransform(0.75, 0.75, 0.75);
		} else {
			backgroundContainer.transform.colorTransform = new ColorTransform();
		}
	}
}

protected function createMoveHandle(): void {
	moveHandle = new SkinnedBackground();
	moveHandle.setSprite("node_move_background");
	addChild(moveHandle);
	moveHandle.doubleClickEnabled = true;
	moveHandle.addEventListener(MouseEvent.MOUSE_OVER, onMouseOverMove);
	moveHandle.addEventListener(MouseEvent.MOUSE_OUT, onMouseOutMove);
	moveHandle.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDownMove);
}

protected function createResizeHandle(): void {
	resizeHandle = new SkinnedBackground();
	resizeHandle.setSprite("node_resize_background");
	addChild(resizeHandle);
	resizeHandle.addEventListener(MouseEvent.MOUSE_OVER, onMouseOverResizer);
	resizeHandle.addEventListener(MouseEvent.MOUSE_OUT, onMouseOutResizer);
	resizeHandle.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDownResizer);
}

protected function redrawHandles(): void {
	// Move handle
	if (!Boolean(moveHandle)) createMoveHandle();
	moveHandle.x = INTERNAL_BORDER;
	moveHandle.y = INTERNAL_BORDER;
	moveHandle.width = MOVE_HANDLE_WIDTH;
	moveHandle.height = _height - INTERNAL_BORDER * 2;
	// Paint borders
	moveHandle.graphics.clear();
	moveHandle.graphics.lineStyle();
	moveHandle.graphics.beginFill(0xff00ff, 0);
	moveHandle.graphics.drawRect(-INTERNAL_BORDER-ADDITIONAL_BORDER, -INTERNAL_BORDER-ADDITIONAL_BORDER, _width + ADDITIONAL_BORDER*2 - (_resizable ? RESIZE_HANDLE_WIDTH + INTERNAL_BORDER*2 + ADDITIONAL_BORDER : 0), _height+ADDITIONAL_BORDER*2);
	moveHandle.graphics.endFill();
	
	// Resize handle
	if (_resizable) {
		if (!Boolean(resizeHandle)) createResizeHandle();
		resizeHandle.x = _width - INTERNAL_BORDER - RESIZE_HANDLE_WIDTH;
		resizeHandle.y = INTERNAL_BORDER;
		resizeHandle.width = RESIZE_HANDLE_WIDTH;
		resizeHandle.height = _height - INTERNAL_BORDER * 2;
		// Paint borders
		resizeHandle.graphics.clear();
		resizeHandle.graphics.lineStyle();
		resizeHandle.graphics.beginFill(0xff00ff, 0);
		resizeHandle.graphics.drawRect(-INTERNAL_BORDER, -INTERNAL_BORDER-ADDITIONAL_BORDER, RESIZE_HANDLE_WIDTH+INTERNAL_BORDER*2+ADDITIONAL_BORDER, _height+ADDITIONAL_BORDER*2);
		resizeHandle.graphics.endFill();
	} else {
		if (resizeHandle != null) {
			removeChild(resizeHandle);
			resizeHandle = null;
		}
	}

}

protected function removeHandles(): void {
	if (Boolean(resizeHandle)) removeResizeHandle();
	if (Boolean(moveHandle)) removeMoveHandle();
}

protected function removeResizeHandle(): void {
		resizeHandle.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOverResizer);
		resizeHandle.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOutResizer);
		resizeHandle.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDownResizer);
		removeChild(resizeHandle);
		resizeHandle = null;
}

protected function removeMoveHandle(): void {
	moveHandle.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOverMove);
	moveHandle.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOutMove);
	moveHandle.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDownMove);
	removeChild(moveHandle);
	moveHandle = null;
}

protected function createConnectors(): void {
	// Creates needed sprites
	
	// Create parent container
	connectorContainer = new Sprite();
	addChild(connectorContainer);
	
	// Create items
	var i:Number;
	var vc:VisibleConnector;
	
	inputConnectors = new Vector.<VisibleConnector>();
	for (i = 0; i < node.numInputConnectors; i++) {
		vc = new VisibleConnector(false);
		vc.addEventListener(MouseEvent.ROLL_OVER, onMouseRollOverConnector);
		vc.addEventListener(MouseEvent.ROLL_OUT, onMouseRollOutConnector);
		vc.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDownConnector);
		vc.addEventListener(MouseEvent.MOUSE_UP, onMouseUpConnector);
		vc.addEventListener(MouseEvent.CLICK, onMouseClickConnector);
		vc.addEventListener(MouseEvent.DOUBLE_CLICK, onMouseDoubleClickConnector);
		connectorContainer.addChild(vc);
		inputConnectors.push(vc);
	}

	outputConnectors = new Vector.<VisibleConnector>();
	for (i = 0; i < node.numOutputConnectors; i++) {
		vc = new VisibleConnector(true);
		vc.addEventListener(MouseEvent.ROLL_OVER, onMouseRollOverConnector);
		vc.addEventListener(MouseEvent.ROLL_OUT, onMouseRollOutConnector);
		vc.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDownConnector);
		vc.addEventListener(MouseEvent.MOUSE_UP, onMouseUpConnector);
		vc.addEventListener(MouseEvent.CLICK, onMouseClickConnector);
		vc.addEventListener(MouseEvent.DOUBLE_CLICK, onMouseDoubleClickConnector);
		connectorContainer.addChild(vc);
		outputConnectors.push(vc);
	}
	
}

protected function redrawConnectors(): void {
	var i:int;
	var pt:Point;
	
	for (i = 0; i < inputConnectors.length; i++) {
		pt = getConnectorPointByIndex(i, false);
		inputConnectors[i].x = pt.x;
		inputConnectors[i].y = pt.y;
		inputConnectors[i].linked = Boolean(inputConnectorsLinked[i]);
		inputConnectors[i].highlighted = Boolean(inputConnectorsHighlighted[i]);
	}

	for (i = 0; i < outputConnectors.length; i++) {
		pt = getConnectorPointByIndex(i, true);
		outputConnectors[i].x = pt.x;
		outputConnectors[i].y = pt.y;
		outputConnectors[i].linked = Boolean(outputConnectorsLinked[i]);
		outputConnectors[i].highlighted = Boolean(outputConnectorsHighlighted[i]);
	}
	
	setChildIndex(connectorContainer, numChildren-1);
}

protected function recreateConnectors(): void {
	if (drawn) {
		removeConnectors();
		createConnectors();
		redrawConnectors();
	}
}

protected function removeConnectors(): void {
	// Creates needed sprites
	if (connectorContainer != null) {
		// Remove items
		var i:Number;
		for (i = 0; i < inputConnectors.length; i++) {
			inputConnectors[i].removeEventListener(MouseEvent.ROLL_OVER, onMouseRollOverConnector);
			inputConnectors[i].removeEventListener(MouseEvent.ROLL_OUT, onMouseRollOutConnector);
			inputConnectors[i].removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDownConnector);
			inputConnectors[i].removeEventListener(MouseEvent.MOUSE_UP, onMouseUpConnector);
			inputConnectors[i].removeEventListener(MouseEvent.CLICK, onMouseClickConnector);
			inputConnectors[i].removeEventListener(MouseEvent.DOUBLE_CLICK, onMouseDoubleClickConnector);
			connectorContainer.removeChild(inputConnectors[i]);
		}
		inputConnectors = null;

		for (i = 0; i < outputConnectors.length; i++) {
			outputConnectors[i].removeEventListener(MouseEvent.ROLL_OVER, onMouseRollOverConnector);
			outputConnectors[i].removeEventListener(MouseEvent.ROLL_OUT, onMouseRollOutConnector);
			outputConnectors[i].removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDownConnector);
			outputConnectors[i].removeEventListener(MouseEvent.MOUSE_UP, onMouseUpConnector);
			outputConnectors[i].removeEventListener(MouseEvent.CLICK, onMouseClickConnector);
			outputConnectors[i].removeEventListener(MouseEvent.DOUBLE_CLICK, onMouseDoubleClickConnector);
			connectorContainer.removeChild(outputConnectors[i]);
		}
		outputConnectors = null;
		
		// Remove parent container
		removeChild(connectorContainer);
		connectorContainer = null;
	}
}

protected function createText(): void {
	// Creates needed textfield
	// TODO: correct text here
	if (hasText) {
		textFieldCaption = new TextField();
		textFieldCaption.wordWrap = false;
		textFieldCaption.embedFonts = false;
		textFieldCaption.mouseEnabled = false;
		textFieldCaption.selectable = true;
		addChild(textFieldCaption);

		var fmt:TextFormat = new TextFormat("Tahoma", 9, 0x000000);
		textFieldCaption.setTextFormat(fmt);
		textFieldCaption.defaultTextFormat = fmt;
	}
}

protected function redrawText(): void {
	if (hasText) {
		setCaption(node.renderingCaption);
		
		var cRect:Rectangle = getContentRect();
		
		textFieldCaption.x = cRect.x;
		textFieldCaption.y = cRect.y-1;
		textFieldCaption.width = cRect.width+1;
		textFieldCaption.height = cRect.height+2;
	}
}

protected function getContentRect(): Rectangle {
	var resizeHandleSize:uint = hasResizeHandle ? RESIZE_HANDLE_WIDTH + INTERNAL_BORDER : 0;
	var moveHandleSize:uint = hasMoveHandle ? MOVE_HANDLE_WIDTH + INTERNAL_BORDER : 0;

	var rx:Number = INTERNAL_BORDER + moveHandleSize;
	var ry:Number = INTERNAL_BORDER;

	var rw:Number = _width - moveHandleSize - INTERNAL_BORDER * 2 - resizeHandleSize;
	var rh:Number = _height - INTERNAL_BORDER * 2;

	return new Rectangle(rx, ry, rw, rh);
}

protected function removeText(): void {
	if (hasText) {
		removeChild(textFieldCaption);
		textFieldCaption = null;
	}
}

protected function setCaption(__text:String): void {
	caption = __text;
	if (drawn) textFieldCaption.text = caption;
}

protected function redrawPosition(): void {
	super.x = _x;
	super.y = _y;
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOVE));
}

protected function getConnectorPointByIndex(__num:uint, __isOutput:Boolean = false):Point {
	// Returns the point of a given connector

	var totalConnectors:uint = __isOutput ? node.numOutputConnectors : node.numInputConnectors;
	
	if (totalConnectors == 0) return null;
	
	var xPhase:Number = totalConnectors == 1 ? 0 : __num / (totalConnectors - 1);
	var resizeHandleSize:uint = hasResizeHandle ? RESIZE_HANDLE_WIDTH + INTERNAL_BORDER : 0;
	var moveHandleSize:uint = hasMoveHandle ? MOVE_HANDLE_WIDTH + INTERNAL_BORDER : 0;
	var baseX:int = INTERNAL_BORDER + moveHandleSize + Math.round(xPhase * (_width - INTERNAL_BORDER * 2 - resizeHandleSize - moveHandleSize - VisibleConnector.VISIBLE_WIDTH));
	var baseY:int = __isOutput ? _height : 0;

	return new Point(baseX, baseY); 
}

protected function createNewEvent(__type:String): VisibleNodeEvent {
	return new VisibleNodeEvent(__type, this, false, false);
}

protected function getVisibleConnectorId(__connector:VisibleConnector): String {
	if (__connector.isOutput) return node.getConnectorId(outputConnectors.indexOf(__connector), true);
	return node.getConnectorId(inputConnectors.indexOf(__connector), false);
}

// Edit connector -----------------------------------------------------------------------------------------

protected function startEditingConnector(__connector:String): void {
	if (!isEditing) {
		dispatchEvent(createNewEvent(VisibleNodeEvent.EDIT_START));
		isEditing = true;
		editingConnectorId = __connector;
		editingField = new NodeEditor(String(node.getConnector(editingConnectorId).getValueAt(0)), true);
		addChild(editingField);
		
		var bounds:Rectangle = getConnectorBounds(editingConnectorId);
		editingField.x = bounds.x;
		editingField.y = bounds.y - 12;
		editingField.width = 80;
		editingField.height = 15;
		editingField.addEventListener(Event.SELECT, stopEditingConnectorChange);
		editingField.addEventListener(Event.CANCEL, stopEditingConnector);
	} 
}

protected function stopEditingConnectorChange(e:Event = null): void {
	if (isEditing) {
		node.getConnector(editingConnectorId).setValue([editingField.value], DataType.STRING);
		node.process();
		dispatchEvent(createNewEvent(VisibleNodeEvent.EDIT_CHANGE));
		stopEditingConnector();
	}
}

protected function stopEditingConnector(e:Event = null): void {
	if (isEditing) {
		removeChild(editingField);
		editingField.removeEventListener(Event.SELECT, stopEditingConnectorChange);
		editingField.removeEventListener(Event.CANCEL, stopEditingConnector);
		editingField = null;
		isEditing = false;
		editingConnectorId = null;
		dispatchEvent(createNewEvent(VisibleNodeEvent.EDIT_END));
	}
}
*/

// ================================================================================================================
// EVENT functions ------------------------------------------------------------------------------------------------

FNKEditor.VisibleNode.prototype.onMouseDownStartMoving = function(__event) {
	// Request that the container start moving this element
	// This is ran from the div element's scope

	this.targetVisualNode.lastMouseEvent = __event;

	// Dispatch the related signal
	this.targetVisualNode.startMovingSignal.dispatch();
};

FNKEditor.VisibleNode.prototype.onMouseDownStartResizing = function(__event) {
	// Request that the container start resizing this element
	// This is ran from the div element's scope

	this.targetVisualNode.lastMouseEvent = __event;

	// Dispatch the related signal
	this.targetVisualNode.startResizingSignal.dispatch();
};

/*
protected function onMouseOverMove(e:MouseEvent = null):void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_OVER_MOVE));
}

protected function onMouseOutMove(e:MouseEvent = null):void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_OUT_MOVE));
}

protected function onMouseDownMove(e:MouseEvent = null):void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_DOWN_MOVE));
}

protected function onMouseRollOverConnector(e:MouseEvent = null):void {
	var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_OVER_CONNECTOR);
	vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	dispatchEvent(vne);
}

protected function onMouseRollOutConnector(e:MouseEvent = null):void {
	var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_OUT_CONNECTOR);
	vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	dispatchEvent(vne);
}

protected function onMouseDownConnector(e:MouseEvent = null):void {
	var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_DOWN_CONNECTOR);
	vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	dispatchEvent(vne);
}

protected function onMouseUpConnector(e:MouseEvent = null):void {
	var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_UP_CONNECTOR);
	vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	dispatchEvent(vne);
}

protected function onMouseClickConnector(e:MouseEvent = null):void {
	var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_CLICK_CONNECTOR);
	vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	dispatchEvent(vne);
}

protected function onMouseDoubleClickConnector(e:MouseEvent = null):void {
	//var vne:VisibleNodeEvent = createNewEvent(VisibleNodeEvent.MOUSE_DOUBLE_CLICK_CONNECTOR);
	//vne.targetConnectorId = getVisibleConnectorId(VisibleConnector(e.target));
	//vne.targetConnectorIsOutput = VisibleConnector(e.target).isOutput;
	//dispatchEvent(vne);
	var cIsOutput:Boolean = VisibleConnector(e.target).isOutput;
	if (!cIsOutput) {
		var cId:String = getVisibleConnectorId(VisibleConnector(e.target));
		var cn:Connector = node.getConnector(cId, false);
		if (DataType.canEdit(cn.dataType) && !node.patch.isNodeConnected(node, cId)) {
			startEditingConnector(cId);
		}
	}
		
}

protected function onMouseOverResizer(e:MouseEvent): void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_OVER_RESIZE));
}

protected function onMouseOutResizer(e:MouseEvent): void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_OUT_RESIZE));
}

protected function onMouseDownResizer(e:MouseEvent): void {
	dispatchEvent(createNewEvent(VisibleNodeEvent.MOUSE_DOWN_RESIZE));
}
*/

// ================================================================================================================
// PUBLIC interface -----------------------------------------------------------------------------------------------

FNKEditor.VisibleNode.prototype.dispose = function() {
	this.node.dispose();
	this.node = undefined;
};

FNKEditor.VisibleNode.prototype.setPosition = function(__x, __y) {
	this.x = __x;
	this.y = __y;

	this.updateElementPosition();
};

FNKEditor.VisibleNode.prototype.setSize = function(__width, __height) {
	this.width = __width; // TODO: clamp the values to max/min?
	this.height = __height; // TODO: clamp the values to max/min?

	this.updateElementSize();

	//dispatchEvent(createNewEvent(VisibleNodeEvent.RESIZE));
};

/*
public function getConnectorBounds(__id:String, __isOutput:Boolean = false): Rectangle {
	// Returns the boundaries of a given connector
	var pt:Point = getConnectorPointByIndex(node.getConnectorIndex(__id, __isOutput), __isOutput);
	
	return __isOutput ? new Rectangle(pt.x, pt.y, VisibleConnector.VISIBLE_WIDTH, VisibleConnector.VISIBLE_HEIGHT) : new Rectangle(pt.x, pt.y - VisibleConnector.VISIBLE_HEIGHT - 1, VisibleConnector.VISIBLE_WIDTH, VisibleConnector.VISIBLE_HEIGHT);
	// TODO: why the -1 here??
}

public function getConnectorCenter(__id:String, __isOutput:Boolean = false): Point {
	// Returns the boundaries of a given connector
	var pt:Point = getConnectorPointByIndex(node.getConnectorIndex(__id, __isOutput), __isOutput);
	
	return new Point(pt.x + VisibleConnector.VISIBLE_WIDTH/2, pt.y + (__isOutput ? VisibleConnector.VISIBLE_HEIGHT : -VisibleConnector.VISIBLE_HEIGHT - 1));
}

public function setConnectorStateLinked(__value:Boolean, __id:String, __isOutput:Boolean = false): void {
	var i:Number = node.getConnectorIndex(__id, __isOutput);
	if (i > -1) {
		if (__isOutput) {
			outputConnectorsLinked[i] = __value;
			if (drawn) outputConnectors[i].linked = __value;
		} else {
			inputConnectorsLinked[i] = __value;
			if (drawn) inputConnectors[i].linked = __value;
		}
	}
}

public function setConnectorStateHighlighted(__value:Boolean, __id:String, __isOutput:Boolean = false): void {
	var i:Number = node.getConnectorIndex(__id, __isOutput);
	if (i > -1) {
		if (__isOutput) {
			if (drawn) outputConnectors[i].highlighted = __value;
			outputConnectorsHighlighted[i] = __value;
		} else {
			inputConnectorsHighlighted[i] = __value;
			if (drawn) inputConnectors[i].highlighted = __value;
		}
	}
}
*/


// ================================================================================================================
// ACCESSOR functions ---------------------------------------------------------------------------------------------

FNKEditor.VisibleNode.prototype.getElement = function() {
	return this.element;
};

FNKEditor.VisibleNode.prototype.getContentElement = function() {
	return this.contentElement;
};

FNKEditor.VisibleNode.prototype.getLastMouseEvent = function() {
	return this.lastMouseEvent;
};

/*
override public function get x():Number { 
	return super.x;
}
override public function set x(__value:Number):void {
	setPosition(__value, _y);
}

override public function get y():Number { 
	return super.y;
}
override public function set y(__value:Number):void {
	setPosition(_x, __value);
}

override public function get width():Number { 
	return _width; 
}
override public function set width(__value:Number):void {
	setSize(__value, _height);
}

override public function get height():Number { 
	return _height; 
}
override public function set height(__value:Number):void {
	setSize(_width, __value);
}

public function get resizable():Boolean { 
	return _resizable; 
}

public function set resizable(__value:Boolean):void {
	_resizable = __value;
	redraw();
}
*/

FNKEditor.VisibleNode.prototype.getSelected = function() {
	return this.isSelected;
};

FNKEditor.VisibleNode.prototype.setSelected = function(__isSelected) {
	this.isSelected = __isSelected;
	this.updateElementSelection();
};
