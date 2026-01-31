"use client";

import dynamic from "next/dynamic";
import { useSimulationStore } from "@/store/simulationStore";

import { useWasm } from "@/hooks/useWasm";
import { useToast } from "@/hooks/useToast";
import type { editor } from "monaco-editor";
import { useCallback, useRef, useEffect } from "react";

// Monaco must be loaded client-side only
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400">
			Loading Editor...
		</div>
	),
});

export function CodeEditor() {
	const {
		sourceCode,
		setSourceCode,
		tapeInput,
		setCompileResult,
		setSimulationResult,
		setCurrentStep,
	} = useSimulationStore();

	const { isReady, compile, run } = useWasm();
	const { toast } = useToast();

	// Use a ref to store the compile and run function so Monaco can always access the latest
	const compileAndRunRef = useRef<() => void>(() => {});

	// Update the ref whenever dependencies change
	useEffect(() => {
		compileAndRunRef.current = () => {
			if (!isReady) {
				toast({
					title: "WASM Not Ready",
					description: "Wait for WASM to load",
					variant: "destructive",
				});
				return;
			}

			const compileResult = compile(sourceCode);
			setCompileResult(compileResult);

			if (compileResult?.status === "error") {
				toast({
					title: "Compilation Error",
					description: compileResult.error,
					variant: "destructive",
				});
				return;
			}

			const result = run(sourceCode, tapeInput);
			setSimulationResult(result);
			setCurrentStep(0);

			if (result?.status === "error") {
				toast({
					title: "Simulation Error",
					description: "Failed to run simulation",
					variant: "destructive",
				});
			} else {
				toast({
					title: `Simulation Complete: ${result?.status}`,
					description: `Total steps: ${result?.history.length || 0}`,
					variant:
						result?.status === "ACCEPTED" ? "success" : "default",
				});
			}
		};
	}, [isReady, sourceCode, tapeInput]);

	const MonacoMount = (editor: editor.IStandaloneCodeEditor) => {
		editor.addAction({
			id: "compile-and-run-on-save",
			label: "Compiles and Runs sim on ctrl+s",
			keybindings: [
				// Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS
				// CtrlCmd = 2048, KeyS = 49
				2048 | 49,
			],
			run: () => {
				// Call through the ref to always get the latest function
				compileAndRunRef.current();
			},
		});
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4">
				<span className="text-sm text-zinc-400">main.tm</span>
				<span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">
					TM-Lang
				</span>
			</div>
			<div className="flex-1">
				<MonacoEditor
					height="100%"
					defaultLanguage="yaml"
					theme="vs-dark"
					value={sourceCode}
					onChange={(value) => setSourceCode(value || "")}
					onMount={MonacoMount}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						fontFamily: "JetBrains Mono, Fira Code, monospace",
						lineNumbers: "on",
						renderLineHighlight: "all",
						scrollBeyondLastLine: false,
						automaticLayout: true,
						tabSize: 4,
						wordWrap: "on",
						padding: { top: 16 },
					}}
				/>
			</div>
		</div>
	);
}
