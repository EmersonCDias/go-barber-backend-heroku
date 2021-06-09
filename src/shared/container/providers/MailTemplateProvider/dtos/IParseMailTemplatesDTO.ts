interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplatesDTO {
  file: string;
  variables: ITemplateVariables;
}
