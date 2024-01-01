import { Page } from "@pepperi-addons/papi-sdk";
export declare type PepHorizontalAlignment = 'left' | 'center' | 'right';
export declare type PepSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export declare class Columns {
    Columns: string;
    ColumnGap: PepSizeType;
}
export interface IHostObject {
    configuration: RichText;
}
export declare class Structure {
    FillHeight: boolean;
    Height: number;
    MaxWidth: number;
    padding: number;
    InnerPadding: PepSizeType;
    Alignment: Alignment;
    Columns: Columns;
}
export declare class Alignment {
    Horizontal: PepHorizontalAlignment;
    Vertical: 'start' | 'middle' | 'end';
}
export declare class RichText {
    OnLoadFlow: any;
    RichText: string;
    Structure: Structure;
}
export interface IEditorHostObject {
    state: any;
    configuration: RichText;
    configurationSource: RichText;
    pageConfiguration: any;
    page: Page;
}
