import { ExampleTMProgram } from "@/lib/types/tmExamples";
import fs from "fs/promises";
import path from "path";

const publicExamplesFolder = path.join(process.cwd(), "public/examples");

let fileNames = await fs.readdir(publicExamplesFolder);
const programExamples: ExampleTMProgram[] = [];

for (let f of fileNames) {
	if (path.extname(f) === ".tm") {
		let programName = path.basename(f, path.extname(f));
		const svg = await fs.readFile(
			path.join(publicExamplesFolder, programName + ".svg"),
		);

		const tm = await fs.readFile(
			path.join(publicExamplesFolder, programName + ".tm"),
		);

		let example: ExampleTMProgram = {
			name: programName,
			svgContent: svg.toString(),
			tmProgram: tm.toString(),
		};

		programExamples.push(example);
	}
}

export default function page() {
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
					Examples of Turing Machine Programs
				</h1>
				<div className="space-y-8">
					{programExamples.map((example: ExampleTMProgram, idx) => {
						return (
							<div
								key={idx}
								className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 shadow-lg"
							>
								<h2 className="text-xl font-semibold text-zinc-100 mb-4 capitalize">
									{example.name}
								</h2>
								<div className="flex flex-col lg:flex-row gap-6">
									<div className="flex-1">
										<h3 className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
											Turing Machine Program
										</h3>
										<pre className="bg-zinc-800 border border-zinc-700 rounded-md p-4 text-sm font-mono text-zinc-200 overflow-x-auto whitespace-pre-wrap">
											{example.tmProgram}
										</pre>
									</div>
									<div className="flex-1">
										<h3 className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
											State Machine Visualization
										</h3>
										<div className="bg-zinc-800 border border-zinc-700 rounded-md p-4">
											<img
												src={`data:image/svg+xml;base64,${Buffer.from(example.svgContent).toString("base64")}`}
												alt={`${example.name} state machine`}
												className="w-full h-auto max-h-96 object-contain"
												width={2200}
												height={800}
											/>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
