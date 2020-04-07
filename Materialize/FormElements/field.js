import MaterializeValidators from "./validators.js";

export default class MaterializeField {

    constructor ( ...args ) {

        const options = Object.assign( {
            node: null,
            parent: null,
			value: null,
            valid: true,
            validators: null, // MaterializeValidators object
            validator: null, // name of validator being applied
			parts: {
				messagesContainer: null
			}
        }, args[ 0 ] );

        Object.assign( this, options );

        this.validators = new MaterializeValidators( );

        this.applyFocusEventListener( );
        this.buildMessagesContainer( );
        
    }

    set value ( value ) {

        this._value = value

    }

    get value ( ) {

        return this._value

    }

    applyFocusEventListener ( ) {

        _n.on( this.node, "focus.main", ( event ) => {

            this.focusIn( event );

            _n.on( this.node, "focusout.main", ( event ) => {

				this.node.blur( );

                this.focusOut( event );

                _n.off( this.node, "focusout.main" );

            } );

        } );

    }

	bindKeydownValidatorEvents ( ) {

		_n.on( this.node, "beforeinput.validator", ( event ) => {

			if ( event.data !== null ) {

				event.key = event.data;

				keydownEvent( event );

			}

		} );

        _n.on( this.node, "keydown.validator", ( event ) => {

            if ( event.key === "Unidentified" ) {

                /**
                 * More than likely this is a mobile/android device
                 * If so let the beforeinput.validator event
                 * Handle validations as keydown does not
                 * Contain values needed to validate input
                 */
                event.preventDefault( );

            }

			keydownEvent( event );

		} );

		let keydownEvent = ( event ) => {

			let cursorPosition = _n.getCursorPosition( event.target ),
				valuePreview = event.target.value,
				key = event.key;

			/**
			 * If key === "Unidentified"
			 * This is probably coming from beforeinput
			 * And is an action key thats ok like Delete
			 */
			if ( key !== "Unidentified" ) {

				if (
					! _n.isArrowKey( event.key ) &&
					! event.metaKey &&
					! [
						"Alt",
						"Backspace",
						"Control",
						"Delete", 
						"End",
						"Home",
						"Shift"
					  ].includes( key )
				) {

					valuePreview = _n.spliceString( 
						cursorPosition[ 0 ], 
						cursorPosition[ 1 ], 
						event.target.value, 
						key 
					);

				}

				try {

					this.validateField( { value: valuePreview } );

				} catch ( err ) {

					event.preventDefault( );

				}

			}

        };

	}

    buildMessagesContainer ( ) {

        this.parts.messagesContainer = document.createElement('messages');

        this.parent.append( this.parts.messagesContainer );

    }

    displayError ( ...args ) {
        const options = Object.assign({
            message: null,
            class: null
        }, args[0]);

        if ( options.class !== null ) {

            let nodes = this.parts.messagesContainer.querySelectorAll( `.${options.class}` );

            if ( nodes.length > 0 ) {

                // this message already exists lets not flood the user with the same message
                return false;

            }

        }

        let message = document.createElement( "message" );

        message.classList.add( "error" );

        if ( options.class !== null ) {

            message.classList.add( options.class );

        }

        message.innerText = options.message;

        this.parts.messagesContainer.append( message );

    }

    focusIn ( event ) {
        
        return new Promise( resolve => {

            this.parent.classList.add( "focus" );
            this.node.classList.add( "focus" );
            
            resolve( );
        
            let afterFocus = new CustomEvent( "afterFocus", {
                "detail" : {
                    "trueTarget": this.node
                }
            } );
            document.dispatchEvent( afterFocus );
        
        } );

    }

    focusOut ( event ) {
        
        return new Promise( resolve => {

            this.parent.classList.remove( "focus" );
            this.node.classList.remove( "focus" );
            
            resolve( );
        
        } );

    }

    removeError ( ...args ) {

        const options = Object.assign( {
            class: null,
        }, args[ 0 ] );

        if( options.class === null ){

            this.parts.messagesContainer = "";

        } else {

            let nodes = this.parts.messagesContainer.querySelectorAll( `.${options.class}` );

            if ( nodes.length > 0 ) {

                nodes.forEach( ( node, k ) => {

                    node.remove( );

                } );
            }
        }
    }

    /**
     * !IMPORTANT!
     * This should be the only method calling displayError
     */
    validateField ( ...args ) {

        const options = Object.assign( {
            value: this.value
        }, args[ 0 ] );

        if ( this.validator !== null ) {

            let validatorMethod = this.validators.getValidator( this.validator );

            try{

                validatorMethod( options.value );

                this.removeError( {
                    class: this.validator
                } );

            } catch ( err ) {

                this.displayError( {
                    class: this.validator,
                    message: err.message
                } );

                throw err;

            }

        }

    }

}
