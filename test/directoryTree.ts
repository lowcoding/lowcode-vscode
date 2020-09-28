import * as dirTree from 'directory-tree';
import { jsonToTs } from '../src/lib';
const filteredTree = dirTree(process.cwd(), { exclude: /node_modules|\.umi/ });
console.log(JSON.stringify(filteredTree, null, 4));
