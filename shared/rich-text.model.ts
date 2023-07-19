import { AddonData } from "@pepperi-addons/papi-sdk";

// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
export const CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD = 'OnClientRichTextLoad';
// **********************************************************************************************

export class RichText  {
    OnLoadFlow: any;
    RichText: string;

    constructor(flow = null, html = ''){
        this.OnLoadFlow = flow;
        this.RichText = html;
    }
}
