import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHostObject, RichText } from 'shared';

@Component({
    selector: 'page-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
   
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    set hostObject(value: IHostObject) {
        this._configuration = value?.configuration;
    }
    
    private _configuration: RichText; // = this.getDefaultHostObject();
    get configuration(): RichText {
        return this._configuration;
    }
    set configuration(conf: RichText){
        this._configuration = conf;
    }

    public htmlStr = '';

    constructor(private translate: TranslateService) {
    }

    ngOnInit(){
        // check if on load flow customized to this block
        this.htmlStr = this.configuration?.RichText || '';
    }

    ngOnChanges(e: any): void {
        this.htmlStr = this.configuration.RichText || '';
    }
}
