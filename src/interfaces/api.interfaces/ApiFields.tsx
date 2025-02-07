export interface apiFiels {
    '@context': string;
    '@id': string;
    '@type': string;
    id: number;
    type: string;
    name: string;
    descripcion?: string;
    label: string;
    placeholder: string;
    required: boolean;
    options: any[];
    getOptionsUrl?:string;
    formConfig: string;
    groupName?: string;
    father?: string;
    ifValueRender?: number[],
    valueBlock?: string,
    fatherValue?: number,

  }