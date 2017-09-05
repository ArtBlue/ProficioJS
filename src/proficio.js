/**
 * Proficio JS  - an abstract interactive range visualization engine that allows for a wide variety of implemntations.
 * @version 	0.2.0
 * @author 		Arthur Khachatryan <arthur@aspiremedia.net>
 * @license  	http://opensource.org/licenses/MIT  	MIT License
 * @beta
 * @param 		{object} 	config 				configuration object
 * @param 		{string} 	config.id 			id of the instance
 * @param 		{string} 	[config.name] 		optional name of the instance
 * @param 		{number} 	[config.val] 		initial value of range
 * @param 		{number} 	config.min 			minimum possible value of the range
 * @param 		{number} 	config.max 			maximum possible value of the range
 * @param 		{number} 	config.granularity 	the granularity of each step in the range; technically this is optional, but excluding it may cause a lot of weirdness
 * @param 		{string} 	[config.orientation] 'h' for horizontal (default), 'v' for vertical
 * @param 		{function} 	[config.callback] 	optional custom callback function for handling range changes
 * @example <caption>basic usage</caption>
 * var options = {
 *		id: 'demo1',
 *		targetContainer: '#demo1-target',
 *		rangeContainer: '#demo1',
 *		val: 25,
 *		min: 0,
 *		max: 100,
 *		granularity: "5"
 *	}
 *	var myProficio1 = new Proficio(options1);
 * @example <caption>vertical usage</caption>
 * var options = {
 *		id: 'demo1',
 *		name: 'demo1',
 *		targetContainer: '#demo1-target',
 *		rangeContainer: '#demo1',
 *		val: 25,
 *		min: 0,
 *		max: 100,
 *		granularity: "5",
 *		orientation: 'v'
 *	}
 *	var myProficio2 = new Proficio(options);
 * @example <caption>advanced usage w/callback</caption>
 * var options = {
 *		id: 'demo1',
 *		name: 'demo1',
 *		targetContainer: '#demo1-target',
 *		rangeContainer: '#demo1',
 *		val: 25,
 *		min: 0,
 *		max: 100,
 *		granularity: "5",
 *		callback: function(){
 *			// do my own cool stuff here...
 *			console.log(this.val); // getting the value of the newly set range
 *		}
 *	}
 *	var myProficio3 = new Proficio(options);
 */
function Proficio(config) {
	// not called with config, fail fast
	if (!config || !config.targetContainer || !config.rangeContainer) {
		return console.warn('Error: config object and range target element must exist.');
	}

	TARGET_ATTR_RANGE_VALUE = 'data-range-value';
	RANGE_VERTICALITY_CLASS = 'proficio-range-vertical'

	// settings
	this.id = config.id;
	this.name = config.name || '';
	this.val = config.val || '';
	this.min = config.min || 0;
	this.max = config.max || 100;
	this.granularity = config.granularity || 'any';
	this.orientation = config.orientation || 'h';
	this.callback = config.callback;

	// range and target container element information
	this.targetContainer = config.targetContainer;
	this.targetContainerCss = config.targetContainerCss;
	this.targetEl = document.querySelector(this.targetContainer);
	this.rangeContainer = config.rangeContainer;
	this.rangeContainerCss = config.rangeContainerCss;
	this.rangeEl = document.querySelector(this.rangeContainer);
	this.fnOnRangeChange = null;
	this.fnCustomCB = null;

	/**
	 * Call a stepUp() or stepDown() on the range input element and force onChange event
	 * @method step
	 * @public
	 * @param  {string} direction direction of step - 'up' or 'down'
	 * @return {undefined}
	 */
	this.step = function(direction) {
		var rangeEl = this.rangeEl;

		if (direction === 'up') {
			rangeEl.stepUp();
		} else if (direction === 'down') {
			rangeEl.stepDown();
		} else {
			return;
		}

		_forceOnChange(rangeEl);
	}

	/**
	 * Set range value directly
	 * @method set
	 * @public
	 * @param  {string} direction direction of step - 'up' or 'down'
	 * @return {undefined}
	 */
	this.set = function(val) {
		this.val = this.rangeEl.value = val;
		_forceOnChange(this.rangeEl);
	}

	_setupTarget.call(this);
	_createRange.call(this);
	_setupEvents.call(this);

	return this;

	/**
	 * Creates the range element
	 * @method _createRange
	 * @property {string} rangeClasses range classes to be added to the range container
	 * @return {undefined}
	 */
	function _createRange() {
		var rangeClasses = this.rangeContainerCss || '';

		if (this.orientation === 'v') {
			rangeClasses = (rangeClasses) 
							? rangeClasses + ' ' + RANGE_VERTICALITY_CLASS
							: RANGE_VERTICALITY_CLASS
			;
		}
		if (this.rangeEl.classList.length) {
			this.rangeEl.classList += ' ' + rangeClasses;
		} else {
			this.rangeEl.classList = rangeClasses;
		}

		// range element will be reassigned to the newly created range input element
		this.rangeEl = _appendChild({
			elParent: this.rangeEl,
			newTag: 'input',
			newElID: this.id,
			attribs: [
				{ aName: 'type',        aVal: 'range' },
				{ aName: 'name',        aVal: this.id },
				{ aName: 'value',       aVal: this.val },
				{ aName: 'min',         aVal: this.min },
				{ aName: 'max',         aVal: this.max },
				{ aName: 'step',        aVal: this.granularity },
				{ aName: 'orientation', aVal: this.orientation }
			],
			sHTML: null
		});
	}

	/**
	 * Set up all the events
	 * @method _setupEvents
	 * @property {object} self copy of instance
	 * @return {undefined}
	 */
	function _setupEvents() {
		var self = this;
		this.fnOnRangeChange = this.rangeEl.addEventListener('change', _onRangeChange.bind(self), false);

		if (this.callback && typeof this.callback === "function") {
			this.fnCustomCB = this.rangeEl.addEventListener('change', this.callback.bind(self), false);
		}
	}

	/**
	 * On range change callback
	 * @method _onRangeChange
	 * @param  {object} e event object
	 * @property {number} nProgress progress number rounded down to 2 decimal places
	 * @return {undefined}
	 */
	function _onRangeChange(e) {
		var nProgress = _round(e.target.value, 2);
		this.targetEl.setAttribute(TARGET_ATTR_RANGE_VALUE, nProgress);
		this.val = nProgress;
	}

	/**
	 * Force onChange event for instances in which it does not get fired (direct value change)
	 * @param  {DOMElement} element the element on which to fire the onChange event
	 * @return {undefined}
	 */
	function _forceOnChange(element) {
		var evt;

		if ("createEvent" in document) {
			evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			element.dispatchEvent(evt);
		} else {
			element.fireEvent("onchange");
		}
	}

	/**
	 * Set up the target element
	 * @method _setupTarget
	 * @return {undefined}
	 */
	function _setupTarget() {
		var targetEl = this.targetEl
			, currentTargetClasses = targetEl.classList || ''
			, rangeAttr
		;

		// append any new classes to the target container element
		if (this.targetContainerCss) {
			targetEl.classList = currentTargetClasses + ' ' + this.targetContainerCss;
		}

		rangeAttr = targetEl.setAttribute(TARGET_ATTR_RANGE_VALUE, this.val);
	}

	/**
	 * Append DOM element with its own features to parent element
	 * @method      _appendChild
	 * @param       {object}        args                the arguments object
	 * @property    {DOMElement}    args.elParent       the parent DOM element   
	 * @property    {string}        args.newTag         the new HTML tag to be created  
	 * @property    {string}        args.newElID        the new ID to be applied to the element being created  
	 * @property    {array}         args.newElClasses   the list of classes to be added to the element being created 
	 * @property    {array}         args.attribs        the list of attribute object for name and value to be added to the element being created
	 * @return      {DOMElement}                        the newly created DOM element 
	 */
	function _appendChild(args) {
		var elParent       = args.elParent
			, newTag       = args.newTag
			, newElID      = args.newElID
			, newEl        = document.createElement(newTag)
			, newElClasses = args.elClasses
			, newElAttr    = args.attribs || null
			, i = 0
			, newElAttrLen
		;

		newEl.id = newElID;

		if (newElClasses) {
			newEl.classList = newElClasses;
		}

		// if attribute(s), iterate and add all
		if (newElAttr) {
			newElAttrLen = newElAttr.length;

			for (; i < newElAttrLen; i++) {
				newEl.setAttribute(newElAttr[i].aName, newElAttr[i].aVal);
			}
		}

		elParent.appendChild(newEl);
		
		return newEl;
	}

	/**
	 * Round number
	 * @method _round
	 * @param  {number} num       the number to round
	 * @param  {number} precision the number of places to round to
	 * @return {number}           the rounded number
	 */
	function _round(num, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = num * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	}

}
