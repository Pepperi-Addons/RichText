import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHostObject, RichText, CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD } from 'shared';

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
        if(this._configuration?.OnLoadFlow?.length)
        {
             this.emitOnLoadFlow()
  
        }
        else{
            this.htmlStr = this.configuration?.RichText || '';
        }
    }

    ngOnChanges(e: any): void {
        this.htmlStr = this.configuration.RichText || '';
    }

    emitOnLoadFlow(): void{
        const self = this;
        try{
            const eventData = {
                detail: {
                    eventKey: CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD,
                    eventData: { Flow: this.configuration.OnLoadFlow, Parameters: {OnLoad: this.configuration} },
                    completion: (res: any) => {
                            if (res) {
                                self.configuration = res.configuration != '' ? res.configuration : self._configuration;
                                self.htmlStr = self.configuration.RichText || '';
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
}
