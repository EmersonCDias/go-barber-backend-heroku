import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class MailTemplateProviderMOCK implements IMailTemplateProvider {
  public async mailParse(): Promise<string> {
    return 'Mail Template';
  }
}
