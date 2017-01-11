module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				compress: { drop_console: true ,  dead_code: false }
			},
			build: {
				files: [{
					expand: true,
					cwd: '<%= btFolder %>/',
					src: ['**/*.js', '!*.min.js'],
					dest: '<%= btFolder %>/js',
					ext: '.min.js'
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: '<%= btFolder %>/',
					src: ['*.css', '!*.min.css'],
					dest: '<%= btFolder %>/css',
					ext: '.min.css'
				}]
			}
		},
		
		watch : {
			uglify: {
				files: ['**/*.js', '!**/*.min.js'],
				tasks: ['newer:uglify:build'],
				options: {
					cwd : { files: '<%= btFolder %>/' },
					spawn: false,
				},
			},
			cssmin: {
				files: ['**/*.css', '!**/*.min.css'],
				tasks: ['newer:cssmin:target'],
				options: {
					cwd : { files: '<%= btFolder %>/' },
					spawn: false,
				},
			}
		},

		// property for ressource directory; e.g. alternative locations :  '$ grunt minify --path <path-to-project>'
		btFolder: typeof grunt.option('path') === 'string' ? grunt.option('path') : 'assets',
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');

	// Default task(s).
	grunt.registerTask('minify', ['uglify:build', 'cssmin:target']);
};
