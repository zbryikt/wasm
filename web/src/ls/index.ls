# loader adopted from https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab
load = (opt = {}) ->
  fetch(opt.path)
    .then -> it.arrayBuffer!
    .then -> WebAssembly.compile it
    .then (module) ->
      imports = opt.imports or {}
      # while the gist use memoryBase and tableBase,
      # emcc has renamed them: https://github.com/googlecodelabs/web-assembly-introduction/issues/11
      imports.env = {__memory_base: 0, __table_base: 0, abort: alert} <<< (imports.env or {})
      imports.env.print = -> console.log it
      if !imports.env.memory => imports.env.memory = new WebAssembly.Memory initial: 256
      if !imports.env.table => imports.env.table = new WebAssembly.Table initial: 256, element: \anyfunc
      return {instance: new WebAssembly.Instance(module, imports), imports}
load {path: '/assets/lib/wasm/dev/main.wasm'}
  .then ({instance,imports}) ->
    lc = {}
    memory = new Uint8Array(imports.env.memory.buffer, 0, 11)
    lc.text = new TextDecoder!decode(memory)
    view = new ldView do
      root: document.body
      action: click: do
        run: ->
          lc.value = instance.exports.doubler(view.get('input').value)
          view.render \output
      handler:
        output: ({node}) -> node.value = lc.value or 0
        memory: ({node}) -> node.value = lc.text

