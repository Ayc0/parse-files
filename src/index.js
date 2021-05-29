const os = require("os");
const glob = require("glob");

const { Worker } = require("worker_threads");

const DEFAULT_GLOB_OPTIONS = { nodir: true };

async function main({
	filePattern,
	workerPath,
	threads = os.cpus().length - 1,
	globOptions,
} = {}) {
	const listOfFiles = glob.sync(filePattern, {
		...DEFAULT_GLOB_OPTIONS,
		...globOptions,
	});
	const responses = [];

	const pool = [];
	function waitForRelease() {
		return Promise.race(pool.map((p, i) => p.then((r) => [r, i]))).then(
			([response, index]) => {
				pool.splice(index, 1);
				return response;
			}
		);
	}

	for (const filePath of listOfFiles) {
		if (pool.length === threads) {
			await waitForRelease();
		}

		const task = newTask(workerPath, filePath).then((res) => {
			responses.push(res);
		});
		pool.push(task);
	}

	await Promise.all(pool);

	return responses;
}

function newTask(workerPath, fileToParse) {
	const worker = new Worker(workerPath, {
		workerData: {
			filePath: fileToParse,
		},
	});

	return new Promise((resolve, reject) => {
		worker.on("message", resolve);
		worker.on("error", reject);
		worker.on("exit", (code) => {
			if (code !== 0)
				reject(new Error(`Worker stopped with exit code ${code}`));
		});
	});
}

module.exports = main;
