import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class RelationsService {

    papiClient: PapiClient
    bundleFileName = '';

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        this.bundleFileName = `file_${this.client.AddonUUID}`;
    }

    // For page block template
    private async upsertRelation(relation): Promise<Relation> {
        return await this.papiClient.addons.data.relations.upsert(relation);
    }

    private getCommonRelationProperties(
        relationName: 'SettingsBlock' | 'PageBlock' | 'AddonBlock',
        blockRelationName: string,
        blockRelationDescription: string,
        blockName: string
    ): Relation {
        return {
            RelationName: relationName,
            Name: blockRelationName,
            Description: blockRelationDescription,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
            ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
            ElementsModule: 'WebComponents',
            ElementName: `${blockName.toLocaleLowerCase()}-element-${this.client.AddonUUID}`,
        };
    }

    private async upsertSettingsRelation(blockRelationSlugName: string, blockRelationGroupName: string, blockRelationName: string, blockRelationDescription: string) {
        const blockName = 'Settings';

        const blockRelation: Relation = this.getCommonRelationProperties(
            'SettingsBlock',
            blockRelationName,
            blockRelationDescription,
            blockName);

        blockRelation['SlugName'] = blockRelationSlugName;
        blockRelation['GroupName'] = blockRelationGroupName;

        return await this.upsertRelation(blockRelation);
    }

    private async upsertBlockRelation(): Promise<any> {
            const blockRelationName = 'RichText';
            const blockName = 'Block';
            const blockRelation: Relation = {
                RelationName: 'PageBlock',
                Name: blockRelationName,
                Description: `Rich text block`,
                Type: "NgComponent",
                SubType: "NG14",
                AddonUUID: this.client.AddonUUID,
                AddonRelativeURL: this.bundleFileName,
                ComponentName: `${blockName}Component`, // This is should be the block component name (from the client-side)
                ModuleName: `${blockName}Module`, // This is should be the block module name (from the client-side)
                ElementsModule: 'WebComponents',
                ElementName: `${blockName.toLocaleLowerCase()}-element-${this.client.AddonUUID}`,
                EditorComponentName: `${blockName}EditorComponent`, // This is should be the block editor component name (from the client-side)
                EditorModuleName: `${blockName}EditorModule`, // This is should be the block editor module name (from the client-side)}
                EditorElementName: `${blockName.toLocaleLowerCase()}-editor-element-${this.client.AddonUUID}`,
                BlockLoadEndpoint: "/addon-cpi/on_block_load"
        }
        return await this.upsertRelation(blockRelation);
    }

    async upsertRelations(){
       await this.upsertBlockRelation();
    }
}
