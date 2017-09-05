// Proficio Demo

(function(){
	var options1 = {
		id: 'demo1',
		name: 'demo1',
		targetContainer: '#demo1-target',
		rangeContainer: '#demo1',
		val: 25,
		min: 0,
		max: 100,
		granularity: "5",
		orientation: 'h'
	}

	var options2 = {
		id: 'demo2',
		name: 'demo2',
		targetContainer: '#demo2-target',
		rangeContainer: '#demo2',
		val: 10,
		min: 0,
		max: 100,
		granularity: "10",
		orientation: 'v',
		callback: function() {
			var myRangeInstance = this
				, myTargetElem = document.querySelector('#demo2-target')
				, myRangeVal = myRangeInstance.val
				, myNewOpacity = myRangeVal/100;
			;
			console.log('My custom callback with my Proficio JS instance: ', myRangeInstance)
			console.log('Setting the opacity of the target based on the progress made in the range: ' + myNewOpacity);

			myTargetElem.style.cssText = 'opacity: ' + myNewOpacity;
		}
	}

	var options3 = {
		id: 'demo3',
		name: 'demo3',
		targetContainer: '#demo3-target',
		rangeContainer: '#demo3',
		val: 25,
		min: 0,
		max: 100,
		granularity: "5",
		orientation: 'h'
	}

	document.addEventListener('DOMContentLoaded',function() {
		var myProficio1 = new Proficio(options1)
			, myProficio2 = new Proficio(options2)
			, myProficio3 = new Proficio(options3)
			, btnStepper = document.querySelector('.rangeStepper')
			, demo3Form = document.querySelector('#demo3-form')
			, demo3Input = document.querySelector('#demo3-input')
			, myProficio3Submit = demo3Form.addEventListener('submit', function(e){
				e.preventDefault();
				// set the range value directly
				myProficio3.set(demo3Input.value);
			}, false)
			, myProficio3Change = btnStepper.addEventListener('click', function(e){
				var tar = e.target
					, dir = tar.getAttribute('data-direction')
				;
				// step up/down on the range directly
				myProficio3.step(dir);
			}, false)
		;

		console.warn(myProficio1, myProficio2, myProficio3);
	},false);

})();
