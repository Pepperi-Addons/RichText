import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHostObject, RichText } from 'shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'page-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
   
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    set hostObject(value: IHostObject) {
        //this._configuration = value?.configuration;
        if(value?.configuration && Object.keys(value.configuration).length){
            this.configuration = value?.configuration;
        }
    }
    
    private _configuration: RichText;
    get configuration(): RichText {
        return this._configuration;
    }
    set configuration(conf: RichText){
        this._configuration = conf;
    }

    public htmlStr: SafeHtml;

    constructor(private translate: TranslateService, private sanitizer: DomSanitizer) {
    }

    ngOnInit(){
        this.hostEvents.emit({
            action: 'register-state-change',
            callback: this.registerStateChange.bind(this)
        });
        // check if on load flow customized to this block
        this.htmlStr = this.sanitizer.bypassSecurityTrustHtml(this.configuration?.RichText || '');
    }

    private registerStateChange(data: {state: any, configuration: any}) {
        if(!this.configuration && data?.configuration){
            this.configuration = data.configuration;
        }
        else if(data?.configuration){
            //this.configuration = data.configuration;
            this.mergeConfiguration(data.configuration);
        }

        this.htmlStr = this.sanitizer.bypassSecurityTrustHtml(this.configuration?.RichText || '');
    }

    private mergeConfiguration(newConfiguration){
        for (const prop in this.configuration) {
            // skip loop if the property dont exits on new object
            if (!newConfiguration.hasOwnProperty(prop)) continue;
            //update configuration with the object from new object
            this.configuration[prop] = newConfiguration[prop]; 
        }
    }

    ngOnChanges(e: any): void {
        this.htmlStr = this.sanitizer.bypassSecurityTrustHtml(this.configuration?.RichText || '');
    }
}
