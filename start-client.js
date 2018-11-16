const args = [ 'build' ];
const opts = { stdio: 'inherit', cwd: '/app/client', shell: true };
require('child_process').spawn('yarn', args, opts);