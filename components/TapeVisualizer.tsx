"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSimulationStore } from "@/store/simulationStore";
import { cn } from "@/lib/utils";

export function TapeVisualizer() {
	const { simulationResult, currentStep } = useSimulationStore();

	const currentState = simulationResult?.history[currentStep];

	if (!currentState) {
		return (
			<div className="flex items-center justify-center py-8 text-zinc-500">
				<div className="text-center">
					<div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-zinc-800/50 flex items-center justify-center">
						<svg
							className="w-8 h-8 text-zinc-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</div>
					<p className="text-sm font-medium">No Simulation Data</p>
					<p className="text-xs text-zinc-600 mt-1">
						Run your TM to see the tape
					</p>
				</div>
			</div>
		);
	}

	const tape = currentState.tape;
	const headIndex = currentState.head;

	// Ensure we have cells to display (pad if necessary)
	const displayTape = tape
		.padStart(Math.max(tape.length, 15), "_")
		.padEnd(20, "_");
	const adjustedHead =
		headIndex +
		(displayTape.length -
			tape.length -
			(tape.length - headIndex - (tape.length - tape.length)));

	// Center the tape around the head
	const visibleCells = 15;
	const halfVisible = Math.floor(visibleCells / 2);
	let startIndex = Math.max(0, headIndex - halfVisible);
	let endIndex = startIndex + visibleCells;

	if (endIndex > tape.length) {
		endIndex = tape.length;
		startIndex = Math.max(0, endIndex - visibleCells);
	}

	const visibleTape = [];
	for (let i = startIndex; i < endIndex; i++) {
		visibleTape.push({
			char: tape[i] || "_",
			index: i,
			isHead: i === headIndex,
		});
	}

	// Pad to always show consistent number of cells
	while (visibleTape.length < visibleCells) {
		visibleTape.push({
			char: "_",
			index: visibleTape.length + startIndex,
			isHead: false,
		});
	}

	return (
		<div className="flex flex-col items-center py-4 px-4">
			{/* Current State Badge */}
			<div className="mb-4 flex items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="text-xs text-zinc-500">State:</span>
					<span className="px-3 py-1 bg-linear-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 rounded-md text-cyan-400 font-mono text-sm font-bold">
						{currentState.state}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-zinc-500">Step:</span>
					<span className="text-sm font-mono text-pink-400">
						{currentState.step}
					</span>
				</div>
			</div>

			{/* Head Indicator Arrow */}
			<div className="flex justify-center mb-1">
				<motion.div
					className="text-cyan-400"
					animate={{ y: [0, -5, 0] }}
					transition={{ repeat: Infinity, duration: 1 }}
				>
					<svg
						className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M12 16l-6-6h12l-6 6z" />
					</svg>
				</motion.div>
			</div>

			{/* Tape */}
			<div className="relative flex gap-0.5 overflow-hidden p-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
				<AnimatePresence mode="popLayout">
					{visibleTape.map((cell, idx) => (
						<motion.div
							key={`${cell.index}-${idx}`}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.15 }}
							className={cn(
								"w-10 h-12 flex items-center justify-center font-mono text-lg font-bold rounded border-2 transition-all",
								cell.isHead
									? "bg-linear-to-b from-cyan-500 to-pink-500 text-white border-transparent shadow-lg shadow-cyan-500/50 scale-110 z-10"
									: "bg-zinc-800 text-zinc-300 border-zinc-700",
							)}
						>
							{cell.char}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Tape Position Indicator */}
			<div className="mt-2 text-xs text-zinc-500 font-mono">
				Position: {headIndex} / {tape.length - 1}
			</div>
		</div>
	);
}
