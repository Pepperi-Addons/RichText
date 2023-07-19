"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichText = exports.CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD = void 0;
// **********************************************************************************************
//                          Client & User events const
// **********************************************************************************************
exports.CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD = 'OnClientRichTextLoad';
// **********************************************************************************************
class RichText {
    constructor(flow = null, html = '') {
        this.OnLoadFlow = flow;
        this.RichText = html;
    }
}
exports.RichText = RichText;
//# sourceMappingURL=rich-text.model.js.map