const path = require("path");
const parseFiles = require("../");
const assert = require("assert").strict;

parseFiles({
	filePattern: path.join(__dirname, "files/**"),
	threads: 3,
	workerPath: require.resolve("./worker.js"),
})
	.then((res) => {
		console.log(res);
		const total = res.reduce((tot, cur) => tot + cur, 0);
		assert.equal(total, 9);
	})
	.catch((error) => assert.equal(error, "no error"));
