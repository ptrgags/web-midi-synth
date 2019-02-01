var sound_enabled = false;

let OSCS = [];

var table = new OscTable();
var table_type = 'osc';
let MIDI_KEYBOARD = new MIDIKeyboard(note_on, note_off);

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  table.setup();
  MIDI_KEYBOARD.setup();
}

function note_on(note) {
    table.note_on(note);
}

function note_off(note) {
    table.note_off(note);
}

function draw() {
    background(0);
    fill(255)
    if (!sound_enabled) {
        text('Click to Begin', 20, 20);
    } else {
        text('Play notes on MIDI keyboard', 20, 20);
    }

    if (table_type === 'chord') {
        text(`chord_type: ${table.chord_type}`, 20, 50);
        text(`delay_enabled: ${table.delay_enabled}`, 20, 80);
    }

}

function mouseClicked() {
    // Enable sound
    getAudioContext().resume();
    sound_enabled = true;
}

function keyReleased() {
    if (key === 'C') {
        table.off();
        switch_table();
        table.setup();
    } else if (key === ' ' && table_type === 'chord') {
        table.delay_enabled = !table.delay_enabled;
    } else if (table_type === 'chord')
        table.select_chord_type(key);
}

function switch_table() {
    if (table_type === 'osc') {
        table = new ChordTable();
        table_type = 'chord';
    } else {
        table = new OscTable();
        table_type = 'osc';
    }

}
