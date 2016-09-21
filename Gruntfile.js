module.exports = function (grunt) {
	
	grunt.loadNpmTasks('grunt-wiredep');
	
	grunt.initConfig({
		wiredep: {
			task: {
				src: ['index.html']
			}
		}
	});
	
	grunt.registerTask('default', ['wiredep']);
};