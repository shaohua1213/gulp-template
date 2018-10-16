var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var cleanCss = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

// 所有开发任务
//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function () {
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['src/sass/*.scss'], ['sass']);
  gulp.watch(['src/js/*.js'], ['js']);
});
//sass任务
gulp.task('sass', function () {
	return gulp.src('src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(connect.reload());
});
//js任务
gulp.task('js', function () {
	return gulp.src('src/js/*.js')
		.pipe(connect.reload());
});
//使用connect启动一个Web服务器
gulp.task('connect',function(){
	connect.server({
		root:'src',
		port:'8000',
		livereload: true,
		host: '0.0.0.0'
	})
});
//html任务
gulp.task('html',function(){
	return gulp.src('src/*.html')
	.pipe(connect.reload());
});

//所有打包任务
gulp.task('cssBuild', function() {
	return gulp.src('src/css/*.css')
			.pipe(cleanCss())
			.pipe(gulp.dest('dist/css'));
});

gulp.task('jsBuild', function () {
	return gulp.src('src/js/*.js')
	.pipe(babel({
		"presets": ["@babel/preset-env"]
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('htmlBuild', function() {
    var options = {
        removeComments: true,     //清除HTML注释
        collapseWhitespace: true,   //压缩HTML
        removeEmptyAttributes: true,        //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,      //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,    //删除<style>和<link>的type="text/css"
        minifyJS: true,      //压缩页面JS
        minifyCSS: true    //压缩页面CSS
    };
    return gulp.src('src/*.html').pipe(htmlmin(options)).pipe(gulp.dest('dist'));
 });

gulp.task('imageBuild', function () {
	gulp.src('src/images/*.{png,jpg,gif,ico}')
			.pipe(imagemin({
					optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
					progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
					interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
					multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
			}))
			.pipe(gulp.dest('dist/images'));
});

//运行gulp 默认的Task dev任务
gulp.task('default',['connect','watch', 'sass', 'js'])

//硬性gulp build 执行打包任务
gulp.task('build',['cssBuild','jsBuild', 'htmlBuild', 'imageBuild'])