class Ninja {

	constructor(...args){
		const options = Object.assign({
			scriptsArray: [ ],
			functionMap: { },
			arrowKeys: {
				"37":"LEFT",
				"38":"UP",
				"39":"RIGHT",
				"40":"DOWN",
			}
        }, args[0]);
        Object.assign(this, options);	
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
				let script = document.querySelectorAll('[src="'+filepath+'"]');
				// maybe a more elegant way of doing this maybe not
				let oldOnload = script[0].onload = script[0].onreadystatechange;

				script[0].onload = script[0].onreadystatechange = function(){
					oldOnload();
                	resolve(true);
    	        }
				return;
			}

			this.scriptsArray.push(filepath);

			let ele = document.createElement('script');
			let head = document.getElementsByTagName('head')[0];

			ele.type = 'text/javascript';
			ele.src = filepath;

			ele.onload = ele.onreadystatechange = function(){ 
				resolve(true);
			}

			head.appendChild(ele);
		});
	}

	empty(mixedVar){
		let undef;
		let key;
		let i;
		let len;
		let emptyValues = [undef, null, false, 0, '', '0'];

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
		let width = element.getBoundingClientRect().width;
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

	isArrowKey(keyCode){
		return this.arrowKeys[keyCode] !== undefined ? this.arrowKeys[keyCode] : false;
	}

	isNumber(value, strict = true){
		let bool = null;

		if(strict){
			bool = !isNaN(value) && (value instanceof Number || typeof(value) == 'number') ? true : false;
		}else{
			bool = !isNaN(value - parseFloat(value));
		}

		return bool;
	}

	/**
	 * Because we hijacked tabbing materialize ninja adds
	 * A custom param to the events object called isTab
	 * Because of that calue can either be the keyCode value
	 * Or the event value passed from an event
	 *
	 * @param (int|obj) value = keyCode || event
	 */
	isTab(value){
		let bool = null;

		if(this.isNumber(value)){
			bool = value === 9 ? true : false;
		} else {
			bool = !_n.empty(value.isTab) ? true : false;
		}

		return bool;
	}

	keyCode(event){
		let keyCode = event.which || event.keyCode || 0;
		return keyCode;
	}

    on(ele, event, func, options){
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

    off(ele, event, options){
        let eleID = ele === document ? ele : ele.getAttribute('id');
        let _event = event.includes('.') ? event.split('.')[0] : event;

        ele.removeEventListener(_event, this.functionMap[eleID][event], options);
        delete this.functionMap[eleID][event];
    }
}

const _n = new Ninja();
