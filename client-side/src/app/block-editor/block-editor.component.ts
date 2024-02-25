import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { RichTextService } from 'src/services/rich-text.service';
import { Columns, IEditorHostObject, RichText } from 'shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FlowService } from 'src/services/flow.service';
import { Page, PageConfiguration } from '@pepperi-addons/papi-sdk';
import { PepButton } from '@pepperi-addons/ngx-lib/button';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {

    @Input()
    set hostObject(value: IEditorHostObject) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            // Override only if the configuration is not the same object
            if (JSON.stringify(this._configuration) !== JSON.stringify(value.configuration)) {
                this._configuration = value.configuration;
            }
            
            if(value.configurationSource && Object.keys(value.configuration).length > 0){
                // Override only if the configuration is not the same object
                if (JSON.stringify(this.configurationSource) !== JSON.stringify(value.configurationSource)) {
                    this.configurationSource = value.configurationSource;
                }
            }

            this.supportOldVersionBlock();
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
    inputTypes: Array<PepButton> = [];
    blockLoaded = false;
    flowHostObject;
    private _pageConfiguration: PageConfiguration;
    
    constructor(private translate: TranslateService,
                private sanitizer: DomSanitizer,
                private richTextService: RichTextService,
                private flowService: FlowService,
                private viewContainerRef: ViewContainerRef,
                private addonBlockLoaderService: PepAddonBlockLoaderService) {}

    async ngOnInit(): Promise<void> {
        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        this.richHtml = this.configuration.RichText || '';

        this.inputTypes = [
            { key: 'rich', value: this.translate.instant('INPUT_TYPE.RICH'), callback: (event: any) => this.onFieldChange('InputType',event) },
            { key: 'text', value: this.translate.instant('INPUT_TYPE.TEXT'), callback: (event: any) => this.onFieldChange('InputType',event) },
            { key: 'file', value: this.translate.instant('INPUT_TYPE.FILE'), callback: (event: any) => this.onFieldChange('InputType',event) }
        ]
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

    private supportOldVersionBlock(){
        //the old version don't have columns and new other prop
        if(!this.configurationSource?.Structure?.Columns?.Columns){
            this.configurationSource.Structure['Columns'] = new Columns();
        }
        if(!this._configuration?.Structure?.Columns?.Columns){
            this._configuration.Structure['Columns'] = new Columns();
        } 
        if(!this._configuration?.Structure?.InputType){
            this._configuration.Structure['InputType'] = 'rich';
        } 
         
    }

    onInputTypeChange(key, event){
        const value = event && event.source && event.source.key ? event.source.key : event && event.source && event.source.value ? event.source.value :  event;
        if(key.indexOf('.') > -1){
            let keyObj = key.split('.');
           // this.configuration.Slides[this.id][keyObj[0]][keyObj[1]] = value;
        }
        else{
           // this.configuration.Slides[this.id][key] = value;
        }

       // this.updateHostObjectField(`Slides[${this.id}].${key}`, value);
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

    onOpenAssetsDialog() {
            this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
                container: this.viewContainerRef,
                name: 'AssetPicker',
                hostObject: {
                    selectionType: 'single',
                    allowedAssetsTypes: 'documents',
                    inDialog: true
                },
                hostEventsCallback: (event) => { this.onHostEvents(event); }
            });

    }

    onHostEvents(event: any) {
        const self = this;
        var filetxt = '';
        var txtFile = new XMLHttpRequest();
        txtFile.open("GET", event.url, true);
        txtFile.onreadystatechange = function() {
        if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
            if (txtFile.status === 200) {  // Makes sure it's found the file.
                self.richHtml = self.configuration.RichText = txtFile.responseText; 
                
                self.updateHostObjectField('RichText', txtFile.responseText);
                
            //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
            //var customTextElement = document.getElementById('textHolder');
            //customTextElement.innerHTML = txtFile.responseText;
            }
        }
    }
    txtFile.send(null);
            this.hostEvents.emit(event);

            if (this.dialogRef) {
                this.dialogRef.close(null);
            }
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
