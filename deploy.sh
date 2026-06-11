#!/bin/bash
#
# deploy.sh - Next.js Standalone 部署脚本 (v6.0 新服务器自动初始化版)
#
set -euo pipefail

# ==================== 配置区 ====================
REMOTE_HOST="${REMOTE_HOST:-111.170.170.202}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_BASE="${REMOTE_BASE:-/var/www}"

# 每个项目修改这里即可
SITE_NAME="scene" 
PORT=3003
NODE_VERSION="${NODE_VERSION:-20}"   # 远程服务器 Node.js 版本

SSH_PORT="${SSH_PORT:-22}"

# ==================== 自动推导 ====================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_DIR="$REMOTE_BASE/$SITE_NAME"
STANDALONE_DIR="$SCRIPT_DIR/.next/standalone"
STATIC_DIR="$SCRIPT_DIR/.next/static"
PUBLIC_DIR="$SCRIPT_DIR/public"

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=15 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -p $SSH_PORT"

# ==================== 主入口 ====================

echo ""
echo "🚀 启动智能部署: [$SITE_NAME]"
echo ""

cd "$SCRIPT_DIR"

# ── 1. 本地构建 ──────────────────────────────────────────────────────
echo "[1/4] 本地构建中..."
rm -rf "$STANDALONE_DIR"

# 智能依赖安装：已存在则跳过，避免每次重新比对版本
if [ ! -d "node_modules" ] || [ "${FORCE_INSTALL:-0}" = "1" ]; then
  echo "  📦 安装依赖..."
  pnpm install --prefer-offline --no-frozen-lockfile
else
  echo "  ⏩ node_modules 已存在，跳过依赖安装（设置 FORCE_INSTALL=1 可强制重新安装）"
fi

pnpm build

# 组装产物
rsync -a --delete --exclude='*.map' "$STATIC_DIR/" "$STANDALONE_DIR/.next/static/"
if [ -d "$PUBLIC_DIR" ]; then
  rsync -a --delete --exclude='*.map' "$PUBLIC_DIR/" "$STANDALONE_DIR/public/"
fi

echo "✅ 本地构建完成"

# ── 2. 远程环境检查与自动安装 ───────────────────────────────────────
echo ""
echo "[2/4] 远程服务器环境检查与初始化（幂等，已有则跳过）..."

ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" bash -s << REMOTE_SETUP_EOF
  set -euo pipefail

  # ---- 2.1 基础工具 ----
  need_install=""
  for cmd in curl rsync; do
    if ! command -v \$cmd &>/dev/null; then
      need_install="\$need_install \$cmd"
    fi
  done

  if [ -n "\$need_install" ]; then
    echo "   📦 正在安装基础工具:\$need_install"
    if command -v apt-get &>/dev/null; then
      apt-get update -qq && apt-get install -y -qq \$need_install
    elif command -v yum &>/dev/null; then
      yum install -y \$need_install
    elif command -v dnf &>/dev/null; then
      dnf install -y \$need_install
    else
      echo "   ❌ 无法识别包管理器，请手动安装:\$need_install"
      exit 1
    fi
  fi

  # ---- 2.2 Node.js (via NVM) ----
  export NVM_DIR="\$HOME/.nvm"
  if [ -s "\$NVM_DIR/nvm.sh" ]; then
    . "\$NVM_DIR/nvm.sh"
  fi

  if ! command -v node &>/dev/null; then
    echo "   📦 Node.js 未安装，正在通过 NVM 安装 v$NODE_VERSION ..."
    if [ ! -d "\$NVM_DIR" ]; then
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
      . "\$NVM_DIR/nvm.sh"
    fi
    nvm install $NODE_VERSION
    nvm alias default $NODE_VERSION
    # 确保后续非交互式 SSH 也能加载 NVM
    if [ -f ~/.bashrc ] && ! grep -q 'NVM_DIR' ~/.bashrc; then
      echo 'export NVM_DIR="\$HOME/.nvm"' >> ~/.bashrc
      echo '[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"' >> ~/.bashrc
    fi
    echo "   ✅ Node.js 安装完成: \$(node -v)"
  else
    echo "   ✅ Node.js 已存在: \$(node -v)"
  fi

  # ---- 2.3 PM2 ----
  if ! command -v pm2 &>/dev/null; then
    echo "   📦 PM2 未安装，正在全局安装 ..."
    npm install -g pm2
    pm2 startup || true
    echo "   ✅ PM2 安装完成: \$(pm2 -v)"
  else
    echo "   ✅ PM2 已存在: \$(pm2 -v)"
  fi

  # ---- 2.4 部署目录 ----
  mkdir -p $REMOTE_DIR
REMOTE_SETUP_EOF

echo "✅ 远程环境准备就绪"

# ── 3. 远程智能清扫与同步 ──────────────────────────────────────────
echo ""
echo "[3/4] 远程清扫与同步..."

# 【优化点】智能识别并清理远程所有干扰目录 (dist, .next, standalone)
# 这样无论子模块叫什么名字，rsync 都不再会报 cannot delete 错误
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "mkdir -p $REMOTE_DIR && find $REMOTE_DIR -maxdepth 3 \( -name 'dist' -o -name '.next' -o -name 'standalone' \) -exec rm -rf {} + || true"

# 执行增量同步
rsync -az --delete-after \
  -e "ssh $SSH_OPTS" \
  --timeout=300 \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='logs/' \
  "$STANDALONE_DIR/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

# ── 4. 服务器进程切换 ──────────────────────────────────────────────
echo ""
echo "[4/4] 重启 PM2 服务..."

ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" \
  "export SITE_NAME='$SITE_NAME'; export PORT='$PORT'; export REMOTE_DIR='$REMOTE_DIR'; bash -s" << 'REMOTE_EOF'
  set -e
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  # 彻底删除旧进程防止残留
  pm2 delete "$SITE_NAME" &>/dev/null || true

  cd "$REMOTE_DIR"
  NODE_BIN=$(which node)
  
  # 启动新进程
  PORT="$PORT" HOSTNAME="0.0.0.0" pm2 start server.js \
    --name "$SITE_NAME" \
    --interpreter "$NODE_BIN" \
    --restart-delay 3000

  pm2 save > /dev/null
REMOTE_EOF

echo ""
echo "✨ [$SITE_NAME] 部署任务圆满完成！"
echo "   访问地址: http://$REMOTE_HOST:$PORT"
echo ""
