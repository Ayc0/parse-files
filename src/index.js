const os = require("os");
const glob = require("glob");

const { Worker } = require("worker_threads");

async function main({
	files,
	workerPath,
	getWorkerData = (filePath) => ({ filePath }),
	threads = os.cpus().length - 1,
} = {}) {
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

	for (const filePath of files) {
		if (pool.length === threads) {
			await waitForRelease();
		}

		const task = newTask(workerPath, filePath, getWorkerData).then((res) => {
			responses.push(res);
		});
		pool.push(task);
	}

	await Promise.all(pool);

	return responses;
}

function newTask(workerPath, fileToParse, getWorkerData) {
	const worker = new Worker(workerPath, {
		workerData: getWorkerData(fileToParse),
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
