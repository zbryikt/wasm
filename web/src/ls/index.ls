# loader adopted from https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab
load = (opt = {}) ->
  fetch(opt.path)
    .then -> it.arrayBuffer!
    .then -> WebAssembly.compile it
    .then (module) ->
      imports = opt.imports or {}
      imports.env = {memoryBase: 0, tableBase: 0, abort: alert} <<< (imports.env or {})
      imports.env.print = -> console.log it
      if !imports.env.memory => imports.env.memory = new WebAssembly.Memory initial: 256
      if !imports.env.table => imports.env.table = new WebAssembly.Table initial: 0, element: \anyfunc
      new WebAssembly.Instance(module, imports);
load {path: '/assets/lib/wasm/dev/main.wasm'}
  .then (instance) ->
    lc = {}
    view = new ldView do
      root: document.body
      action: click: do
        run: ->
          lc.value = instance.exports.doubler(view.get('input').value)
          view.render \output
      handler:
        output: ({node}) -> node.value = lc.value or 0

