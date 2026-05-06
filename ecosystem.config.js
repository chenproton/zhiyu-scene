module.exports = {
  apps: [
    {
      name: 'scene',
      cwd: '/var/www/scene',
      script: 'pnpm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      // 日志配置
      log_file: '/var/log/pm2/scene-combined.log',
      out_file: '/var/log/pm2/scene-out.log',
      error_file: '/var/log/pm2/scene-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 自动重启
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      // 内存限制
      max_memory_restart: '1G',
      // 平滑重启
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
}
