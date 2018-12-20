class MaterializeField extends MaterializeValidators {

	constructor(...args){
        const options = Object.assign({
			element: null,
			parent: null,
			validators: null,
        }, args[0]);

		super(options);
		Object.assign(this, options);

		this.applyFocusEventListener();
		this.validators = new MaterializeValidators();
    }

	applyFocusEventListener(){
		_n.on(this.element, 'focusin', (event) => {
			this.focusIn(event);

			_n.on(this.element, 'focusout', (event) => {
				this.focusOut(event);

				_n.off(this.element, 'focusout');
			});
		});
	}

	focusIn(event) {
	  	this.parent.classList.add('focus');
        this.element.classList.add('focus');
	}

	focusOut(event) {
	    this.parent.classList.remove('focus');
        this.element.classList.remove('focus');
	}
}
