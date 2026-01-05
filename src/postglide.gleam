import gleam/dynamic.{type Dynamic}
import gleam/dynamic/decode.{type DecodeError}
import gleam/javascript/array.{type Array}
import gleam/javascript/promise.{type Promise}
import gleam/list
import gleam/option.{type Option}
import gleam/result

pub type Connection

pub type Config {
  Config(
    file_system: FileSystem,
    debug_level: Int,
    relaxed_durability: Bool,
    username: option.Option(String),
    extensions: List(String),
  )
}

type JSConfig {
  JSConfig(
    file_system: FileSystem,
    debug_level: Int,
    relaxed_durability: Bool,
    username: option.Option(String),
    extensions: Array(String),  
  )
}

pub type FileSystem {
  Memory
  NodeFS(path: String)
  IndexedDB(database: String)
  OriginPrivateFS(path: String)
}

pub type Results(t) {
  Results(affected_rows: Int, rows: List(t), blob: Option(Blob))
}

pub type Blob

pub type Value

pub type QueryError {
  DatabaseError(message: String)
  DecodeFailed(List(DecodeError))
}

pub fn default_config() {
  Config(
    file_system: IndexedDB("pgdb"),
    debug_level: 0,
    relaxed_durability: True,
    username: option.None,
    extensions: [],
  )
}

pub fn create(config: Config) -> promise.Promise(Connection) {
    config
    |> to_js_config
    |> do_create
}

fn to_js_config(config: Config) -> JSConfig {
    JSConfig(
       file_system: config.file_system,
       debug_level: config.debug_level,
       relaxed_durability: config.relaxed_durability,
       username: config.username,
       extensions: array.from_list(config.extensions)
    )
}

@external(javascript, "./pglite_ffi.mjs", "create")
fn do_create(with config: JSConfig) -> promise.Promise(Connection)

pub fn query(
  query: String,
  connection: Connection,
  arguments: List(Value),
  expecting decoder: fn(Dynamic) -> Result(t, List(DecodeError)),
) -> promise.Promise(Result(Results(t), QueryError)) {
  do_query(connection, query, array.from_list(arguments))
  |> promise.map(fn(db_result) {
    db_result
    |> get_rows
    |> array.to_list
    |> list.try_map(decoder)
    |> result.map(Results(0, _, option.None))
    |> result.map_error(DecodeFailed(_))
  })
  |> promise.rescue(fn(err) {
    get_error_message(err)
    |> DatabaseError
    |> Error
  })
}

@external(javascript, "./pglite_ffi.mjs", "getErrorMessage")
fn get_error_message(any: Dynamic) -> String

@external(javascript, "./pglite_ffi.mjs", "query")
fn do_query(
  connection: Connection,
  query: String,
  params: Array(Value),
) -> promise.Promise(PGResult)

pub type PGResult

@external(javascript, "./pglite_ffi.mjs", "getRows")
fn get_rows(result: PGResult) -> Array(Dynamic)

@external(javascript, "./pglite_ffi.mjs", "int")
pub fn int(int: Int) -> Value

@external(javascript, "./pglite_ffi.mjs", "string")
pub fn string(string: String) -> Value

@external(javascript, "./pglite_ffi.mjs", "bool")
pub fn bool(bool: Bool) -> Value

@external(javascript, "./pglite_ffi.mjs", "exec")
pub fn exec(connection: Connection, query: String) -> Promise(List(PGResult))
