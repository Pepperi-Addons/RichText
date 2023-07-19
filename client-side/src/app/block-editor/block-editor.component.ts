import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { RichText } from 'shared';

@Component({
    selector: 'page-block-editor',
    templateUrl: './block-editor.component.html',
    styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {

    @Input()
    set hostObject(value: any) {
        this._configuration = value?.configuration;
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

    constructor(private translate: TranslateService,
                private viewContainerRef: ViewContainerRef,
                private addonBlockLoaderService: PepAddonBlockLoaderService) {
        
                this.richHtml =
            "<h1><u>Rich Text Value Example</u></h1><h2><em style=' color: rgb(147, 200, 14);'>Pepperi Rich Text Value </em><u style='color: rgb(0, 102, 204);'>Example</u></h2><ol><li><strong><u>Pepperi Rich Text Value Example</u></strong></li><li>Pepperi Rich text [value] example</li><li>Pepperi Rich text [value] example</li><li>Pepperi Rich text [value] example</li><li>Pepperi Rich text [value] example</li></ol>";
   
    }

    ngOnInit(): void {
        //this.htmlText = this.stripHtml(this.richHtml);
    }

    ngOnChanges(e: any): void {
       
    }

    richTextChanged(event){
        //TODO - NEED TO UPDATE HOST OBJECT
        //this.htmlText = this.stripHtml(event);
    }

    // stripHtml(html) {
    //     var textarea = document.createElement("textarea");
    //     textarea.innerHTML = html;
    //     var temporalDivElement = document.createElement("p");
    //     temporalDivElement.innerHTML = textarea.value;
    //     return temporalDivElement.textContent || temporalDivElement.innerText || "";
    // }

    openFlowPickerDialog() {
        //const flow = this.configuration.SlideshowConfig.OnLoadFlow ? JSON.parse(atob(this.configuration.SlideshowConfig.OnLoadFlow)) : null;
        let hostObj = {};
        const flow = {
            FlowKey: null,
            FlowParams: null
        };
        
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
                                //this.configuration.SlideshowConfig.OnLoadFlow = event.data?.FlowKey !== '' ? base64Flow : null;
                                //this.updateHostObject();
                                this.dialogRef.close();
                                //this.onLoadFlowName = this.configuration.SlideshowConfig.OnLoadFlow ?  await this.slideshowService.getFlowName(event.data?.FlowKey) : undefined;
                } else if (event.action === 'on-cancel') {
                                this.dialogRef.close();
                }
            }
        });
    }
}
