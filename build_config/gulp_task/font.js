/**
 * 从svg构造webfont
 */

var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
	rename = require('gulp-rename'),
	APP_PATH = 'src/app/';

regTasks({
	hyfont: 'assets/fonts'
});

function regTasks(options) {
	var taskArr = [];
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			var val = options[key];
			if (typeof val === 'string') {
				val = {
					dir: val
				};
			}
			regTask(key, val);
			taskArr.push('font:' + key);
		}
	}
	gulp.task('font', taskArr);
}
function regTask(name, val) {
	gulp.task('font:' + name, function() {
		return gulp.src((val.dir || name) + '/svg/*.svg', {
				cwd: APP_PATH
			})
			.pipe(iconfont({
				fontName: name, // 字体的family名
				formats: [ 'ttf', 'eot', 'woff', 'woff2', 'svg' ],
				fixedWidth: true, // true 等宽字体
				centerHorizontally: true, // true 横向居中
				normalize: true, // 将svg拉伸为同样的高度
				fontHeight: 1000, // 字体高度 默认为输入图片中最高图片的高度
				descent: 140, // 生成的字体下边线相对baseline的偏移 向下为正
				// ascent: 820, // 生成的字体上边线相对baseline的偏移 向上为正
				metadata: 'Copyright © 2017 by V5KF. All rights reserved.', // 元数据 可用于存储版权信息
				startUnicode: 59905,
				prependUnicode: true // true会将生成的编码添加到svg文件名前，用于保证下次使用相同的编码
			}))
			.on('glyphs', function(glyphs/*, options*/) {
				// 生成样例html、stylus、css、json
				gulp.src('tpl.*', {
						cwd: 'build_config/gulp_task/font'
					})
					.pipe(consolidate('lodash', {
						glyphs: glyphs,
						fontName: name,
						fontRefer: 'assets/fonts',
						fontPath: APP_PATH + (val.dir || name),
						className: (val.className || name)
					}))
					.pipe(rename({basename: name}))
					.pipe(gulp.dest(APP_PATH + (val.dir || name)));
			})
			.pipe(gulp.dest(APP_PATH + (val.dir || name)));
	});
}