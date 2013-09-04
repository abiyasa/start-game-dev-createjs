module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 9001,
          base: '.',
          keepalive: true
        }
      }
    },

    jshint: {
      files: ['js/*.js'],
      options: {
        browser: true,
        undef: true,
        devel: true,
        globals: {
          createjs: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['connect']);
};
