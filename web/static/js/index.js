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
      memoryBase: 0,
      tableBase: 0,
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
        initial: 0,
        element: 'anyfunc'
      });
    }
    return new WebAssembly.Instance(module, imports);
  });
};
load({
  path: '/assets/lib/wasm/dev/main.wasm'
}).then(function(instance){
  var lc, view;
  lc = {};
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
      }
    }
  });
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}