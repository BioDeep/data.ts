﻿namespace TypeScript {

    /**
     * The web assembly helper
    */
    export module Wasm {

        /**
         * The webassembly engine.
        */
        const engine: WebAssembly = (<any>window).WebAssembly;

        /** 
         * Run the compiled VisualBasic.NET assembly module
         * 
         * > This function add javascript ``math`` module as imports object automatic
         * 
         * @param module The ``*.wasm`` module file path
         * @param run A action delegate for utilize the VB.NET assembly module
         *         
        */
        export function RunAssembly(module: string, opts: Config): void {
            fetch(module)
                .then(function (response) {
                    if (response.ok) {
                        return response.arrayBuffer();
                    } else {
                        throw `Unable to fetch Web Assembly file ${module}.`;
                    }
                })
                .then(buffer => new Uint8Array(buffer))
                .then(module => ExecuteInternal(module, opts))
                .then(assembly => {
                    if (typeof logging == "object" && logging.outputEverything) {
                        console.log("Load external WebAssembly module success!");
                        console.log(assembly);
                    }

                    opts.run(assembly);
                });
        }

        function ExecuteInternal(module: Uint8Array, opts: Config): IWasm {
            var byteBuffer: TypeScript.WasmMemory = new (<any>window).WebAssembly.Memory({ initial: 10 });
            var dependencies = {
                "global": {},
                "env": {
                    bytechunks: byteBuffer
                }
            };
            var api: apiOptions = opts.api || { document: false };

            // imports the javascript math module for VisualBasic.NET module by default
            dependencies["Math"] = (<any>window).Math;

            if (typeof opts.imports == "object") {
                for (var key in opts.imports) {
                    dependencies[key] = opts.imports[key];
                }
            }

            WebAssembly.ObjectManager.load(byteBuffer);

            if (api.document) {
                dependencies["document"] = WebAssembly.Document;
            }

            let assembly = engine.instantiate(module, dependencies);
            return assembly;
        }
    }
}