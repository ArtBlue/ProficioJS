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
			console.log('Setting the opacity of the target based on the progress made in the range...');

			myTargetElem.style.cssText = 'opacity: ' + myNewOpacity;
		}
	}

	document.addEventListener('DOMContentLoaded',function() {
		var myProficio1 = new Proficio(options1);
		var myProficio2 = new Proficio(options2);

		console.warn(myProficio1, myProficio2);
	},false);
})();
