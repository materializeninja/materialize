class MaterializeField {

	constructor(...args){
        const options = Object.assign({
			value: null,
			element: null,
			parent: null,
			valid: true,
			validators: null, // MaterializeValidators object
			validator: null, // name of validator being applied
			parts: { },
        }, args[0]);
		Object.assign(this, options);

		this.validators = new MaterializeValidators();

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
			try {
				this.validateKeyCode(event);
			} catch(err){
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

	displayError(...args){
        const options = Object.assign({
     		message: null,
			class: null
        }, args[0]);

		if(options.class !== null){
			let nodes = this.parts.messagesContainerHTML.querySelectorAll('.' + options.class);

			if(nodes.length > 0){
				// this message already exists lets not flood the user with the same message
				return false;
			}
		}

		let messageHTML = document.createElement('div');

		messageHTML.classList.add('message');
		messageHTML.classList.add('error');

		if(options.class !== null){
			messageHTML.classList.add(options.class);
		}

		messageHTML.innerText = options.message;

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

	removeError(...args){
        const options = Object.assign({
            class: null,
        }, args[0]);

		if(options.class === null){
			this.parts.messagesContainerHTML = '';
		} else {
			let nodes = this.parts.messagesContainerHTML.querySelectorAll('.' + options.class);

			if(nodes.length > 0){
				nodes.forEach((node, k) => {
					node.remove();
				});
			}
		}
	}

	/**
	 * !IMPORTANT!
	 * This should be the only method calling displayError
	 */
	validateField(...args){
		const options = Object.assign({
			value: this.value
        }, args[0]);

		if(this.validator !== null){

			let validatorMethod = this.validators.getValidator(this.validator);	

			try{
				validatorMethod(options.value);

				this.removeError({
					class: this.validator
				});
			} catch(err) {
				this.displayError({
					class: this.validator,
					message: err.message
				});

				throw err;
			}

		}
	}

	validateKeyCode(event){
		try {
			this.validateField({value:event});
		} catch(err) {
			throw err;
		}
	}
}
