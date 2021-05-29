const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");

const { filePath } = workerData;

// const now = Date.now();
// while (Date.now() - now < 5000) {}

setTimeout(() => {
	parentPort.postMessage(
		fs.readFileSync(filePath, { encoding: "utf-8" }).trim().length
	);
}, Math.random());
