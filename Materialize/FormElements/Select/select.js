class MaterializeSelect extends MaterializeField {

    constructor(...args){
        const options = Object.assign({
			value: { },
            element: null,
            parent: null,
			multiselect: false,
			parts: [ ], // node parts of the select object
			options: [ ], // node options of select object
			activeOption: null, // node of current active option
        }, args[0]);

		super(options);
        Object.assign(this, options);

		this.buildSelectElement();
		this.bindEvents();
    }

	activateOption(optionObj = null){
		optionObj = optionObj === null ? this.options[0] : optionObj;

		this.deactivateOption();
		this.bindOptionKeyEvents(optionObj);
		this.activeOption = optionObj;

		optionObj.classList.add('active');
		optionObj.focus();
	}
	deactivateOption(optionObj = null){
		optionObj = optionObj === null ? this.activeOption : optionObj;

		if(optionObj !== null){
			this.unbindOptionKeyEvents(optionObj);
			optionObj.classList.remove('active');
		}
	}

	addOptionValue(optionObj){
		let value = optionObj.dataset.value;
		let text = optionObj.innerText;

		let selectedOptionHTML = document.createElement('div');
		selectedOptionHTML.dataset.value = value;
		selectedOptionHTML.innerText = text;

		switch(this.multiselect){
			case false:
				this.parts.selectedValuesHTML.innerHTML = '';
				this.value = { };
			break;
			case true:
			break;
		}

		this.parts.selectedValuesHTML.append(selectedOptionHTML);

		if(!_n.empty(value)){
			this.value[value] = text;
		}

		this.hideDropDown();
	}

    bindEvents(){
		let _event = null;

        _n.on(this.parent, 'click', (event) => {
			this.element.focus();
        });

		_n.on(this.element, 'keydown', (event) => {
			let keyCode = _n.keyCode(event);
			
			if(keyCode == 9){
				this.hideDropDown();
			};
		});
    }

	bindOptionKeyEvents(optionObj){
		_n.on(optionObj, 'keydown.option', (event) => {
			let keyCode = _n.keyCode(event);
			let optionsCount = Object.keys(this.options).length;
			let optionKey = null;
			let nextOptionKey = null;
			let nextOptionObj = null;
			let arrow = null;

			if(arrow = _n.isArrowKey(keyCode)){
				event.preventDefault(); // stop scrolling

				switch(arrow){
					case 'UP':
                        optionKey = parseInt(_n.getKeyByValue(this.options, optionObj));
                        nextOptionKey = (optionKey - 1) < 0 ? (optionsCount - 1) : optionKey - 1;
                        nextOptionObj = this.options[nextOptionKey];

                        this.activateOption(nextOptionObj);
					break;
					case 'DOWN':
						optionKey = parseInt(_n.getKeyByValue(this.options, optionObj));
						nextOptionKey = (optionKey + 1) >= optionsCount ? 0 : optionKey + 1;
						nextOptionObj = this.options[nextOptionKey];

						this.activateOption(nextOptionObj);
					break;
				}
			} else if(keyCode == 13) {
				this.deactivateOption(optionObj);
				this.addOptionValue(optionObj);
			};
		});
	}
	unbindOptionKeyEvents(optionObj){
		_n.off(optionObj, 'keydown.option');
	}

	buildSelectElement(){
		this.parts = { };

		/**
		 * Build area to put selected value(s)
		 */
		this.parts.selectElementHTML = document.createElement('div');
		this.parts.selectElementHTML.classList.add('material-select-element');

		this.parts.selectedValuesHTML = document.createElement('div');
		this.parts.selectedValuesHTML.classList.add('material-select-values');

		this.parts.selectArrowHTML = document.createElement('i');
		this.parts.selectArrowHTML.classList.add('material-icons');
		this.parts.selectArrowHTML.innerHTML = 'keyboard_arrow_down';

		this.parts.selectElementHTML.append(this.parts.selectArrowHTML);
        this.parts.selectElementHTML.append(this.parts.selectedValuesHTML);
		this.parent.append(this.parts.selectElementHTML);

		/**
		 * Build new material drop down
		 */
		this.parts.selectOptionsHTML = document.createElement('div');
		this.parts.selectOptionsHTML.classList.add('material-select-options');

		this.element.childNodes.forEach((ele) => {
			if(ele.nodeType > 1){
				return;
			}

			let optionHTML = document.createElement('div');

			optionHTML.classList.add('material-select-option');
			optionHTML.innerHTML = _n.empty(ele.textContent) ? '&#8203;' : ele.textContent;
			optionHTML.dataset.value = ele.value;
			optionHTML.setAttribute('tabindex', '-1');

            this.options.push(optionHTML);
            this.parts.selectOptionsHTML.append(optionHTML);

			_n.on(optionHTML, 'mouseenter', (event) => {
				event.stopPropagation();

				// before adding more methods make sure they aren't being called by this.activateOption
				this.activateOption(optionHTML);
			});

			_n.on(optionHTML, 'click.option', (event) => {
				event.stopPropagation();

                // before adding more methods make sure they aren't being called by this.deactivateOption
				this.deactivateOption(optionHTML);
				this.addOptionValue(optionHTML);
			});

			_n.on(optionHTML, 'mouseleave', (event) => {
				event.stopPropagation();

                // before adding more methods make sure they aren't being called by this.deactivateOption
				this.deactivateOption(optionHTML);
			});
		});

		this.parent.append(this.parts.selectOptionsHTML);

        /**
         * 1. Get select width
         * 2. Get label width
         * 3. Set parent width to which ever is greater
         */
        this.parts.labelSpan = this.parent.getElementsByTagName('LABEL')[0].children[0];
        this.parts.labelSpan.style.position = 'unset';

        let selectWidth = _n.getWidth(this.element, true);
        let labelWidth = _n.getWidth(this.parts.labelSpan, true);
		let arrowWidth = _n.getWidth(this.parts.selectArrowHTML, true);
        let newWidth = selectWidth >= labelWidth ? selectWidth : labelWidth;

		newWidth = newWidth + arrowWidth
        this.parent.style.width = newWidth + 'px';
        this.parts.labelSpan.removeAttribute('style');
	}

    focusIn(){
        super.focusIn();

		//this.element.focus();

        this.revealDropDown();
		this.activateOption();
    }

    focusOut(event){
		let keyCode = _n.keyCode(event);

		// if its a tab then we need to hide else we'll let option event handle this
		if(_n.isTab(event)){
			this.hideDropDown();
		}
    }

	hideDropDown(){
		if(Object.keys(this.value).length === 0){
			this.parent.classList.remove('active');
		}

		this.parent.classList.remove('focus');
		this.activeOption = null;

		/*let _event = new Event('click');
		document.dispatchEvent(_event);*/

		_n.off(document.body, 'click.select');
	}

	revealDropDown(){

        this.parent.classList.add('active');
        this.parent.classList.add('focus');

        setTimeout(() => {
            _n.on(document.body, 'click.select', (event) => {
				event.stopPropagation();
	
                this.hideDropDown();

				_n.off(document.body, 'click.select');
            /*}, {
                once: true*/
            });
        }, 100);
    }
}
