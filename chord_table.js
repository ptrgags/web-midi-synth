class ChordTable {
    constructor() {
        //Don't allow the extremely high notes as roots
        this.NUM_PITCHES = 125;
        this.roots = [];
        this.thirds = [];
        this.fifths = [];
        this.sevenths = [];

        this.CHORD_TYPES = new Map([
            ['1', 'major_triad'],
            ['Q', 'minor_triad'],
            ['W', 'diminished_triad'],
            ['2', 'augmented_triad'],
            ['3', 'major_seventh'],
            ['E', 'dominant_seventh'],
            ['4', 'minor_major_seventh'],
            ['R', 'minor_seventh'],
            ['5', 'half_diminished'],
            ['T', 'fully_diminished'],
            ['6', 'augmented_major_seventh'],
            ['Y', 'augmented_dominant_seventh'],
        ]);

        this.chord_type = 'major_triad'
        this.delay_enabled = false;
    }

    setup() {
        for (let i = 0; i < this.NUM_PITCHES; i++) {
            let root = i;
            this.roots[i] = this.make_osc(root);

            // Default to a dominant 7th chord so we fill out
            // all oscilators though they're all off by default
            // and will change anyway once a note is played

            let third = this.major_third_above(root);
            this.thirds[i] = this.make_osc(third);

            let fifth = this.minor_third_above(third);
            this.fifths[i] = this.make_osc(fifth);

            let seventh = this.minor_third_above(fifth);
            this.sevenths[i] = this.make_osc(seventh);
        }
    }

    /**
     * Return a major third above the given note
     */
    major_third_above(midi_note) {
        return midi_note + 4;
    }

    /**
     * Return a minor third above the given note
     */
    minor_third_above(midi_note) {
        return midi_note + 3;
    }

    /**
     * Get the interval between root and third as a function
     */
    get third_interval() {
        switch (this.chord_type) {
            case 'major_triad':
            case 'augmented_triad':
            case 'major_seventh':
            case 'dominant_seventh':
            case 'augmented_major_seventh':
            case 'augmented_dominant_seventh':
                return this.major_third_above;
            default:
                return this.minor_third_above;
        }
    }

    /**
     * Get the interval between the third and the fifth
     * (NOT between root and fifth!) as a function
     */
    get fifth_interval() {
        switch (this.chord_type) {
            case 'major_triad':
            case 'diminished_triad':
            case 'major_seventh':
            case 'dominant_seventh':
            case 'half_diminished':
            case 'fully_diminished':
                return this.minor_third_above;
            default:
                return this.major_third_above;
        }
    }

    /**
     * Get the interval between the fifth and the 7th of the chord
     * as a function or null if there is no seventh in the given chord type
     */
    get seventh_interval() {
        switch (this.chord_type) {
            case 'major_triad':
            case 'minor_triad':
            case 'diminished_triad':
            case 'augmented_triad':
                // Triads have no 7th
                return null;
            case 'major_seventh':
            case 'half_diminished':
            case 'augmented_major_seventh':
            case 'minor_major_seventh':
                return this.major_third_above;
            default:
                return this.minor_third_above;
        }
    }

    make_osc(midi_note) {
        const AMP = 0.7;
        let freq = midiToFreq(midi_note);
        let osc = new p5.Oscillator();
        osc.setType('sine');
        osc.freq(freq);
        osc.amp(AMP);
        return osc;
    }

    off() {
        for (let i = 0; i < this.NUM_PITCHES; i++) {
            this.roots[i].stop();
            this.thirds[i].stop();
            this.fifths[i].stop();
            this.sevenths[i].stop();
        }
    }

    select_chord_type(key) {
        let new_type = this.CHORD_TYPES.get(key);
        if (new_type)
            this.chord_type = new_type;
    }
    
    /**
     * Delay  betw
     */
    get delay() {
        const DELAY = 0.3;
        if (this.delay_enabled) 
            return DELAY
        else
            return 0.0;
    }

    note_on(note_num) {
        // Always turn on the root note
        let root = note_num;
        this.roots[note_num].start();

        // Add the third
        let stack_third = this.third_interval;
        let third = stack_third(root);
        let third_freq = midiToFreq(third);
        this.thirds[note_num].freq(third_freq);
        this.thirds[note_num].start(this.delay);

        // And the fifth
        let stack_fifth = this.fifth_interval;
        let fifth = stack_fifth(third);
        let fifth_freq = midiToFreq(fifth);
        this.fifths[note_num].freq(fifth_freq);
        this.fifths[note_num].start(2 * this.delay);

        // And maybe the 7th
        let stack_seventh = this.seventh_interval;
        if (!stack_seventh)
            return;
        let seventh = stack_seventh(fifth);
        let seventh_freq = midiToFreq(seventh);
        this.sevenths[note_num].freq(seventh_freq);
        this.sevenths[note_num].start(3 * this.delay);

    }

    note_off(note_num) {
        this.roots[note_num].stop();
        this.thirds[note_num].stop();
        this.fifths[note_num].stop();
        this.sevenths[note_num].stop();
    }
}
