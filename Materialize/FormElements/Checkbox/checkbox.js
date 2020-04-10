import MaterializeField from "./../field.js";

export default class MaterializeCheckbox extends MaterializeField {

	constructor ( ...args ) {

		super( ...args );

		this.bindEvents( );

	}

	bindEvents ( ) {
		
		_n.on( this.node, "afterFocus", ( event ) => {
			
			/**
			 * This solves the issue of leaving the focus state
			 * When tabbing through the form.
			 * It's safe to do this because if we were hovering
			 * The same styling would still be applied
			 */
			if ( this.parent.matches( ":hover" ) ) {

				this.parent.classList.remove( "focus" );
			
			}
			
		} );
		
	}

}
