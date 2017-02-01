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
    var htmlBasePath = htmlPath.substr(0, htmlPath.lastIndexOf("/"));
    var outputScriptTemplate = argv.output || "js/main.js?v={hash}";
    var scriptAttribute = argv.async ? "async" : argv.defer ? "defer" : "";

    var dom = cheerio.load(String(inputHtmlContent));
    processScripts(dom);
    return new Buffer(dom.html());

    function processScripts(dom) {
        var scripts = dom(`${parentSelector} script`);
        var content = joinContent(scripts);
        var scriptName = generateFileName(content);
        var outputFileName = url.parse(scriptName).pathname;
        var outputFile = path.join(htmlBasePath, outputFileName);

        createFile(outputFile, content);
        deleteOldScripts(scripts);
        dom(parentSelector).append(`<script ${scriptAttribute} src="${scriptName}"></script>`);
    }

    function joinContent(scripts) {
        var scriptsArray = Array.from(scripts);

        return scriptsArray.map(function (el) {
            el = dom(el);
            var src = el.attr("src");

            if (isLocal(src)) {
                return readFile(el);
            } else if (!src) {
                return el.text();
            }

        }).join(";");
    }

    function readFile(el) {
        var src = url.parse(el.attr("src")).pathname;
        var file = path.join(htmlBasePath, src);
        var source = fs.readFileSync(file);
        return source.toString();
    }

    function generateFileName(content) {
        var hash = crypto.createHash("md5").update(content).digest("hex").substring(0, 10);
        return outputScriptTemplate.replace("{hash}", hash);
    }

    function createFile(file, content) {
        var fileBasePath = file.substr(0, file.lastIndexOf("/"));
        mkdirp.sync(fileBasePath);
        fs.writeFileSync(file, content);
    }

    function deleteOldScripts(scripts) {
        scripts.each(function (idx, el) {
            el = dom(el);
            var src = el.attr("src");
            if (!src || isLocal(src)) {
                dom(el).replaceWith("");
            }
        });
    }

    function isLocal(src) {
        return src && !url.parse(src).hostname;
    }

};