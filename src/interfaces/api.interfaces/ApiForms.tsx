export interface apiForms {
    '@context': string;
    '@id': string;
    '@type': string;
    totalItems: number;
    member: Member[];
    view: View;
    search: Search;
  }
  export interface Search {
    '@type': string;
    template: string;
    variableRepresentation: string;
    mapping: Mapping[];
  }
  export interface Mapping {
    '@type': string;
    variable: string;
    property: string;
    required: boolean;
  }
  export interface View {
    '@id': string;
    '@type': string;
  }
  export  interface Member {
    '@id': string;
    '@type': string;
    id: number;
    submitButtonText: string;
    submitButtonClassName: string;
    saveUrl: string;
    title: string;
    description: string;
    fields: string[];
    groupfields: Groupfield[];
    code: string;
  }
  export interface Groupfield {
    groupName: string;
    subtitle: string;
    message: string;
  }