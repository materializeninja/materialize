class MaterializeText extends MaterializeField {

    constructor(...args){
        const options = Object.assign({
            element: null,
            parent: null,
			value: null,
        }, args[0]);

		super(options);
        Object.assign(this, options);

		this.adjustFieldSize();
		this.applyValidators();
		this.bindEvents();
    }

	set value(value){
		this._value = value
	}
	get value(){
		return this._value
	}

	adjustFieldSize(){
		let labelSpan = this.parent.getElementsByTagName('LABEL')[0].children[0];
		let labelWidth = _n.getWidth(labelSpan, true);

		this.parent.style.width = labelWidth + 'px';
	}

	applyValidators(){
		if('validator' in this.parent.dataset){
			let validatorString = this.parent.dataset.validator;
			let validators = new MaterializeValidators();
			let validator = validators.getValidator(validatorString);

			this.validator = validator;
			this.errorMessage = validators.errorMessage;

			let keydownEventValidators = [
				'integer'
			];

			if(keydownEventValidators.includes(validatorString)){
				this.bindKeydownValidatorEvents();
			}
		}
	}

	bindEvents(){
		_n.on(this.element, 'keyup', (event) => {
			this.value = event.target.value;
		});
	}

	bindKeydownValidatorEvents(){
		super.bindKeydownValidatorEvents();
	}

	focusIn(){
		super.focusIn();
		this.element.select();
	}

	focusOut(){
		super.focusOut();

		if(!_n.empty(this.value)){
			this.parent.classList.add('active');
		}else{
            this.parent.classList.remove('active');
		}
	}
}
