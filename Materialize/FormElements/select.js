class MaterializeSelect extends MaterializeField {

    constructor(...args){
        const options = Object.assign({
			value: { },
            element: null,
            parent: null,
			multiselect: false,
        }, args[0]);

		super(options);
        Object.assign(this, options);

		this.buildSelectElement();
		this.bindEvents();
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

            this.revealDropDown();
        });

		_n.on(this.element, 'keydown', (event) => {
			var keyCode = event.which || event.keyCode || 0;
			
			if(keyCode == 9){
				this.hideDropDown();
			};
		});
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

            this.parts.selectOptionsHTML.append(optionHTML);

			_n.on(optionHTML, 'mouseenter', (event) => {
				event.stopPropagation();
				optionHTML.classList.add('active');
			});

			_n.on(optionHTML, 'click.option', (event) => {
				event.stopPropagation();

				let option = event.target;

				this.addOptionValue(option);
			});

			_n.on(optionHTML, 'mouseleave', (event) => {
				event.stopPropagation();
				optionHTML.classList.remove('active');
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

		this.element.focus();
        this.revealDropDown();
    }

    focusOut(event){
		//this.hideDropDown();
    }

	hideDropDown(){
		if(Object.keys(this.value).length === 0){
			this.parent.classList.remove('active');
		}

		this.parent.classList.remove('focus');
		_n.off(document, 'click.select');
	}

	revealDropDown(){

        this.parent.classList.add('active');
        this.parent.classList.add('focus');

        setTimeout(() => {
            _n.on(document, 'click.select', (event) => {
                this.hideDropDown();
            }, {
                once: true
            });
        }, 100);
    }
}
