class MaterializeValidators {

	constructor(...args){
        const options = Object.assign({
			errorMessage: '',
        }, args[0]);
		Object.assign(this, options);
    }

	getValidator(validator){
		switch(validator){
			case 'integer':
				this.errorMessage = 'Numbers Only';
				return this.integer;
			break;
		}
	}

	/**
	 * @param (int|event object) value
	 */
	integer(value){
		let bool = true;

		if(typeof(value) === 'object'){
			let keyCode = _n.keyCode(event);

			if(
				(_n.letterKeys.includes(keyCode)) ||
				(_n.specialCharKeys.includes(keyCode)) ||
				(event.shiftKey && _n.shiftSpecialCharKeys.includes(keyCode))
			){
				bool = false;
			}
		}

		return bool;
	}
}
