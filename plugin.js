'use strict'

const SDK = globalThis.SDK
{
    const PLUGIN_ID = 'PlaygamaBridge'
    const PLUGIN_CATEGORY = 'platform-specific'

    const PLUGIN_CLASS = (SDK.Plugins.PlaygamaBridge = class PlaygamaBridgePlugin extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID)

            SDK.Lang.PushContext('plugins.' + PLUGIN_ID.toLowerCase())
            this._info.SetName(lang('.name'))
            this._info.SetDescription(lang('.description'))
            this._info.SetCategory(PLUGIN_CATEGORY)
            this._info.SetAuthor(lang('.author'))
            this._info.SetHelpUrl(lang('.help-url'))
            this._info.SetIsSingleGlobal(true)
            this._info.SetSupportedRuntimes(['c3'])

            SDK.Lang.PushContext('.properties')
            this._info.SetProperties([]);

            SDK.Lang.PopContext()
            SDK.Lang.PopContext()
        }
    })

    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS)
}
