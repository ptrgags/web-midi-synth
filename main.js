var sound_enabled = false;

let OSCS = [];

let OSC_TABLE = new OscTable();
let MIDI_KEYBOARD = new MIDIKeyboard(note_on, note_off);

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  OSC_TABLE.setup();
  MIDI_KEYBOARD.setup();
}

function note_on(note) {
    OSC_TABLE.note_on(note);
}

function note_off(note) {
    OSC_TABLE.note_off(note);
}

function draw() {
    background(0);
    fill(255)
    if (!sound_enabled) {
        text('Click to Begin', 20, 20);
    } else {
        text('Play notes on MIDI keyboard', 20, 20);
    }
}

function mouseClicked() {
    // Enable sound
    getAudioContext().resume();
    sound_enabled = true;
}
