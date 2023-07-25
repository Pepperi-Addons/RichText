export declare const CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD = "OnClientRichTextLoad";
export declare type PepHorizontalAlignment = 'left' | 'center' | 'right';
export declare type PepSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
