"use client";

import { useEffect, useState, useCallback } from "react";
import type { CompileResponse, SimulationResult } from "@/lib/types/wasm";

interface UseWasmReturn {
	isLoading: boolean;
	isReady: boolean;
	error: string | null;
	compile: (source: string) => CompileResponse | null;
	run: (source: string, input: string) => SimulationResult | null;
}

export function useWasm(): UseWasmReturn {
	const [isLoading, setIsLoading] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Prevent double initialization - check if tmCompile exists and is callable
		if (
			typeof window !== "undefined" &&
			typeof window.tmCompile === "function"
		) {
			setIsReady(true);
			setIsLoading(false);
			return;
		}

		// 1. Load the Go WASM Glue Script
		const script = document.createElement("script");
		script.src = "/wasm_exec.js";
		script.async = true;

		script.onload = async () => {
			// 2. Initialize the Go Runtime
			const go = new window.Go();

			try {
				// 3. Fetch and Instantiate
				const response = await fetch("/tmlang-client-compiler.wasm");

				if (!response.ok) {
					throw new Error(
						`Failed to fetch WASM: ${response.statusText}`,
					);
				}

				const bytes = await response.arrayBuffer();

				// Standard Go loading requires passing go.importObject
				const result = await WebAssembly.instantiate(
					bytes,
					go.importObject,
				);

				// 4. Run the Instance (This blocks forever in a background promise)
				// DO NOT await this, or your UI will freeze!
				go.run(result.instance);

				// 5. Ready!
				setIsReady(true);
				setIsLoading(false);
			} catch (err) {
				console.error("Failed to load WASM:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load WASM",
				);
				setIsLoading(false);
			}
		};

		script.onerror = () => {
			setError("Failed to load wasm_exec.js");
			setIsLoading(false);
		};

		document.body.appendChild(script);

		// Cleanup
		return () => {
			if (document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	const compile = useCallback(
		(source: string): CompileResponse | null => {
			if (!isReady || !window.tmCompile) {
				return null;
			}

			try {
				const jsonResult = window.tmCompile(source);
				return JSON.parse(jsonResult) as CompileResponse;
			} catch (err) {
				console.error("Compile error:", err);
				return {
					status: "error",
					c_code: "",
					dot: "",
					error:
						err instanceof Error
							? err.message
							: "Unknown compile error",
				};
			}
		},
		[isReady],
	);

	const run = useCallback(
		(source: string, input: string): SimulationResult | null => {
			if (!isReady || !window.tmRun) {
				return null;
			}

			try {
				const jsonResult = window.tmRun(source, input);
				return JSON.parse(jsonResult) as SimulationResult;
			} catch (err) {
				console.error("Run error:", err);
				return {
					status: "error",
					history: [],
				};
			}
		},
		[isReady],
	);

	return {
		isLoading,
		isReady,
		error,
		compile,
		run,
	};
}
