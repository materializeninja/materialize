class Ninja {

	#functionMap = { };

	#arrowKeys = [ 37, 38, 39, 40 ]; // LEFT, UP, RIGHT, DOWN
	
	#swipeEvents = [
	    "swipeup",
	    "swipedown",
	    "swipeleft",
	    "swiperight"
    ];
	
	constructor ( ) {
	    
	    this.applyGlobalEvents( );
	    
	}
	
	applyGlobalEvents ( ) {
	    
        this.on( document, "afterFocus", ( event ) => {
            
            this.dispatchGlobalEvent( event, "afterFocus" );

        } );
        
	}
	
	dispatchGlobalEvent ( event, eventName ) {
	    
	    let trueTarget;

	    if ( event.detail !== undefined && event.detail.trueTarget !== undefined ) {
	        
	        trueTarget = event.detail.trueTarget;

	    }
            
        for ( let [ k, v ] of Object.entries( this.#functionMap ) ) {
            
            if ( v[ eventName ] !== undefined ) {
                
                if ( k !== "document" ) {
                    
                    let node = document.getElementById( k );
                    
                    switch ( true ) {
                        
                        case trueTarget === undefined :
                            
                            trueTarget = node;
                            
                        break;
                            
                        case trueTarget.id === undefined || trueTarget.id === "":
                            
                            trueTarget = node;
                        
                        break;
                        
                    }
                    
                    if ( node === trueTarget ) {
                        
                        let globalEvent = new Event( eventName );
                        node.dispatchEvent( globalEvent );
                    
                    }
                
                }
                
            }
            
        };
	    
	}

	empty ( mixedVar ) {

        let i,
			len,
			key,
			undef,
			emptyValues = [ undef, null, false, "" ];

        for ( i = 0, len = emptyValues.length; i < len; i++ ) {

            if ( mixedVar === emptyValues[ i ] ) {

                return true;

            }

        }

        if ( typeof mixedVar === "object" ) {

            for ( key in mixedVar ) {

                if ( mixedVar.hasOwnProperty( key ) ) {

                    return false;

                }

            }

            return true;

        }

        return false;

    }
    
	emptyNode ( node ) {

		while ( node.firstChild ) {

			node.removeChild( node.firstChild );

		}

	}

	getCursorPosition ( node ) {
	
		let pos = 0,
			posEnd = 0;

		if ( "selectionStart" in node ) {

			pos = node.selectionStart;
			posEnd = node.selectionEnd;

		} else if( "selection" in document ) {

			node.focus();

			var Snode = document.selection.createRange( );
			var SnodeLength = document.selection.createRange( ).text.length;

			Snode.moveStart( "character", - node.value.length );

			pos = Snode.text.length - SnodeLength;
			posEnd = Snode.text.length;

		}

		return [ pos, posEnd ];

	}

    getKeyByValue ( object, value ) {

        return Object.keys( object ).find( key => object[ key ] === value );

    }

    guid ( ) {

        let s4 = function ( ) {

            return Math
				.floor( ( 1 + Math.random( ) ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );

        }

        return `${s4( )}${s4( )}-${s4( )}-${s4( )}-${s4( )}-${s4( )}${s4( )}${s4( )}`;

    }

	isArrowKey ( key ) {

		return [ "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft" ].includes( key );

        //return this.#arrowKeys.includes( keyCode ) ? true : false;

    }

	/**
	 * @param string key single value
	 * @return boolean
	 * https://regex101.com/r/M01aDp/2/tests
	 */
	isLetterKey ( key ) {

        const regex = /^[A-Za-z]{1}$/;

        return regex.test( key );

	}

	/**
	 * @param string value
	 * @return boolean
	 * https://regex101.com/r/irBKnq/5/tests
	 */
    isNumber ( value ) {

		const regex = /^\d+$/;
		
		return regex.test( value );

    }

	/**
     * @param string key single value
     * @return boolean
	 * https://regex101.com/r/isfG4s/3/tests
	 */
	isSpecialCharKey ( key ) {

        const regex = /^[^A-Za-z0-9]{1}$/;

        return regex.test( key );

    }

    /**
     * Because we hijacked tabbing materialize ninja adds
     * A custom param to the events object called isTab
     * Because of that calue can either be the keyCode value
     * Or the event value passed from an event
     *
     * @param ( int | obj ) value = keyCode || event
     */
    isTab ( value ) {

        let bool = null;

        if( this.isNumber( value ) ) {

            bool = value === 9 ? true : false;

        } else {

            bool = ! _n.empty( value.isTab ) ? true : false;

        }

        return bool;

    }

    keyCode ( event ) {

        let keyCode = event.which || event.keyCode || 0;

        return keyCode;

    }

    on ( node, event, func, options ){
        
        if (
            NodeList.prototype.isPrototypeOf( node ) || 
            HTMLCollection.prototype.isPrototypeOf( node ) 
        ) {
            
            for( let _node of Object.values( node ) ) {
                
                this.on( _node, event, func, options );
                
            }
            
            return;
            
        }

        let nodeID = node === document ? "document" : node.getAttribute( "id" );
        let _event = event.includes( "." ) ? event.split( "." )[ 0 ] : event;

        if ( this.empty( nodeID ) ) {

            /**
             * Due to a quirk in CSS selectors an ID cannot start with an integer
             * Because of this we'll prepend our IDs with GUID-
             */

            nodeID = `GUID-${ this.guid( ) }`;
            node.setAttribute( "id" , nodeID );

        }

        if ( this.#functionMap[ nodeID ] === undefined ) {

            this.#functionMap[ nodeID ] = { };

        }
        
        this.#functionMap[ nodeID ][ event ] = func;
        
        if ( this.#swipeEvents.includes( _event ) ) {
            
            this.#functionMap[ nodeID ][ event ] = this.swipeEvent.bind( this, { 
                "node": node,
                "originEvent": event,
                "callback": func
            } );
            
            _event = "touchstart"
            
        }
        
        node.addEventListener( _event, this.#functionMap[ nodeID ][ event ], options );

    }
    
	/**
	 * Query selector of node we're looking for
	 */
	onNodeInsert( nodeQuerySelector, callback ) {
	    
        let observer = new MutationObserver( ( mutations, observer ) => {
        
        	for ( let mutation of mutations ) {
        	
        	    for ( let node of mutation.addedNodes ) {
        	    	
        	    	// we track only elements, skip other nodes (e.g. text nodes)
        	    	if ( node.nodeType !== 1 ) { continue; }
        	    	
        	    	if ( node.matches( nodeQuerySelector ) ) {
        	    	    
        	    	    callback( node, mutations, observer );
        	    	    
        	    	    observer.disconnect( );
        	    		
        	    	}
        	
        		}
        	
        	}
        	
        } );
        
        observer.observe( document, { childList: true, subtree: true } );
        
        return observer;
	    
	}

    off ( node, event, options ){

        let nodeID = node === document ? "document" : node.getAttribute( "id" );
        let _event = event.includes( "." ) ? event.split( "." )[ 0 ] : event;
        let eventMethod = this.#functionMap[ nodeID ][ event ];
        
        if ( this.#swipeEvents.includes( _event ) ) {
            
            _event = "touchstart"

            /**
             * If we're off'ing a touch event lest make sure
             * To remove our *.trackEvent listeners as well
             */
             
            this.off( node, `touchmove.trackEvent.${event}` );
    	    this.off( node, `touchend.trackEvent.${event}` );
            
        }
        
        node.removeEventListener( _event, eventMethod, options );

        delete this.#functionMap[ nodeID ][ event ];

    }

	spliceString ( cursorPositionStart, cursorPositionStop, source, string ) {

		let start = cursorPositionStart;
		let stop = cursorPositionStart - cursorPositionStop;

		return `${ source.slice( 0, start ) }${ string }${ source.slice( start + Math.abs( stop ) ) }`;

	}
	
	swipeEvent ( data, event ) {
	    
	    let node = data.node,
	        originEvent = data.originEvent,
	        nodeID = node.id,
	        touchobj = event.changedTouches[ 0 ],
	        
	        swipedir = "none",
            startX = touchobj.pageX,
            startY = touchobj.pageY,
            distX,
            distY,
            threshold = 15, //required min distance traveled to be considered swipe
            restraint = 300, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime = new Date( ).getTime( ),
            
	        touchmove = event => {
	            
	            event.preventDefault( );
	            
	        },
	        touchend = event => {
	            
	            let touchobj = event.changedTouches[ 0 ];
	            
	            distX = touchobj.pageX - startX;
	            distY = touchobj.pageY - startY;
	            elapsedTime = new Date( ).getTime( ) - startTime;
	            
	            if ( elapsedTime <= allowedTime ) {
	                
	                if ( Math.abs( distX ) >= threshold && Math.abs( distY ) <= restraint ) {
	                    
	                    swipedir = ( distX < 0 ) ? "left" : "right";
	                    
	                } else if ( Math.abs( distY ) >= threshold && Math.abs( distX ) <= restraint ) {
	                    
	                    swipedir = ( distY < 0 ) ? "up" : "down";
	                    
	                }
	                
	            }
	            
	            if ( swipedir !== "none" ) {
	            
    	            let swipevent = `swipe${swipedir}`;
    	            
    	            for ( let [ funcName, func ] of Object.entries( this.#functionMap[ nodeID ] ) ) {
    	            
    	                if ( funcName.includes( swipevent ) ) {
    	                    
    	                    data.callback( event );
    	            
    	                    event.preventDefault( );
    	                    
    	                }
    	                
    	            }
    	            
    	            this.off( node, `touchmove.trackEvent.${originEvent}`, touchmove );
    	            this.off( node, `touchend.trackEvent.${originEvent}`, touchend );
	            
	            }
	            
	        };

        if ( 
            this.#functionMap[ nodeID ][ `touchmove.trackEvent.${originEvent}`] === undefined &&
            this.#functionMap[ nodeID ][ `touchend.trackEvent.${originEvent}`] === undefined 
        ) {

    	    this.on( node, `touchmove.trackEvent.${originEvent}`, touchmove, { "passive": false, "cancelable": true } );
    	    this.on( node, `touchend.trackEvent.${originEvent}`, touchend, { "passive": false, "cancelable": true } );
	    
        }
	    
	}

}

/**
 * Setting Ninja helper globally so it doesn't
 * Need imported and newed everytime it needs used
 * Adding check to see if Ninja already exests and use it else new
 */
window._n = window.Ninja = window.Ninja === undefined ? new Ninja( ) : window.Ninja;