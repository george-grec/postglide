# postglide

[![Package Version](https://img.shields.io/hexpm/v/postglide)](https://hex.pm/packages/postglide)
[![Hex Docs](https://img.shields.io/badge/hex-docs-ffaff3)](https://hexdocs.pm/postglide/)


Use the power of postgres in your client-side [Lustre](https://hexdocs.pm/lustre/) application thanks
to [PGlite](https://pglite.dev/)!
This has been tested with [vite](https://vitejs.dev/) and
[vite-gleam](https://github.com/Enderchief/gleam-tools/tree/master/packages/vite-gleam) (see below
for more info).


## How to create a basic lustre project with postglide

Prerequisites: you have gleam, node and npm installed

```sh
gleam new postglide_demo
cd postglide_demo
gleam add gleam_javascript
gleam add lustre
gleam add postglide

npm i @electric-sql/pglite
npm i -D vite
npm i vite-gleam
```

Add this to your package.json
```
  ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
```

Add this `index.html` to the root of your project
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <script
            src="https://cdn.jsdelivr.net/npm/@electric-sql/pglite-repl/dist-webcomponent/Repl.js"
            type="module"
        ></script>
    </head>

    <body>
        <script type="module">
            import { main } from "./src/postglide_demo.gleam";
            document.addEventListener("DOMContentLoaded", main);
        </script>
    </body>
</html>
```

Change your `postglide_demo.gleam` file to this
```gleam
import gleam/javascript/promise
import lustre
import lustre/attribute
import lustre/element
import postglide

pub fn main() {
  use connection <- promise.map(postglide.create(postglide.default_config()))

  let app =
    lustre.element(
      element.element(
        "pglite-repl",
        [attribute.id("repl"), attribute.property("pg", connection)],
        [],
      ),
    )
  let assert Ok(_) = lustre.start(app, "body", Nil)

  Nil
}

```

If you run `npm run dev` and open the local web page you will see a lustre application connected to
a local postgres database (stored via [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)).
It will also show you a REPL to execute your SQL code in. Try creating a table and inserting data,
and then refresh the page and select from that table!

## How do I use this in my lustre app?
Just like in the example above, you should first connect to the postgres database with `postglide.create`
and then just store the connection in your lustre model. Then, you would use that connection to
call `postglide.query`, for example. The API pretty much just copies the
[official PGlite docs](https://pglite.dev/docs/api). **However, this is a WIP so not all of the API has
been implemented yet!**

Further documentation can be found at <https://hexdocs.pm/postglide>.
