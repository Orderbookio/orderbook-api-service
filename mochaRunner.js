const fs = require('fs');

const basePath = process.argv[2] || './test';

// read recursively
function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];

  files.forEach((file) => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
}

const testFiles = walkSync(basePath).filter(filename => filename.endsWith('spec.js')).sort();

if (!testFiles.length) {
  console.error(`No test files found at '${basePath}'`);
  return process.exit(0);
}

// init report
console.log(`Base path: ${basePath}`);
console.log(`Test files: ${testFiles.length}`);
testFiles.forEach((fileName) => console.log(`\t${fileName}`));

// run tests
const passed = [];
const failed = [];
const failedLogs = [];

function runTest(fileName) {
  const { spawn } = require('child_process');
  const child = spawn('node_modules/.bin/mocha', [fileName, '--exit', '--colors']);

  const logs = [];

  child.on('exit', function (code, signal) {
    if (code !== 0) {
      failedLogs.push(logs);
      failed.push({ fileName, code });
    } else {
      console.log(logs.join(''));
      passed.push({ fileName, code });
    }
  });

  child.stdout.on('data', (data) => {
    logs.push(data);
  });

  child.stderr.on('data', (data) => {
    logs.push(data);
  });
}

testFiles.forEach(runTest);

// wait
setTimeout(function fn() {
  if (passed.length + failed.length === testFiles.length) {
    failedLogs.forEach((logs) => console.log(logs.join('')));

    function sortByName(test1, test2) {
      return test1.fileName.localeCompare(test2.fileName);
    }

    console.log(`\nPassed: ${passed.length}/${testFiles.length}`);
    passed.sort(sortByName).forEach((test) => console.log(`\t${test.fileName}`));

    if (failed.length) {
      console.error(`\nFailed: ${failed.length}/${testFiles.length}`);
      failed.sort(sortByName).forEach((test) => console.error(`\t${test.fileName}`));
    }

    const exitCode = failed.length ? 1 : 0;

    console.log(`\nExit code: ${exitCode}`);

    process.exit(exitCode);
  } else {
    setTimeout(fn, 100);
  }
}, 0);
