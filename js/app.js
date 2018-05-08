/*
 * Create a list that holds all of your cards
 */
let gameData = {
    symbols: ['trello', 'tripadvisor', 'tumblr', 'vine', 'envira', 'skype', 'drupal', 'firefox', 'trello', 'tripadvisor', 'tumblr', 'vine', 'envira', 'skype', 'drupal', 'firefox'],
    openCards: [],
    moves: 0,
    matchCount: 0,
    timeCount: 0,
    timer: '',
    started: false
};

$(document).ready(function () {
    createGrid();
    $('.restart').on('click', restart);

    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yup, I love it!';
    vex.dialog.buttons.NO.text = 'No, Thanks!';

    //executed when clicked on restart game.
    function restart() {
        $('.deck').html('');
        gameData.started = false;
        gameData.openCards = [];
        gameData.moves = 0;
        gameData.matchCount = 0;
        createGrid();
        stopTimer();
        resetStars();
        $('#moves').html('0');
    }

    //used to create the grid of random cards
    function createGrid() {
        let list = shuffle(gameData.symbols);
        for (item of list) {
            $('.deck').append('<li class="card"> <i class="fa fa-' + item + '"></i> </li>')
        }
        $('.card').on('click', showCard);
    }

    // used to stop the timer
    function startTimer() {
        if (gameData.started) {
            gameData.timeCount += 1;
            $("#timer").html(gameData.timeCount);
            gameData.timer = setTimeout(startTimer, 1000);
        }
    }

    //used to stop the timer
    function stopTimer() {
        clearTimeout(gameData.timer);
        gameData.timeCount = 0;
        $("#timer").html('0');
    }

    //used to reset the number of stars
    function resetStars() {
        $(".stars").html('');
        for (let i = 0; i < 3; i++) {
            $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
        }
    }

    //executed when the card is clicked
    function showCard() {
        let classes = $(this).attr("class");
        if (classes.search('open') * classes.search('match') !== 1) {
            return;
        }
        if (!gameData.started) {
            gameData.started = true;
            startTimer()
        }
        if (gameData.openCards.length === 0) {
            addToOpenCards($(this));
            $(this).addClass(' open show bounceIn animated');
        }
        else if (gameData.openCards.length === 1) {
            addToOpenCards($(this));
            $(this).addClass(' open show bounceIn animated');
            setTimeout(checkMatch, 400);
        }
    }

    //used to keep count of open cards
    function addToOpenCards(card) {
        increaseMoves();
        gameData.openCards.push(card)
    }

    // used to update the number of moves in the game. These moves are used for updating the star rating
    function increaseMoves() {
        gameData.moves++
        $('#moves').html(gameData.moves);
        if (gameData.moves === 18 || gameData.moves === 30 || gameData.moves === 44) {
            updateStars();
        }
    }

    // used to reduce the number of stars in the game
    function updateStars() {
        let stars = $(".fa-star");
        $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
    }

    //used to check the match
    function checkMatch() {
        if (gameData.openCards[0].children('i').attr('class') === gameData.openCards[1].children('i').attr('class')) {
            cardsMatched()
        }
        else {
            cardsNotMatched()
        }
        gameData.openCards = []
    }

    //executed when two open cards match
    function cardsMatched() {
        increaseMatchCount()
        gameData.openCards[0].removeClass("animated bounceIn");
        gameData.openCards[1].removeClass("animated bounceIn");
        if (gameData.matchCount === 8) {
            gameData.openCards[0].addClass("open show match tada animated");
            gameData.openCards[1].addClass("open show match tada animated");
            setTimeout(endGame, 700)
        }
        else {
            gameData.openCards[0].addClass(" open show match tada animated");
            gameData.openCards[1].addClass(" open show match tada animated");
        }
    }

    //used to increase match count
    function increaseMatchCount() {
        gameData.matchCount++;
    }

    //executed when two open cards do not match
    function cardsNotMatched() {
        gameData.openCards.forEach(function (card) {
            card.removeClass('animated bounceIn')
            card.animateCss('shake animated', function () {
                card.toggleClass("open show");
            });
        });
    }

    // executed when the match count is equal to 8, meaning all the pairs are matched.
    function endGame() {
        clearTimeout(gameData.timer);
        let starlength = $(".fa-star").length;
        vex.dialog.confirm({
            message: `Champion! You won the game in ${gameData.timeCount} seconds with ${starlength} star rating. Do you want to play again?`,
            callback: function (value) {
                if (value) {
                    restart();
                }
            }
        });
    }

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

});


//take from https://github.com/daneden/animate.css/#usage
// works like promises, used to block events until animations are over
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});