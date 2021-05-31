const { workerData, parentPort } = require("worker_threads");

const { filePathLength } = workerData;

parentPort.postMessage(filePathLength + 2);
