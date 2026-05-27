const { spawn } = require('child_process');
const path = require('path');

const dashboardDir = 'C:/Users/ASUS/.understand-anything/repo/understand-anything-plugin/packages/dashboard';
const projectDir = path.resolve(__dirname, '..');

console.log('Starting Understand Anything Dashboard dev server at port 5188...');

const child = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5188'], {
  cwd: dashboardDir,
  env: {
    ...process.env,
    GRAPH_DIR: projectDir
  },
  shell: true,
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Failed to start dashboard:', err);
});
