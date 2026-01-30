"use client";

import dynamic from "next/dynamic";
import { useSimulationStore } from "@/store/simulationStore";
import { FileCode2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400">
			Loading Editor...
		</div>
	),
});

export function CCodeViewer() {
	const { compileResult } = useSimulationStore();

	if (!compileResult?.c_code) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 text-zinc-500">
				<div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
					<FileCode2 className="w-10 h-10 text-zinc-600" />
				</div>
				<p className="text-sm font-medium">No C Code Generated</p>
				<p className="text-xs text-zinc-600 mt-1">
					Compile your TM code to see the generated C
				</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col">
			<div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4">
				<span className="text-sm text-zinc-400">output.c</span>
				<span className="ml-2 px-2 py-0.5 text-xs bg-pink-500/10 text-pink-400 rounded border border-pink-500/30">
					Generated
				</span>
				<span className="ml-auto text-xs text-zinc-500">Read-only</span>
			</div>
			<div className="flex-1">
				<MonacoEditor
					height="100%"
					language="c"
					theme="vs-dark"
					value={compileResult.c_code}
					options={{
						readOnly: true,
						minimap: { enabled: false },
						fontSize: 13,
						fontFamily: "JetBrains Mono, Fira Code, monospace",
						lineNumbers: "on",
						renderLineHighlight: "none",
						scrollBeyondLastLine: false,
						automaticLayout: true,
						padding: { top: 16 },
					}}
				/>
			</div>
		</div>
	);
}
