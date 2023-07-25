import '@pepperi-addons/cpi-node'
import { CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD } from 'shared';
import RichTextCPIService from './rich-text-cpi.service';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
})

  // Handle on application header load
  pepperi.events.intercept(CLIENT_ACTION_ON_CLIENT_APP_RICHTEXT_LOAD as any, {}, async (data): Promise<any> => {
    const cpiService = new RichTextCPIService();
    const res = await cpiService.getOptionsFromFlow(data );
    
    return res;
});
