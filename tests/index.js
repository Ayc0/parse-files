const path = require("path");
const glob = require("glob");
const parseFiles = require("../");
const assert = require("assert").strict;

const files = glob
	.sync(path.join(__dirname, "files/**"), { nodir: true })
	.map((file) => path.relative(path.dirname(__dirname), file));

main();

function main() {
	checkItWorks();
	checkItCanReceiveCustomData();
	checkItThrowsOnError();
}

function checkItWorks() {
	parseFiles({
		data: files,
		threads: 3,
		workerPath: require.resolve("./worker-default.js"),
	})
		.then((res) => {
			console.log("Content sizes:", res);
			const total = res.reduce((tot, cur) => tot + cur, 0);
			assert.equal(total, 9);
		})
		.catch((error) => assert.equal(error, "no error"));
}

function checkItCanReceiveCustomData() {
	parseFiles({
		data: files.map((filePath) => ({ filePathLength: filePath.length })),
		threads: 5,
		workerPath: require.resolve("./worker-custom-data.js"),
	})
		.then((res) => {
			console.log("File path lengths:", res);
			const total = res.reduce((tot, cur) => tot + cur, 0);
			assert.equal(total, 139);
		})
		.catch((error) => assert.equal(error, "no error"));
}

function checkItThrowsOnError() {
	assert.rejects(
		parseFiles({
			data: files,
			threads: 3,
			workerPath: require.resolve("./worker-throws.js"),
		}),
		{ message: "error from main throw" }
	);
}
