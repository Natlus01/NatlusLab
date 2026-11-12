module.exports = {
  apps: [
    {
      name: 'natluslab-api',
      script: 'server/index.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      cwd: '/home/komes/natlus-lab',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      watch: false,
      autorestart: true,
      max_restarts: 5,
      restart_delay: 2000,
    },
  ],
};
