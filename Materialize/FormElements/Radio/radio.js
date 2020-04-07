import MaterializeField from "./../field.js";

export default class MaterializeRadio extends MaterializeField {

	constructor ( ...args ) {

		super( ...args );

		this.bindEvents( );

	}

	bindEvents ( ) {
		
		_n.on( this.node, "afterFocus", ( event ) => {
			
			this.parent.classList.remove( "focus" );
			
		} );
		
	}

}
