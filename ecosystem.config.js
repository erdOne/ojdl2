module.exports = {
  apps: [{
    name: "ojdl2",
    script: "npm",

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: "start",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    },
    error_file: "err.log",
    out_file: "out.log",
    log_file: "combined.log",
  }],

  deploy: {
    production: {
      user: "node",
      host: "212.83.163.1",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "/var/www/production",
      "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
