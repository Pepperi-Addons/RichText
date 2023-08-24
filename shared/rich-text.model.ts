import { AddonData } from "@pepperi-addons/papi-sdk";
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
