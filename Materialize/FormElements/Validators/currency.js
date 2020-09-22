import Decimal from "./decimal.js";

/**
 * May break this out by country eventually
 */
export default class Currency {

    constructor ( fieldObj ) {

        this.fieldObj = fieldObj;
		this.decimal = new Decimal( 2 );

		this.fieldObj.setFieldValue( "$" );

		this.fieldObj.focusOut( );

    }

    /**
     * @param ( int | string ) value
     */
    test ( value ) {

		if ( value.length <= 0 ) {

			return "$";

		} else {

			/**
			 * Remove currency sign to validate value
			 */
			if ( value.includes( "$" ) ) {

				value = value.replace( "$", "" );

			}

			try {

				let test = this.decimal.test( value );

				return `$${ value }`;

			} catch ( err ) {

				throw new Error ( "Not valid US currency format" );

			}

		}


    }

}
