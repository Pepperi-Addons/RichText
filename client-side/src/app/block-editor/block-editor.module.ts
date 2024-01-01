import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { BlockEditorComponent } from './index';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { config } from '../app.config';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepRichHtmlTextareaModule } from '@pepperi-addons/ngx-lib/rich-html-textarea';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepSliderModule } from '@pepperi-addons/ngx-lib/slider';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepFieldTitleModule } from '@pepperi-addons/ngx-lib/field-title';
import { PepFlowPickerButtonModule } from '@pepperi-addons/ngx-composite-lib/flow-picker-button';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
import { FlowService } from '../../services/flow.service';
@NgModule({
    declarations: [BlockEditorComponent],
    imports: [
        CommonModule,
        PepButtonModule,
        PepTextboxModule,
        PepFlowPickerButtonModule,
        PepFieldTitleModule,
        PepNgxCompositeLibModule,
        PepGroupButtonsSettingsModule,
        PepRichHtmlTextareaModule,
        PepTextareaModule,
        PepCheckboxModule,
        PepSliderModule,
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
        FlowService
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
