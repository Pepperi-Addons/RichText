import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { RichTextService } from 'src/services/rich-text.service';
import { IEditorHostObject, RichText } from 'shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {

    @Input()
    set hostObject(value: IEditorHostObject) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            this._configuration = value.configuration ;
            //prepare the flow host hobject
            this.flowHostObject = this.flowService.prepareFlowHostObject(this.configuration?.OnLoadFlow || null); 
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }

        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);  
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _page: Page;
    get page(): Page {
        return this._page;
    }
    
    private _configuration: RichText;
    get configuration(): RichText {
        return this._configuration;
    }
    set configuration(conf: RichText){
        this._configuration = conf;
    }

    dialogRef: MatDialogRef<any>;

    richHtml: SafeHtml;
    htmlText = '';
    blockLoaded = false;
    flowHostObject;
    private _pageConfiguration: PageConfiguration;
    
    constructor(private translate: TranslateService,
                private sanitizer: DomSanitizer,
                private richTextService: RichTextService,
                private flowService: FlowService) {}

    async ngOnInit(): Promise<void> {

        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        this.richHtml = this.configuration.RichText || '';
        //this.richHtml = this.sanitizer.bypassSecurityTrustHtml(this.configuration?.RichText || '');
        // block loaded must be the last line in onInit function
        this.blockLoaded = true;
    }

    ngOnChanges(e: any): void {
       
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
        //prepare the flow host hobject
        this.flowHostObject = this.flowService.prepareFlowHostObject(this.configuration?.OnLoadFlow || null); 
    }

    private getDefaultHostObject(): RichText {
        return  new RichText;
    }

    private updateHostObject() { 
        this.hostEvents.emit({
            action: 'set-configuration',
            configuration: this.configuration
        });
    }

    private updateHostObjectField(fieldKey: string, value: any) {
        this.hostEvents.emit({
            action: 'set-configuration-field',
            key: fieldKey, 
            value: value
        });
    }

    onFieldChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
            this.configuration[keyObj[0]][keyObj[1]] = value;
        }
        else{
            this.configuration[key] = value;
        }
  
        this.updateHostObjectField(`${key}`, value);
    }

    richTextChanged(event){
        this.richHtml = event || '';
        this.onFieldChange('RichText',event);
    }

    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.OnLoadFlow = base64Flow;
        this.updateHostObject();
    }
}
