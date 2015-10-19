var util = require("util"),
    del = require("del"),
    runSequence = require("run-sequence"),
    gulp = require("gulp"),
    config = require("./gulp.config"),
    $ = require("gulp-load-plugins")({lazy:true}),
    wiredep = require("wiredep")(),
    argv = require("yargs").boolean('prod').argv,
    browserSync = require('browser-sync').create();


function removeDistribution(path) {
    return path.replace("/" + config.distribution, "");
}

gulp.task("clean", function(){
   del.sync([config.distribution + "**"]);
   del.sync([config.build + "**"]);
});

gulp.task("bundle.js", function(){
    gulp
        .src(config.bundles.js)
        .pipe($.if(argv.prod,
            $.inject(
                gulp.src(config.sources.js, {base: config.clientRoot})
                    .pipe($.angularFilesort())
                    .pipe($.uglify()),
                {
                    starttag: "/* inject:js */",
                    endtag: " /* endinject */",
                    transform: function(filePath, file) {
                        return file.contents.toString('utf8');
                    }
                })
            ,
            $.inject(
                gulp.src(config.sources.js, {base: config.clientRoot})
                    .pipe($.angularFilesort())
                    .pipe(gulp.dest(config.distribution)), {
                    starttag: "/* inject:js */",
                    endtag: " /* endinject */",
                    transform: function (filePath) {
                        return util.format("document.write(\"<script type='text/javascript' src='%s'></script>\");", removeDistribution(filePath));
                    }
                }
            )))
        .pipe(gulp.dest(config.distribution));
});

gulp.task("bundle.css", [], function () {
    gulp
        .src(config.bundles.css, {base: config.clientRoot})
        .pipe($.if(argv.prod,
            $.inject(gulp.src(config.sources.less, {base: config.clientRoot})
                    .pipe($.less())
                    .pipe($.minifyCss()),
                {
                    starttag: "/* inject:css */",
                    endtag: " /* endinject */",
                    transform: function (filePath, file) {
                        return file.contents.toString('utf8');
                    }
                })
            ,
            $.inject(
                gulp.src(config.sources.less, {base: config.clientRoot})
                    .pipe($.less())
                    .pipe(gulp.dest(config.distribution)), {
                    starttag: "/* inject:css */",
                    endtag: " /* endinject */",
                    transform: function (filePath) {
                        return util.format("@import url(%s);", removeDistribution(filePath));
                    }
                }
            )
        ))
        .pipe(gulp.dest(config.distribution));
});

gulp.task("vendor.js", [], function(){
    if (typeof wiredep.js == 'undefined') {
        gulp
            .src(config.vendors.js)
            .pipe(gulp.dest(config.distribution));
        return;
    }
    gulp
        .src(config.vendors.js)
        .pipe($.if(argv.prod,
            $.inject(
                gulp.src(wiredep.js, {base: config.clientRoot})
                    .pipe($.uglify()),
                {
                    starttag: "/* inject:js */",
                    endtag: " /* endinject */",
                    transform: function(filePath, file) {
                        return file.contents.toString('utf8');
                    }
                })
            ,
            $.inject(
                gulp.src(wiredep.js, {base: config.clientRoot})
                    .pipe(gulp.dest(config.distribution)), {
                    starttag: "/* inject:js */",
                    endtag: " /* endinject */",
                    transform: function (filePath) {
                        return util.format("document.write(\"<script type='text/javascript' src='%s'></script>\");", removeDistribution(filePath));
                    }
                }
            )))
        .pipe(gulp.dest(config.distribution));
});

gulp.task("vendor.css", [], function(){
    if (wiredep.css) {
        gulp
            .src(config.vendors.css, {base: config.clientRoot})
            .pipe($.if(argv.prod,
                $.inject(gulp.src(wiredep.css, {base: config.clientRoot})
                        .pipe($.minifyCss()),
                    {
                        starttag: "/* inject:css */",
                        endtag: " /* endinject */",
                        transform: function (filePath, file) {
                            return file.contents.toString('utf8');
                        }
                    })
                ,
                $.inject(
                    gulp.src(wiredep.css, {base: config.clientRoot})
                        .pipe(gulp.dest(config.distribution)), {
                        starttag: "/* inject:css */",
                        endtag: " /* endinject */",
                        transform: function (filePath) {
                            return util.format("@import url(%s);", removeDistribution(filePath));
                        }
                    }
                )
            ))
            .pipe(gulp.dest(config.distribution));
    }
});


gulp.task("statics", function(){
    gulp.src(config.sources.statics, { base: config.clientRoot})
        .pipe(gulp.dest(config.distribution));
});

gulp.task("html", function(){
   gulp.src(config.sources.views, {base:config.clientRoot})
       .pipe(gulp.dest(config.distribution));
});

gulp.task("build", function(){
    runSequence("clean", /*"vendor.js", "vendor.css", */"bundle.js", "bundle.css", "statics", "html");
});

gulp.task("bundle.js.update", function(){
   gulp.src(config.sources.js, {base: config.clientRoot})
       .pipe(gulp.dest(config.distribution));
});

gulp.task("bundle.css.update", function(){
    gulp.src(config.sources.less, {base: config.clientRoot})
        .pipe($.less())
        .pipe(gulp.dest(config.distribution));
});

gulp.task("watchers", function(){
    var watchers = [
        {glob:config.sources.views, task: ["html"]},
        {glob:config.sources.js, task: ["bundle.js"]},
        {glob:config.sources.less, task: ["bundle.css"]}
    ];

    watchers.forEach(function(w){
        var watcher = gulp.watch(w.glob, w.task);
        watcher.on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
});

gulp.task('build.lib', function(){
   gulp.src(config.sources.xmpmap)
       .pipe($.concat('xmp-map.min.js'))
       .pipe($.uglify())
       .pipe(gulp.dest(config.build));
});

gulp.task('pack', ['build.lib'], function(){
    gulp.src(['client/**','dist/**', 'server/**', '.bowerrc', 'bower.json','gulp*', 'package.json', 'README.md'], { base: './'})
        .pipe(gulp.dest('package/'));

        gulp.src('./package/*')
        .pipe($.using())
        .pipe($.tar('archive.tar'))
        .pipe($.gzip())
        .pipe(gulp.dest('./'));
})

gulp.task('dev',  function() {
    require("./server/app");
    runSequence("build","watchers", function(){
        browserSync.init(config.browserSync);
    });
});

gulp.task('serve', function() {
    require("./server/app");
});

gulp.task('default', ['dev']);
