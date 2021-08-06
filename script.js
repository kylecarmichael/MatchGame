/* 
This project's focus was to add a cool, working game to my portfolio. 
I decided to take it a few steps further and add a level of polish while experimenting with new technologies I am learning.
I don't have a ton of experience writing comments so they may seem a little over-done at times to help aide refactoring. :)
*/

// appendNewCard() appends a single new card element to the parent element (#card-container) and returns the new card element.
function appendNewCard(parentElement) {
	let newCard = document.createElement("div");
	newCard.classList.add("card");
	newCard.innerHTML = '<div class="card-down"></div><div class="card-up"></div>';
	parentElement.appendChild(newCard);
	return newCard;
}

// Uncomment to test:
// appendNewCardTest();

// shuffleCardImageClasses() creates an array for us to use to later apply as classes to our cards. This array is shuffled before use.
function shuffleCardImageClasses() {

	let arr = [];

	// arrBuilder pushes items to an empty array in order. ex: [image-1, image-2, image-3] 
	// The inner most loop repeats the items giving a consistent multiple of items. ex: [image-1, image-1, image-2, image-2]
	function arrBuilder(num, repeats, title) {
		for (let i = 1; i <= num; i++) {
			for (let j = 1; j <= repeats; j++) {
				arr.push(title + i);
			}
		}
		return arr;
	}

	// The arrBuilder could made to use globally if it was needed more than once with title being optional.
	arrBuilder(6, 2, "image-");

	// Using underscore.js to shuffle
	let shuffledArr = _.shuffle(arr);
	return shuffledArr;
}

// Uncomment to test:
// shuffleCardImageClassesTest();

// createCards() creates the 12 cards and assigns the image-x class to each looking at the index of the shuffle array from shuffledImageClasses. This also creates cardObj stored in the cardArr and returns the cardArr to track the objects later.
function createCards(parentElement, shuffledImageClasses) {
	// Array to hold card objects
	let cardArr = [];

	for (let i = 0; i < 12; i++) {
		// Append a new card and store the result in a variable.
		let addedCard = appendNewCard(parentElement);

		// Add the image class to the new card element, using shuffledImageClasses[i].
		addedCard.classList.add(shuffledImageClasses[i]);

		let cardObj = {
			index: i,
			element: parentElement.children[i],
			imageClass: parentElement.children[i].classList[1]
		};
		cardArr.push(cardObj);
	}
	// Return the array of 12 card objects.
	return cardArr;
}

// Uncomment to test:
// createCardsTest();

// Given two card objects, this will check if the card objects show the same image when flipped. returns true/false
function doCardsMatch(cardObject1, cardObject2) {
	if (cardObject1.imageClass === cardObject2.imageClass) {
		return true;
	} else {
		return false;
	}
}

// Uncomment to test:
// doCardsMatchTest();

// An object used below as a dictionary to store counter names and their respective values.  
let counters = {
	flips: 0,
	matches: 0
}

// Adds one to a counter being displayed on the webpage (meant for counting flips and matches).
function incrementCounter(counterName, parentElement) {
	// If the 'counterName' property is not defined in the 'counters' object, add it with a value of 0.
	if (counters[counterName] === undefined) {
		counters[counterName] = 0;
	}
	counters[counterName]++;
	// Change the DOM within 'parentElement' to display the new counter value.
	parentElement.innerHTML = counters[counterName];
}

// Uncomment to test:
// incrementCounterTest();

// Variables storing an audio objects to make the various sounds.
let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav')

// adds an onclick listener to the card, flips the card when clicked, and calls the function 'onCardFlipped' after the flip is complete.
function flipCardWhenClicked(cardObject) {
	// Adds an "onclick" attribute/listener to the element that will call the function below.
	cardObject.element.onclick = function () {
		// This code runs after a click
		// Card is already flipped, return.
		if (cardObject.element.classList.contains("flipped")) {
			return;
		}

		// Play the "click" sound.
		clickAudio.play();

		// Add the flipped class immediately after a card is clicked.
		cardObject.element.classList.add("flipped");

		// Wait 500 milliseconds (1/2 of a second) for the flip transition to complete and then call onCardFlipped.
		setTimeout(function () {
			// This runs after a 500ms delay.
			onCardFlipped(cardObject);
		}, 500);
	};
}

/* The 'onCardFlipped' function below will be called each time the user flips a card.  This variable is used to remember the first card flipped while we wait for the user to flip another card. It should be reset to 'null' each time a second card is flipped. */
let lastCardFlipped = null;

// Main game match logic. Checked each time a card is flipped and tracks the first & second card clicked.
// Logic for cards matching or !matching
function onCardFlipped(newlyFlippedCard) {
	// increment the flip counter UI.
	incrementCounter(counters.flips, document.getElementById("flip-count"));
	// If this is the first card flipped, then remember that card using the 'lastCardFlipped' variable and return 
	if (lastCardFlipped === null) {
		lastCardFlipped = newlyFlippedCard;
		return;
	}

	// If the cards don't match, then remove the "flipped" class from each, reset 'lastCardFlipped', and return.
	if (!doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
		lastCardFlipped.element.classList.remove("flipped");
		newlyFlippedCard.element.classList.remove("flipped");

		lastCardFlipped = null;
		return;
	}

	// Play either the win audio or match audio based on whether the user has the number of matches needed to win.
	if (doCardsMatch(lastCardFlipped, newlyFlippedCard)) {
		incrementCounter(counters, document.getElementById("match-count"));

		if (document.getElementById("match-count").textContent == 6) {
			winAudio.play();
		} else {
			matchAudio.play();
		}

		//GLOW EFFECT
		lastCardClass = lastCardFlipped.element.classList
		lastCardClass.add("glow");
		newCardClass = newlyFlippedCard.element.classList
		newCardClass.add("glow");

		setTimeout(function () {
			lastCardClass.remove("glow");
			newCardClass.remove("glow");
		}, 1000);

		// Reset 'lastCardFlipped'.
		lastCardFlipped = null;
		return;
	}
}

// Set up the game.
let cardObjects =
	createCards(document.getElementById("card-container"), shuffleCardImageClasses());

if (cardObjects != null) {
	for (let i = 0; i < cardObjects.length; i++) {
		flipCardWhenClicked(cardObjects[i]);
	}
}

// Reset the game.

function playAgain() {
	// Remove Children
	let cardContainer = document.getElementById("card-container");
	let child = cardContainer.lastElementChild;
	while (child) {
		cardContainer.removeChild(child);
		child = cardContainer.lastElementChild;
	}

	// Reset scores
	document.getElementById("flip-count").textContent = 0;
	document.getElementById("match-count").textContent = 0;
	counters = {
		flips: 0,
		matches: 0
	}


	let cardObjects =
	createCards(document.getElementById("card-container"), shuffleCardImageClasses());

	if (cardObjects != null) {
		for (let i = 0; i < cardObjects.length; i++) {
			flipCardWhenClicked(cardObjects[i]);
		}
	}

}

// Modal pop-up for High Score

let modal = document.getElementById("myModal");
let modalBtn = document.getElementById("modal-btn");
let closeSpan = document.getElementsByClassName("close")[0];

modalBtn.onclick = function() {
	modal.style.display = "block";
}
closeSpan.onclick = function() {
	modal.style.display = "none";
}
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// Append high scores
// NOTE: Here I thought it would look better to have the five top scores appended by default rather than add them sequentially

// This creates the elements, adds the classes from an array built in buildScoreArr, default score is "--"
function appendNewHighScore(parentElement, buildScoreArr) {
	for(let i = 0; i < 5; i++){
		let highScoreMessage = document.createElement("p");
		highScoreMessage.classList.add("score")
		highScoreMessage.textContent = i + 1 + " - Flip count: ";
		parentElement.appendChild(highScoreMessage);

		let newHighScore = document.createElement("span");
		newHighScore.classList.add("score-num");
		newHighScore.classList.add(buildScoreArr[i]);
		newHighScore.innerText = "--";
		highScoreMessage.appendChild(newHighScore);
	}			
}

let scoreContainer = document.getElementById("score-container");
appendNewHighScore(scoreContainer, buildScoreArr());


// Another Example of Tech Debt :| Added ids to all the bois 
let hS1dom = document.getElementsByClassName("high-score-1")[0];
let hS1att = document.createAttribute("id");
hS1att.value = "high-score-1";
hS1dom.setAttributeNode(hS1att);

let hS2dom = document.getElementsByClassName("high-score-2")[0];
let hS2att = document.createAttribute("id");
hS2att.value = "high-score-2";
hS2dom.setAttributeNode(hS2att);
 
let hS3dom = document.getElementsByClassName("high-score-3")[0];
let hS3att = document.createAttribute("id");
hS3att.value = "high-score-3";
hS3dom.setAttributeNode(hS3att);
 
let hS4dom = document.getElementsByClassName("high-score-4")[0];
let hS4att = document.createAttribute("id");
hS4att.value = "high-score-4";
hS4dom.setAttributeNode(hS4att);
 
let hS5dom = document.getElementsByClassName("high-score-5")[0];
let hS5att = document.createAttribute("id");
hS5att.value = "high-score-5";
hS5dom.setAttributeNode(hS5att);
 

// Local Storage for High Scores

// For the arr of class names
function buildScoreArr(){
	let scoreArr = []
	function scoreArrBuilder(num, repeats, title) {
		for (let i = 1; i <= num; i++) {
			for (let j = 1; j <= repeats; j++) {
				scoreArr.push(title + i);
			}
		}
		return scoreArr;
	}
	scoreArrBuilder(5, 1, "high-score-");
	return scoreArr;
}

// This could probably go in a loop but (;-;)
let highScore1 = localStorage.getItem("highScore1");
let highScore2 = localStorage.getItem("highScore2");
let highScore3 = localStorage.getItem("highScore3");
let highScore4 = localStorage.getItem("highScore4");
let highScore5 = localStorage.getItem("highScore5");

// If it doesn't exist yet, set to zero (displayed as --)
if(highScore1 == null || highScore1 == undefined) {
	highScore1 = 0;
} else {
	highScore1 = parseInt(highScore1, 10);
}

if(highScore2 == null || highScore2 == undefined) {
	highScore2 = 0;
} else {
	highScore2 = parseInt(highScore2, 10);
}

if(highScore3 == null || highScore3 == undefined) {
	highScore3 = 0;
} else {
	highScore3 = parseInt(highScore3, 10);
}

if(highScore4 == null || highScore4 == undefined) {
	highScore4 = 0;
} else {
	highScore4 = parseInt(highScore4, 10);
}

if(highScore5 == null || highScore5 == undefined) {
	highScore5 = 0;
} else {
	highScore5 = parseInt(highScore5, 10);
}


// Array for Scores

// This doesn't work
function highScoresArr1() {
	let arr = ["16", "20", "28", "30", "32"];
	console.log(arr);
	return arr;
}

// scoreArrFromLocal
let highScoresArr = [];
highScoresArr.push(highScore1);
highScoresArr.push(highScore2);
highScoresArr.push(highScore3);
highScoresArr.push(highScore4);
highScoresArr.push(highScore5);

// This does??
// let highScoresArr3 = ["14", "20", "22", "30", "36"];


// DON'T NEED ANY OF THIS (i think)
// function scoreList(flips, matches) {
// 	if (matches.innerText === "6") {
// 		for (let i = 0; i < 5; i++){
// 			if (flips.innerText < highScoresArr[i]) {
// 				highScoresArr.splice(i, 1, flips);
// 			} else if (highScoresArr[i] == null){
// 				console.log("Flag me");
// 			} else {
// 				console.log("here");
// 			}
			
// 		}
// 		console.log("should look at your score now");
// 	} else {
// 		console.log("not done yet to log scores");
// 	}
// }



// click listener for high score btn
document.getElementById("modal-btn").addEventListener("click", updateHighScores);

function updateHighScores() {
	localStorage.setItem("highScore1", highScoresArr[0]);
	document.getElementById("high-score-1").innerText = highScore1;

	localStorage.setItem("highScore2", highScoresArr[1]);
	document.getElementById("high-score-2").innerText = highScore2;

	localStorage.setItem("highScore3", highScoresArr[2]);
	document.getElementById("high-score-3").innerText = highScore3;

	localStorage.setItem("highScore4", highScoresArr[3]);
	document.getElementById("high-score-4").innerText = highScore4;

	localStorage.setItem("highScore5", highScoresArr[4]);
	document.getElementById("high-score-5").innerText = highScore5;
	
}

// TODO:

// Get flip value on win
// Switch cases for flip vs. high scores

