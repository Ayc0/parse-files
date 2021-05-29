const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");

const { filePath } = workerData;

// Add random timeout to make sure that it supports async operations and un-ordered callbacks
const timeout = Math.random() * 1000;

setTimeout(() => {
	parentPort.postMessage(
		fs.readFileSync(filePath, { encoding: "utf-8" }).trim().length
	);
}, timeout);
