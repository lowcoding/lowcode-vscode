import alert from '../controllers/alert';
import material from '../controllers/material';
import command from '../controllers/command';
import * as scaffold from '../controllers/scaffold';
import * as directory from '../controllers/directory';
import * as yapi from '../controllers/yapi';
import * as generate from '../controllers/generate';
import * as snippet from '../controllers/snippet';
import * as block from '../controllers/block';
import * as json from '../controllers/json';
import * as config from '../controllers/config';
import * as intelliSense from '../controllers/intelliSense';
import * as reqeust from '../controllers/request';
import * as openai from '../controllers/openai';
import * as task from '../controllers/task';

export const routes: Record<string, any> = {
  alert: alert.alert,

  downloadMaterials: material.downloadMaterials,
  getLocalMaterials: material.getLocalMaterials,
  saveDownloadMaterials: material.saveDownloadMaterials,

  executeVscodeCommand: command.executeVscodeCommand,

  getScaffolds: scaffold.getScaffolds,
  downloadScaffold: scaffold.downloadScaffold,
  selectDirectory: scaffold.selectDirectory,
  createProject: scaffold.createProject,
  useLocalScaffold: scaffold.useLocalScaffold,

  getDirectoryTree: directory.getDirectoryTree,

  getYapiDomain: yapi.getYapiDomain,
  getYapiProjects: yapi.getYapiProjects,

  genTemplateModelByYapi: generate.genTemplateModelByYapi,
  genCodeByBlockMaterial: generate.genCodeByBlockMaterial,
  genCodeBySnippetMaterial: generate.genCodeBySnippetMaterial,

  insertSnippet: snippet.insertSnippet,
  addSnippets: snippet.addSnippets,

  createBlockTemplate: block.createBlock,

  jsonToTs: json.jsonToTs,

  getPluginConfig: config.getPluginConfig,
  savePluginConfig: config.savePluginConfig,

  refreshIntelliSense: intelliSense.refreshIntelliSense,
  request: reqeust.axiosRequest,

  askChatGPT: openai.askChatGPT,
  insertCode: openai.insertCode,
  exportChatGPTContent: openai.exportChatGPTContent,

  getTask: task.getTask,
};
