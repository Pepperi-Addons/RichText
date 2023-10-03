import '@pepperi-addons/cpi-node'
import RichTextCPIService from './rich-text-cpi.service';
import { IContextWithData } from '@pepperi-addons/cpi-node/build/cpi-side/events';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})

router.post('/on_block_load', async (req, res) => {
    let configuration = req?.body?.Configuration;
    const state = req.body.State;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.OnLoadFlow){
        const cpiService = new RichTextCPIService();
        //CALL TO FLOWS AND SET CONFIGURATION
        const result: any = await cpiService.getOptionsFromFlow(configuration.OnLoadFlow || [], state, req.context, configuration);
        configuration = result?.configuration || configuration;
    }
    
    res.json({Configuration: configuration});
});
