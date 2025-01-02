import axios from 'axios';
import dirTree from 'directory-tree';
import ejs from 'ejs';
import fsExtra from 'fs-extra';
import execa from 'execa';
import glob from 'glob';
import prettier from 'prettier';
import jsonSchemaToTypescript from 'json-schema-to-typescript';
import typescriptJsonSchema from 'typescript-json-schema';

const stripComments = require('strip-comments');
const stripJsonComments = require('strip-json-comments');
const generateSchema = require('generate-schema');
const tar = require('tar');

export const getInnerLibs = () => ({
  axios,
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
