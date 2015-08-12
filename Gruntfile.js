module.exports = function (grunt) {
    'use strict';

    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: ['availabletasks', 'clean', 'jsdoc', 'lintspaces', 'requirejs'],
                    descriptions: {
                        'default': 'List available Grunt tasks & targets.',
                        'docs': 'Generate documentation in the docs/ folder',
                        'lint': 'Run static code checkers',
                        'test': 'Run unit tests'
                    }
                }
            }
        },

        clean: {
            docs: ['<%= jsdoc.component.options.destination%>'],
            tests: ['coverage/', 'test-results/']
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            component: {
                files: {
                    src: ['src/**/*.js', 'tests/**/*.js']
                }
            },
            configuration: {
                files: {
                    src: ['Gruntfile.js', 'karma.conf.js']
                }
            }
        },

        jsdoc: {
            component: {
                src: ['src/**/*.js'],
                options: {
                    destination: 'docs/jsdoc'
                }
            }
        },

        jshint: {
            options: {
                latedef: 'nofunc',
                undef: true,
                curly: true,

                // environments
                jquery: false,
                node: false,
                browser: false
            },

            config: {
                options: {
                    node: true
                },
                src: ['Gruntfile.js']
            },

            component: {
                options: {
                    node: true,
                    globals: {
                        Promise: true
                    }
                },
                src: ['src/**/*.js']
            }
        },

        mocha_istanbul: {
            options: {
                quiet: true
            },
            coverage: {
                src: 'tests/src/**/*.spec.js'
            }
        },

        simplemocha: {
            options: {
                timeout: 2000,
                ignoreLeaks: false,
                ui: 'bdd',
                "reporter": "mocha-jenkins-reporter",
                "reporterOptions": {
                    "junit_report_name": "Tests",
                    "junit_report_path": "test-results/report.xml",
                    "junit_report_stack": 1
                }
            },

            component: {src: ['tests/**/*.spec.js']}
        }
    });

    grunt.registerTask('lint', ['jscs', 'jshint']);

    grunt.registerTask('test', ['clean:tests', 'simplemocha', 'mocha_istanbul']);

    grunt.registerTask('verify', ['lint', 'test']);

    grunt.registerTask('docs', ['clean:docs', 'jsdoc']);

    grunt.registerTask('dist', ['verify']); // add copy, uglify or requirejs tasks here as needed

    grunt.registerTask('package', ['dist', 'docs']);

    grunt.registerTask('default', ['availabletasks']);
};
