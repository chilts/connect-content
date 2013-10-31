# connect-blog #

## Synopsis ##

```
var connectContent = require('connect-content);

var content = connectContent({
    contentDir  : fs.joinPath('/', __dirname, 'content'),
});

// later on
app.get('/', content);
app.get('/:path', content);
```

This example will serve this content at the root level. You must set both ```/``` and ```/:path``` so that we can show
the 'index' page at ```/``` since Express doesn't call us for ```/``` when using only ```/:path```.  The ```/:path```
parameter must also be called ```path```, not anything else.

## What is connect-content ##

'connect-content' is middleware for Express/Connect. It can read a directory full of static ```md|txt|html|json|ini```
files and serve up some content for each.

Note that ```md```, ```txt``` and ```html``` files are content files. And ```json``` and ```ini``` files are metadata
files. You should only have one of each type for each path. e.g.

If, for example you had a directory of files:

```
index.md
index.json
about.ini
about.html
code.txt
```

This would serve up the following files (if ```connect-content``` was mounted at ```/```)::

```
* /
* /about
* /code
```

Once 'connect-blog' has read those files in, it will create a structure similar to the following:

```
{
    name    : 'my-first-post',
    content : ' ... the entire content from the *.md, *..html or *.txt file ... ',
    html    : ' ... the HTML from the HTML conversion ... ',
    meta    : {
        // then entire data read from the *.json or *.ini file
    }
}
```

## Synopsis ##

To set up some content from within Express, try this:

```
var connectContent = require('connect-content);

var content = connectContent({
    title       : 'My Projects',
    contentDir  : fs.joinPath('/', __dirname, 'content/project'),
    domain      : 'example.com',
    basePath    : '/project',
});

app.get( '/project/',      content );
app.get( '/project/:path', content );
```

This will serve the following pages:

```
/blog/  - renders the 'content-index' template
/blog/* - renders the 'content-page' template
```

## Default Options ##

The default options have reasonable (not necessarily sensible) defaults for each of these keys, so the only onw you MUST provide
is the ```domain```.

```
var opts = {
    title       : 'Content',
    contentDir  : 'content',
    basePath    : '',
};
```

# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) - [Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
