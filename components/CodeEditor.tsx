"use client";

import dynamic from "next/dynamic";
import { useSimulationStore } from "@/store/simulationStore";

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
	const { sourceCode, setSourceCode } = useSimulationStore();

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
