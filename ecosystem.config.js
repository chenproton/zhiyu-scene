module.exports = {
  apps: [
    {
      name: 'next-app',
      cwd: '/var/www/next-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 日志配置
      log_file: '/var/log/pm2/next-app-combined.log',
      out_file: '/var/log/pm2/next-app-out.log',
      error_file: '/var/log/pm2/next-app-error.log',
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
