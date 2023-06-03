"use strict";

const sass = require("gulp-sass")(require("sass"));
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const gutil = require("gulp-util");
const jshint = require("gulp-jshint");
const fileinclude = require("gulp-file-include");
const bs = require("browser-sync").create();
const rimraf = require("rimraf");
const wrapper = require("gulp-wrapper");
const comments = require("gulp-header-comment");
const template = require("gulp-template");
const theme = require("./src/theme.json");
const node_env = process.argv.slice(2)[0];
const headerComments = `WEBSITE: https://themefisher.com
                        TWITTER: https://twitter.com/themefisher
                        FACEBOOK: https://facebook.com/themefisher
                        GITHUB: https://github.com/themefisher/`;

var path = {
  // source paths
  src: {
    theme: "src/theme.json",
    pages: "src/pages/*.html",
    partials: "src/partials/**/*.html",
    styles: "src/styles/*.scss",
    scripts: "src/scripts/*.js",
    plugins: "src/plugins/**/*",
    public: "src/public/**/*",
  },

  // build paths
  build: {
    dir: "theme/",
  },
};

// pages
gulp.task("pages", function () {
  return gulp
    .src(path.src.pages)
    .pipe(
      wrapper({
        header:
          "<!DOCTYPE html>\n<html lang=\"zxx\">\n@@include('head.html')\n@@include('header.html')\n<body>",
        footer:
          node_env === "dev"
            ? "@@include('components/tw-size-indicator.html')\n @@include('footer.html')\n</body>\n</html>"
            : "@@include('footer.html')\n</body>\n</html>",
      })
    )
    .pipe(
      fileinclude({
        basepath: "src/partials/",
      })
    )
    .pipe(
      template({
        fontPrimary: theme.fonts.font_family.primary,
        fontSecondary: theme.fonts.font_family.secondary,
      })
    )
    .pipe(comments(headerComments))
    .pipe(gulp.dest(path.build.dir))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// styles
gulp.task("styles", function () {
  return gulp
    .src(path.src.styles)
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(
      postcss([tailwindcss("./tailwind.config.js"), require("autoprefixer")])
    )
    .pipe(comments(headerComments))
    .pipe(gulp.dest(path.build.dir + "styles/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// scripts
gulp.task("scripts", function () {
  return gulp
    .src(path.src.scripts)
    .pipe(jshint("./.jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"))
    .on("error", gutil.log)
    .pipe(comments(headerComments))
    .pipe(gulp.dest(path.build.dir + "scripts/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Plugins
gulp.task("plugins", function () {
  return gulp
    .src(path.src.plugins)
    .pipe(gulp.dest(path.build.dir + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// public files
gulp.task("public", function () {
  return gulp.src(path.src.public).pipe(gulp.dest(path.build.dir));
});

// Clean Theme Folder
gulp.task("clean", function (cb) {
  rimraf("./theme", cb);
});

// Watch Task
gulp.task("watch", function () {
  gulp.watch(path.src.theme, gulp.parallel("styles"));
  gulp.watch(path.src.pages, gulp.parallel("pages", "styles"));
  gulp.watch(path.src.partials, gulp.parallel("pages", "styles"));
  gulp.watch(path.src.scripts, gulp.parallel("scripts", "styles"));
  gulp.watch(path.src.styles, gulp.parallel("styles"));
  gulp.watch(path.src.plugins, gulp.parallel("plugins", "pages"));
  gulp.watch(path.src.public, gulp.parallel("public", "pages"));
});

// dev Task
gulp.task(
  "dev",
  gulp.series(
    "clean",
    "pages",
    "styles",
    "scripts",
    "plugins",
    "public",
    gulp.parallel("watch", function () {
      bs.init({
        server: {
          baseDir: path.build.dir,
        },
      });
    })
  )
);

// Build Task
gulp.task(
  "build",
  gulp.series("clean", "pages", "styles", "scripts", "plugins", "public")
);

// Deploy Task
gulp.task(
  "deploy",
  gulp.series("pages", "styles", "scripts", "plugins", "public")
);
