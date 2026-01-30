"use client";

import { Button } from "@/components/ui/button";
import { Download, Play, Zap, Terminal, Github } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useWasm } from "@/hooks/useWasm";
import { useToast } from "@/hooks/useToast";

export function Header() {
	const { toast } = useToast();
	const { isReady, compile, run } = useWasm();
	const {
		sourceCode,
		compileResult,
		tapeInput,
		setCompileResult,
		setSimulationResult,
	} = useSimulationStore();

	const handleCompile = () => {
		if (!isReady) {
			toast({
				title: "WASM not ready",
				description: "Please wait for the compiler to load.",
				variant: "destructive",
			});
			return;
		}

		const result = compile(sourceCode);
		setCompileResult(result);

		if (result?.status === "error") {
			toast({
				title: "Compilation Error",
				description: result.error || "Unknown error occurred",
				variant: "destructive",
			});
		} else {
			toast({
				title: "Compilation Successful",
				description: "Your TM code has been compiled.",
				variant: "success",
			});
		}
	};

	const handleRun = () => {
		if (!isReady) {
			toast({
				title: "WASM not ready",
				description: "Please wait for the compiler to load.",
				variant: "destructive",
			});
			return;
		}

		const result = run(sourceCode, tapeInput);
		setSimulationResult(result);

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
				variant: result?.status === "ACCEPTED" ? "success" : "default",
			});
		}
	};

	const handleDownload = () => {
		if (!compileResult?.c_code) {
			toast({
				title: "No C code available",
				description: "Please compile your TM code first.",
				variant: "destructive",
			});
			return;
		}

		const blob = new Blob([compileResult.c_code], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "turing_machine.c";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast({
			title: "Download Started",
			description: "Your C code file is being downloaded.",
		});
	};

	return (
		<header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-6">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-pink-500 flex items-center justify-center">
					<Terminal className="w-5 h-5 text-white" />
				</div>
				<div>
					<h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
						TM-Lang
					</h1>
					<p className="text-xs text-zinc-500">
						Turing Machine Live Editor
					</p>
				</div>
				<a
					href="https://github.com/Mystery-Coder/TM-Lang"
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2 text-zinc-400 hover:text-zinc-100 transition-colors"
					title="View on GitHub"
				>
					<Github size={20} strokeWidth={1.75} />
				</a>
			</div>

			<div className="flex items-center gap-3">
				<div
					className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
						isReady
							? "bg-green-500/10 text-green-400 border border-green-500/30"
							: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
					}`}
				>
					<div
						className={`w-2 h-2 rounded-full ${
							isReady
								? "bg-green-400 animate-pulse"
								: "bg-yellow-400"
						}`}
					/>
					{isReady ? "WASM Ready" : "Loading..."}
				</div>

				<Button
					onClick={handleCompile}
					disabled={!isReady}
					variant="default"
				>
					<Zap className="w-4 h-4" />
					Compile
				</Button>

				<Button onClick={handleRun} disabled={!isReady} variant="pink">
					<Play className="w-4 h-4" />
					Run
				</Button>

				<Button
					onClick={handleDownload}
					disabled={!compileResult?.c_code}
					variant="outline"
				>
					<Download className="w-4 h-4" />
					Export C
				</Button>
			</div>
		</header>
	);
}
