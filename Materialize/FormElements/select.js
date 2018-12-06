class MaterializeSelect extends MaterializeField {

    constructor(...args){
		console.log('MaterializeSelect');

        const options = Object.assign({
			value: { },
            element: null,
            parent: null,
        }, args[0]);

		super(options);
        Object.assign(this, options);

		this.buildSelectElement();
		this.bindEvents();
    }

	buildSelectElement(){
		/**
		 * Build area to put selected value(s)
		 */
		var selectElementHTML = document.createElement('div');
		selectElementHTML.classList.add('material-select-element');

		var selectedValuesHTML = document.createElement('div');
		selectedValuesHTML.classList.add('material-select-values');

		var selectArrowHTML = document.createElement('i');
		selectArrowHTML.classList.add('material-icons');
		selectArrowHTML.innerHTML = 'keyboard_arrow_down';

		selectElementHTML.append(selectArrowHTML);
        selectElementHTML.append(selectedValuesHTML);
		this.parent.append(selectElementHTML);

		/**
		 * Build new material drop down
		 */
		var selectOptionsHTML = document.createElement('div');
		selectOptionsHTML.classList.add('material-select-options');

		this.element.childNodes.forEach((ele) => {
			if(ele.nodeType > 1){
				return;
			}

			var optionHTML = document.createElement('div');

			optionHTML.classList.add('material-select-option');
			optionHTML.innerHTML = ele.textContent;
			optionHTML.dataset.value = ele.value;

            selectOptionsHTML.append(optionHTML);

			_n.on(optionHTML, 'mouseenter', (event) => {
				event.stopPropagation();
				optionHTML.classList.add('active');
			});

			_n.on(optionHTML, 'mouseleave', (event) => {
				event.stopPropagation();
                optionHTML.classList.remove('active');
			});

			_n.on(optionHTML, 'click', (event) => {
				event.stopPropagation();

				var option = event.target;
				var value = option.dataset.value;
				var text = option.innerText;

				var selectedOptionHTML = document.createElement('div');
				selectedOptionHTML.dataset.value = value;
				selectedOptionHTML.innerText = text;

				selectedValuesHTML.innerHTML = '';
				this.value = { };

				selectedValuesHTML.append(selectedOptionHTML);
				this.value[value] = text;

                this.hideDropDown();
			});
		});

		this.parent.append(selectOptionsHTML);

        /**
         * 1. Get select width
         * 2. Get label width
         * 3. Set parent width to which ever is greater
         */
        var labelSpan = this.parent.getElementsByTagName('LABEL')[0].children[0];
        labelSpan.style.position = 'unset';

        var selectWidth = _n.getWidth(this.element, true);
        var labelWidth = _n.getWidth(labelSpan, true);
		var arrowWidth = _n.getWidth(selectArrowHTML, true);
        var newWidth = selectWidth >= labelWidth ? selectWidth : labelWidth;

		newWidth = newWidth + arrowWidth
        this.parent.style.width = newWidth + 'px';
        labelSpan.removeAttribute('style');
	}

	bindEvents(){
		_n.on(this.parent, 'click', (event) => { 
			this.revealDropDown(); 
		}, false);
	}

	revealDropDown(){
		this.parent.classList.add('active');
        this.parent.classList.add('focus');

		setTimeout(() => {
			_n.on(document, 'click.select', (event) => {
				this.hideDropDown();
			});
		}, 100);
	}

	hideDropDown(){
		if(Object.keys(this.value).length === 0){
			this.parent.classList.remove('active');
		}
		this.parent.classList.remove('focus');

   		_n.off(document, 'click.select');
	}
}
