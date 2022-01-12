import { Note, getNoteFrequency } from "./lib/noteToHz";

type Octave = -2 | -1 | 0 | 1 | 2;

type FliterType = "lowpass" | "highpass";

type WaveType = "sine" | "sawtooth" | "square" | "triangle";

interface SynthConfig {
  ocsillators?: {
    osc1?: {
      on: boolean;
      octave: Octave;
      type: WaveType;
    };
    osc2?: {
      on: boolean;
      octave: Octave;
      type: WaveType;
    };
    osc3?: {
      on: boolean;
      octave: Octave;
      type: WaveType;
    };
  };
  gain?: {
    value: number;
  };
  filter?: {
    type: FliterType;
    frequency: number;
  };
}

const initConfig: SynthConfig = {
  ocsillators: {
    osc1: {
      on: true,
      octave: 0,
      type: "triangle",
    },
    osc2: {
      on: true,
      octave: -1,
      type: "sine",
    },
    osc3: {
      on: true,
      octave: 1,
      type: "sawtooth",
    },
  },
  gain: {
    value: 1,
  },
  filter: {
    type: "lowpass",
    frequency: 220,
  },
};

class Synthd {
  protected config: SynthConfig;
  protected audioCtx: AudioContext;
  protected filter: BiquadFilterNode;
  protected gain: GainNode;
  protected oscillators: Array<OscillatorNode>;

  constructor(config: SynthConfig = initConfig) {
    this.config = { ...initConfig, ...config };
    this.audioCtx = new AudioContext();
    this.filter = this.initFilter();
    this.gain = this.initGain();
    this.oscillators = [];
  }

  protected initFilter() {
    const filter = this.audioCtx.createBiquadFilter();
    filter.connect(this.audioCtx.destination);
    if (this.config.filter) {
      filter.frequency.value = this.config.filter.frequency;
      filter.type = this.config.filter.type;
    }
    return filter;
  }

  protected initGain() {
    const gain = this.audioCtx.createGain();
    gain.connect(this.filter);
    if (this.config.gain) {
      gain.gain.value = this.config.gain.value;
    }
    return gain;
  }

  protected initOscillators(note: Note) {
    this.oscillators = [];
    if (!this.config.ocsillators)
      throw new Error("No Oscillators set in config");

    for (const [, osc] of Object.entries(this.config.ocsillators)) {
      if (!osc.on) continue;
      const oscillator = this.audioCtx.createOscillator();
      oscillator.connect(this.filter);
      oscillator.type = osc.type;
      oscillator.frequency.value =
        osc.octave === 0
          ? getNoteFrequency(note)
          : getNoteFrequency(note, osc.octave);
      console.log(oscillator.frequency.value);
      this.oscillators.push(oscillator);
    }
  }

  public configChange(config: SynthConfig) {
    this.config = { ...this.config, ...config };
  }

  public playSynth(note: Note = "A4") {
    this.oscillators.forEach((osc) => {
      osc.stop();
    });
    this.initOscillators(note);
    this.oscillators.forEach((osc) => {
      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.5);
    });
  }
}

const synthd = new Synthd();
const button = document.querySelector<HTMLButtonElement>("#play-synth");
if (!button) throw new Error("Play button does not exist");
button.addEventListener("click", () => {
  synthd.playSynth("C4");
  setTimeout(() => {
    synthd.playSynth("D4");
  }, 500);
  setTimeout(() => {
    synthd.playSynth("E4");
  }, 1000);
  setTimeout(() => {
    synthd.playSynth("F4");
  }, 1500);
  setTimeout(() => {
    synthd.playSynth("G4");
  }, 2000);
  setTimeout(() => {
    synthd.playSynth("A4");
  }, 2500);
  setTimeout(() => {
    synthd.playSynth("B4");
  }, 3000);
  setTimeout(() => {
    synthd.playSynth("C5");
  }, 3500);
});
