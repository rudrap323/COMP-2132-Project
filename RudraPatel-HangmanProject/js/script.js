/**
 * Hangman — script.js
 * COMP 2132 Project
 * @author Rudra Patel
 */

$(document).ready(function () {

    // ============================================================
    // HANGMAN OBJECT
    // ============================================================

    function Hangman() {
        this.words = [
            { word: 'javascript',  hint: 'The programming language of the web browser' },
            { word: 'algorithm',   hint: 'A step-by-step process for solving a problem' },
            { word: 'elephant',    hint: 'The largest land animal on Earth' },
            { word: 'volcano',     hint: 'A mountain that erupts with lava' },
            { word: 'pyramid',     hint: 'Ancient Egyptian stone structure' },
            { word: 'umbrella',    hint: 'Keeps you dry when it rains' },
            { word: 'butterfly',   hint: 'An insect with colourful wings' },
            { word: 'astronaut',   hint: 'A person who travels to outer space' },
            { word: 'submarine',   hint: 'A vessel that travels underwater' },
            { word: 'chocolate',   hint: 'A sweet treat made from cacao beans' },
            { word: 'telescope',   hint: 'Used to observe distant stars and planets' },
            { word: 'dinosaur',    hint: 'A prehistoric reptile, now extinct' },
            { word: 'lightning',   hint: 'A flash of electricity in a storm' },
            { word: 'compass',     hint: 'A navigation tool that always points north' },
            { word: 'avalanche',   hint: 'A mass of snow sliding down a mountain' },
            { word: 'labyrinth',   hint: 'A complex and confusing maze' },
            { word: 'quicksand',   hint: 'Dangerous loose wet sand that swallows things' },
            { word: 'saxophone',   hint: 'A jazz wind instrument' },
            { word: 'hurricane',   hint: 'A powerful tropical storm with high winds' },
            { word: 'magician',    hint: 'A performer who does tricks and illusions' },
            { word: 'keyboard',    hint: 'A device you type on to use a computer' },
            { word: 'centipede',   hint: 'A long insect with many legs' },
            { word: 'blueprint',   hint: 'A detailed technical plan or diagram' },
            { word: 'flamingo',    hint: 'A pink bird that stands on one leg' },
            { word: 'catapult',    hint: 'An ancient weapon that launches projectiles' }
        ];

        this.currentWord    = '';
        this.currentHint    = '';
        this.guessedLetters = [];
        this.wrongGuesses   = 0;
        this.maxWrong       = 6;
        this.gameOver       = false;
    }

    /**
     * Picks a random word+hint from the list and sets up a fresh game.
     */
    Hangman.prototype.selectWord = function () {
        var index = Math.floor(Math.random() * this.words.length);
        this.currentWord = this.words[index].word;
        this.currentHint = this.words[index].hint;
    };

    /**
     * Processes a letter guess.
     * Returns 'correct', 'wrong', or 'already' (already guessed).
     * @param {string} letter
     * @returns {string}
     */
    Hangman.prototype.guess = function (letter) {
        if (this.gameOver) { return 'over'; }
        if (this.guessedLetters.indexOf(letter) !== -1) { return 'already'; }

        this.guessedLetters.push(letter);

        if (this.currentWord.indexOf(letter) !== -1) {
            return 'correct';
        }

        this.wrongGuesses++;
        if (this.wrongGuesses >= this.maxWrong) {
            this.gameOver = true;
        }
        return 'wrong';
    };

    /**
     * Returns true if the player has revealed every letter.
     * @returns {boolean}
     */
    Hangman.prototype.isWon = function () {
        for (var i = 0; i < this.currentWord.length; i++) {
            if (this.guessedLetters.indexOf(this.currentWord[i]) === -1) {
                return false;
            }
        }
        return true;
    };

    /**
     * Returns an array of objects {char, revealed} for each letter position.
     * @returns {Array}
     */
    Hangman.prototype.getDisplayLetters = function () {
        var result = [];
        for (var i = 0; i < this.currentWord.length; i++) {
            var ch = this.currentWord[i];
            result.push({
                char:     ch,
                revealed: this.guessedLetters.indexOf(ch) !== -1
            });
        }
        return result;
    };

    /**
     * Returns only the letters guessed incorrectly.
     * @returns {Array}
     */
    Hangman.prototype.getWrongLetters = function () {
        var wrong = [];
        for (var i = 0; i < this.guessedLetters.length; i++) {
            if (this.currentWord.indexOf(this.guessedLetters[i]) === -1) {
                wrong.push(this.guessedLetters[i]);
            }
        }
        return wrong;
    };

    /**
     * Returns the count of unguessed unique letters remaining.
     * @returns {number}
     */
    Hangman.prototype.remainingCount = function () {
        var unique = {};
        for (var i = 0; i < this.currentWord.length; i++) {
            unique[this.currentWord[i]] = true;
        }
        var count = 0;
        for (var letter in unique) {
            if (this.guessedLetters.indexOf(letter) === -1) {
                count++;
            }
        }
        return count;
    };

    /**
     * Resets the game object for a new round.
     */
    Hangman.prototype.reset = function () {
        this.currentWord    = '';
        this.currentHint    = '';
        this.guessedLetters = [];
        this.wrongGuesses   = 0;
        this.gameOver       = false;
    };


    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    /**
     * Returns the relative path to a hangman stage image.
     * @param {number} stage  0–6
     * @returns {string}
     */
    function hangPath(stage) {
        return '../images/hang' + stage + '.svg';
    }

    /**
     * Generates all 26 A–Z letter buttons and appends them to #keyboard.
     */
    function buildKeyboard() {
        var $keyboard = $('#keyboard');
        $keyboard.empty();

        for (var i = 65; i <= 90; i++) {
            var letter = String.fromCharCode(i).toLowerCase();
            var $btn = $('<button></button>')
                .addClass('key-btn')
                .attr('data-letter', letter)
                .text(letter.toUpperCase());
            $keyboard.append($btn);
        }
    }

    /**
     * Rebuilds the word display slots based on current game state.
     */
    function renderWord() {
        var $display  = $('#word-display');
        var letters   = game.getDisplayLetters();

        $display.empty();

        for (var i = 0; i < letters.length; i++) {
            var $slot = $('<div></div>').addClass('letter-slot');
            var $char = $('<div></div>').addClass('letter-char');
            var $line = $('<div></div>').addClass('letter-line');

            if (letters[i].revealed) {
                $char.text(letters[i].char.toUpperCase()).addClass('revealed');
            } else {
                $char.text('');
            }

            $slot.append($char).append($line);
            $display.append($slot);
        }
    }

    /**
     * Updates the hangman image to the current wrong-guess stage.
     */
    function renderHangman() {
        var $img = $('#hangman-img');
        $img.attr('src', hangPath(game.wrongGuesses));
        // Re-trigger animation
        $img.removeClass('hangman-anim');
        void $img[0].offsetWidth;
        $img.addClass('hangman-anim');
    }

    /**
     * Updates the wrong-letters panel and wrong count.
     */
    function renderWrongLetters() {
        var wrong   = game.getWrongLetters();
        var $panel  = $('#wrong-letters');
        var $count  = $('#wrong-num');

        $panel.empty();
        $count.text(game.wrongGuesses);

        for (var i = 0; i < wrong.length; i++) {
            var $chip = $('<span></span>')
                .addClass('wrong-letter-chip')
                .text(wrong[i].toUpperCase());
            $panel.append($chip);
        }
    }

    /**
     * Updates the letters-remaining counter text.
     */
    function renderRemaining() {
        var rem = game.remainingCount();
        if (rem === 0) {
            $('#letters-remaining-text').text('');
        } else {
            $('#letters-remaining-text').text(rem + ' letter' + (rem !== 1 ? 's' : '') + ' remaining');
        }
    }

    /**
     * Marks a keyboard button as correct or wrong.
     * @param {string} letter
     * @param {string} state  'correct' | 'wrong'
     */
    function markKey(letter, state) {
        $('[data-letter="' + letter + '"]')
            .addClass(state + ' used')
            .prop('disabled', true);
    }

    /**
     * Disables all keyboard buttons (called when game ends).
     */
    function disableAllKeys() {
        $('.key-btn').prop('disabled', true);
    }

    /**
     * Shows the end-of-game result overlay.
     * @param {boolean} won
     */
    function showResult(won) {
        var icon, title, detail, colour;

        if (won) {
            icon   = '🎉';
            title  = 'You Won!';
            detail = 'Great job — you guessed the word!';
            colour = '#2dd4bf';
        } else {
            icon   = '💀';
            title  = 'Game Over';
            detail = 'Better luck next time. The word was:';
            colour = '#f87171';
        }

        $('#result-icon').text(icon);
        $('#result-title').text(title).css('color', colour);
        $('#result-detail').text(detail);
        $('#result-word').text(game.currentWord.toUpperCase());

        $('#result-overlay').removeClass('hidden').hide().fadeIn(320);
    }

    /**
     * Starts a brand new game: resets state, rebuilds UI.
     */
    function startGame() {
        game.reset();
        game.selectWord();

        buildKeyboard();
        renderWord();
        renderHangman();
        renderWrongLetters();
        renderRemaining();

        $('#hint-text').text(game.currentHint);
        $('#result-overlay').addClass('hidden').hide();
    }


    // ============================================================
    // INIT
    // ============================================================

    var game = new Hangman();
    startGame();


    // ============================================================
    // EVENT HANDLERS
    // ============================================================

    // Letter button click
    $(document).on('click', '.key-btn', function () {
        if (game.gameOver) { return; }

        var letter = $(this).attr('data-letter');
        var result = game.guess(letter);

        if (result === 'correct') {
            markKey(letter, 'correct');
            renderWord();
            renderRemaining();

            if (game.isWon()) {
                game.gameOver = true;
                disableAllKeys();
                setTimeout(function () { showResult(true); }, 450);
            }
        } else if (result === 'wrong') {
            markKey(letter, 'wrong');
            renderHangman();
            renderWrongLetters();
            renderRemaining();

            if (game.gameOver) {
                disableAllKeys();
                setTimeout(function () { showResult(false); }, 700);
            }
        }
    });

    // New game button
    $('#new-game-btn').on('click', function () {
        startGame();
    });

    // Play again (from overlay)
    $('#play-again-btn').on('click', function () {
        startGame();
    });

});