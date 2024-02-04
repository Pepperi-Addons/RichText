import { AddonData, Page } from "@pepperi-addons/papi-sdk";

export declare type InputType = 'rich' | 'text' | 'file';
export declare type PepHorizontalAlignment = 'left' | 'center' | 'right';
export declare type PepSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';



export class Columns {
    Columns: string = '1';
    ColumnGap: PepSizeType = 'xs';  
}

export interface IHostObject {
    configuration: RichText;
    // pageConfiguration?: PageConfiguration;
    // pageType?: any;
    // context?: any;
    // filter?: any;
}

export class Structure {
    FillHeight: boolean = false;
    Height: number = 16;
    MaxWidth: number = 100;
    padding: number = 0;
    InnerPadding: PepSizeType = "md";
    Alignment: Alignment = new Alignment();
    Columns: Columns = new Columns();
    InputType: InputType = 'rich';

}

export class Alignment {
    Horizontal: PepHorizontalAlignment = 'left';
    Vertical: 'start' | 'middle' | 'end' = 'start';
}

export class RichText  {
    OnLoadFlow: any = null;
    RichText: string = '';
    Structure: Structure = new Structure();
}

export interface IEditorHostObject {
    state: any;
    configuration: RichText;
    configurationSource: RichText;
    pageConfiguration: any;
    page: Page
}
