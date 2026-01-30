"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSimulationStore } from "@/store/simulationStore";
import {
	ZoomIn,
	ZoomOut,
	Maximize2,
	AlertCircle,
	Download,
	Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { instance } from "@viz-js/viz";

export function StateMachineVisualizer() {
	const { compileResult } = useSimulationStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const graphRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.8);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [error, setError] = useState<string | null>(null);
	const [svgContent, setSvgContent] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Render DOT to SVG using @viz-js/viz
	useEffect(() => {
		if (!compileResult?.dot) {
			setSvgContent(null);
			setError(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		const styledDot = styleDotForDarkTheme(compileResult.dot);

		instance()
			.then((viz) => {
				try {
					const svg = viz.renderSVGElement(styledDot);
					setSvgContent(svg.outerHTML);
					setIsLoading(false);
				} catch (err) {
					console.error("Graphviz render error:", err);
					setError(
						err instanceof Error
							? err.message
							: "Failed to render graph",
					);
					setIsLoading(false);
				}
			})
			.catch((err) => {
				console.error("Viz.js initialization error:", err);
				setError("Failed to initialize Graphviz");
				setIsLoading(false);
			});
	}, [compileResult?.dot]);

	const handleWheel = useCallback((e: React.WheelEvent) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		setScale((prev) => Math.min(Math.max(prev * delta, 0.1), 5));
	}, []);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		},
		[position],
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging) return;
			setPosition({
				x: e.clientX - dragStart.x,
				y: e.clientY - dragStart.y,
			});
		},
		[isDragging, dragStart],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const resetView = useCallback(() => {
		setScale(1);
		setPosition({ x: 0, y: 0 });
	}, []);

	// Export as SVG
	const exportSvg = useCallback(() => {
		const svgElement = graphRef.current?.querySelector("svg");
		if (!svgElement) return;

		const svgData = new XMLSerializer().serializeToString(svgElement);
		const blob = new Blob([svgData], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "turing_machine.svg";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, []);

	// Export as PNG
	const exportPng = useCallback(() => {
		const svgElement = graphRef.current?.querySelector("svg");
		if (!svgElement) return;

		const svgData = new XMLSerializer().serializeToString(svgElement);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new window.Image();

		img.onload = () => {
			canvas.width = img.width * 2; // 2x for better quality
			canvas.height = img.height * 2;
			ctx?.scale(2, 2);
			ctx?.drawImage(img, 0, 0);

			const pngUrl = canvas.toDataURL("image/png");
			const a = document.createElement("a");
			a.href = pngUrl;
			a.download = "turing_machine.png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		};

		img.src =
			"data:image/svg+xml;base64," +
			btoa(unescape(encodeURIComponent(svgData)));
	}, []);

	if (!compileResult?.dot) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 text-zinc-500">
				<div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
					<svg
						className="w-10 h-10 text-zinc-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
						/>
					</svg>
				</div>
				<p className="text-sm font-medium">No State Machine</p>
				<p className="text-xs text-zinc-600 mt-1">
					Compile your code to see the visualization
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 text-red-400">
				<AlertCircle className="w-10 h-10 mb-4" />
				<p className="text-sm font-medium">{error}</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col bg-zinc-900/50">
			{/* Controls */}
			<div className="h-10 border-b border-zinc-800 flex items-center justify-between px-3">
				<span className="text-xs text-zinc-500">
					State Machine Diagram
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={exportSvg}
						title="Export SVG"
						disabled={!svgContent}
					>
						<Download className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={exportPng}
						title="Export PNG"
						disabled={!svgContent}
					>
						<Image className="h-4 w-4" />
					</Button>
					<div className="w-px h-4 bg-zinc-700 mx-1" />
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={() => setScale((s) => Math.min(s * 1.2, 5))}
					>
						<ZoomIn className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={() => setScale((s) => Math.max(s * 0.8, 0.1))}
					>
						<ZoomOut className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={resetView}
					>
						<Maximize2 className="h-4 w-4" />
					</Button>
					<span className="text-xs text-zinc-500 ml-2 w-12 text-right">
						{Math.round(scale * 100)}%
					</span>
				</div>
			</div>

			{/* SVG Container */}
			<div
				ref={containerRef}
				className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<div
					ref={graphRef}
					className="w-full h-full flex items-center justify-center graphviz-container"
					style={{
						transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
						transformOrigin: "center center",
					}}
				>
					{isLoading ? (
						<div className="text-zinc-500">Rendering graph...</div>
					) : svgContent ? (
						<div
							dangerouslySetInnerHTML={{ __html: svgContent }}
							className="graphviz-svg"
						/>
					) : (
						<div className="text-zinc-500">No graph to display</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Add dark theme styling to DOT graph
function styleDotForDarkTheme(dot: string): string {
	// Check if graph attributes already exist
	if (dot.includes("graph [")) {
		return dot;
	}

	// Insert dark theme attributes after the digraph declaration
	const graphAttrs = `
    graph [bgcolor="transparent" fontcolor="#e4e4e7" fontname="monospace"];
    node [style="filled" fillcolor="#18181b" color="#06b6d4" fontcolor="#e4e4e7" fontname="monospace"];
    edge [color="#06b6d4" fontcolor="#a1a1aa" fontname="monospace"];
  `;

	// Insert after "digraph {" or "digraph G {"
	return dot.replace(/(digraph\s*\w*\s*\{)/i, `$1${graphAttrs}`);
}
