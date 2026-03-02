const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname),
  shell: true,
  stdio: ['ignore', 'ignore', 'ignore'],
  env: { ...process.env, FORCE_COLOR: '0' },
});

let resolved = false;
const START_PORT = 5173;
const END_PORT = 5220;
const POLL_DELAY_MS = 400;
const INITIAL_DELAY_MS = 8000;
const DEBUG = process.env.E2E_DEBUG === '1' || process.env.E2E_DEBUG === 'true';

function tryPort(port, host) {
  return new Promise((resolve) => {
    const url = `http://${host}:${port}`;
    const req = http.get(url, { timeout: 2000 }, (res) => {
      req.destroy();
      resolve(res.statusCode >= 200 && res.statusCode < 400 ? port : null);
    });
    req.on('error', () => {
      req.destroy();
      resolve(null);
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function checkPort(port) {
  const ok = await tryPort(port, '127.0.0.1');
  if (ok !== null) return ok;
  return tryPort(port, 'localhost');
}

async function pollForPort() {
  for (let port = START_PORT; port <= END_PORT; port++) {
    if (resolved) return null;
    if (DEBUG) process.stderr.write(`E2E: trying port ${port}...\n`);
    const ok = await checkPort(port);
    if (ok !== null) return ok;
    await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
  }
  return null;
}

function runPlaywright(port) {
  const baseURL = `http://127.0.0.1:${port}`;
  const pw = spawn('npx', ['playwright', 'test'], {
    cwd: path.resolve(__dirname),
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port), PLAYWRIGHT_BASE_URL: baseURL },
  });
  pw.on('close', (code) => {
    devServer.kill();
    process.exit(code ?? 0);
  });
}

const timeout = setTimeout(() => {
  if (!resolved) {
    devServer.kill();
    console.error('E2E: Dev server did not respond on any port in time (tried ' + START_PORT + '-' + END_PORT + ').');
    process.exit(1);
  }
}, 90000);

async function waitForServer() {
  if (DEBUG) process.stderr.write('E2E: waiting ' + (INITIAL_DELAY_MS / 1000) + 's for dev server...\n');
  await new Promise((r) => setTimeout(r, INITIAL_DELAY_MS));
  while (!resolved) {
    const port = await pollForPort();
    if (port != null) {
      resolved = true;
      clearTimeout(timeout);
      if (DEBUG) process.stderr.write('E2E: found server on port ' + port + '\n');
      runPlaywright(port);
      return;
    }
    if (DEBUG) process.stderr.write('E2E: no port yet, retrying in 1s...\n');
    await new Promise((r) => setTimeout(r, 1000));
  }
}

waitForServer();

devServer.on('error', (err) => {
  clearTimeout(timeout);
  console.error('E2E: Failed to start dev server:', err.message);
  process.exit(1);
});

devServer.on('exit', (code) => {
  clearTimeout(timeout);
  if (!resolved) {
    console.error('E2E: Dev server exited with code', code);
    process.exit(code ?? 1);
  }
});
