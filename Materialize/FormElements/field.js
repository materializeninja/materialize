class MaterializeField {

	constructor(...args){
        const options = Object.assign({
			value: null,
			element: null,
			parent: null,
			valid: true,
			errorMessage: null,
			validator: null,
			parts: { },
        }, args[0]);
		Object.assign(this, options);

		this.applyFocusEventListener();
		this.buildMessagesContainer();
    }

    set value(value){
        this._value = value
    }
    get value(){
        return this._value
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

	bindKeydownValidatorEvents(){
        _n.on(this.element, 'keydown.validator', (event) => {
			if(!this.validateKeyCode(event)){
				event.preventDefault();
			}
        });
    }

	buildMessagesContainer(){
		let messagesContainerHTML = document.createElement('div');
		messagesContainerHTML.classList.add('messages');

		this.parts.messagesContainerHTML = messagesContainerHTML;

		this.parent.append(messagesContainerHTML);
	}

	displayError(message = null){
		let messageText = message === null ? this.errorMessage : message;

		let messageHTML = document.createElement('div');
		messageHTML.classList.add('message');
		messageHTML.classList.add('error');

		messageHTML.innerText = messageText;

		this.parts.messagesContainerHTML.append(messageHTML);
	}

	focusIn(event) {
	  	this.parent.classList.add('focus');
        this.element.classList.add('focus');
	}

	focusOut(event) {
	    this.parent.classList.remove('focus');
        this.element.classList.remove('focus');
	}

	/**
	 * !IMPORTANT!
	 * This should be the only method calling displayError
	 */
	validateField(...args){
		const options = Object.assign({
			value: this.value,
			bool: true,
        }, args[0]);

		if(this.validator !== null){

			if(!this.validator(options.value)){

				options.bool = false;
           		this.displayError();

            }

		}

		return options.bool;
	}

	validateKeyCode(event){
		return this.validateField({value:event});
	}
}
