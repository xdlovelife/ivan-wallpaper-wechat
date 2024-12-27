module.exports = {
  apps: [{
    name: 'wallpaper-server',
    script: 'dist/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      DB_HOST: 'localhost',
      DB_USER: 'root',
      DB_PASSWORD: 'Woshizhu134.',
      DB_NAME: 'wallpaper'
    }
  }]
}; 