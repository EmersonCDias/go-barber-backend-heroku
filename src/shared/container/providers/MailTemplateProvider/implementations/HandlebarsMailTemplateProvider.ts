import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplatesDTO from '../dtos/IParseMailTemplatesDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async mailParse({
    file,
    variables,
  }: IParseMailTemplatesDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
