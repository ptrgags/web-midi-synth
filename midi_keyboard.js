class MIDIKeyboard {
    /**
     * This accepts the callbacks note_on(midi_note) and
     * note_off(midi_note);
     */
    constructor(note_on, note_off) {
        this.note_on = note_on;
        this.note_off = note_off;

        this.MIDI_MSG_ON = 144;
        this.MIDI_MSG_OFF = 128;
    }

    setup() {
        navigator.requestMIDIAccess()
            .then((access) => this.on_access(access))
            .catch((e) => console.error("MIDI Error:", e));
    }

    on_access(midi_access) {
        let inputs = midi_access.inputs;
        for (let input of inputs.values()) {
            input.onmidimessage = (message) => this.on_message(message);
        }
    }

    on_message(message) {
        let [command, note,] = message.data;
        console.log(command, note);
        if (command === this.MIDI_MSG_ON) {
            this.note_on(note); 
        } else if (command === this.MIDI_MSG_OFF) {
            this.note_off(note);
        } else {
            console.log("Unknown midi event", message);
        }
    }
}
