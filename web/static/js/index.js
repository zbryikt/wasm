var load;
load = function(opt){
  opt == null && (opt = {});
  return fetch(opt.path).then(function(it){
    return it.arrayBuffer();
  }).then(function(it){
    return WebAssembly.compile(it);
  }).then(function(module){
    var imports;
    imports = opt.imports || {};
    imports.env = import$({
      __memory_base: 0,
      __table_base: 0,
      abort: alert
    }, imports.env || {});
    imports.env.print = function(it){
      return console.log(it);
    };
    if (!imports.env.memory) {
      imports.env.memory = new WebAssembly.Memory({
        initial: 256
      });
    }
    if (!imports.env.table) {
      imports.env.table = new WebAssembly.Table({
        initial: 256,
        element: 'anyfunc'
      });
    }
    return {
      instance: new WebAssembly.Instance(module, imports),
      imports: imports
    };
  });
};
load({
  path: '/assets/lib/wasm/dev/main.wasm'
}).then(function(arg$){
  var instance, imports, lc, memory, view;
  instance = arg$.instance, imports = arg$.imports;
  lc = {};
  memory = new Uint8Array(imports.env.memory.buffer, 0, 11);
  lc.text = new TextDecoder().decode(memory);
  return view = new ldView({
    root: document.body,
    action: {
      click: {
        run: function(){
          lc.value = instance.exports.doubler(view.get('input').value);
          return view.render('output');
        }
      }
    },
    handler: {
      output: function(arg$){
        var node;
        node = arg$.node;
        return node.value = lc.value || 0;
      },
      memory: function(arg$){
        var node;
        node = arg$.node;
        return node.value = lc.text;
      }
    }
  });
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}