import axios from 'axios';
import * as copyPaste from 'copy-paste';
import * as dirTree from 'directory-tree';
import * as ejs from 'ejs';
import * as fsExtra from 'fs-extra';
import * as execa from 'execa';
import * as glob from 'glob';
import * as prettier from 'prettier';
import * as jsonSchemaToTypescript from 'json-schema-to-typescript';
import * as typescriptJsonSchema from 'typescript-json-schema';

const stripComments = require('strip-comments');
const stripJsonComments = require('strip-json-comments');
const generateSchema = require('generate-schema');
const tar = require('tar');

export const getInnerLibs = () => ({
  axios,
  copyPaste,
  dirTree,
  ejs,
  fsExtra,
  execa,
  glob,
  prettier,
  stripComments,
  stripJsonComments,
  generateSchema,
  jsonSchemaToTypescript,
  typescriptJsonSchema,
  tar,
});
