"use client";

import { useEffect, useCallback } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	RotateCcw,
	ChevronLeft,
	ChevronRight,
	Gauge,
} from "lucide-react";
import { TapeVisualizer } from "./TapeVisualizer";

export function SimulationController() {
	const {
		simulationResult,
		currentStep,
		setCurrentStep,
		isPlaying,
		setIsPlaying,
		playbackSpeed,
		setPlaybackSpeed,
		stepForward,
		stepBackward,
		reset,
		tapeInput,
		setTapeInput,
	} = useSimulationStore();

	const totalSteps = simulationResult?.history.length || 0;

	// Playback timer
	useEffect(() => {
		if (!isPlaying || !simulationResult) return;

		const timer = setInterval(() => {
			stepForward();
		}, playbackSpeed);

		return () => clearInterval(timer);
	}, [isPlaying, playbackSpeed, simulationResult, stepForward]);

	// Stop playing at the end
	useEffect(() => {
		if (currentStep >= totalSteps - 1 && isPlaying) {
			setIsPlaying(false);
		}
	}, [currentStep, totalSteps, isPlaying, setIsPlaying]);

	const handleSliderChange = useCallback(
		(value: number[]) => {
			setCurrentStep(value[0]);
		},
		[setCurrentStep],
	);

	const togglePlay = useCallback(() => {
		if (currentStep >= totalSteps - 1) {
			reset();
			setIsPlaying(true);
		} else {
			setIsPlaying(!isPlaying);
		}
	}, [currentStep, totalSteps, reset, setIsPlaying, isPlaying]);

	const getStatusColor = () => {
		if (!simulationResult) return "text-zinc-500";
		switch (simulationResult.status) {
			case "ACCEPTED":
				return "text-green-400";
			case "REJECTED":
				return "text-red-400";
			case "TIMEOUT":
				return "text-yellow-400";
			case "CRASH":
				return "text-red-500";
			default:
				return "text-zinc-400";
		}
	};

	const getStatusBg = () => {
		if (!simulationResult) return "bg-zinc-800/50";
		switch (simulationResult.status) {
			case "ACCEPTED":
				return "bg-green-500/10 border-green-500/30";
			case "REJECTED":
				return "bg-red-500/10 border-red-500/30";
			case "TIMEOUT":
				return "bg-yellow-500/10 border-yellow-500/30";
			case "CRASH":
				return "bg-red-500/10 border-red-500/30";
			default:
				return "bg-zinc-800/50 border-zinc-700";
		}
	};

	return (
		<div className="h-full bg-zinc-950 border-t border-zinc-800 flex flex-col">
			{/* Tape Input & Status */}
			<div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-4">
				<div className="flex items-center gap-2">
					<label className="text-xs text-zinc-500 whitespace-nowrap">
						Tape Input:
					</label>
					<Input
						value={tapeInput}
						onChange={(e) => setTapeInput(e.target.value)}
						placeholder="Enter tape symbols..."
						className="w-40 h-8 text-sm font-mono"
					/>
				</div>

				{simulationResult && (
					<div
						className={`flex items-center gap-2 px-3 py-1 rounded-md border ${getStatusBg()}`}
					>
						<span
							className={`text-sm font-bold font-mono ${getStatusColor()}`}
						>
							{simulationResult.status}
						</span>
						<span className="text-xs text-zinc-500">
							({totalSteps} steps)
						</span>
					</div>
				)}

				<div className="ml-auto flex items-center gap-2">
					<Gauge className="w-4 h-4 text-zinc-500" />
					<span className="text-xs text-zinc-500">Speed:</span>
					<div className="w-24">
						<Slider
							value={[1000 - playbackSpeed]}
							min={0}
							max={900}
							step={100}
							onValueChange={(v) => setPlaybackSpeed(1000 - v[0])}
						/>
					</div>
					<span className="text-xs text-zinc-400 w-16">
						{playbackSpeed}ms
					</span>
				</div>
			</div>

			{/* Tape Visualizer */}
			<div className="flex-1 overflow-hidden">
				<TapeVisualizer />
			</div>

			{/* Playback Controls */}
			<div className="h-16 border-t border-zinc-800 flex items-center justify-center gap-4 px-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={reset}
					disabled={!simulationResult}
					className="text-zinc-400 hover:text-cyan-400"
				>
					<RotateCcw className="w-5 h-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCurrentStep(0)}
					disabled={!simulationResult}
					className="text-zinc-400 hover:text-cyan-400"
				>
					<SkipBack className="w-5 h-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={stepBackward}
					disabled={!simulationResult || currentStep <= 0}
					className="text-zinc-400 hover:text-cyan-400"
				>
					<ChevronLeft className="w-5 h-5" />
				</Button>

				<Button
					variant="default"
					size="icon"
					onClick={togglePlay}
					disabled={!simulationResult || totalSteps === 0}
					className="w-12 h-12 rounded-full"
				>
					{isPlaying ? (
						<Pause className="w-6 h-6" />
					) : (
						<Play className="w-6 h-6 ml-0.5" />
					)}
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={stepForward}
					disabled={
						!simulationResult || currentStep >= totalSteps - 1
					}
					className="text-zinc-400 hover:text-cyan-400"
				>
					<ChevronRight className="w-5 h-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCurrentStep(totalSteps - 1)}
					disabled={!simulationResult}
					className="text-zinc-400 hover:text-cyan-400"
				>
					<SkipForward className="w-5 h-5" />
				</Button>

				{/* Scrubber */}
				<div className="flex-1 max-w-md flex items-center gap-3">
					<span className="text-xs text-zinc-500 font-mono w-8 text-right">
						{currentStep}
					</span>
					<Slider
						value={[currentStep]}
						min={0}
						max={Math.max(0, totalSteps - 1)}
						step={1}
						onValueChange={handleSliderChange}
						disabled={!simulationResult || totalSteps === 0}
						className="flex-1"
					/>
					<span className="text-xs text-zinc-500 font-mono w-8">
						{Math.max(0, totalSteps - 1)}
					</span>
				</div>
			</div>
		</div>
	);
}
