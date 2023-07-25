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
        this.htmlStr = this.configuration.RichText || '';
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

    async ngOnInit(): Promise<void> {
        // check if on load flow customized to this block
        if(this._configuration?.OnLoadFlow?.length)
        {
            //await this.emitOnLoadFlow();
            this.configuration = await this.emitOnLoadFlow();
        }

        this.htmlStr = this.configuration?.RichText || '';
    }

    ngOnChanges(e: any): void {
 
    }

    private emitOnLoadFlow(){
        let retObj = this.configuration;
        try{
            const eventData = {
                detail: {
                    eventKey: CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD,
                    eventData: { Flow: this.configuration.OnLoadFlow, Parameters: {OnLoad: this.configuration} },
                    completion: (res: RichText) => {
                            if (res) {
                                retObj =  res;
                            } else {
                                // Show default error.
                              
                            }
                    },
                    finally(){
                        return retObj;
                    }
                }
            };
       
            const customEvent = new CustomEvent('emit-event', eventData);
            window.dispatchEvent(customEvent);
        }
        catch(err){
            return retObj;
        }
    }
}
