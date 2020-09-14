import MaterializeField from "./../field.js";

export default class MaterializeText extends MaterializeField {

	constructor ( ...args ) {

		super( ...args );

		this.applyValidators( );
		this.bindEvents( );
		
		this.turnOffAutocomplete( );

		this.node.insertAdjacentHTML( "afterend", `<span class="highlight"></span>`);

	}

	applyValidators ( ) {

        if ( this.validatorName ) {

            // list of keydown validators for text field
            let keydownEventValidators = [
                "integer",
                "decimal",
                "currency-US"
            ];

            if( keydownEventValidators.includes( this.validatorName ) ) {

                this.bindKeydownValidatorEvents( );

            }

        }

    }

    bindEvents ( ) {

        _n.on( this.node, "keyup.updateValue", ( event ) => {

            this.value = event.target.value;

        } );

    }

    focusOut ( ) {

        super.focusOut( );

		if ( _n.empty( this.value ) ) {

			this.parent.classList.remove( "active" );

        } else {

            this.parent.classList.add( "active" );

        }

    }
    
    turnOffAutocomplete ( ) {
        
        this.node.setAttribute( "autocomplete", "off" );
        
    }

}
