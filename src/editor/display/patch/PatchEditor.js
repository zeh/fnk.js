// ================================================================================================================
// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

FNKEditor.PatchEditor = function() {
	FNKEditor.PatchViewer.call(this);

	this.selectedVisibleNodes = [];
	this.selectedVisibleLinks = [];
	this.selectedVisibleComments = [];

	this.resetSelection(); // Same as above...
	this.lastMousePosition = null;
	this.isMovingSelection = false;
	this.isResizingSelection = false;

	this.selectAdditions = false; // If true, new additions are always selected // TODO: not used yet
};

FNKEditor.PatchEditor.prototype = new FNKEditor.PatchViewer();
FNKEditor.PatchEditor.prototype.constructor = FNKEditor.OperationNode;


// ================================================================================================================
// INTERNAL interface ---------------------------------------------------------------------------------------------

FNKEditor.PatchEditor.prototype.addVisibleNode = function(__visibleNode) {
	FNKEditor.PatchViewer.prototype.addVisibleNode.call(this, __visibleNode);

	__visibleNode.startMovingSignal.add(this.onVisibleNodeShouldStartMoving, this, [__visibleNode]);
	__visibleNode.startResizingSignal.add(this.onVisibleNodeShouldStartResizing, this, [__visibleNode]);
};

FNKEditor.PatchEditor.prototype.selectAll = function() {
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

FNKEditor.PatchEditor.prototype.selectNone = function() {
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

FNKEditor.PatchEditor.prototype.resetSelection = function() {
	this.selectedVisibleNodes = [];
	this.selectedVisibleLinks = [];
	this.selectedVisibleComments = [];
};

FNKEditor.PatchEditor.prototype.selectVisibleNode = function(__visibleNode, __allowToggle) {
	if (!__visibleNode.getSelected()) {
		this.selectedVisibleNodes.push(__visibleNode);
		__visibleNode.setSelected(true);
	} else {
		if (__allowToggle) this.deselectVisibleNode(__visibleNode);
	}
};

FNKEditor.PatchEditor.prototype.deselectVisibleNode = function(__visibleNode) {
	if (__visibleNode.getSelected()) {
		var i = this.selectedVisibleNodes.indexOf(__visibleNode);
		if (i > -1) this.selectedVisibleNodes.splice(i, 1);
		__visibleNode.setSelected(false);
	}
};

FNKEditor.PatchEditor.prototype.startMovingSelection = function(__event) {
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

FNKEditor.PatchEditor.prototype.continueMovingSelection = function(__mouseX, __mouseY) {
	if (this.lastMousePosition != null) {
		this.moveSelection(__mouseX - this.lastMousePosition.x, __mouseY - this.lastMousePosition.y);
	}

	this.lastMousePosition = {x:__mouseX, y:__mouseY};
};

FNKEditor.PatchEditor.prototype.stopMovingSelection = function(__event) {
	this.lastMousePosition = null;
	this.isMovingSelection = false;
	document.fnkTargetPatch = null;

	document.onmousemove = null;
	document.onmouseup = null;
};

FNKEditor.PatchEditor.prototype.onContinueMovingSelection = function(__event) {
	document.fnkTargetPatch.continueMovingSelection.apply(document.fnkTargetPatch, [__event.clientX, __event.clientY]);
	if (__event != undefined) __event.preventDefault();
};

FNKEditor.PatchEditor.prototype.onStopMovingSelection = function(__event) {
	document.fnkTargetPatch.onContinueMovingSelection(__event);
	document.fnkTargetPatch.stopMovingSelection.apply(document.fnkTargetPatch);
};

FNKEditor.PatchEditor.prototype.moveSelection = function(__offsetX, __offsetY) {
	// Moves all currently selected items by a given amount of pixels

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

FNKEditor.PatchEditor.prototype.startResizingSelection = function(__event) {
// TODO: support touch events

	document.onmousemove = this.onContinueResizingSelection;
	document.onmouseup = this.onStopResizingSelection;
	document.fnkTargetPatch = this;

	this.lastMousePosition = null;
	this.isResizingSelection = true;
	this.onContinueResizingSelection(__event);
};

FNKEditor.PatchEditor.prototype.continueResizingSelection = function(__mouseX, __mouseY) {
	if (this.lastMousePosition != null) {
		this.resizeSelection(__mouseX - this.lastMousePosition.x, __mouseY - this.lastMousePosition.y);
	}

	this.lastMousePosition = {x:__mouseX, y:__mouseY};
};

FNKEditor.PatchEditor.prototype.stopResizingSelection = function(__event) {
	this.lastMousePosition = null;
	this.isResizingSelection = false;
	document.fnkTargetPatch = null;

	document.onmousemove = null;
	document.onmouseup = null;
};

FNKEditor.PatchEditor.prototype.onContinueResizingSelection = function(__event) {
	document.fnkTargetPatch.continueResizingSelection.apply(document.fnkTargetPatch, [__event.clientX, __event.clientY]);
	if (__event != undefined) __event.preventDefault();
};

FNKEditor.PatchEditor.prototype.onStopResizingSelection = function(__event) {
	document.fnkTargetPatch.onContinueResizingSelection(__event);
	document.fnkTargetPatch.stopResizingSelection.apply(document.fnkTargetPatch);
};

FNKEditor.PatchEditor.prototype.resizeSelection = function(__offsetX, __offsetY) {
	// Resizes all currently selected items by a given amount of pixels

	if (__offsetX == 0 && __offsetY == 0) return;
	if (this.selectedVisibleNodes.length == 0 && this.selectedVisibleLinks.length == 0 && this.selectedVisibleComments.length == 0) return;

	var i;
	for (i = 0; i < this.selectedVisibleNodes.length; i++) {
		this.selectedVisibleNodes[i].setSize(this.selectedVisibleNodes[i].width + __offsetX,this. selectedVisibleNodes[i].height + __offsetY);
	}

	// TODO: resize links too!
	// TODO: resize comments too!

	//updateScrollBoundaries();
	//dispatchChangeEvent();
};


// ================================================================================================================
// EVENT functions ------------------------------------------------------------------------------------------------

FNKEditor.PatchEditor.prototype.onVisibleNodeShouldStartMoving = function(__visibleNode) {
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

FNKEditor.PatchEditor.prototype.onVisibleNodeShouldStartResizing = function(__visibleNode) {
	//if (isMovingFreely) {
	//	hideCurrentTooltip();
		var canStartResizing = true;
	//	if (selectedVisibleNodes.indexOf(e.visibleNode) > -1) {
	//		// Already selected
	//		if (KeyboardUtils.isShiftDown()) {
	//			deselectVisibleNode(e.visibleNode);
	//			canStartResizing = false;
	//		}
	//	} else {
	//		// Not selected
	//		if (!KeyboardUtils.isShiftDown()) selectNone();
			this.selectNone();
			this.bringNodeToFront(__visibleNode);
			this.selectVisibleNode(__visibleNode);
	//	}
		if (canStartResizing) this.startResizingSelection(__visibleNode.getLastMouseEvent());
	//}
};

/*
// ================================================================================================================
// ACCESSOR functions ---------------------------------------------------------------------------------------------

public function get isFocused(): Boolean {
	return _isFocused;
}

public function get isMovingFreely(): Boolean {
	return !isFullscreen && !isMovingSelection && !isResizingSelection && !isDraggingCanvasMouse && !isSelectingArea && _isFocused && !isDrawingLink && !isEditingNode && !isEditingComment;
}

public function get numNodesSelected(): Number {
	return selectedVisibleNodes.length;
}

public function get numLinksSelected(): Number {
	return selectedVisibleLinks.length;
}

public function get numCommentsSelected(): Number {
	return selectedVisibleComments.length;
}

public function get numLinksSelectedDelayed(): Number {
	var lnks:Number = 0;
	for (var i:Number = 0; i < selectedVisibleLinks.length; i++) {
		if (Boolean(selectedVisibleLinks[i].link) && selectedVisibleLinks[i].link.delayed) lnks++;
	}
	return lnks;
}
*/

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
*/

/*
package org.ffnnkk.display.patches {
	import com.zehfernando.geom.Line;
	import com.zehfernando.utils.AppUtils;
	import com.zehfernando.utils.KeyboardUtils;
	import com.zehfernando.utils.MouseUtils;
	
	import org.ffnnkk.core.data.Connector;
	import org.ffnnkk.core.data.DataType;
	import org.ffnnkk.core.links.Link;
	import org.ffnnkk.core.nodes.Node;
	import org.ffnnkk.display.RectangularSelection;
	import org.ffnnkk.display.annotations.VisibleComment;
	import org.ffnnkk.display.links.VisibleLink;
	import org.ffnnkk.display.nodes.VisibleGraphicNode;
	import org.ffnnkk.display.nodes.VisibleNode;
	import org.ffnnkk.display.tooltips.Tooltip;
	import org.ffnnkk.editor.application.Editor;
	import org.ffnnkk.events.PatchEditorEvent;
	import org.ffnnkk.events.VisibleCommentEvent;
	import org.ffnnkk.events.VisibleLinkEvent;
	import org.ffnnkk.events.VisibleNodeEvent;
	
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.FullScreenEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.ui.Keyboard;
	import flash.utils.Dictionary;	

	public class PatchEditor extends PatchViewer {

		// Properties
		protected var selectedVisibleNodes:Vector.<VisibleNode>;
		protected var selectedVisibleLinks:Vector.<VisibleLink>;
		protected var selectedVisibleComments:Vector.<VisibleComment>;
		
		protected var lastMousePosition:Point;
		protected var startedMousePosition:Point;
		protected var _isFocused:Boolean;
		
		// State vars
		protected var isMovingSelection:Boolean;
		protected var isMovingSelectionMouse:Boolean;
		protected var isResizingSelection:Boolean;
		protected var isResizingSelectionMouse:Boolean;
		protected var isDraggingCanvas:Boolean;
		protected var isDraggingCanvasMouse:Boolean;
		protected var isSelectingArea:Boolean;
		protected var isDrawingLink:Boolean;
		protected var isEditingNode:Boolean;
		protected var isEditingComment:Boolean;
		protected var isFullscreen:Boolean;
		
		protected var savedNodePositions:Dictionary;
		
		public var selectAdditions:Boolean;	// If true, new additions are always selected
		
		// Instances
		protected var currentTooltip:Tooltip;
		protected var currentNodePicker:NodePicker;
		protected var currentRectangularSelection:RectangularSelection;
		
		protected var drawingVisibleLink:VisibleLink;
		protected var drawingVisibleNode:VisibleNode;
		protected var drawingConnectorId:String;
		protected var drawingConnectorIsOutput:Boolean;
		protected var drawingVisibleLinkFirstPointDone:Boolean; // little hack
		protected var fullScreenNode:VisibleGraphicNode;

		
		// ================================================================================================================
		// INSTANCE functions that override -------------------------------------------------------------------------------

		override protected function reset(): void {
			super.reset();
			//selectNone();
//			TODO: better handle the reset/creation process between PatchEditor and PatchViewer 
		}
		
		override protected function resetGraphics(): void {
			super.resetGraphics();
			background.doubleClickEnabled = true; 
		}

		override protected function addVisibleComment(__visibleComment:VisibleComment): void {
			deselectVisibleComment(__visibleComment);
			super.addVisibleComment(__visibleComment);
			__visibleComment.addEventListener(VisibleCommentEvent.MOUSE_DOWN_MOVE, onCommentMouseDownMove);
			__visibleComment.addEventListener(VisibleCommentEvent.MOUSE_OVER_MOVE, onCommentMouseOverMove);
			__visibleComment.addEventListener(VisibleCommentEvent.MOUSE_OUT_MOVE, onCommentMouseOutMove);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_DOWN_RESIZE, onNodeMouseDownResize);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_OVER_RESIZE, onNodeMouseOverResize);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_OUT_RESIZE, onNodeMouseOutResize);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_OVER_CONNECTOR, onNodeMouseOverConnector);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_OUT_CONNECTOR, onNodeMouseOutConnector);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_DOWN_CONNECTOR, onNodeMouseDownConnector);
//			__visibleComment.addEventListener(VisibleNodeEvent.MOUSE_UP_CONNECTOR, onNodeMouseUpConnector);
			__visibleComment.addEventListener(VisibleCommentEvent.EDIT_START, onCommentEditStart);
			__visibleComment.addEventListener(VisibleCommentEvent.EDIT_CHANGE, onCommentEditChange);
			__visibleComment.addEventListener(VisibleCommentEvent.EDIT_END, onCommentEditEnd);
			dispatchChangeEvent();
			if (selectAdditions) selectVisibleComment(__visibleComment);
		}
		
		override protected function removeVisibleComment(__visibleComment:VisibleComment): void {
			MouseUtils.removeSpecialCursor(); // TODO: hm...
			__visibleComment.removeEventListener(VisibleCommentEvent.MOUSE_DOWN_MOVE, onCommentMouseDownMove);
			__visibleComment.removeEventListener(VisibleCommentEvent.MOUSE_OVER_MOVE, onCommentMouseOverMove);
			__visibleComment.removeEventListener(VisibleCommentEvent.MOUSE_OUT_MOVE, onCommentMouseOutMove);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_DOWN_RESIZE, onNodeMouseDownResize);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_OVER_RESIZE, onNodeMouseOverResize);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_OUT_RESIZE, onNodeMouseOutResize);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_OVER_CONNECTOR, onNodeMouseOverConnector);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_OUT_CONNECTOR, onNodeMouseOutConnector);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_DOWN_CONNECTOR, onNodeMouseDownConnector);
//			__visibleComment.removeEventListener(VisibleNodeEvent.MOUSE_UP_CONNECTOR, onNodeMouseUpConnector);
			__visibleComment.removeEventListener(VisibleCommentEvent.EDIT_START, onCommentEditStart);
			__visibleComment.removeEventListener(VisibleCommentEvent.EDIT_CHANGE, onCommentEditChange);
			__visibleComment.removeEventListener(VisibleCommentEvent.EDIT_END, onCommentEditEnd);
			super.removeVisibleComment(__visibleComment);
			dispatchChangeEvent();
		}

		override protected function addVisibleLink(__visibleLink:VisibleLink): void {
			super.addVisibleLink(__visibleLink);
			if (Boolean(__visibleLink.link)) {
				__visibleLink.addEventListener(VisibleLinkEvent.MOUSE_DOWN_SELECT, onLinkMouseDownSelect);
				dispatchChangeEvent();
				if (selectAdditions) selectVisibleLink(__visibleLink);
			}
		}

		override protected function removeVisibleLink(__visibleLink:VisibleLink): void {
			deselectVisibleLink(__visibleLink);
			super.removeVisibleLink(__visibleLink);
			if (Boolean(__visibleLink.link)) {
				__visibleLink.removeEventListener(VisibleLinkEvent.MOUSE_DOWN_SELECT, onLinkMouseDownSelect);
				dispatchChangeEvent();
			}
		}
		
		override protected function addVisibleNode(__visibleNode:VisibleNode): void {
			deselectVisibleNode(__visibleNode);
			super.addVisibleNode(__visibleNode);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_DOWN_MOVE, onNodeMouseDownMove);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OVER_MOVE, onNodeMouseOverMove);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OUT_MOVE, onNodeMouseOutMove);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_DOWN_RESIZE, onNodeMouseDownResize);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OVER_RESIZE, onNodeMouseOverResize);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OUT_RESIZE, onNodeMouseOutResize);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OVER_CONNECTOR, onNodeMouseOverConnector);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_OUT_CONNECTOR, onNodeMouseOutConnector);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_DOWN_CONNECTOR, onNodeMouseDownConnector);
			__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_UP_CONNECTOR, onNodeMouseUpConnector);
			//__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_DOUBLE_CLICK_CONNECTOR, onNodeMouseDoubleClickConnector);
			//__visibleNode.addEventListener(VisibleNodeEvent.MOUSE_CLICK_CONNECTOR, onNodeMouseClickConnector);
			__visibleNode.addEventListener(VisibleNodeEvent.EDIT_START, onNodeEditStart);
			__visibleNode.addEventListener(VisibleNodeEvent.EDIT_CHANGE, onNodeEditChange);
			__visibleNode.addEventListener(VisibleNodeEvent.EDIT_END, onNodeEditEnd);
			dispatchChangeEvent();
			if (selectAdditions) selectVisibleNode(__visibleNode);
		}
		
		override protected function removeVisibleNode(__visibleNode:VisibleNode): void {
			MouseUtils.removeSpecialCursor(); // TODO: hm...
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_DOWN_MOVE, onNodeMouseDownMove);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OVER_MOVE, onNodeMouseOverMove);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OUT_MOVE, onNodeMouseOutMove);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_DOWN_RESIZE, onNodeMouseDownResize);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OVER_RESIZE, onNodeMouseOverResize);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OUT_RESIZE, onNodeMouseOutResize);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OVER_CONNECTOR, onNodeMouseOverConnector);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_OUT_CONNECTOR, onNodeMouseOutConnector);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_DOWN_CONNECTOR, onNodeMouseDownConnector);
			__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_UP_CONNECTOR, onNodeMouseUpConnector);
			//__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_DOUBLE_CLICK_CONNECTOR, onNodeMouseDoubleClickConnector);
			//__visibleNode.removeEventListener(VisibleNodeEvent.MOUSE_CLICK_CONNECTOR, onNodeMouseClickConnector);
			__visibleNode.removeEventListener(VisibleNodeEvent.EDIT_START, onNodeEditStart);
			__visibleNode.removeEventListener(VisibleNodeEvent.EDIT_CHANGE, onNodeEditChange);
			__visibleNode.removeEventListener(VisibleNodeEvent.EDIT_END, onNodeEditEnd);
			super.removeVisibleNode(__visibleNode);
			dispatchChangeEvent();
		}
		
		public function setFocus(): void {
			if (!_isFocused) {
				AppUtils.getStage().addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
				AppUtils.getStage().addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
				background.addEventListener(MouseEvent.MOUSE_DOWN, onBackgroundMouseDown);
				background.addEventListener(MouseEvent.DOUBLE_CLICK, onBackgroundDoubleClick);
				_isFocused = true;
			}
		}
		
		public function killFocus(): void {
			if (_isFocused) {
				AppUtils.getStage().removeEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
				AppUtils.getStage().removeEventListener(KeyboardEvent.KEY_UP, onKeyUp);
				background.removeEventListener(MouseEvent.MOUSE_DOWN, onBackgroundMouseDown);
				background.removeEventListener(MouseEvent.DOUBLE_CLICK, onBackgroundDoubleClick);
				_isFocused = false;
			}
		}

		// ================================================================================================================
		// PUBLIC functions -----------------------------------------------------------------------------------------------

		public function getSelectionSource(): XML {
			// Like getSource(), but only for the selected items
			
			header.touch();
			
			// Add selected nodes and related links
			// Selected links are ignored; the only links added are the ones related to the selected nodes
			var i:Number;
			var snodes:Vector.<int> = new Vector.<int>();
			var slinks:Vector.<int> = new Vector.<int>();
			var stexts:Vector.<int> = new Vector.<int>();
			
			// Nodes
			for (i = 0;i < selectedVisibleNodes.length; i++) {
				snodes.push(visibleNodes.indexOf(selectedVisibleNodes[i]));
			}
			
			// Links
			var iNode:Number;
			var oNode:Number;
			for (i = 0; i < visibleLinks.length; i++) {
				iNode = getVisibleNodeIdFromNode(visibleLinks[i].link.inputNode);
				oNode = getVisibleNodeIdFromNode(visibleLinks[i].link.outputNode);
				if (!isNaN(iNode) && visibleNodes[iNode].isSelected && !isNaN(oNode) && visibleNodes[oNode].isSelected) {  
					slinks.push(i);
				}
			}
			
			// Comments
			for (i = 0; i < selectedVisibleComments.length; i++) {
				stexts.push(visibleComments.indexOf(selectedVisibleComments[i]));
			}
			
			var src:XML = getSpecificSource(snodes, slinks, stexts);
						
			return src;
		}

		public function getSelectionLength(): Number {
			return selectedVisibleNodes.length + selectedVisibleLinks.length + selectedVisibleComments.length;
		}
		
		public function getSelectionHelpSource():XML {
			if (hasSelectionHelp()) return selectedVisibleNodes[0].node.helpPatchSource;
			return null;
		}

		public function hasSelectionHelp(): Boolean {
			return (selectedVisibleNodes.length == 1 && Boolean(selectedVisibleNodes[0].node) && selectedVisibleNodes[0].node.hasHelpPatch);
		}

		public function selectVisibleLink(__visibleLink:VisibleLink, __allowToggle:Boolean = false): void {
			if (!__visibleLink.isSelected) {
				selectedVisibleLinks.push(__visibleLink);
				__visibleLink.isSelected = true;
			} else {
				if (__allowToggle) deselectVisibleLink(__visibleLink);
			}
		}

		public function deselectVisibleLink(__visibleLink:VisibleLink): void {
			if (__visibleLink.isSelected) {
				var i:Number = selectedVisibleLinks.indexOf(__visibleLink);
				if (i > -1) selectedVisibleLinks.splice(i, 1);
				__visibleLink.isSelected = false;
			}
		}

		public function selectVisibleComment(__visibleComment:VisibleComment, __allowToggle:Boolean = false): void {
			if (!__visibleComment.isSelected) {
				selectedVisibleComments.push(__visibleComment);
				__visibleComment.isSelected = true;
			} else {
				if (__allowToggle) deselectVisibleComment(__visibleComment);
			}
		}

		public function deselectVisibleComment(__visibleComment:VisibleComment): void {
			if (__visibleComment.isSelected) {
				var i:Number = selectedVisibleComments.indexOf(__visibleComment);
				if (i > -1) selectedVisibleComments.splice(i, 1);
				__visibleComment.isSelected = false;
			}
		}

		public function setSelectedLinksDelay(__delayed:Boolean):void {
			for (var i:Number = 0; i < selectedVisibleLinks.length; i++) {
				if (Boolean(selectedVisibleLinks[i].link)) {
					if (!__delayed) {
						selectedVisibleLinks[i].link.delayed = areNodesLinked(selectedVisibleLinks[i].link.outputNode, selectedVisibleLinks[i].link.inputNode);
					} else {
						selectedVisibleLinks[i].link.delayed = __delayed;
					}
					selectedVisibleLinks[i].requestRedraw();
				}
			}
			// Verify the need for forced delays
		}
		
		public function changeSelectedCommentSize(__offset:Number): void {
			for (var i:Number = 0; i < selectedVisibleComments.length; i++) {
				selectedVisibleComments[i].textSize += __offset;
			}
		}

		public function deleteSelection(): void {
			
			// Delete all selected nodes and links
			
			var i:Number;
			
			var linksToDelete:Vector.<VisibleLink> = selectedVisibleLinks["concat"](); // TODO: remove this once the syntax check is correct
			for (i = 0; i < linksToDelete.length; i++) {
				removeVisibleLink(linksToDelete[i]);
			}
			linksToDelete = null;
			
			var nodesToDelete:Vector.<VisibleNode> = selectedVisibleNodes["concat"](); // TODO: remove this once the syntax check is correct
			for (i = 0; i < nodesToDelete.length; i++) {
				removeVisibleNode(nodesToDelete[i]);
			}
			nodesToDelete = null;
			
			var textsToDelete:Vector.<VisibleComment> = selectedVisibleComments["concat"](); // TODO: remove this once the syntax check is correct
			for (i = 0; i < textsToDelete.length; i++) {
				removeVisibleComment(textsToDelete[i]);
			}
			textsToDelete = null;

			updateScrollBoundaries();

			selectNone();
			dispatchChangeEvent();
		}
		
		override public function dispose(): void {
			selectNone();
			super.dispose();
		}

		// ================================================================================================================
		// INTERNAL functions ---------------------------------------------------------------------------------------------

		protected function resetSelection(): void {
			selectedVisibleNodes = new Vector.<VisibleNode>();
			selectedVisibleLinks = new Vector.<VisibleLink>();
			selectedVisibleComments = new Vector.<VisibleComment>();
		}

		protected function saveNodePositions(__selectedOnly:Boolean = true): void {
			savedNodePositions = new Dictionary();
			for (var i:Number = 0; i < visibleNodes.length; i++) {
				if (visibleNodes[i].isSelected || !__selectedOnly) {
					savedNodePositions[visibleNodes[i]] = new Rectangle(visibleNodes[i].x, visibleNodes[i].y, visibleNodes[i].width, visibleNodes[i].height);
				}
			}
		}

		protected function restoreNodePositions(): void {
			var vn:VisibleNode;
			for (var key:* in savedNodePositions) {
				vn = VisibleNode(key);
				vn.setPosition(savedNodePositions[vn].x, savedNodePositions[vn].y);
				vn.setSize(savedNodePositions[vn].width, savedNodePositions[vn].height);
			}
		}
		
		protected function clearNodePositions(): void {
			savedNodePositions = null;
		}
		
		protected function bringNodeToFront(__visibleNode:VisibleNode): void {
			nodeContainer.setChildIndex(__visibleNode, nodeContainer.numChildren-1);
		}

		protected function bringCommentToFront(__visibleComment:VisibleComment): void {
			commentContainer.setChildIndex(__visibleComment, commentContainer.numChildren-1);
		}

		protected function getMousePosition(__insideCanvas:Boolean = false): Point {
			var p:Point = new Point (mouseX, mouseY);
			if (__insideCanvas) {
				// Not used?
				p.x += _scrollX;
				p.y += _scrollY;
			}
			return p;
		}

		protected function showTooltip(__text:String, __x:Number, __y:Number, __arrowPos:String): void {
			hideCurrentTooltip();

			currentTooltip = new Tooltip(__text, __arrowPos);
			AppUtils.getStage().addChild(currentTooltip);
			
			var p:Point = new Point(Math.round(__x), Math.round(__y));
			p = localToGlobal(p);
			
			currentTooltip.x = p.x;
			currentTooltip.y = p.y;
			//currentTooltip.width = 105; // 105
			//currentTooltip.height = 17; // 17
		}

		protected function hideCurrentTooltip(): void {
			if (Boolean(currentTooltip)) {
				AppUtils.getStage().removeChild(currentTooltip);
				currentTooltip = undefined;
			}
		}

		public function createVisibleCommentNew(): void {
			// TODO: remove this
			createVisibleComment(100 + _scrollX, 100 + _scrollY);
		}

		public function createVisibleNodeNew(): void {
			// TODO: remove this
			showNodePicker(100, 100);
		}
		
		protected function createVisibleComment(__x:Number, __y:Number): void {
			var ta:VisibleComment = new VisibleComment();
			addVisibleComment(ta);
			ta.x = __x;
			ta.y = __y;
			ta.startEditingText();
		}
		
		protected function showNodePicker(__x:Number, __y:Number): void {
			hideCurrentNodePicker();

			currentNodePicker = new NodePicker();
			AppUtils.getStage().addChild(currentNodePicker);
			
			var p:Point = new Point(Math.round(__x) - 4, Math.round(__y) - 14);
			p = localToGlobal(p);
			
			currentNodePicker.x = p.x;
			currentNodePicker.y = p.y;
			
			currentNodePicker.addEventListener(Event.SELECT, onNodePickSelect);
			currentNodePicker.addEventListener(Event.CANCEL, onNodePickCancel);
			
			Editor.getInstance().lockShortcuts();
		}
		
		protected function onNodePickSelect(e:Event): void {
			var newNode:VisibleNode = createVisibleNode(currentNodePicker.nodeData);
			
			if (Boolean(newNode)) {
				addVisibleNode(newNode);
				var pt:Point = new Point(currentNodePicker.x, currentNodePicker.y);
				pt = nodeContainer.globalToLocal(pt);
				newNode.x = Math.round(pt.x);
				newNode.y = Math.round(pt.y);
			}
			hideCurrentNodePicker();
		}

		protected function onNodePickCancel(e:Event): void {
			hideCurrentNodePicker();
		}

		protected function hideCurrentNodePicker(): void {
			if (Boolean(currentNodePicker)) {
				currentNodePicker.removeEventListener(Event.SELECT, onNodePickSelect);
				currentNodePicker.removeEventListener(Event.CANCEL, onNodePickCancel);
				AppUtils.getStage().removeChild(currentNodePicker);
				currentNodePicker = undefined;
				Editor.getInstance().unlockShortcuts();
			}
		}

		protected function dispatchChangeEvent(): void {
			var ce:Event = new PatchEditorEvent(PatchEditorEvent.CHANGE, this);
			dispatchEvent(ce);
		}

		protected function highlightCompatibleConnectors(__visibleNode:VisibleNode, __connectorId:String, __connectorIsOutput:Boolean):void {
			// Highlight all connectors of a given type
			
			//var dataType:String = __visibleNode.node.getConnector(__connectorId, __connectorIsOutput).dataType;
			
			// TODO: must allow back linking with delayed links

			var i:Number;
			var j:Number;
			var id:String;
			for (i = 0; i < visibleNodes.length; i++) {
				for (j = 0; j < visibleNodes[i].node.numInputConnectors; j++) {
					id = visibleNodes[i].node.getConnectorId(j, false);
					visibleNodes[i].setConnectorStateHighlighted(isLinkingAllowed(__visibleNode, __connectorId, __connectorIsOutput, visibleNodes[i], id, false), id, false);
//					if (visibleNodes[i].node.getConnectorAt(j, false).dataType == dataType) {
//						visibleNodes[i].setConnectorStateHighlighted(true, visibleNodes[i].node.getConnectorId(j, false), false);
//					}
				}
				for (j = 0; j < visibleNodes[i].node.numOutputConnectors; j++) {
					id = visibleNodes[i].node.getConnectorId(j, true);
					visibleNodes[i].setConnectorStateHighlighted(isLinkingAllowed(__visibleNode, __connectorId, __connectorIsOutput, visibleNodes[i], id, true), id, true);
//					if (visibleNodes[i].node.getConnectorAt(j, true).dataType == dataType) {
//						visibleNodes[i].setConnectorStateHighlighted(true, visibleNodes[i].node.getConnectorId(j, true), true);
//					}
				}
			} 
		}
		
		protected function resetConnectorHighlights():void {
			var i:Number;
			var j:Number;
			for (i = 0; i < visibleNodes.length; i++) {
				for (j = 0; j < visibleNodes[i].node.numInputConnectors; j++) {
					visibleNodes[i].setConnectorStateHighlighted(false, visibleNodes[i].node.getConnectorId(j, false), false);
				}
				for (j = 0; j < visibleNodes[i].node.numOutputConnectors; j++) {
					visibleNodes[i].setConnectorStateHighlighted(false, visibleNodes[i].node.getConnectorId(j, true), true);
				}
			} 
		}
		
		public function canGoFullscreenSelection(): Boolean {
			// Whether it can go fullscreen with the selected nodes
			return (selectedVisibleNodes.length == 1 && selectedVisibleNodes[0] is VisibleGraphicNode);
		}
		
		public function goFullscreenSelection(): void {
			if (canGoFullscreenSelection()) {
				goFullscreen(VisibleGraphicNode(selectedVisibleNodes[0]));
			}
		}
		
		public function goFullscreen(__node:VisibleGraphicNode): void {
			// TODO: move to viewer
			selectNone();
			fullScreenNode = __node;
			isFullscreen = true;
			var stg:Stage = AppUtils.getStage();
			
			fullScreenNode.setFullScreen(true);
			stg.fullScreenSourceRect = fullScreenNode.getFullScreenRect();
			
			Editor.getInstance().startFullScreen();
			
			stg.addEventListener(FullScreenEvent.FULL_SCREEN, endFullscreen);
		}
		
		protected function endFullscreen(e:FullScreenEvent = null): void {
			fullScreenNode.setFullScreen(false);
			isFullscreen = false;
			AppUtils.getStage().removeEventListener(FullScreenEvent.FULL_SCREEN, endFullscreen);
			fullScreenNode = null;
			selectNone();
		}
		
		// Move selection by dragging mouse --------------

		protected function startMovingSelection(): void {
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_MOVE, continueMovingSelection);
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_UP, stopMovingSelection);
			lastMousePosition = null;
			isMovingSelection = true;
			continueMovingSelection();
		}

		protected function continueMovingSelection(e:MouseEvent = null): void {
			var mousePosition:Point = getMousePosition();
			if (lastMousePosition != null) {
				moveSelection(mousePosition.x - lastMousePosition.x, mousePosition.y - lastMousePosition.y);
			}
			lastMousePosition = mousePosition;
			
			if (Boolean(e)) e.updateAfterEvent();
		}

		protected function stopMovingSelection(e:MouseEvent = null): void {
			continueMovingSelection();
			lastMousePosition = null;
			isMovingSelection = false;
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_MOVE, continueMovingSelection);
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_UP, stopMovingSelection);
		}

		// Resize selection by dragging mouse from one single object --------------

		protected function startResizingSelection(): void {
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_MOVE, continueResizingSelection);
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_UP, stopResizingSelection);
			startedMousePosition = getMousePosition();
			isResizingSelection = true;
			saveNodePositions();
			//continueResizingSelection();
		}

		protected function continueResizingSelection(e:MouseEvent = null): void {
			var mousePosition:Point = getMousePosition();
			restoreNodePositions();
			resizeSelection(mousePosition.x - startedMousePosition.x, mousePosition.y - startedMousePosition.y);
			//if (Boolean(e)) e.updateAfterEvent();
		}

		protected function stopResizingSelection(e:MouseEvent = null): void {
			continueResizingSelection();
			startedMousePosition = null;
			clearNodePositions();
			isResizingSelection = false;
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_MOVE, continueResizingSelection);
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_UP, stopResizingSelection);
			if (!isResizingSelectionMouse) {
				onNodeMouseOutResize(null);
			}
		}

		// Create selection by dragging mouse --------------		

		protected function startSelectingArea(): void {
			currentRectangularSelection = new RectangularSelection();
			addChild(currentRectangularSelection);
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_MOVE, continueSelectingArea);
			AppUtils.getStage().addEventListener(MouseEvent.MOUSE_UP, stopSelectingArea);
			startedMousePosition = getMousePosition();
			lastMousePosition = getMousePosition();
			isSelectingArea = true;
			continueSelectingArea();
		}

		protected function continueSelectingArea(e:MouseEvent = null): void {
			var mousePosition:Point = getMousePosition();

			var selectionRect:Rectangle = new Rectangle();
			selectionRect.x = Math.min(startedMousePosition.x, mousePosition.x);
			selectionRect.y = Math.min(startedMousePosition.y, mousePosition.y);
			selectionRect.width = Math.abs(startedMousePosition.x - mousePosition.x)+1;
			selectionRect.height = Math.abs(startedMousePosition.y - mousePosition.y)+1;

			// Redraw square
			currentRectangularSelection.x = selectionRect.x;
			currentRectangularSelection.y = selectionRect.y;
			//currentRectangularSelection.width = mw;
			//currentRectangularSelection.height = mh;
			currentRectangularSelection.setSizeFaster(selectionRect.width, selectionRect.height);

			// Evaluate selection area - windows desktop-style
			var prevSelectionRect:Rectangle = new Rectangle();
			prevSelectionRect.x = Math.min(startedMousePosition.x, lastMousePosition.x);
			prevSelectionRect.y = Math.min(startedMousePosition.y, lastMousePosition.y);
			prevSelectionRect.width = Math.abs(startedMousePosition.x - lastMousePosition.x)+1;
			prevSelectionRect.height = Math.abs(startedMousePosition.y - lastMousePosition.y)+1;
			
			selectionRect.x += _scrollX;
			selectionRect.y += _scrollY;

			prevSelectionRect.x += _scrollX;
			prevSelectionRect.y += _scrollY;

			// Checks objects
			var i:Number, j:Number;
			var objRect:Rectangle;
			var isInSelection:Boolean;
			var isInPrevSelection:Boolean;
			
			// Check visible nodes	
			var vn:VisibleNode;
			for (i = 0; i < visibleNodes.length; i++) {
				vn = visibleNodes[i];
				objRect = new Rectangle(vn.x, vn.y, vn.width, vn.height);
				
				isInSelection = selectionRect.intersects(objRect);
				
				if (isInSelection) {
					if (!vn.isSelected) {
						selectVisibleNode(vn);
					}
				} else {
					isInPrevSelection = prevSelectionRect.intersects(objRect);
					if (isInPrevSelection && vn.isSelected) {
						deselectVisibleNode(vn);
					}
				}
				
			}
			
			// Check visible links
			var vl:VisibleLink;
			var linkLines:Vector.<Line>;
			for (i = 0; i < visibleLinks.length; i++) {
				vl = visibleLinks[i];
				//linkLine = new Line(new Point(vl.xIn, vl.yIn), new Point(vl.xOut, vl.yOut));
				linkLines = vl.getLines(true);
				// TODO: must check complex lines too, not just straight ones; move linkLine creator to VisibleLink class?
				
				isInSelection = false;
				for (j = 0; j < linkLines.length; j++) {
					if (linkLines[j].intersectsRect(selectionRect)) {
						isInSelection = true;
						break;
					}
				}
				
				if (isInSelection) {
					if (!vl.isSelected) {
						selectVisibleLink(vl);
					}
				} else {
					isInPrevSelection = false;
					for (j = 0; j < linkLines.length; j++) {
						if (linkLines[j].intersectsRect(prevSelectionRect)) {
							isInPrevSelection = true;
							break;
						}
					}
					//linkLine.intersectsRect(prevSelectionRect);
					if (isInPrevSelection && vl.isSelected) {
						deselectVisibleLink(vl);
					}
				}
			}
			
			// Check comments	
			var ta:VisibleComment;
			for (i = 0; i < visibleComments.length; i++) {
				ta = visibleComments[i];
				objRect = new Rectangle(ta.x, ta.y, ta.width, ta.height);
				
				isInSelection = selectionRect.intersects(objRect);
				
				if (isInSelection) {
					if (!ta.isSelected) {
						selectVisibleComment(ta);
					}
				} else {
					isInPrevSelection = prevSelectionRect.intersects(objRect);
					if (isInPrevSelection && ta.isSelected) {
						deselectVisibleComment(ta);
					}
				}
				
			}

			lastMousePosition = mousePosition;
			
			//e.updateAfterEvent();
		}

		protected function stopSelectingArea(e:MouseEvent = null): void {
			continueSelectingArea();
			removeChild(currentRectangularSelection);
			currentRectangularSelection = null;
			startedMousePosition = null;
			lastMousePosition = null;
			isSelectingArea = false;
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_MOVE, continueSelectingArea);
			AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_UP, stopSelectingArea);
		}

		// Drag the canvas by pressing space and dragging mouse --------------

		protected function startDraggingCanvasMouse(): void {
			if (!isDraggingCanvasMouse) {
				MouseUtils.setSpecialCursor(MouseUtils.CURSOR_HAND);
				nodeContainer.mouseEnabled = nodeContainer.mouseChildren = false;
				linkContainer.mouseEnabled = linkContainer.mouseChildren = false;
				commentContainer.mouseEnabled = commentContainer.mouseChildren = false;
				isDraggingCanvasMouse = true;
			}
		}

		protected function stopDraggingCanvasMouse(): void {
			if (isDraggingCanvasMouse) {
				stopDraggingCanvas();
				MouseUtils.removeSpecialCursor();
				nodeContainer.mouseEnabled = nodeContainer.mouseChildren = true;
				linkContainer.mouseEnabled = linkContainer.mouseChildren = true;
				commentContainer.mouseEnabled = commentContainer.mouseChildren = true;
				isDraggingCanvasMouse = false;
			}
		}

		protected function startDraggingCanvas(): void {
			if (!isDraggingCanvas) {
				AppUtils.getStage().addEventListener(MouseEvent.MOUSE_MOVE, continueDraggingCanvas);
				AppUtils.getStage().addEventListener(MouseEvent.MOUSE_UP, stopDraggingCanvas);
				lastMousePosition = null;
				continueMovingSelection();
				isDraggingCanvas = true;
			}
		}

		protected function continueDraggingCanvas(e:MouseEvent = null): void {
			var mousePosition:Point = getMousePosition();
			
			if (lastMousePosition != null) {
				moveCanvas(lastMousePosition.x - mousePosition.x, lastMousePosition.y - mousePosition.y);
			}
			lastMousePosition = mousePosition;
			
			//if (Boolean(e)) e.updateAfterEvent();
		}

		protected function stopDraggingCanvas(e:MouseEvent = null): void {
			if (isDraggingCanvas) {
				continueDraggingCanvas();
				lastMousePosition = null;
				AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_MOVE, continueDraggingCanvas);
				AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_UP, stopDraggingCanvas);
				isDraggingCanvas = false;
			}
		}


		// Draw a link by pressing clicking on a node connector --------------
		
		protected function startDrawingLink(__visibleNode:VisibleNode, __connectorId:String, __connectorIsOutput:Boolean): void {
			if (!isDrawingLink) {
				hideCurrentTooltip();
				
				drawingVisibleLink = new VisibleLink(null);
				addVisibleLink(drawingVisibleLink);
				
				// TODO: set connector from node as linked
				// TODO: highlight linkable connectors
				
				drawingVisibleNode = __visibleNode;
				drawingConnectorId = __connectorId;
				drawingConnectorIsOutput = __connectorIsOutput;
				drawingVisibleLinkFirstPointDone = false;
				
				isDrawingLink = true;
				
				drawingVisibleNode.setConnectorStateLinked(true, drawingConnectorId, drawingConnectorIsOutput);

				AppUtils.getStage().addEventListener(MouseEvent.MOUSE_MOVE, continueDrawingLink);
				addEventListener(MouseEvent.CLICK, clickDrawingLink);
				
				highlightCompatibleConnectors(drawingVisibleNode, drawingConnectorId, drawingConnectorIsOutput);
				
				continueDrawingLink();
			}
		}
		
		protected function continueDrawingLink(e:MouseEvent = null): void {
			if (isDrawingLink) {
				var p1:Point = getConnectorCenter(drawingVisibleNode.node, drawingConnectorId, drawingConnectorIsOutput);
				var p2:Point = new Point(mouseX + _scrollX, mouseY + _scrollY);
				//var p:Point = new Point()
				if (drawingConnectorIsOutput) {
					drawingVisibleLink.xIn = p1.x;
					drawingVisibleLink.yIn = p1.y;
				
					drawingVisibleLink.xOut = p2.x;
					drawingVisibleLink.yOut = p2.y;
				} else {
					drawingVisibleLink.xIn = p2.x;
					drawingVisibleLink.yIn = p2.y;
				
					drawingVisibleLink.xOut = p1.x;
					drawingVisibleLink.yOut = p1.y;
				}
				if (Boolean(e)) e.updateAfterEvent();
			}
		}

		protected function clickDrawingLink(e:MouseEvent = null): void {
			if (isDrawingLink) {
				
				continueDrawingLink();
				
				if (drawingVisibleLinkFirstPointDone) {
					if (drawingConnectorIsOutput) {
						drawingVisibleLink.addPoint(new Point(mouseX + _scrollX, mouseY + _scrollY));
					} else {
						drawingVisibleLink.addPointAt(new Point(mouseX + _scrollX, mouseY + _scrollY), 0);
					}
				} else {
					drawingVisibleLinkFirstPointDone = true;
				}
				
			}
		}
		
		protected function finishDrawingLink(__visibleNode:VisibleNode, __connectorId:String, __connectorIsOutput:Boolean): void {
			if (isDrawingLink) {
				if (isLinkingAllowed(drawingVisibleNode, drawingConnectorId, drawingConnectorIsOutput, __visibleNode, __connectorId, __connectorIsOutput)) {
					// Completes a link
					
					var newLink:Link;
					if (__connectorIsOutput) {
						newLink = createLink(__visibleNode.node, __connectorId, drawingVisibleNode.node, drawingConnectorId);
					} else {
						newLink = createLink(drawingVisibleNode.node, drawingConnectorId, __visibleNode.node, __connectorId);
					}
					
					newLink.process();
					
//					newLink.outputNode.getConnector(newLink.outputConnector).hasChanged = true;

					var newVisibleLink:VisibleLink = new VisibleLink(newLink);
					
					for (var i:Number = 0; i < drawingVisibleLink.numPoints; i++) {
						newVisibleLink.addPoint(drawingVisibleLink.getPointAt(i));
					}
					
					stopDrawingLink();
					patch.addLink(newLink);
					addVisibleLink(newVisibleLink);
				}
			}
		}

		protected function stopDrawingLink(): void {
			if (isDrawingLink) {
				// Cancel drawing link
				continueDrawingLink();

				// TODO: set connector from node as unlinked
				resetConnectorHighlights();
				
				removeVisibleLink(drawingVisibleLink);
				drawingVisibleLink = null;
				
				drawingVisibleNode.setConnectorStateLinked(isNodeConnected(drawingVisibleNode, drawingConnectorId, drawingConnectorIsOutput), drawingConnectorId, drawingConnectorIsOutput);
				// TODO: make this a more generic catch-all function?
				
				drawingVisibleNode = null;
				drawingConnectorId = null;
				drawingConnectorIsOutput = false;
				drawingVisibleLinkFirstPointDone = false;

				AppUtils.getStage().removeEventListener(MouseEvent.MOUSE_MOVE, continueDrawingLink);
				removeEventListener(MouseEvent.CLICK, clickDrawingLink);

				isDrawingLink = false;
			}
		}


		// ================================================================================================================
		// EVENT functions ------------------------------------------------------------------------------------------------

		protected function onLinkMouseDownSelect(e:VisibleLinkEvent): void {
			if (isMovingFreely) {
				if (selectedVisibleLinks.indexOf(e.visibleLink) > -1) {
					// Already selected
					if (KeyboardUtils.isShiftDown()) {
						deselectVisibleLink(e.visibleLink);
					}
				} else {
					// Not selected
					if (!KeyboardUtils.isAdditionalSelectionModifierDown()) selectNone();
					selectVisibleLink(e.visibleLink);
				}
			}
		}

		protected function onCommentMouseDownMove(e:VisibleCommentEvent): void {
			if (isMovingFreely) {
				hideCurrentTooltip();
				var canStartMoving:Boolean = true;
				if (selectedVisibleComments.indexOf(e.visibleComment) > -1) {
					// Already selected
					if (KeyboardUtils.isShiftDown()) {
						deselectVisibleComment(e.visibleComment);
						canStartMoving = false;
					}
				} else {
					// Not selected
					if (!KeyboardUtils.isAdditionalSelectionModifierDown()) selectNone();
					bringCommentToFront(e.visibleComment);
					selectVisibleComment(e.visibleComment);
				}
				if (canStartMoving) startMovingSelection();
			}
		}

		protected function onCommentMouseOverMove(e:VisibleCommentEvent): void {
			if (!isResizingSelection && !isDraggingCanvasMouse && !isSelectingArea && _isFocused && !isDrawingLink) {
				MouseUtils.setSpecialCursor(MouseUtils.CURSOR_MOVE);
				isMovingSelectionMouse = true;
			}
		}

		protected function onCommentMouseOutMove(e:VisibleCommentEvent): void {
			if (!isResizingSelection && !isDraggingCanvasMouse && !isSelectingArea && _isFocused && !isDrawingLink) {
				if (!isMovingSelection) MouseUtils.removeSpecialCursor();
				isMovingSelectionMouse = false;
			}
		}

		protected function onNodeMouseOverConnector(e:VisibleNodeEvent): void {
			if (isMovingFreely || isDrawingLink) {
				var rect:Rectangle = e.visibleNode.getConnectorBounds(e.targetConnectorId, e.targetConnectorIsOutput);
				//var connectorValue:Array = e.targetConnectorIsOutput ? e.visibleNode.node.getOutputValue(e.targetConnectorId) : e.visibleNode.node.getInputValue(e.targetConnectorId);
				var pt:Point = new Point(rect.x+rect.width/2, rect.y+rect.height/2);
				pt = e.visibleNode.localToGlobal(pt);
				pt = globalToLocal(pt);
				var conn:Connector = e.visibleNode.node.getConnector(e.targetConnectorId, e.targetConnectorIsOutput);
				showTooltip(DataType.getTooltipText(conn.description, conn.getValue(), conn.dataType), Math.round(pt.x), Math.round(pt.y), e.targetConnectorIsOutput ? Tooltip.ARROW_UP : Tooltip.ARROW_DOWN);
				//showTooltip(connectorValue.toString(), Math.round(pt.x), Math.round(pt.y), e.targetConnectorIsOutput ? Tooltip.ARROW_UP : Tooltip.ARROW_DOWN);
				
				if (!isDrawingLink) e.visibleNode.setConnectorStateHighlighted(true, e.targetConnectorId, e.targetConnectorIsOutput);
			}
		}
		
		protected function onNodeMouseOutConnector(e:VisibleNodeEvent): void {
//			Console.getInstance().echo("Editor :: VisibleNode " + e.visibleNode + " mouse out connector " + e.targetConnectorIndex + " " + (e.targetConnectorIsOutput ? "(output)" : "(input)"));
			//if (isMovingFreely || (e.visibleNode == drawingVisibleNode && e.targetConnectorId == drawingConnectorId && e.targetConnectorIsOutput == drawingConnectorIsOutput)) {
			if (isMovingFreely || isDrawingLink) {
				if (!isDrawingLink) {
					e.visibleNode.setConnectorStateHighlighted(false, e.targetConnectorId, e.targetConnectorIsOutput);
				} else {
					drawingVisibleLinkFirstPointDone = true;
				}
				hideCurrentTooltip();
			}
		}

		protected function onNodeMouseDownConnector(e:VisibleNodeEvent): void {
			//Logger.getInstance().addMessage("Editor :: VisibleNode " + e.visibleNode + " mouse down connector " + e.targetConnectorId + " " + (e.targetConnectorIsOutput ? "(output)" : "(input)"));
			if (isMovingFreely) {
				startDrawingLink(e.visibleNode, e.targetConnectorId, e.targetConnectorIsOutput);
			}
		}

		protected function onNodeMouseUpConnector(e:VisibleNodeEvent): void {
			//Logger.getInstance().addMessage("Editor :: VisibleNode " + e.visibleNode + " mouse up connector " + e.targetConnectorId + " " + (e.targetConnectorIsOutput ? "(output)" : "(input)"));
			if (isDrawingLink) {
				finishDrawingLink(e.visibleNode, e.targetConnectorId, e.targetConnectorIsOutput);
			}
		}

		protected function onNodeEditStart(e:VisibleNodeEvent): void {
			isEditingNode = true;
			Editor.getInstance().lockShortcuts();
			if (isDrawingLink) stopDrawingLink();
		}
		
		protected function onNodeEditChange(e:VisibleNodeEvent): void {
			dispatchChangeEvent();
		}

		protected function onNodeEditEnd(e:VisibleNodeEvent): void {
			isEditingNode = false;
			Editor.getInstance().unlockShortcuts();
		}

		protected function onCommentEditStart(e:VisibleCommentEvent): void {
			isEditingComment = true;
			Editor.getInstance().lockShortcuts();
			if (isDrawingLink) stopDrawingLink();
		}
		
		protected function onCommentEditChange(e:VisibleCommentEvent): void {
			dispatchChangeEvent();
		}

		protected function onCommentEditEnd(e:VisibleCommentEvent): void {
			isEditingComment = false;
			Editor.getInstance().unlockShortcuts();
			if (e.visibleComment.value.length == 0) {
				removeVisibleComment(e.visibleComment);
			}
		}

		protected function onBackgroundMouseDown(e:MouseEvent): void {
			if (isMovingFreely) {
				if (!KeyboardUtils.isShiftDown()) selectNone();
				startSelectingArea();
			} else {
				if (isDraggingCanvasMouse) {
					startDraggingCanvas();
				}
			}
		}

		protected function onBackgroundDoubleClick(e:MouseEvent): void {
			//Logger.getInstance().addMessage("Double click");
			if (KeyboardUtils.isShiftDown()) {
				createVisibleComment(mouseX + _scrollX, mouseY + _scrollY);
			} else {
				showNodePicker(mouseX, mouseY);
			}
		}

		protected function onKeyDown(e:KeyboardEvent): void {
			if (!isFullscreen) {
				var pxOffset:Number = KeyboardUtils.isShiftDown() ? 10 : 1;
				switch (e.keyCode) {
					case Keyboard.ESCAPE:
						if (isDrawingLink) {
							stopDrawingLink();
							e.updateAfterEvent();
						}
						break;
					case Keyboard.UP:
						if (isMovingFreely) {
							if (KeyboardUtils.isControlDown()) {
								resizeSelection(0, -pxOffset);
							} else {
								moveSelection(0, -pxOffset);
							}
							e.updateAfterEvent();
						}
						break;
					case Keyboard.DOWN:
						if (isMovingFreely) {
							if (KeyboardUtils.isControlDown()) {
								resizeSelection(0, pxOffset);
							} else {
								moveSelection(0, pxOffset);
							}
							e.updateAfterEvent();
						}
						break;
					case Keyboard.LEFT:
						if (isMovingFreely) {
							if (KeyboardUtils.isControlDown()) {
								resizeSelection(-pxOffset, 0);
							} else {
								moveSelection(-pxOffset, 0);
							}
							e.updateAfterEvent();
						}
						break;
					case Keyboard.RIGHT:
						if (isMovingFreely) {
							if (KeyboardUtils.isControlDown()) {
								resizeSelection(pxOffset, 0);
							} else {
								moveSelection(pxOffset, 0);
							}
							e.updateAfterEvent();
						}
						break;
					case Keyboard.SPACE:
						startDraggingCanvasMouse();
						e.updateAfterEvent();
						break;
					case Keyboard.BACKSPACE:
					case Keyboard.DELETE:
						if (isMovingFreely) {
							deleteSelection();
						}
						if (isDrawingLink) {
							drawingVisibleLink.removePoint();
						}
						break;
				}
			}
		}

		protected function onKeyUp(e:KeyboardEvent): void {
			if (!isFullscreen) {
				switch (e.keyCode) {
					case Keyboard.SPACE:
						stopDraggingCanvasMouse();
						break;
				}
			}
		}



	}
}

*/