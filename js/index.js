import Deck, { VERSION } from './reveal.js'

/**
 * Expose the Reveal class to the window. To create a
 * new instance:
 * let deck = new Reveal( document.querySelector( '.reveal' ), {
 *   controls: false
 * } );
 * deck.initialize().then(() => {
 *   // reveal.js is ready
 * });
 */
let Reveal = Deck;


/**
 * The below is a thin shell that mimics the pre 4.0
 * reveal.js API and ensures backwards compatibility.
 * This API only allows for one Reveal instance per
 * page, whereas the new API above lets you run many
 * presentations on the same page.
 *
 * Reveal.initialize( { controls: false } ).then(() => {
 *   // reveal.js is ready
 * });
 */

let enqueuedAPICalls = [];

Reveal.initialize = options => {

	// Create our singleton reveal.js instance
	Object.assign( Reveal, new Deck( document.querySelector( '.reveal' ), options ) );

	// Invoke any enqueued API calls
	enqueuedAPICalls.map( method => method( Reveal ) );

	return Reveal.initialize(

		{ // The "normal" size of the presentation, aspect ratio will
			// be preserved when the presentation is scaled to fit different
			// resolutions. Can be specified using percentage units.
			width: 1920,
			height: 1080,
		  
			// Factor of the display size that should remain empty around
			// the content
			margin: 0.04,
		  
			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 2.0,}
	);

}

/**
 * The pre 4.0 API let you add event listener before
 * initializing. We maintain the same behavior by
 * queuing up premature API calls and invoking all
 * of them when Reveal.initialize is called.
 */
[ 'configure', 'on', 'off', 'addEventListener', 'removeEventListener', 'registerPlugin' ].forEach( method => {
	Reveal[method] = ( ...args ) => {
		enqueuedAPICalls.push( deck => deck[method].call( null, ...args ) );
	}
} );

Reveal.isReady = () => false;

Reveal.VERSION = VERSION;

export default Reveal;