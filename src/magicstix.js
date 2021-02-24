var magicStix = {};

(function(ns){
  ns.state = [];
  ns.variableStack = {};
  ns.history = function() {
    ns.state.push(document.body.innerHTML);
    window.history.pushState({},'','');
  }

  ns.remote_fetch = async function(url) {
    const response = await fetch(url,{
      method: 'GET',
      headers: this.config.headers,
      redirect: 'follow',
      referrerPolicy: 'origin'
    });
    if (!response.ok) { return }
    switch (response.headers.get('Content-Type')) {
      case 'text/html':
        var body = await response.text();
        break;
      case 'application/json':
        var body = await response.json();
        break;
      case 'multipart/form-data':
        var body = await response.formData();
        break;
      default:
        var body = await response.blob();
    }
    return body;
  };

  ns.extend = function(pname,plugin) {
    ns[pname] = plugin;
  };
}(window.magicStix = window.magicStix || {}));

magicStix.extend("config", {
  api_prefix: "http://localhost:8000/",
  headers: {}
});

magicStix.extend("template", async function(obj) {
  // Locate the content for the element
  if (obj.hasAttribute('content')) {
    var body = obj.getAttribute('content');
  } else if (obj.hasAttribute('remote')) {
    var body = await magicStix.remote_fetch(obj.getAttribute('remote'));
  } else if (obj.hasAttribute('href')) { 
    var body = await magicStix.remote_fetch(obj.getAttribute('href'));
  } 
  var vars = obj.getAttribute('vars') || {}
  var variables = {}
  try {
    variables = JSON.parse(vars); 
  } 
  catch { 
    variables = await magicStix.remote_fetch(vars); 
  }
  if (obj.hasAttribute("norender")) {
    obj.dest.innerHTML = body
  } else {
    Object.assign(magicStix.variableStack,variables);
    console.log(magicStix.variableStack);
    obj.dest.innerHTML = ejs.render(body, variables);
  }
  magicStix.parse(obj.dest)
});

magicStix.extend("parse", async function(element) {
  element.querySelectorAll('[remote]').forEach(function(x) {
    x.dest = document.getElementById(x.getAttribute('dest-id')) || x
    magicStix.template(x);
  });

  document.querySelectorAll('[local]').forEach(function(x) {
    if (x.getAttribute('href') == undefined) { return; }
    x.dest = document.getElementById(x.getAttribute('dest-id')) || document.body;
    x.onclick = function(e) { e.preventDefault();magicStix.history(); magicStix.template(x);};
  });
});


window.onload = function() {
  let ejs_cdn = document.createElement('script');
  ejs_cdn.setAttribute("src",'https://cdn.jsdelivr.net/npm/ejs@3.1.6/ejs.min.js');
  document.body.prepend(ejs_cdn);
  ejs_cdn.onload = function() { 
    window.addEventListener('popstate', (event) => {
      document.body.innerHTML = magicStix.state.pop();
      magicStix.parse(document.body);
    });  
    magicStix.parse(document.body); 
  };
}