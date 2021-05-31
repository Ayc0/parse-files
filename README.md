# parse-files

This tool helps you to run scripts in parallel in a multi-threaded way.

To run it, you need to create 2 files:

- your main one that will gather the data sent by your workers
- a worker file that will compute data based on what you provide to the main file.

This tool will automatically spawn a pool of workers, and won't spawn more that what you allow it to do. Once a worker is done, a new one will be spawn (if a few remaining task still need to be performed).

## Main file

```javascript
const parseFiles = require("parse-files");

parseFiles({
	workerPath: require.resolve("./worker.js"), // path to the worker file, we recommend to use absolute path to avoid issues with the cwd
	data: [{ foo: "bar", hello: "world" }], // array of values passed to the worker. Each element will be passed to the worker with the `workerData` variable
	threads: 4, // number of threads, the default is the "number of CPUs - 1"
}).then((results) => {
	// this will retrieve an array with each result returned by the worker file
});
```

## Worker file

```javascript
const { workerData, parentPort } = require("worker_threads");

// Value contained in each element of `data`
const { foo, hello } = workerData;

const results = serializable_data_of_your_choice;

parentPort.postMessage(results);
```
