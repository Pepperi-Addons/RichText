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
    const configuration = req?.body?.Configuration;
    let configurationRes = configuration;
    const state = req.body.State;
    // check if flow configured to on load --> run flow (instaed of onload event)
    if (configuration?.OnLoadFlow){
        try {
            const cpiService = new RichTextCPIService();
            //CALL TO FLOWS AND SET CONFIGURATION
            const result: any = await cpiService.getOptionsFromFlow(configuration.OnLoadFlow || [], state, req.context, configuration);
            configurationRes = result?.configuration || configuration;
        }
        catch (err){
            configurationRes = configuration;
        }
    }
    res.json({
        State: state,
        Configuration: configurationRes,
    });
});

router.post('/on_block_state_change', async (req, res) => {
    const state = req.body.State || {};
    const changes = req.body.Changes || {};
    //const configuration = req.body.Configuration;

    const mergeState = {...state, ...changes};
    res.json({
        State: mergeState,
        Configuration: changes,
    });
});
