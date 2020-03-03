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
        }, args[ 0 ] );

        Object.assign( this, options );

        this.validators = new MaterializeValidators( );

        this.applyFocusEventListener( );
        //this.buildMessagesContainer( );
    }

    set value ( value ) {

        this._value = value

    }

    get value ( ) {

        return this._value

    }

    applyFocusEventListener ( ) {

        _n.on( this.node, "focusin", ( event ) => {

            this.focusIn( event );

            _n.on( this.node, "focusout", ( event ) => {

                this.focusOut( event );

                _n.off( this.node, "focusout" );

            } );

        } );

    }

    focusIn( event ) {

        this.parent.classList.add( "focus" );
        this.node.classList.add( "focus" );

    }

    focusOut( event ) {

        this.parent.classList.remove( "focus" );
        this.node.classList.remove( "focus" );

    }

}
