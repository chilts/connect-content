# connect-content #

## Synopsis ##

```
var connectContent = require('connect-content');

var content = connectContent({
    contentDir : path.join('/', __dirname, 'content'),
});

// later on
app.get('/', content);
app.get('/:pagename', content);
```

This example will serve this content at the root level. You must set both `/`
and `/:pagename` so that we can show the 'index' page at `/` since Express
doesn't call us for `/` when using only `/:pagename`.  The `/:pagename`
parameter must also be called `pagename`, not anything else, otherwise
`connect-content` wouldn't know where to look.

## What is connect-content ##

'connect-content' is middleware for Express (formerly Connect). It can read a
directory full of static `md|txt|html|json|ini` files and serve up some content
for each.

Note that `md`, `txt` and `html` files are content files. And `json` and `ini`
files are metadata files. You should only have one of each type for each
path. e.g.

If, for example you had a directory of files:

```
index.md
index.json
about.ini
about.html
code.txt
```

This would serve up the following files (if `connect-content` was mounted at
`/`)::

```
* /
* /about
* /code
```

Once 'connect-content' has read those files in, it will create a structure
similar to the following:

```
{
    name    : 'my-page',
    content : ' ... the entire content from the *.md, *..html or *.txt file ... ',
    html    : ' ... the HTML from the HTML conversion ... ',
    meta    : {
        // then entire data read from the *.json or *.ini file
    }
}
```

## Default Options ##

The default options have reasonable defaults for each of these keys, but you
can provide your own if you like:

```
var defaults = {
    title       : 'Content',
    contentDir  : 'content',
    template    : 'content-page',
    localsVar   : 'content',
};

var opts = {
    title       : 'My Projects',
    contentDir  : path.join('/', __dirname, 'projects'),
    template    : 'project-page',
    localsVar   : 'projects',
};
```

## The Template ##

The default template used is `content-page` so a really simple example (in Pug)
of that is:

```
extends layout

block content
  h1= content.title
  | !{content.page.html}
```

This means that the title is placed into the h1 and the html that has been
generated is placed (unescaped) underneath that. Since we are using Markdown or
Textile for the page content, any HTML escaping has already occurred.

## Filetypes ##

Generally there are two types of file in your content directory. Content files
and meta files.

* content
** *.html
** *.md
** *.textile
** *.txt
* meta
** *.json
** *.ini
** *.yaml

Therefore, for each page you want one of each type. For an `about` page you
could have:

* about.html
* about.json

If you also have an `about.md`, then only one of `about.html` and `about.md`
will be shown (and it is not specified which one) so make sure you only have
one of each type in the `contentDir`.

# Author #

```
$ npx chilts

   ╒════════════════════════════════════════════════════╕
   │                                                    │
   │   Andrew Chilton (Personal)                        │
   │   -------------------------                        │
   │                                                    │
   │          Email : andychilton@gmail.com             │
   │            Web : https://chilts.org                │
   │        Twitter : https://twitter.com/andychilton   │
   │         GitHub : https://github.com/chilts         │
   │         GitLab : https://gitlab.org/chilts         │
   │                                                    │
   │   Apps Attic Ltd (My Company)                      │
   │   ---------------------------                      │
   │                                                    │
   │          Email : chilts@appsattic.com              │
   │            Web : https://appsattic.com             │
   │        Twitter : https://twitter.com/AppsAttic     │
   │         GitLab : https://gitlab.com/appsattic      │
   │                                                    │
   │   Node.js / npm                                    │
   │   -------------                                    │
   │                                                    │
   │        Profile : https://www.npmjs.com/~chilts     │
   │           Card : $ npx chilts                      │
   │                                                    │
   ╘════════════════════════════════════════════════════╛
```

# License #

* [Copyright 2013 Andrew Chilton. All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
