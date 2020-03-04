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

        _n.on( this.node, "focusin", ( event ) => {

			this.node.focus( );

            this.focusIn( event );

            _n.on( this.node, "focusout", ( event ) => {

				this.node.blur( );

                this.focusOut( event );

                _n.off( this.node, "focusout" );

            } );

        } );

    }

	bindKeydownValidatorEvents ( ) {

        _n.on( this.node, "keydown.validator", ( event ) => {

            try {

                this.validateField( { value: event } );

            } catch ( err ) {

                event.preventDefault( );

            }

        } );

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

    focusIn( event ) {

        this.parent.classList.add( "focus" );
        this.node.classList.add( "focus" );

    }

    focusOut( event ) {

        this.parent.classList.remove( "focus" );
        this.node.classList.remove( "focus" );

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
