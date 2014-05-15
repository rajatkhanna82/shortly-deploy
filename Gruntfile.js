module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist:{
        src:['public/client/**/*.js'],
        dest:'public/dist/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/output.min.js': ['public/dist/client.js']
        }
      }

    },

    jshint: {
      files: [
        'app/**/*.js',
        'public/client/**/*.js',
        'lib/**/*.js'
        // Add filespec list here
      ],
      options: {
        // force: 'true', // force set to false(default ) to make it stop the task
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      add_banner: {
        options: {
         banner: '/* My minified css file */'
        },
        files: {
          'public/style.min.css': ['public/*.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
    shell: {
        prodServer: {
            command: function () {
                return 'git push azure master';
            }
        }
    },

    // shell: {
    //   prodServer: {
    //   }
    // },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest',
  ]);

  grunt.registerTask('build', [
     'concat',
    //uglify
    'uglify',
    //cssmin
    'cssmin'

  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // grunt.task.run(['build']);
      grunt.task.run(['shell']);
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);

    }
  });

  grunt.registerTask('deploy', [ 
    //JShint
    'jshint',
    'test',
    'build',
    // add your deploy tasks here
  ]);

  grunt.registerTask('default', ['build',
  ]);


};
