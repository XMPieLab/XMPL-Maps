var root = __dirname,
    build = "build/",
    client = "client/",
    dist = "dist/";

function mapClient(item) {
    if (item.indexOf("!") > -1) {
        return "!" + client + item;
    }
    return client + item;
}


var config = {
    distribution: dist,
    clientRoot: client,
    build: build,
    sources : {
        less : ["modules/**/*.less"].map(mapClient),
        js: ["xmpcfg.js", "modules/**/*.js"].map(mapClient),
        views: ["*.html", "**/*.html", "!lib/**/*.html"].map(mapClient),
        statics: ["**/*.gif", "**/*.png", "**/**.jpg", "**/*.woff","**/*.woff2", "**/*.eot", "**/*.json", "**/*.svg"].map(mapClient),
        xmpmap: ["modules/xmp.map/**/*.js"].map(mapClient)
    },
    bundles: {
        js: ["build/xmp-map.min.js"].map(mapClient),
        css: ["bundle.css"].map(mapClient)
    },
    vendors: {
        js: ["vendor.js"].map(mapClient),
        css: ["vendor.css"].map(mapClient)
    }
};

config.browserSync = {
    files: [].concat(config.sources.js, config.sources.views, config.sources.less),
    proxy: "localhost:1337"
};

module.exports = config;