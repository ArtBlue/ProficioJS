# Proficio JS
Proficio JS is an abstract interactive range visualization engine that allows for a wide variety of implemntations. You can use Proficion JS to build things like,

1. Time-lapse of maps and countries through history.
2. Cross-fading graphics from one range value to another.
3. Interactive timeline
4. interactive infographics
5. Anything that changes and can be visualized

Since Proficio JS is merely an abstract engine, the possibilities for what you can build are endless. There is enough flexibility to allow for anything. Anything that changes (everything) and can be visualized can be built for the web using Proficio JS. It uses the input range element native to HTML and is written in vanilla JS and CSS3, which means that it works everywhere - on all types of browsers and devices. The only exceptions are ancient browsers (IE < 9). It won't work in those.

## Implementation
The basic implementation requires very little. Here's how to get started:

### a. Set up your basic HTML structure:

```html
<div id="demo1"></div>
<div id="demo1-target"></div>
```

### b. Add the Proficio JS file before you close <body>.

```html
<script type="text/javascript" src="dist/proficio..min.js"></script>
```

### c. Instantiate Proficio JS after DOMContentLoaded:

```javascript
document.addEventListener('DOMContentLoaded',function() {
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
	var myProficio1 = new Proficio(options1);
},false);
```

### d. Write CSS to match the different milestone levels:

```css
#demo1-target {
	height: 200px;
	background: #efefef;
	transition: background 500ms ease-in-out;
}
#demo1-target[data-range-value='0'] {
	background: #000;
}
#demo1-target[data-range-value='5'] {
	background: #ccc;
}
#demo1-target[data-range-value='10'] {
	background: #f67;
}
#demo1-target[data-range-value='15'] {
	background: #ff6600;
}
#demo1-target[data-range-value='20'] {
	background: #ffcc00;
}
#demo1-target[data-range-value='25'] {
	background: #69c;
}
#demo1-target[data-range-value='30'] {
	background: yellow;
}
#demo1-target[data-range-value='35'] {
	background: magenta;
}
#demo1-target[data-range-value='40'] {
	background: teal;
}
#demo1-target[data-range-value='45'] {
	background: green;
}
```

### e. That's it!
When your range value matches the range value specified in your CSS, your target container will be styled with whatever you specify under the spcific declaration.

NOTE: It's best to include granularity that matches the specific milestones of your range. If Granularity is not included, Proficio JS will default to a number with 2 decimal places, which may be a bit harder to match to a range milestone and may require a large number of style declarations.

### Configuration

* `id` - unique ID of your Proficio instance.
* `name` - name of your Proficion instance (this is simply for the sake of flexibility; can be the same as the ID).
* `targetContainer` - the selector of the target element that will get all the styles applied.
* `rangeContainer` - the selector of the range element container in which the range input element will be created with the corresponding settings.
* `val` - the initial value of the range.
* `min` - the minimum value of the range.
* `max` - the maximum value of the range.
* `granularity` - the value will be changed by the level of granularity passed in (if 5, then the range will change only by 5s). **It's highly recommended to use this as its exclusion may yield extreme weirdness!**
* `orientation` - 'h' for horizontal, 'v' for vertical
* `callback` - the custom callback function for advanced implementations. You can use `this` to access the specific Proficio instance.
* `playSpeed` - speed in ms for how fast to play the range when `.play()` is called on the instance.

### API Methods

`step(direction)` - Allows for stepping through the range from the outside. `direction` can be `up` or `down`. If the current range value is `50` and the `granularity` is `10`, calling `instance.step('up')` would result in the value of `60` and `instance.step('down')` would result in `40`.

`set(value)` - Allows for value of the range to be set from the outside. Calling `instance.set('10')` would result in the instance value to be set to `10`.

`play()` - Plays the range automatically. The play speed is based on either the `playSpeed` option passed in or defaults to 100ms.

`pause()` - Pauses the range at the current play progress marker.

`stop()` - Stops the playing range and resets the range to min value passed in.

