import { Client, Context, IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { FlowObject, RunFlowBody } from '@pepperi-addons/cpi-node';

class RichTextCPIService {
    // public async getOptionsFromFlow(eventData: any): Promise<any> {
    //     const flowStr = eventData.Flow;
    //     const parameters = eventData.Parameters;
    //     const context = eventData.client.context;
    //     const flowData: FlowObject = flowStr?.length ? JSON.parse(Buffer.from(flowStr, 'base64').toString('utf8')) : {};
    //     if (flowData?.FlowKey?.length > 0) {
    //         const dynamicParamsData: any = {};
    //         if (flowData.FlowParams) {
    //             const dynamicParams: any = [];
    //             // Get all dynamic parameters to set their value on the data property later.
    //             const keysArr = Object.keys(flowData.FlowParams);
    //             for (let index = 0; index < keysArr.length; index++) {
    //                 if (flowData.FlowParams[keysArr[index]].Source === 'Dynamic') {
    //                     dynamicParams.push(flowData.FlowParams[keysArr[index]].Value);
    //                 }
    //             }
    //             // Set the dynamic parameters values on the dynamicParamsData property.
    //             for (let index = 0; index < dynamicParams.length; index++) {
    //                 dynamicParamsData[dynamicParams[index]] = parameters[dynamicParams[index]] || '';
    //             }
    //         }
    //         const flowToRun: RunFlowBody = { RunFlow: flowData, Data: dynamicParamsData};
    //         // TODO: Remove one of the context properties.
    //         if (context) {
    //             flowToRun['context'] = context;
    //             flowToRun['Context'] = context;
    //         }
    //         // Run the flow and return the options.
    //         const res = await pepperi.flows.run(flowToRun);
    //         return res;
    //     }
    //     else { return {}; }
    // }

    public async getOptionsFromFlow(flow: any, configuration: any, context: IContext | undefined): Promise<Array<{ Key: string, Title: string }>> {
        const res: any = { Options: [] };
        const flowData: FlowObject = flow ? JSON.parse(Buffer.from(flow, 'base64').toString('utf8')) : {};
        if (flowData?.FlowKey?.length > 0) {
            flowData.FlowParams['configuration'] = {Source: 'Dynamic', Value: 'configuration' };

            const dynamicParamsData: any = {};

            if (flowData?.FlowParams) {
                const dynamicParams: any = [];

                // Get all dynamic parameters to set their value on the data property later.
                const keysArr = Object.keys(flowData.FlowParams);
                for (let index = 0; index < keysArr.length; index++) {
                    const key = keysArr[index];
                    if (flowData.FlowParams[key].Source === 'Dynamic') {
                        dynamicParams.push(flowData.FlowParams[key].Value);
                    }
                }

                // Set the dynamic parameters values on the dynamicParamsData property.
                for (let index = 0; index < dynamicParams.length; index++) {
                    const param = dynamicParams[index];
                    dynamicParamsData[param] = configuration[param] || '';
                }
            }
            const flowToRun: RunFlowBody = {
                RunFlow: flowData,
                Data: dynamicParamsData,
                context: context
            };

            // Run the flow and return the options.
            const flowRes = await pepperi.flows.run(flowToRun);
            res.Options = flowRes || [];
        }
        return res.Options;
    }
}
export default RichTextCPIService;
