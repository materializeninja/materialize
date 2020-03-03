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
     * @param ( int | event object ) value
     */
    integer ( value ) {

        if ( typeof( value ) === "object" ) {

            let keyCode = _n.keyCode(event);

            if (
                ( _n.isLetterKey( keyCode ) ) ||
                ( _n.isSpecialCharKey( keyCode ) ) ||
                ( event.shiftKey && _n.isShiftSpecialCharKey( keyCode ) )
            ) {

                throw new Error( "Numbers Only" );

            } else {

                return true;

            }

        } else {

			if ( ! Number.isInteger( value ) ) {

				throw new Error( "Numbers Only" );

			} else {

				return true;

			}

        }

    }

}
