# MagicStix
A stick I found, glued to a a rock I found.


MagicStix is a micro javascript framework.  MagicStix allows you to easily create a single page application with template parsing and remote data.

## Use

Download the newest release, place it in your application's js directory, and include it in your application source.
```html
<script src="/js/magicstix.min.js"></script>
```

## Examples
```html
<!DOCTYPE html>

<html lang="en"> 
    <meta charset="utf-8">

    <title> test </title>
  </head>
  <body>
    <p>Your ip is <span content="<%= ip %>" remote="http://ip.jsontest.com/"></span></p> 
  </body>
</html>
```

## What does magicstix do?
* Creates a simple single page application.
* Consumes remote API's for display on your application.
* Displays blocks of HTML in async.
* Renders EJS templates with variables from local or remote sources.

## What **doesn't** magicstix do?
* Provide any UI utlities or widgets. (use bootstrap, materialize, etc)
* Perform actual authentication
* Make Coffee
* Clean toilets


# Plugins
The following plugins are built into MagiStix, but can be