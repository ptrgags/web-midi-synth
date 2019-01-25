class OscTable {
    constructor() {
        this.NUM_PITCHES = 128;
        this.osc_table = [];
    }
    
    setup() {
        // Generate an oscillator for each pitch so we have polyphony
        for (let i = 0; i < this.NUM_PITCHES; i++) {
            let freq = midiToFreq(i);

            // TODO: Abstract this into an OscillatorFactory?
            // Create an oscillator with the given pitch, but set the amp
            // to 0 to disable it
            let osc = new p5.Oscillator();
            osc.setType('square');
            osc.freq(freq);
            //let osc = new p5.Pulse(freq, 0.2);
            osc.amp(0);
            osc.start();

            // Store it in the table
            this.osc_table[i] = osc;
        }
    }

    note_on(note_num) {
        const AMP = 0.5;
        const ATTACK = 0.0;
        this.osc_table[note_num].amp(AMP, ATTACK);
    }

    note_off(note_num) {
        const OFF = 0;
        const RELEASE = 0.0;
        this.osc_table[note_num].amp(OFF, RELEASE);
    }
}
