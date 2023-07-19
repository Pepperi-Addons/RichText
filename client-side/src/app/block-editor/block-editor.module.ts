import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockEditorComponent } from './index';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { config } from '../app.config';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepRichHtmlTextareaModule } from '@pepperi-addons/ngx-lib/rich-html-textarea';

@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        PepButtonModule,
        PepRichHtmlTextareaModule,
        PepTextareaModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    exports: [BlockEditorComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class BlockEditorModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
