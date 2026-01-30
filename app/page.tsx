"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { StateMachineVisualizer } from "@/components/StateMachineVisualizer";
import { CCodeViewer } from "@/components/CCodeViewer";
import { SimulationController } from "@/components/SimulationController";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Network, FileCode2 } from "lucide-react";

export default function TMLangPlayground() {
	return (
		<div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
			<Header />

			<div className="flex-1 flex flex-col overflow-hidden">
				<Group orientation="vertical" className="flex-1">
					{/* Main Editor Area */}
					<Panel defaultSize={65} minSize={30}>
						<Group orientation="horizontal">
							{/* Left: Code Editor */}
							<Panel defaultSize={50} minSize={25}>
								<div className="h-full border-r border-zinc-800">
									<CodeEditor />
								</div>
							</Panel>

							<Separator className="w-1 bg-zinc-800 hover:bg-cyan-500/50 transition-colors cursor-col-resize" />

							{/* Right: Visualizer / C Code Tabs */}
							<Panel defaultSize={50} minSize={25}>
								<div className="h-full flex flex-col">
									<Tabs
										defaultValue="visualizer"
										className="flex-1 flex flex-col"
									>
										<div className="h-10 border-b border-zinc-800 px-4 flex items-center">
											<TabsList>
												<TabsTrigger
													value="visualizer"
													className="gap-2"
												>
													<Network className="w-4 h-4" />
													Visualizer
												</TabsTrigger>
												<TabsTrigger
													value="c-code"
													className="gap-2"
												>
													<FileCode2 className="w-4 h-4" />
													C Code
												</TabsTrigger>
											</TabsList>
										</div>
										<TabsContent
											value="visualizer"
											className="flex-1 m-0"
										>
											<StateMachineVisualizer />
										</TabsContent>
										<TabsContent
											value="c-code"
											className="flex-1 m-0"
										>
											<CCodeViewer />
										</TabsContent>
									</Tabs>
								</div>
							</Panel>
						</Group>
					</Panel>

					<Separator className="h-1 bg-zinc-800 hover:bg-pink-500/50 transition-colors cursor-row-resize" />

					{/* Bottom: Simulation Controller */}
					<Panel defaultSize={35} minSize={20}>
						<SimulationController />
					</Panel>
				</Group>
			</div>

			<Toaster />
		</div>
	);
}
