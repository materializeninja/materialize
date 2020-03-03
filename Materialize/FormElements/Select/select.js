import MaterializeField from "./../field.js";

export default class MaterializeSelect extends MaterializeField {

    constructor ( ...args ) {
		const options = Object.assign( {
			value: { },
            multiselect: false,
            parts: { 
				selectElement: null,
				selectedValues: null,
				selectArrow: null,
				selectOptions: null
			}, // node parts of the select object
            options: [ ], // node options of select object
            activeOption: null, // node of current active option
        }, args[ 0 ] );

        super( ...args );

		Object.assign( this, options );

		this.buildSelectElement( );
        this.bindEvents( );

    }

    activateOption ( optionNode = null ) {

        optionNode = optionNode === null ? this.options[ 0 ] : optionNode;

        this.deactivateOption( );
        this.bindOptionKeyEvents( optionNode );
        this.activeOption = optionNode;

        optionNode.classList.add( "active" );
        optionNode.focus( );

    }

    addOptionValue ( optionObj ) {

        let value = optionObj.dataset.value;
        let text = optionObj.innerText;
        let selectedOption = document.createElement('div');

        selectedOption.dataset.value = value;
        selectedOption.innerText = text;

        switch ( this.multiselect ) {

            case false:

                this.parts.selectedValues.innerHTML = "";
                this.value = { };

            break;

            case true:
            break;

        }

        this.parts.selectedValues.append( selectedOption );

        if( ! _n.empty( value ) ) {

            this.value[ value ] = text;

        }

        this.hideDropDown( );
    }

    bindEvents ( ) {

        _n.on( this.parent, "click.select", ( event ) => {

            this.node.focus( );

        });

        _n.on( this.node, "keydown.select", ( event ) => {

            let keyCode = _n.keyCode( event );

			switch ( _n.keyCode( event ) ) {

				case 19:

					this.hideDropDown( );

				break;

			}

		} );
    }

    bindOptionKeyEvents ( optionNode ) {

        _n.on( optionNode, "keydown.option", ( event ) => {

            let keyCode = _n.keyCode( event );
            let optionsCount = Object.keys( this.options ).length;
            let optionKey = null;
            let nextOptionKey = null;
            let nextOptionNode = null;
            let arrow = null;

            if ( arrow = _n.isArrowKey( keyCode ) ) {

                event.preventDefault( ); // stop scrolling

                switch ( arrow ) {

                    case "UP":

                        optionKey = parseInt( _n.getKeyByValue( this.options, optionNode ) );
                        nextOptionKey = ( optionKey - 1 ) < 0 ? ( optionsCount - 1 ) : optionKey - 1;
                        nextOptionNode = this.options[ nextOptionKey ];

                        this.activateOption( nextOptionNode );

                    break;

                    case "DOWN":

                        optionKey = parseInt( _n.getKeyByValue( this.options, optionNode ) );
                        nextOptionKey = ( optionKey + 1 ) >= optionsCount ? 0 : optionKey + 1;
                        nextOptionNode = this.options[ nextOptionKey ];

                        this.activateOption( nextOptionNode );

                    break;

                }

            } else if ( keyCode === 13 ) {

                this.deactivateOption( optionNode );
                this.addOptionValue( optionNode );

            }

        } );

    }

	buildSelectElement ( ) {

        /**
         * Build area to put selected value(s)
         */
        this.parts.selectElement = document.createElement( "div" );
        this.parts.selectElement.classList.add( "material-select-element" );

        this.parts.selectedValues = document.createElement( "div" );
        this.parts.selectedValues.classList.add( "material-select-values" );

        this.parts.selectArrow = document.createElement( "i" );
        this.parts.selectArrow.classList.add( "material-icons" );
        this.parts.selectArrow.innerHTML = "keyboard_arrow_down";

        this.parts.selectElement.append( this.parts.selectArrow );
        this.parts.selectElement.append( this.parts.selectedValues );
        this.parent.append( this.parts.selectElement );

        /**
         * Build new material drop down
         */
        this.parts.selectOptions = document.createElement( "div" );
        this.parts.selectOptions.classList.add( "material-select-options" );

        this.node.childNodes.forEach( ( node ) => {

            if ( node.nodeType > 1 ) {

                return;

            }

            let option = document.createElement( "div" );

            option.classList.add( "material-select-option" );
			option.innerHTML = _n.empty( node.textContent ) ? "&#8203;" : node.textContent;
            option.dataset.value = node.value;
            option.setAttribute( "tabindex", "-1" );

            this.options.push( option );
            this.parts.selectOptions.append( option );

            _n.on( option, "mouseenter", ( event ) => {

                event.stopPropagation( );

                // before adding more methods make sure they aren't being called by this.activateOption
                this.activateOption( option );

            } );

            _n.on( option, "click.option", ( event ) => {

                event.stopPropagation( );

                // before adding more methods make sure they aren't being called by this.deactivateOption
                this.deactivateOption( option );
                this.addOptionValue( option );

            } );

            _n.on( option, "mouseleave", ( event ) => {

                event.stopPropagation( );

                // before adding more methods make sure they aren't being called by this.deactivateOption
                this.deactivateOption( option );

            } );

        } );

		this.parent.append( this.parts.selectOptions );

	}

    deactivateOption ( optionNode = null ) {

        optionNode = optionNode === null ? this.activeOption : optionNode;

        if ( optionNode !== null ) {

            this.unbindOptionKeyEvents( optionNode );
            optionNode.classList.remove( "active" );

        }

    }

    focusIn ( ) {

        super.focusIn( );

        this.revealDropDown( );
        this.activateOption( );

    }

    focusOut ( event ) {

        let keyCode = _n.keyCode( event );

        // if its a tab then we need to hide else we'll let option event handle this
        /*if ( _n.isTab( event ) ) {

            this.hideDropDown( );

        }*/

    }

    hideDropDown ( ) {

        if ( Object.keys( this.value ).length === 0 ) {

            this.parent.classList.remove( "active" );

        }

        this.parent.classList.remove( "focus");
        this.activeOption = null;

        /*let _event = new Event('click');
        document.dispatchEvent(_event);*/

        _n.off( document.body, "click.selectHide" );
    }

    revealDropDown ( ) {

        this.parent.classList.add( "active" );
        this.parent.classList.add( "focus" );

        setTimeout( ( ) => {

            _n.on( document.body, "click.selectHide", ( event ) => {

                event.stopPropagation( );

				this.hideDropDown( );

                _n.off( document.body, "click.selectHide" );

            } );

        }, 100 );
    }

    unbindOptionKeyEvents ( optionObj ) {

        _n.off( optionObj, "keydown.option" );

    }

}
