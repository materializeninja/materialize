import MaterializeField from "./../field.js";

export default class MaterializeCheckbox extends MaterializeField {

	constructor ( ...args ) {

		super( ...args );

		this.bindEvents( );

		/**
		 * Check for events
		 */
		if ( this.parent.hasAttribute( "check-toggle" ) ) {
		
			this.eventCheckToggle( );

		}

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

	/**
	 * Check Toggle EVENT
	 * Toggles other elements with the same class or ID specified
	 * If class string will be ".class" - note period
	 * If ID string will be "#ID" - note hashtag
	 */
	eventCheckToggle( ) {

		_n.on( this.node, "change", ( event ) => {
		
			let sourceValue = this.node.checked;

			for ( let node of Object.values( document.querySelectorAll( this.parent.getAttribute( "check-toggle" ) ) ) ) {
			
				node.checked = sourceValue;

			}

		} );

	}

}






