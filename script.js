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