import IParseMailTemplatesDTO from '../dtos/IParseMailTemplatesDTO';

export default interface IMailTemplateProvider {
  mailParse(data: IParseMailTemplatesDTO): Promise<string>;
}
