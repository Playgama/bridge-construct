'use strict'

const C3 = globalThis.C3

{
    C3.Plugins.PlaygamaBridge = class PlaygamaBridgePlugin extends globalThis.ISDKPluginBase {
        constructor() {
            super()
        }
    }
}
