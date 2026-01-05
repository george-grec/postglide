import { Some } from "../gleam_stdlib/gleam/option.mjs";
import { Memory, NodeFS, IndexedDB, OriginPrivateFS } from "./postglide.mjs";
import { PGlite } from "@electric-sql/pglite";
import { live } from '@electric-sql/pglite/live';
import { vector } from '@electric-sql/pglite/vector';
import { amcheck } from '@electric-sql/pglite/contrib/amcheck';
import { auto_explain } from '@electric-sql/pglite/contrib/auto_explain';
import { bloom } from '@electric-sql/pglite/contrib/bloom';
import { btree_gin } from '@electric-sql/pglite/contrib/btree_gin';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { citext } from '@electric-sql/pglite/contrib/citext';
import { cube } from '@electric-sql/pglite/contrib/cube';
import { dict_int } from '@electric-sql/pglite/contrib/dict_int';
import { dict_xsyn } from '@electric-sql/pglite/contrib/dict_xsyn';
import { earthdistance } from '@electric-sql/pglite/contrib/earthdistance';
import { file_fdw } from '@electric-sql/pglite/contrib/file_fdw';
import { fuzzystrmatch } from '@electric-sql/pglite/contrib/fuzzystrmatch';
import { hstore } from '@electric-sql/pglite/contrib/hstore';
import { intarray } from '@electric-sql/pglite/contrib/intarray';
import { isn } from '@electric-sql/pglite/contrib/isn';
import { lo } from '@electric-sql/pglite/contrib/lo';
import { ltree } from '@electric-sql/pglite/contrib/ltree';
import { pageinspect } from '@electric-sql/pglite/contrib/pageinspect';
import { pg_buffercache } from '@electric-sql/pglite/contrib/pg_buffercache';
import { pg_freespacemap } from '@electric-sql/pglite/contrib/pg_freespacemap';
import { pg_ivm } from '@electric-sql/pglite/pg_ivm';
import { pg_surgery } from '@electric-sql/pglite/contrib/pg_surgery';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pg_uuidv7 } from '@electric-sql/pglite/pg_uuidv7';
import { pg_visibility } from '@electric-sql/pglite/contrib/pg_visibility';
import { pg_walinspect } from '@electric-sql/pglite/contrib/pg_walinspect';
import { pgtap } from '@electric-sql/pglite/pgtap';
import { seg } from '@electric-sql/pglite/contrib/seg';
import { tablefunc } from '@electric-sql/pglite/contrib/tablefunc';
import { tcn } from '@electric-sql/pglite/contrib/tcn';
import { tsm_system_rows } from '@electric-sql/pglite/contrib/tsm_system_rows';
import { tsm_system_time } from '@electric-sql/pglite/contrib/tsm_system_time';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';

export const EXTENSIONS = {
    live, vector, amcheck, auto_explain, bloom, btree_gin, btree_gist, citext,
    cube, dict_int, dict_xsyn, earthdistance, file_fdw, fuzzystrmatch, hstore,
    intarray, isn, lo, ltree, pageinspect, pg_buffercache, pg_freespacemap, 
    pg_ivm, pg_surgery, pg_trgm, pg_uuidv7, pg_visibility, pg_walinspect,
    pgtap, seg, tablefunc, tcn, tsm_system_rows, tsm_system_time, unaccent,
    uuid_ossp
}

export function create(config) {
  return PGlite.create({
    ...config,
    extensions: getExtensionsObject(config.extensions),
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

function getExtensionsObject(extensionsString) { 
  return Object.fromEntries(
      Object.entries(EXTENSIONS)
        .filter(([extensionName, _]) => extensionsString.includes(extensionName))
  );
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
