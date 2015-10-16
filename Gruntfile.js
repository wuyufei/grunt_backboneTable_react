module.exports = function(grunt){
  //Project configuration
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    //coffeeScript
    coffee:{
      glob_to_multiple:{
        expand:true,
        flatten:true,
        src:['coffeescript/*.coffee'],
        dest:'dest',
        ext:'.js'
      }
    },
    watch:{
      files:['coffeescript/*.coffee'],
      tasks:['coffee']
    }
  });
  //加载插件
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  //默认执行的任务
  grunt.registerTask('default',['watch']);

}
