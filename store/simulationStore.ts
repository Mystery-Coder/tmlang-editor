import { create } from "zustand";
import type {
	SimulationStep,
	SimulationResult,
	CompileResponse,
} from "@/lib/types/wasm";

interface SimulationState {
	// Source code
	sourceCode: string;
	setSourceCode: (code: string) => void;

	// Compilation results
	compileResult: CompileResponse | null;
	setCompileResult: (result: CompileResponse | null) => void;

	// Simulation state
	simulationResult: SimulationResult | null;
	setSimulationResult: (result: SimulationResult | null) => void;

	// Tape input
	tapeInput: string;
	setTapeInput: (input: string) => void;

	// Playback state
	currentStep: number;
	setCurrentStep: (step: number) => void;
	isPlaying: boolean;
	setIsPlaying: (playing: boolean) => void;
	playbackSpeed: number; // ms per step
	setPlaybackSpeed: (speed: number) => void;

	// Computed helpers
	getCurrentState: () => SimulationStep | null;
	getTotalSteps: () => number;

	// Playback controls
	stepForward: () => void;
	stepBackward: () => void;
	reset: () => void;
}

const DEFAULT_SOURCE = `CONFIG:
    START: q0
    ACCEPT: success
    REJECT: fail

MAIN:
    q0, 0 -> 0, R, q0
    q0, 1 -> 1, R, q0
    q0, _ -> _, L, q1

    q1, 0 -> 0, L, q1
    q1, 1 -> 1, L, q2

    q2, 0 -> 1, L, q2
    q2, 1 -> 0, L, q2
    q2, _ -> _, S, success`;

export const useSimulationStore = create<SimulationState>((set, get) => ({
	// Source code
	sourceCode: DEFAULT_SOURCE,
	setSourceCode: (code) => set({ sourceCode: code }),

	// Compilation results
	compileResult: null,
	setCompileResult: (result) => set({ compileResult: result }),

	// Simulation state
	simulationResult: null,
	setSimulationResult: (result) =>
		set({ simulationResult: result, currentStep: 0, isPlaying: false }),

	// Tape input
	tapeInput: "11011",
	setTapeInput: (input) => set({ tapeInput: input }),

	// Playback state
	currentStep: 0,
	setCurrentStep: (step) => {
		const { simulationResult } = get();
		if (
			simulationResult &&
			step >= 0 &&
			step < simulationResult.history.length
		) {
			set({ currentStep: step });
		}
	},
	isPlaying: false,
	setIsPlaying: (playing) => set({ isPlaying: playing }),
	playbackSpeed: 500,
	setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

	// Computed helpers
	getCurrentState: () => {
		const { simulationResult, currentStep } = get();
		if (!simulationResult || simulationResult.history.length === 0) {
			return null;
		}
		return simulationResult.history[currentStep] || null;
	},

	getTotalSteps: () => {
		const { simulationResult } = get();
		return simulationResult?.history.length || 0;
	},

	// Playback controls
	stepForward: () => {
		const { currentStep, simulationResult } = get();
		if (
			simulationResult &&
			currentStep < simulationResult.history.length - 1
		) {
			set({ currentStep: currentStep + 1 });
		} else {
			set({ isPlaying: false });
		}
	},

	stepBackward: () => {
		const { currentStep } = get();
		if (currentStep > 0) {
			set({ currentStep: currentStep - 1 });
		}
	},

	reset: () => {
		set({ currentStep: 0, isPlaying: false });
	},
}));
