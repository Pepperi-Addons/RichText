import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { RichTextService } from 'src/services/rich-text.service';
import { RichText } from 'shared';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {

    @Input()
    set hostObject(value: any) {
        if (value && value.configuration && Object.keys(value.configuration).length > 0) {
            this._configuration = value.configuration  
        } else {
            if(this.blockLoaded){
                this.loadDefaultConfiguration();
            }
        }
    }

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _configuration: RichText;
    get configuration(): RichText {
        return this._configuration;
    }
    set configuration(conf: RichText){
        this._configuration = conf;
    }

    dialogRef: MatDialogRef<any>;
    public onLoadFlowName = undefined;
    richHtml = '';
    htmlText = '';
    blockLoaded = false;

    constructor(private translate: TranslateService,
                private viewContainerRef: ViewContainerRef,
                private richTextService: RichTextService,
                private addonBlockLoaderService: PepAddonBlockLoaderService) {}

    async ngOnInit(): Promise<void> {

        if (!this.configuration) {
            this.loadDefaultConfiguration();
        }

        this.richHtml = this.configuration.RichText || '';

        if(this.configuration.OnLoadFlow){
            const flow = JSON.parse(atob(this.configuration.OnLoadFlow));
            this.onLoadFlowName = await this.richTextService.getFlowName(flow.FlowKey) || undefined;
        }

        // block loaded must be the last line in onInit function
        this.blockLoaded = true;
    }

    ngOnChanges(e: any): void {
       
    }

    private loadDefaultConfiguration() {
        this._configuration = this.getDefaultHostObject();
        this.updateHostObject();
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
        this.onFieldChange('RichText',event);
    }

    private onClientRichTextLoad(){
        try{
            const eventData = {
                detail: {
                    eventKey: 'OnClientRichTextLoad',
                    eventData: {},
                    completion: (res: any) => {
                            if (res) {
                                this.configuration = res;
                            } else {
                                // Show default error.
                            }
                        }
                }
            };

            const customEvent = new CustomEvent('emit-event', eventData);
            window.dispatchEvent(customEvent);
        }
        catch(err){

        }
    }

    openFlowPickerDialog() {
        const flow = this.configuration.OnLoadFlow ? JSON.parse(atob(this.configuration.OnLoadFlow)) : null;
        let hostObj = {};
        
        if(flow){
            hostObj = { 
                runFlowData: { 
                    FlowKey: flow.FlowKey, 
                    FlowParams: flow.FlowParams 
                },
                fields: {
                    onLoad: {
                        Type: 'Object',
                    },
                    Test: {
                        Type: 'String'
                    }
                }
            };
        } else{
            hostObj = { 
                fields: {
                        onLoad: {
                            Type: 'Object',
                        },
                        Test: {
                            Type: 'String'
                        }
                    },
                }
        }
        
        this.dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'FlowPicker',
            size: 'large',
            hostObject: hostObj,
            hostEventsCallback: async (event) => {
                if (event.action === 'on-done') {
                                const base64Flow = btoa(JSON.stringify(event.data));
                                this.configuration.OnLoadFlow = event.data?.FlowKey !== '' ? base64Flow : null;
                                this.updateHostObject();
                                this.dialogRef.close();
                                this.onLoadFlowName = this.configuration.OnLoadFlow ?  await this.richTextService.getFlowName(event.data?.FlowKey) : undefined;
                } else if (event.action === 'on-cancel') {
                                this.dialogRef.close();
                }
            }
        });
    }
}
