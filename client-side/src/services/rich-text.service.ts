import jwt from 'jwt-decode';
import { Injectable } from "@angular/core";
import { PepColorService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';
import { config } from '../app/app.config';

@Injectable({
    providedIn: 'root',
})
export class RichTextService {
    
    papiClient: PapiClient
    accessToken = '';
    parsedToken: any
    papiBaseURL = ''

    constructor(private pepColorService: PepColorService,
                public session: PepSessionService,
                private httpService: PepHttpService) {
                    const accessToken = this.session.getIdpToken();
                    this.parsedToken = jwt(accessToken);
                    this.papiBaseURL = this.parsedToken["pepperi.baseurl"];

                    this.papiClient = new PapiClient({
                        baseURL: this.papiBaseURL,
                        token: this.session.getIdpToken(),
                        addonUUID: config.AddonUUID,
                        suppressLogging:true
                        //addonSecretKey: client.AddonSecretKey,
                        //actionUUID: client.AddonUUID
                    });
                }
    
     async getFlowName(flowKey){
        let flowName = undefined;
        try{
            const flow = (await this.papiClient.userDefinedFlows.search({ KeyList: [flowKey], Fields: ['Key', 'Name']})).Objects;
            flowName = flow?.length ? flow[0].Name : undefined;
        }
        catch(err){
            flowName = undefined;
        }
        finally{
            return flowName;
        }
     }
}
