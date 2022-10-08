import { spawn } from 'child_process';

const proc = spawn('npm', ['start']);

proc.stdout.on('data', function (data) {
  console.log(data.toString());
});

proc.stderr.on('data', function (data) {
  console.error(data.toString());
});
