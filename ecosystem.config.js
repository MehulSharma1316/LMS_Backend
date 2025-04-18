module.exports = {
    apps: [
      {
        name: 'lmsbackend',
        script: 'src/index.js',
        out_file: 'logs/app-out.log',
        error_file: 'logs/app-error.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        watch: false, // Enable watching for file changes
        ignore_watch: ['node_modules', 'logs', 'Queries\data'] // Ignore node_modules and logs directories
      },
    ],
  };
  