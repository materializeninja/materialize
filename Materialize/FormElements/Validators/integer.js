export default class Integer {
	
	/**
     * @param ( int | string ) value
     */
	test ( value ) {

		if (
			value.length > 0 &&
			! _n.isNumber( value ) 
		) {

			throw new Error( "Numbers Only" );

		} else {

			return value;

		}

    }

}
