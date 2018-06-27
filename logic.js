$(document).ready(function() {

// ========== GLOBAL VARIABLES ==========
// Firebase Config
  var config = {
    apiKey: "AIzaSyCa1lcOJMrdYEoXumlkbsOL6WUaFg1LYKU",
    authDomain: "click-button-4f522.firebaseapp.com",
    databaseURL: "https://click-button-4f522.firebaseio.com",
    projectId: "click-button-4f522",
    storageBucket: "click-button-4f522.appspot.com",
    messagingSenderId: "794333455197"
  };

  var databaseConnectionsRef;

	var playerOneKey = "";
	var playerTwoKey = "";
	var playerOneTurn = false;
	var playerTwoTurn = false;
	var canPlay = false;
	var options = ["r", "p", "s"];

// ========== FUNCTIONS ==========

	// When there are no players, display the following...
	function displayNoPlayers() {
		$("#player-one-div").html($("<h2>").text("Waiting for player"));
		$("#player-two-div").html($("<h2>").text("Waiting for player"));
		$("#results-div").html($("<h2>").text("Waiting..."));
	}


// ========== MAIN PROCESSES ==========

	// Initialize Firebase
	firebase.initializeApp(config);

	// Create database reference to connections
	databaseConnectionsRef = firebase.database().ref("/connections");

	// When database connections change...
	databaseConnectionsRef.on("value", function(connections) {

		// If there are no connections, then display no users information
		if (connections.numChildren() === 0) {
			displayNoPlayers();
		}
	});

});
