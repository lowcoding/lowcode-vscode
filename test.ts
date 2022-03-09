import * as os from 'os';
import * as copyPaste from 'copy-paste';
import * as quicktypeCore from 'quicktype-core';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import * as tsj from 'ts-json-schema-generator';
import { Config } from 'ts-json-schema-generator';
import * as TJS from 'typescript-json-schema';
import { resolve } from 'path';

const tempDir = path.join(os.homedir(), '.lowcode/temp');
const filePath = path.join(tempDir, 'ts.ts');
if (!fs.existsSync(filePath)) {
  fs.createFileSync(filePath);
}
const type = `{
	code: number;
	message: string;
	result: {
	  houses: {
		recordTime: string;
		status: 1 | 2;
		houseName: string;
		houseCode: string;
		startTime: string;
		endTime: string;
		company: string;
		foreman: string;
		mobile: string;
		WorkerApplication: {
		  name: string;
		  startTime: string;
		  endTime: string;
		  typeName: string;
		  typeId: number;
		  workerStatus: 1 | 2;
		  passStatus: 1 | 2 | 3 | 4 | 5;
		}[];
		WorkerApplicationNumber: number;
		validity: number;
		reasonType: number;
		reasonContent: string;
		inspectionStatus: number;
		presentWorkerNumber: number;
		recordId: string;
		// 前端用
		imgStatus?: string;
	  }[];
	};
  }`;
fs.writeFileSync(filePath, `export interface TempType ${type}`, {
  encoding: 'utf-8',
});

//   const config: Config = {
//     path: filePath,
//     topRef: true,
//     expose: 'all',
//     jsDoc: 'extended',
//     type: '*',
//   };

//   const schema = tsj.createGenerator(config).createSchema(config.type) as any;
// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};
const program = TJS.getProgramFromFiles([resolve(filePath)], compilerOptions);
const schema = TJS.generateSchema(program, 'TempType', settings) as any;
console.log(JSON.stringify(schema, null, 4));
