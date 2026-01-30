export interface CompileResponse {
	status: "success" | "error";
	c_code: string;
	dot: string;
	error: string;
}

export interface SimulationStep {
	step: number;
	tape: string; // The visible window of the tape (dynamic viewport)
	head: number; // The index of the head within the 'tape' string
	state: string; // Current state name (e.g., "q0")
}

export interface SimulationResult {
	status: "ACCEPTED" | "REJECTED" | "TIMEOUT" | "CRASH" | "error";
	history: SimulationStep[];
}
