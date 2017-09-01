


function Proficio(config) {
	// not called with config, fail fast
	if (!config || !config.targetContainer || !config.rangeContainer) {
		return console.warn('Error: config object and range target element must exist.');
	}

	TARGET_ATTR_RANGE_VALUE = 'data-range-value';
	RANGE_VERTICALITY_CLASS = 'proficio-range-vertical'

	// settings
	this.id = config.id;
	this.name = config.name;
	this.val = config.val;
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
			// elClasses: rangeClasses,
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

	function _setupTarget() {
		var targetEl = this.targetEl
			, currentTargetClasses = targetEl.classList || ''
			, rangeAttr
		;

		// append any new classes to the target container element
		if (this.targetContainerCss) {
			targetEl.classList = currentTargetClasses + ' ' + this.targetContainerCss;
		}

		// add default value of the range as an attribute of the target
		rangeAttr = targetEl.setAttribute(TARGET_ATTR_RANGE_VALUE, this.val);
		//rangeAttr.value = this.val;
		//targetEl.setAttributeNode(rangeAttr); // set range attribute
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
