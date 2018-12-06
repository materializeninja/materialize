class Ninja {

	constructor(...args){
		console.log('Ninja');
		console.log(this);

		const options = Object.assign({
			scriptsArray: [ ],
			functionMap: { },
        }, args[0]);
        Object.assign(this, options);	
	}

	on(...args){ this.addEventListener(...args); }
	addEventListener(ele, event, func) {
		if(typeof(this.functionMap[ele]) == 'undefined'){
			this.functionMap[ele] = { };
		};

		let _event = event.includes('.') ? event.split('.')[0] : event;

    	this.functionMap[ele][event] = func;
	    ele.addEventListener(event, this.functionMap[ele][event]);
	}

	off(...args){ this.removeEventListener(...args); }
	removeEventListener(ele, event) {
        let _event = event.includes('.') ? event.split('.')[0] : event;

	    ele.removeEventListener(event, this.functionMap[ele][event]);
    	delete this.functionMap[ele][event];
	}

	addJS(filepath){
		/**
		 * This promise doesn't require a reject
		 * as it resolves itself if there is an issue
		 */
		return new Promise((resolve) => {
			/**
			 * If the script has already been added don't add again
			 */
			if(this.scriptsArray.includes(filepath)){
				var script = document.querySelectorAll('[src="'+filepath+'"]');
				// maybe a more elegant way of doing this maybe not
				var oldOnload = script[0].onload = script[0].onreadystatechange;

				script[0].onload = script[0].onreadystatechange = function(){
					oldOnload();
                	resolve(true);
    	        }
				return;
			}

			this.scriptsArray.push(filepath);

			var ele = document.createElement('script');
			var head = document.getElementsByTagName('head')[0];

			ele.type = 'text/javascript';
			ele.src = filepath;

			ele.onload = ele.onreadystatechange = function(){ 
				resolve(true);
			}

			head.appendChild(ele);
		});
	}

	empty(mixedVar){
		var undef;
		var key;
		var i;
		var len;
		var emptyValues = [undef, null, false, 0, '', '0'];

		for (i = 0, len = emptyValues.length; i < len; i++) {
			if (mixedVar === emptyValues[i]) {
				return true;
			}
		}

		if (typeof mixedVar === 'object') {
			for (key in mixedVar) {
				if (mixedVar.hasOwnProperty(key)) {
					return false;
				}
			}

			return true;
		}

		return false;
	}

	getWidth(element, ceil = false){
		var width = element.getBoundingClientRect().width;
		return ceil ? Math.ceil(width) : width;
	}
}

const _n = new Ninja();
