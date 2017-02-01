var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");
var url = require("url");
var crypto = require('crypto');
var mkdirp = require('mkdirp');

module.exports = function (argv) {
    var inputHtmlName = argv["_"][0];
    var inputHtmlContent = fs.readFileSync(inputHtmlName);
    var htmlPath = fs.realpathSync(inputHtmlName);
    var parentSelector = argv.parent || "body";
    var basePath = htmlPath.substr(0, htmlPath.lastIndexOf("/"));
    var outputScriptTemplate = argv.output || "js/main.js?v={hash}";
    var scriptAttribute = argv.async ? "async" : argv.defer ? "defer" : "";

    var dom = cheerio.load(String(inputHtmlContent));
    joinScripts(dom);
    return new Buffer(dom.html());

    function joinScripts(dom) {
        var scripts = dom(`${parentSelector} script`);
        var scriptsArray = Array.from(scripts);
        // join files content
        var joined = scriptsArray.map(function (el) {
            el = dom(el);
            var src = el.attr("src");

            if (isLocal(src)) {
                var src = url.parse(el.attr("src")).pathname;
                var file = path.join(basePath, src);
                var source = fs.readFileSync(file);
                return source.toString();
            } else if(!src) {
                return el.text();
            }

        }).join(";");

        // generate script name
        var hash = crypto.createHash("md5").update(joined).digest("hex").substring(0, 10);
        var scriptName = outputScriptTemplate.replace("{hash}", hash);
        var outputFileName = url.parse(scriptName).pathname;


        // create a file
        var outputFile = path.join(basePath, outputFileName);
        var outputBasePath = outputFile.substr(0, outputFile.lastIndexOf("/"));
        mkdirp.sync(outputBasePath);
        fs.writeFileSync(outputFile, joined);


        // delete scripts
        scripts.each(function (idx, el) {
            el = dom(el);
            var src = el.attr("src");
            if(!src || isLocal(src)) {
                dom(el).replaceWith("");
            }
        });

        dom(parentSelector).append(`<script ${scriptAttribute} src="${scriptName}"></script>`);
    }

    function isLocal(src) {
        return src && !url.parse(src).hostname;
    }

};