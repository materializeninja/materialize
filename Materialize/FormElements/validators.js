export default class MaterializeValidators {

    getValidator ( validator ) {

        switch ( validator ) {

            case "integer":

                this.errorMessage = "Numbers Only";

                return this.integer;

            break;

        }

    }

	/**
     * @param ( int | string ) value
     */
    integer ( value ) {

		if (
			value.length > 0 &&
			! _n.isNumber( value ) 
		) {

			throw new Error( "Numbers Only" );

		} else {

			return true;

		}

    }

}
