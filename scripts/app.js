// INITIALIZE DICE*************************************
var container = $t.id('dice-box');
container.style.width = window.innerWidth + 'px';
container.style.height = window.innerHeight + 'px';

$t.dice.scale = 100;
//$t.dice.use_shadows = false;
//$t.dice.dice_color = '#808080';
//$t.dice.label_color = '#202020';
//$t.dice.ambient_light_color = 0xff0000;
//$t.dice.spot_light_color = 0xefdfd5;

var box = new $t.dice.dice_box(container, { w: window.innerWidth, h: window.innerHeight });
//box.animate_selector = false;

function resize() {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;

    container.style.width = w + 'px';
    container.style.height = h + 'px';
    box.reinit(container, { w: w, h: h });
}

$t.bind(window, ['resize', 'orientationchange'], resize);

let saved_dice = {
    boost: 0,
    setback: 0,
    ability: 0,
    difficulty: 0,
    proficiency: 0,
    challenge: 0,
    force: 0
}

// Setup gesture recognition on dice buttons
let roll_button = document.getElementById('roll-btn');

for (const dice in saved_dice) {
    let elm, counter, gesture;

    try {
        elm = document.getElementById(dice);
        counter = elm.children[1];
    } catch (e) {
        console.log('Cannot find element with ID:', dice);
        continue
    }

    gesture = new Gestures(elm)
    gesture.on('click tap', () => {
        // increment counter and add to saved_dice
        saved_dice[dice]++
        counter.innerHTML = saved_dice[dice]
        counter.classList.remove('hidden');
        roll_button.classList.remove('hidden');
    })
    gesture.on('rightClick', () => {
        // decrement counter and remove from saved_dice
        if (saved_dice[dice] > 0) {
            saved_dice[dice]--;
            counter.innerHTML = saved_dice[dice]

            if (saved_dice[dice] == 0) counter.classList.add('hidden');
        }

        if (Object.values(saved_dice).every(item => item === 0))
            roll_button.classList.add('hidden');
    })
    gesture.on('longClick longPress', () => {
        // clear ounter and reset saved_dice
        saved_dice[dice] = 0;
        counter.classList.add('hidden');

        if (Object.values(saved_dice).every(item => item === 0))
            roll_button.classList.add('hidden');
    })
    gesture.start();
}
// FINISHED INITIALIZING DICE****************************


function before_roll(vectors, notation, callback) {

    // do here rpc call or whatever to get your own result of throw.
    // then callback with array of your result, example:
    // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
    callback(notation.result);
}

function after_roll(notation, result) {

    // log results to the console
    var res = result.join(' ');
    if (notation.constant) {
        if (notation.constant > 0) res += ' +' + notation.constant;
        else res += ' -' + Math.abs(notation.constant);
    }
    if (result.length > 1) res += ' = ' +
        (result.reduce(function (s, a) { return s + a; }) + notation.constant);
    console.log(res);
}

let roll_dice = function (inputString) {
    box.rolling = false;
    box.start_throw(function () {
        return $t.dice.parse_notation(inputString);
    }, before_roll, after_roll);
}

let clear_dice = function () {
    box.clear()
}

let roll_saved_dice = function () {
    if (saved_dice.boost || saved_dice.setback || saved_dice.ability || saved_dice.difficulty ||
        saved_dice.proficiency || saved_dice.challenge || saved_dice.force) {

        let inputString = `${saved_dice.boost}d101 + ${saved_dice.setback}d102 + ${saved_dice.ability}d103 + ${saved_dice.difficulty}d104 + ${saved_dice.proficiency}d105 + ${saved_dice.challenge}d106 + ${saved_dice.force}d107`
        document.getElementById("dice-box").classList.remove("hidden")
        roll_dice(inputString);
    }
}

let clear_saved_dice = function () {
    for (const dice in saved_dice) {
        try {
            elm = document.getElementById(dice);
            counter = elm.children[1];
        } catch (e) {
            console.log('Cannot find element with ID:', dice);
            continue
        }
        saved_dice[dice] = 0;
        counter.classList.add('hidden');
        roll_button.classList.add('hidden');
    }
}

let hide_dice = function () {
    document.getElementById("dice-box").classList.add("hidden")
}