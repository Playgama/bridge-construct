'use strict'
{
    const PLUGIN_CLASS = SDK.Plugins.PlaygamaBridge

    PLUGIN_CLASS.Type = class PlaygamaBridgeType extends SDK.ITypeBase {
        constructor(sdkPlugin, iObjectType) {
            super(sdkPlugin, iObjectType)
        }
    }
}
