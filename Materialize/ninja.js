class Ninja {

	constructor(...args){
		const options = Object.assign({
			scriptsArray: [ ],
			functionMap: { },
        }, args[0]);
        Object.assign(this, options);	
	}

	on(...args){ this.addEventListener(...args); }
	addEventListener(ele, event, func, options) {
		let eleID = ele === document ? ele : ele.getAttribute('id');
		let _event = event.includes('.') ? event.split('.')[0] : event;
		
		if(this.empty(eleID)){
			eleID = this.guid();
			ele.setAttribute('id', eleID);
		}

		if(typeof(this.functionMap[eleID]) == 'undefined'){
			this.functionMap[eleID] = { };
		};

    	this.functionMap[eleID][event] = func;
	    ele.addEventListener(_event, this.functionMap[eleID][event], options);
	}

	off(...args){ this.removeEventListener(...args); }
	removeEventListener(ele, event, options) {
	    let eleID = ele === document ? ele : ele.getAttribute('id');
        let _event = event.includes('.') ? event.split('.')[0] : event;

	    ele.removeEventListener(_event, this.functionMap[eleID][event], options);
    	delete this.functionMap[eleID][event];
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

	guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

}

const _n = new Ninja();
