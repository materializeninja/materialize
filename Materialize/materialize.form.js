class MaterializeForm {

	constructor(...args){
        const options = Object.assign({
            form: null, // this is just the id not the element
            root: null, // path to root dir of materialize.js
			elements: { },
			currentFocus: null, // order number of element in this.elements (NOT tab number but number position ie position 0 maybe tab number 10 so not this.elements key but this.elements position)
        }, args[0]);
		Object.assign(this, options);

		this.form = document.getElementById(options.form);

		this.hijackTabbing();
	}

	async buildIndexes(...args){
		const options = args;
		const matches = this.form.querySelectorAll('[tabindex]');
		
		let count = 0;
		let matchLength = matches.length;

		try {
			await _n.addJS(this.root + 'FormElements/field.js');

			matches.forEach(async (ele) => {

				switch(true){
					case ele.hasAttribute('type') && ele.getAttribute('type') == 'text':
						await this.processInput(ele);
					break;
					case ele.tagName == 'SELECT':
						await this.processSelect(ele);
					break;
				}

				_n.on(ele, 'focusin.trackfocus', (event) => {
					let tabindex = ele.getAttribute('tabindex');

					this.currentFocus = Object.keys(this.elements).indexOf(tabindex);
				})

				count++;

				if(count === matchLength){
					this.currentFocus = 0;

					this.forceTab({
						field: this.elements[Object.keys(this.elements)[this.currentFocus]],
						direction: 'absolute'
					});
				}
			});
		} catch(err) {
		}
	}

	forceTab(...args){
		const options = Object.assign({
			field: false,
			event: false, //information/options https://api.jquery.com/category/events/event-object/
			direction: false, //options are closest/next/previous/absolute (absolute required field to be filled out this will force the tab to this field specifically)
			isTab: false,
        }, args[0]);

		let event = null;
		let eleLength = null;
		let currentFocusedObj = null;

		switch(options.direction){
			case 'absolute':
				event = new Event('focusin');
				options.field.element.dispatchEvent(event);
			break;
			case 'next':
				eleLength = Object.keys(this.elements).length;
				currentFocusedObj = this.elements[Object.keys(this.elements)[this.currentFocus]];

				event = new Event('focusout');
				event.isTab = options.isTab;

				this.currentFocus = this.currentFocus + 1;

				if(this.currentFocus >= eleLength){
					this.currentFocus = 0;
				}

				currentFocusedObj.element.dispatchEvent(event);

				this.forceTab({
					field: this.elements[Object.keys(this.elements)[this.currentFocus]],
					direction: 'absolute'
				});
			break;
			case 'previous':
				eleLength = Object.keys(this.elements).length;
                currentFocusedObj = this.elements[Object.keys(this.elements)[this.currentFocus]];

                event = new Event('focusout');
				event.isTab = options.isTab;

                this.currentFocus = this.currentFocus - 1;

                if(this.currentFocus < 0){
                    this.currentFocus = (eleLength - 1);
                }

                currentFocusedObj.element.dispatchEvent(event);

                this.forceTab({
                    field: this.elements[Object.keys(this.elements)[this.currentFocus]],
                    direction: 'absolute'
                });
			break;
		}
	}

	hijackTabbing(){
		_n.on(document, 'keydown', (event) => {
			var keyCode = _n.keyCode(event);

			if(keyCode === 9){
				event.preventDefault();

				switch(event.shiftKey){
					case false:
						this.forceTab({
							direction: 'next',
							isTab: true,
						});
					break;
					case true:
					    this.forceTab({
                            direction: 'previous',
							isTab: true,
                        });
					break;
				}
			}
		});
	}

	async processInput(ele){
		return new Promise(async (resolve, reject) => {
			try {
				await _n.addJS(this.root + 'FormElements/Text/text.js');
				
				this.elements[ele.getAttribute('tabindex')] = new MaterializeText({
					element: ele,
					parent: ele.closest('div.material.text'),
				});

				resolve(ele);
			} catch (err) {
				reject(err);
			}
		});
	}

	processSelect(ele){
        return new Promise(async (resolve, reject) => {
            try {
				await _n.addJS(this.root + 'FormElements/Select/select.js')

				this.elements[ele.getAttribute('tabindex')] = new MaterializeSelect({
					element: ele,
					parent: ele.closest('div.material.select'),
				});

                resolve(ele);
            } catch (err) {
                reject(err);
            }
		});
	}
}
