module.exports = function (grunt) {

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'clean': ['dist'],
        'copy': {
            all: {
                cwd: 'static',
                src: ['**', 'themes/**'],
                dest: 'dist/',
                expand: true
            },
        },
        'watch': {
            copy: {
                files: ['static/*'],
                tasks: ['copy']
            }
        },
        'copy-node-modules': {
            options: {
                srcDir: './', // projectRoot, source directory contains package.json file.
                dstDir: './dist'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-copy-node-modules');

    grunt.registerTask('default', ['clean', 'copy-node-modules', 'copy'])
};
