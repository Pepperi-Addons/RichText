import { AddonData } from "@pepperi-addons/papi-sdk";
// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
export const CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD = 'OnClientRichTextLoad';
// **********************************************************************************************

export declare type PepHorizontalAlignment = 'left' | 'center' | 'right';
export declare type PepSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
