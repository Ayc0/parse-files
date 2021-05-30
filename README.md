# parse-files

This tool helps you to run scripts on files in a multi-threaded way.

To run it, you need to create 2 files:
- your main one that will gather the results of your script run on the files
- a worker file that will be run on each file

## Main file

```javascript
const parseFiles = require("parse-files");

parseFiles({
  workerPath: require.resolve("./worker.js"), // path to the worker file, we recommend to use absolute path to avoid issues with the cwd
  filePattern: path.join(__dirname, "files/**"), // files you want the worker to be applied on, it uses glob under the hood
  threads: 4, // number of threads, the default is the number of CPUs - 1,
  globOptions: {} // other options for the glob matcher, the default is "{ nodir: true }"

})
  .then((results) => {
    // this will retrieve an array with each result returned by the worker file
  });
```

### Worker file

```javascript
const { workerData, parentPort } = require("worker_threads");

// filePath = current file that you'll have to parse
const { filePath } = workerData;

const results = serializable_data_of_your_choice;

parentPort.postMessage(results);
```
