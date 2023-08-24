"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichText = exports.Alignment = exports.Structure = void 0;
class Structure {
    constructor() {
        this.FillHeight = false;
        this.Height = 16;
        this.MaxWidth = 100;
        this.padding = 0;
        this.InnerPadding = "md";
        this.Alignment = new Alignment();
    }
}
exports.Structure = Structure;
class Alignment {
    constructor() {
        this.Horizontal = 'left';
        this.Vertical = 'start';
    }
}
exports.Alignment = Alignment;
class RichText {
    constructor() {
        this.OnLoadFlow = null;
        this.RichText = '';
        this.Structure = new Structure();
    }
}
exports.RichText = RichText;
//# sourceMappingURL=rich-text.model.js.map