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
            this._configuration = value.configuration;
            if(value.configurationSource && Object.keys(value.configuration).length > 0){
                this.configurationSource = value.configurationSource;
            }
            //prepare the flow host hobject
            this.flowHostObject = this.flowService.prepareFlowHostObject(this.configuration?.OnLoadFlow || null); 
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }

        this.initPageConfiguration(value?.pageConfiguration);
        this._page = value?.page;
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);  
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _page: Page;
    get page(): Page {
        return this._page;
    }
    
    private defaultPageConfiguration: PageConfiguration = { "Parameters": []};
    public configurationSource: RichText;
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
            this.configuration.Structure[keyObj[0]][keyObj[1]] = value;
            //this.updateHostObject();
            this.updateHostObjectField(`Structure.${key}`, value);
            //this.configuration[keyObj[0]][keyObj[1]] = value;
        }
        else{
            switch(key){
                case 'RichText':
                    this.configuration[key] = value;
                    this.updateHostObjectField(`${key}`, value);
                    break;
                default:
                    this.configuration.Structure[key] = value;
                    this.updateHostObjectField(`Structure.${key}`, value);
                    break;
            }
        }
        
       // this.updateHostObjectField(`Structure.${key}`, value);

    }

    richTextChanged(event){
        this.richHtml = event || '';
        this.onFieldChange('RichText',event);
    }


    /***************   FLOW AND CONSUMER PARAMETERS START   ********************************/
    onFlowChange(flowData: any) {
        const base64Flow = btoa(JSON.stringify(flowData));
        this.configuration.OnLoadFlow = base64Flow;
        this.updateHostObject();
        this.updatePageConfigurationObject();
    }

    private initPageConfiguration(value: PageConfiguration = null) {
        this._pageConfiguration = value || JSON.parse(JSON.stringify(this.defaultPageConfiguration));
    }

    private updatePageConfigurationObject() {
        this.initPageConfiguration();
    
        // Get the consume parameters keys from the filters.
        const consumeParametersKeys = this.getConsumeParametersKeys();
        this.addParametersToPageConfiguration(consumeParametersKeys, false, true);
        
        // After adding the params to the page configuration need to recalculate the page parameters.
        this.flowService.recalculateEditorData(this._page, this._pageConfiguration);

        this.emitSetPageConfiguration();
    }

    private getConsumeParametersKeys(): Map<string, string> {
        const parametersKeys = new Map<string, string>();

        // Move on all load flows
        const onLoadFlow = this.configuration?.OnLoadFlow || null;
        if (onLoadFlow) {
            let flowParams = JSON.parse(atob(onLoadFlow)).FlowParams;
            Object.keys(flowParams).forEach(key => {
                const param = flowParams[key];
                if (param.Source === 'Dynamic') {
                    parametersKeys.set(param.Value, param.Value);
                }
            });
        }

        return parametersKeys;
    }

    private addParametersToPageConfiguration(paramsMap: Map<string, string>, isProduce: boolean, isConsume: boolean) {
        const params = Array.from(paramsMap.values());

        // Add the parameters to page configuration.
        for (let index = 0; index < params.length; index++) {
            const parameterKey = params[index];
            if(parameterKey !== 'configuration'){
                const paramIndex = this._pageConfiguration.Parameters.findIndex(param => param.Key === parameterKey);

                // If the parameter exist, update the consume/produce.
                if (paramIndex >= 0) {
                    this._pageConfiguration.Parameters[paramIndex].Consume = this._pageConfiguration.Parameters[paramIndex].Consume || isConsume;
                    this._pageConfiguration.Parameters[paramIndex].Produce = this._pageConfiguration.Parameters[paramIndex].Produce || isProduce;
                } else {
                    // Add the parameter only if not exist.
                    this._pageConfiguration.Parameters.push({
                        Key: parameterKey,
                        Type: 'String',
                        Consume: isConsume,
                        Produce: isProduce
                    });
                }
            }
        }
    }

    private emitSetPageConfiguration() {
        this.hostEvents.emit({
            action: 'set-page-configuration',
            pageConfiguration: this._pageConfiguration
        });
    }
    /***************   FLOW AND CONSUMER PARAMETERS END   ********************************/
}
