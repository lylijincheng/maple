/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.description %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> ' +
      'Author: <%= pkg.author %>; */\n',

    build: build(),

    clean: ['dist/'],

    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      web: {
        files: {
          'dist/web-<%= build %>.js': 
          [
            'javascripts/jquery-1.11.1.js',
            'javascripts/jquery.scrollTo.js',
            'javascripts/underscore.js',
            'javascripts/bootstrap.js',
            'javascripts/wScratchPad.js',
            'javascripts/video.js',
            'javascripts/maple-web.js'
          ]
        }
      },
      app: {
        files: {
          'dist/app-<%= build %>.js': 
          [
            'javascripts/jquery-1.11.1.js',
            'javascripts/underscore.js',
            'javascripts/wScratchPad.js',
            'javascripts/cardview.js',
            'javascripts/maple-app.js'
          ]
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'sass/',
          cssDir: 'stylesheets/',
          imagesDir: 'images/',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'sass/',
          cssDir: 'stylesheets/',
          imagesDir: 'images/',
          outputStyle: 'expanded',
          watch: true
        }
      }
    },

    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      web: {
        files: {
          'dist/web-<%= build %>.css': ['stylesheets/bootstrap.css', 'stylesheets/video-js.css', 'stylesheets/maple-web.css']
        }
      },
      app: {
        files: {
          'dist/app-<%= build %>.css': ['stylesheets/normalize.css', 'stylesheets/cardview.css', 'stylesheets/maple-app.css']
        }
      }
    },

    processhtml: {
      options: {
        data: {
          build: '<%= build %>'
        }
      },
      web: {
        files: {
          'web.html': ['web-dev.html']
        }
      },
      app: {
        files: {
          'app.html': ['app-dev.html']
        }
      }
    },

    htmlmin: {
      options: {
        collapseWhitespace: true,
        processScripts: ['text/template']
      },
      web: {
        files: {
          'web.html': 'web.html'
        }
      },
      app: {
        files: {
          'app.html': 'app.html'
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Build navi.
  grunt.registerTask('default', [
    'clean',
    'compass:dist',
    'uglify', 
    'cssmin', 
    'processhtml', 
    'htmlmin'
  ]);

  function build() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).slice(1); 
    }

    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  }

};
