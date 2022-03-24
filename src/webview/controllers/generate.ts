import { genTemplateModelByYapi as modelByYapi } from '../../genCode/genCodeByYapi';
import { genCodeByBlock, genCodeBySnippet } from '../../utils/generate';
import { IMessage } from '../type';

export const genTemplateModelByYapi = async (
  message: IMessage<{
    domain: string;
    id: string;
    token: string;
    typeName?: string;
    funName?: string;
  }>,
) => {
  const model = await modelByYapi(
    message.data.domain,
    message.data.id,
    message.data.token,
    message.data.typeName,
    message.data.funName,
  );
  return model;
};
export const genCodeByBlockMaterial = async (
  message: IMessage<{
    material: string;
    model: object;
    path: string;
    createPath: string[];
  }>,
) => {
  await genCodeByBlock(message.data);
  return '生成成功';
};
export const genCodeBySnippetMaterial = async (
  message: IMessage<{ model: any; template: string; name: string }>,
) => {
  await genCodeBySnippet(message.data);
  return '生成成功';
};
