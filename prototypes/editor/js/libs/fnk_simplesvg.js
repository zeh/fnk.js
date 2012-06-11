var SimpleSVG = function(__width, __height) {
	this.element = document.createElementNS(this.NAMESPACE, "svg");
	this.element.setAttribute("width", __width);
	this.element.setAttribute("height", __height);
	this.element.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
};

SimpleSVG.prototype.NAMESPACE = "http://www.w3.org/2000/svg";

SimpleSVG.prototype.clear = function() {
	while (this.element.hasChildNodes()) this.element.removeChild(this.element.firstChild);
}

SimpleSVG.prototype.setPosition = function(__x, __y) {
	this.element.style.left = __x + "px";
	this.element.style.top = __y + "px";
	this.element.style.position = "absolute";
}

SimpleSVG.prototype.setDimensions = function(__width, __height) {
	this.element.setAttribute("width", __width);
	this.element.setAttribute("height", __height);
}

SimpleSVG.prototype.circle = function(__x, __y, __radius) {
	var shape = document.createElementNS(this.NAMESPACE, "circle");

	shape.setAttributeNS(null, "cx", __x);
	shape.setAttributeNS(null, "cy", __y);
	shape.setAttributeNS(null, "r",  __radius);
	//shape.setAttributeNS(null, "fill", __fillColor);
	
	this.element.appendChild(shape);

	// c2.setAttribute("stroke", "#AA99FF");
	// c2.setAttribute("stroke-width", "7");
	
	// <line x1="900" y1="300" x2="1100" y2="100" stroke-width="25" />
};

SimpleSVG.prototype.line = function(__x1, __y1, __x2, __y2) {
	var shape = document.createElementNS(this.NAMESPACE, "line");

	shape.setAttributeNS(null, "x1", __x1);
	shape.setAttributeNS(null, "y1", __y1);
	shape.setAttributeNS(null, "x2", __x2);
	shape.setAttributeNS(null, "y2", __y2);
	shape.setAttributeNS(null, "stroke-width", "4");
	shape.setAttributeNS(null, "stroke", "#000000");
	
	this.element.appendChild(shape);
};

SimpleSVG.prototype.path = function(__commands) {
	var shape = document.createElementNS(this.NAMESPACE, "path");
	
	var commands = "";
	var i, j;
	for (i = 0; i < __commands.length; i++) {
		commands += __commands[i].command;
		for (j = 0; j < __commands[i].parameters.length; j++) {
			commands += __commands[i].parameters[j].join(",") + " ";
		}
	}
	
	shape.setAttributeNS(null, "d", commands);
	shape.setAttributeNS(null, "stroke-width", "1");
	shape.setAttributeNS(null, "stroke", "#000000");
	shape.setAttributeNS(null, "fill", "none");
	shape.setAttributeNS(null, "class", "fnk-link");
	
	this.element.appendChild(shape);
	//<path d="M 100 100 L 300 100 L 200 300 z" fill="red" stroke="blue" stroke-width="3" />
}