/* --- List images cards --- */
const listCards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle','fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube']

let openCards = [];

/* --- Suffle Action --- */
// Shuffle cards list and update the html 
function shuffleCards(){
    shuffle(listCards);
    for(let i=0; i<listCards.length; i++)   {
        let image = listCards[i];
        $('.card').eq(i).html('<i class="fa ' + image +'"></i>');
    }
}

shuffleCards()                    
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/* ---- Number of Moves ---- */
let moves = 0;
function incrementMoves(){
    moves = moves + 1; 
    $('.moves').html(moves); 
    if (moves === 30 || moves === 40){
        $('.fa-star').last().remove();
    }
}

/* ---- Reset number of Moves ---- */
function resetMoves(){
    moves = 0;
    $('.moves').html(0);
}

/* ---- Reset numbers of Stars ---- */
// Add all the stars back in html
function resetStars(){
    $('.stars').html('<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>');
}

/* ---- Timer ---- */
let gameStarted = false; // Tell if the game has started or not
let timerInterval; // Variable that to be used to remove the setInterval
function startTimer(){
    timerInterval = setInterval(function() {
        let minutes = $('.minutes').html(); // get current minute from HTML
        let seconds = $('.seconds').html(); // get current seconds from HTML
        seconds++;
        if(seconds > 59) {
            seconds = 0;
            minutes++;
            if(minutes<10){
                minutes = '0' + minutes;
            }
        }   
        
        if(seconds<10){
            seconds = '0' + seconds;
        }
        $('.minutes').text(minutes);
        $('.seconds').text(seconds);
    }, 1000);
}

function clearTimer(){
    // Remove setInterval to stop the timer
    clearInterval(timerInterval);
    $('.minutes').html('00');
    $('.seconds').html('00');
}

/* --- Cards Logic --- */
$('.card').on('click', function(evt){
    // Start timer on first card click
    if (gameStarted === false){
        gameStarted = true;
        startTimer();
    }
    // Open card only if it is closed and no animation is in progress
   if (!$(this).hasClass('open') && $(':animated').length === 0){
        incrementMoves(); 
        $(this).addClass('open show');
        const lastIndex = openCards[openCards.length-1];
        const lastLastIndex = openCards[openCards.length-2];
        const lastCard = listCards[lastIndex];
        const lastLastCard = listCards[lastLastIndex];
        const actualIndex = $(this).index();
        const actualCard = listCards[actualIndex];
       // If there was 2 cards opened before, close them  
        if (openCards.length % 2 === 0) {
            $('.card').eq(lastIndex).removeClass('open show');
            $('.card').eq(lastLastIndex).removeClass('open show');
            // if they are different, remove from the open card list
            // (if they are equal, they already have the match class)
            if(lastCard !== lastLastCard){ 
                openCards.pop();
                openCards.pop();
            } 
        // if there was just 1 card open before, compare with the current one     
        } else {
            // if the actual card is different than the last card, then shake both
            if(actualCard !== lastCard){
                $( ".open" ).effect( "shake",{times: 3, distance: 8});
            } else {
                // if both cards are the same, highlight effect and let them opened with match class
                $('.card').eq(lastIndex).addClass('match').effect( "highlight" );
                $('.card').eq(actualIndex).addClass('match').effect( "highlight" );
            }  
        }  
        // add the curent card to the list of open cards
        openCards.push(actualIndex);
        // Show the final score panel when all the cards are opened
        if (listCards.length === openCards.length){
            showPanel();
        }
   }
});

/* --- Score Panel for HTML CSS --- */
function showPanel(){
    clearInterval(timerInterval);
    disableGame();
    effectPanel();
    const numberOfStars = $('.fa-star').length;
    const numberOfMoves = moves ;
    const finalTime = $('.minutes').text() + ':'+ $('.seconds').text();
    $('.numberOfStars').html($('.stars').html());
    $('.numberOfMoves').html(numberOfMoves + ' Moves');
    $('.finalTime').html(finalTime);
    $('.deck').addClass('deck-opacity');    
}
function hidePanel() {
    $('#scoreDialog').fadeOut( 500 );
    $('.deck').removeClass('deck-opacity');
}

function disableGame(){
    $('#game-container').addClass('disabled'); // Desable the game when the panel is opened  
}
function enableGame(){
    $('#game-container').removeClass('disabled');  // Enable the game when the panel is closed
}

function effectPanel(){
    $('#scoreDialog').fadeIn( 1000 ).removeClass('hide');
}

function resetCards (){
    $('.card').removeClass('open show match'); // close all the cards opened
    openCards = []; // clear the list 
    shuffleCards(); 
}

/* --- Restart button --- */
function restart(){
    resetCards();
    clearTimer();
    gameStarted = false;
    resetMoves();
    resetStars();
    hidePanel();
    enableGame();
}
            
$('.restart').on('click', restart);