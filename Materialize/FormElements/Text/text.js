import MaterializeField from "./../field.js";

export default class MaterializeText extends MaterializeField {

	constructor ( ...args ) {

		super( ...args );

		this.bindEvents( );

	}

    bindEvents ( ) {

        _n.on( this.node, "keyup", ( event ) => {

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

}
