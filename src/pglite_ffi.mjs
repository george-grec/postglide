import { Some } from "../gleam_stdlib/gleam/option.mjs";
import { Memory, NodeFS, IndexedDB, OriginPrivateFS } from "./postglide.mjs";
import { PGlite } from "@electric-sql/pglite";

export function create(config) {
  return PGlite.create({
    ...config,
    debug: config.debug_level,
    username: config.username instanceof Some ? config.username[0] : null,
    dataDir: getDataDir(config.file_system),
  });
}

export function int(integer) {
  return integer;
}

export function string(string) {
  return string;
}

export function bool(bool) {
  return bool;
}

function getDataDir(fs) {
  if (fs instanceof Memory) {
    return "memory://";
  } else if (fs instanceof NodeFS) {
    return fs[0];
  } else if (fs instanceof IndexedDB) {
    return "idb://" + fs[0];
  } else if (fs instanceof OriginPrivateFS) {
    return "opfs-ahp://" + fs[0];
  }
}

export function query(connection, query, params) {
  return connection.query(query, params);
}

export function exec(connection, query) {
  return connection.exec(query);
}

export function getRows(results) {
  return results.rows;
}

export function getValues(row) {
  return row;
}

export function getErrorMessage(err) {
  return err.message;
}
