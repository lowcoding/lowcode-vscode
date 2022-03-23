import * as quicktypeCore from 'quicktype-core';

export const jsonToTs = async (typeName: string, jsonString: string) => {
  const jsonInput = quicktypeCore.jsonInputForTargetLanguage('typescript');
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new quicktypeCore.InputData();
  inputData.addInput(jsonInput);

  const result = await quicktypeCore.quicktype({
    inputData,
    lang: 'typescript',
    fixedTopLevels: true,
    rendererOptions: {
      'just-types': 'true',
    },
    inferMaps: false,
    inferEnums: false,
    inferDateTimes: false,
    inferIntegerStrings: false,
  });
  return result.lines.join('\n');
};
