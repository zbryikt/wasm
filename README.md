# wasm

this is a simple workable example of wasm execution.

You will need an availabel emcc, which could be installed via:

    git clone https://github.com/emscripten-core/emsdk.git
    cd emsdk
    ./emsdk update # only for update
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh
    emcc -v # verify installation

## Call C functions in JS

in c file:

    int doubler(int val) { return val * 2; }

in JS file: ( check `web/src/ls/index.ls` for more information about `load` )

    load({...}).then (instance) -> instance.exports.doubler(5);



## Call JS functions in C

in c file:

    void print(int num); /* definition */

in JS file, add `print` in `importObject.env`:

    importObject.env.print = -> console.log it


## Reference

 - https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab

