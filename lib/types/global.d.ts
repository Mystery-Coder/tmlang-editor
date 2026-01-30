export {};

declare global {
	interface Window {
		Go: new () => {
			importObject: WebAssembly.Imports;
			run: (instance: WebAssembly.Instance) => Promise<void>;
		};

		// The functions your Go main_wasm.go exports:
		tmCompile: (source: string) => string;
		tmRun: (source: string, input: string) => string;
	}
}
