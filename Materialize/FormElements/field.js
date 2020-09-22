import MaterializeValidators from "./validators.js";

export default class MaterializeField {

    constructor ( ...args ) {

        const options = Object.assign( {
            node: null,
            parent: null,
			value: null,
            valid: true,
            validatorModel: null, // Validator model being applied from MaterializeValidators
            validatorName: null, // name of validator being applied
			parts: {
				messagesContainer: null
			}
        }, args[ 0 ] );

        Object.assign( this, options );

        if ( "validator" in this.parent.dataset ) {

			this.applyValidator ( );

        }

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

	async applyValidator( ) {

        this.validatorName = this.parent.dataset.validator;

		let MaterializeValidator = new MaterializeValidators( );
		
		this.validatorModel = await MaterializeValidator.init( this );

	}

	bindKeydownValidatorEvents ( ) {

		/**
		 * If window has onbeforeinput then most likely
		 * This is a mobile device and lets use this event
		 * Instead of the traditional onkeydown event
		 */
		if ( "onbeforeinput" in window ) {

			_n.on( this.node, "beforeinput.validator", ( event ) => {

				if ( event.data !== null ) {

					event.key = event.data;

					keydownEvent( event );

				}

			} );

		} else {

			_n.on( this.node, "keydown.validator", ( event ) => {

				//if ( event.key === "Unidentified" ) {

					/**
					 * More than likely this is a mobile/android device
					 * If so let the beforeinput.validator event
					 * Handle validations as keydown does not
					 * Contain values needed to validate input
					 */
					//event.preventDefault( );

				//}

				keydownEvent( event );

			} );

		}

		let keydownEvent = async ( event ) => {

			let cursorPosition = _n.getCursorPosition( event.target ),
				valuePreview = event.target.value,
				key = event.key;

			/**
			 * If key === "Unidentified"
			 * This is probably coming from beforeinput
			 * Or is an action key thats ok like Delete
			 */
			if ( key !== "Unidentified" ) {

				if (
					! _n.isArrowKey( event.key ) &&
					! event.metaKey &&
					! [
						"Alt",
						"Control",
						"End",
						"Home",
						"Shift"
					  ].includes( key )
				) {

                    /**
                     * Now that we know this is a valid key lets make sure it's
                     * A Character key and not an "action"
                     * If key length is greater than 1 then its probably an action such as "Tab"
                     * If that is the case we don't want to add "Tab" to our value
                     */
                    let keyValue = key.length > 1 ? "" : key;
					let start = cursorPosition[ 0 ];
					let stop = cursorPosition[ 1 ];

					switch( key ) {

						case "Backspace":

							start = start === stop ? ( start - 1 ) : start;

						break;

						case "Delete":

							stop = start === stop ? ( stop + 1 ) : stop;

						break;
					
					}

					valuePreview = _n.spliceString(
						start,
						stop,
						event.target.value,
						keyValue
					);

				}

				/**
				 * If the value has not changed then its a waste of time
				 * Running the rest of the code below
				 */
				if ( valuePreview !== event.target.value ) {

					try {

						/**
						 * Some field like currency will validate a number input as true
						 * BUT will enforce the currency sign for the user
						 * Because of that we want to set the value to what the validator returned
						 */
						let validatedValue = await this.validateField( { value: valuePreview } );

						/**
						 * We are triggering this on a keydown event so we need to
						 * Delay it a few to allow for a keyup event so we can
						 * Properly Display the intended value
						 */
						setTimeout( ( ) => {

							this.setFieldValue( validatedValue );

						}, 5 );

					} catch ( err ) {

						event.preventDefault( );

						console.error( err );

					}

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

    setFieldValue( value ) {

        this.value = value;
        this.node.value = value;

    }

    /**
     * !IMPORTANT!
     * This should be the only method calling displayError
     */
    validateField ( ...args ) {

        const options = Object.assign( {
            value: this.value
        }, args[ 0 ] );

		return new Promise( resolve  => {

			if ( this.validatorName !== null ) {

				try{

					options.value = this.validatorModel.test( options.value );

					this.removeError( {
						class: this.validatorName
					} );

					resolve( options.value );

				} catch ( err ) {

					this.displayError( {
						class: this.validatorName,
						message: err.message
					} );

					throw err;

				}

			}

		} );

    }

}
