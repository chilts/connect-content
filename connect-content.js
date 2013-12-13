// ----------------------------------------------------------------------------
//
// connect-blog.js - Blog middleware you can add to your Connect/Express app.
//
// Copyright (c) 2013 Andrew Chilton. All rights resered.
//
// License: http://chilts.mit-license.org/2013/
//
// ----------------------------------------------------------------------------

// core
var fs = require('fs');

// npm
var xtend    = require('xtend');
var ini      = require('ini');
var yaml     = require('js-yaml');
var marked   = require('marked');
var textile  = require('textile-js');
var escape   = require('escape-html');

// ----------------------------------------------------------------------------

var defaults = { 
    title      : 'Content',
    contentDir : 'content',
    template   : 'content-page',
};

// ----------------------------------------------------------------------------

module.exports = function(args) {
    var opts = xtend({}, defaults, args);

    var page  = {};

    // read all the files from the content dir
    var files = fs.readdirSync(opts.contentDir);

    // skip over any directories
    files = files.filter(function(filename) {
        return !fs.statSync(opts.contentDir + '/' + filename).isDirectory();
    });

    files.forEach(function(filename) {
        var parts = filename.split(/\./);
        var basename = parts[0];
        var ext = parts[1];

        // set this to a default post with the 'name'
        page[basename] = page[basename] || {
            name    : basename,
            meta    : {
                title : basename.split(/-/).map(function(str) { return str.substr(0, 1).toUpperCase() + str.substr(1); }).join(' '),
            },
            content : '',
            html    : '',
        };

        var contents = fs.readFileSync(opts.contentDir + '/' + filename, 'utf8');

        // do the meta files
        if ( ext === 'json' ) {
            try {
                // console.log('Got json : ' + contents);
                page[basename].meta = xtend(page[basename].meta, JSON.parse(contents));
            }
            catch (e) {
                console.warn('Error parsing ' + filename + ' file : ' + e);
                process.exit(2);
            }
        }
        if ( ext === 'yml' || ext === 'yaml' ) {
            page[basename].meta = xtend({}, page[basename].meta, yaml.load(contents));
        }
        if ( ext === 'ini' ) {
            page[basename].meta = xtend({}, page[basename].meta, ini.decode(contents));
        }

        // do the content files
        if ( ext === 'html' ) {
            page[basename].content = contents;
            page[basename].html    = contents;
        }
        if ( ext === 'md' ) {
            page[basename].content = contents;
            page[basename].html    = marked(contents);
        }
        if ( ext === 'textile' ) {
            page[basename].content = contents;
            page[basename].html    = textile(contents);
        }
        if ( ext === 'txt' ) {
            page[basename].content = contents;
            page[basename].html    = '<pre>' + escape(contents) + '</pre>';
        }
    });

    // console.log(page);

    var middleware = function(req, res, next) {
        res.locals.content = {
            page : page,
        };

        var pagename = req.params.page;

        if ( !pagename ) {
            if ( !page.index ) {
                // no index page
                return next();
            }

            res.locals.content.title = opts.title + ' : ' + page['index'].meta.title;
            res.locals.content.page  = page.index;
            return res.render(opts.template);
        }

        // is this a page
        if ( page[pagename] ) {
            res.locals.content.title = opts.title + ' : ' + page[pagename].meta.title;
            res.locals.content.page  = page[pagename];
            return res.render(opts.template);
        }

        // didn't find anything interesting, pass it on
        next();
    };

    // prior to returning, let's put these vars onto this middleware so
    // the user can get access to some interesting things
    middleware.page = page;

    return middleware;
};

// ----------------------------------------------------------------------------
