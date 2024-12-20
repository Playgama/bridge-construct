'use strict'

const C3 = globalThis.C3

{
    C3.Plugins.PlaygamaBridge.Type = class PlaygamaBridgeType extends globalThis.ISDKObjectTypeBase {
        constructor(objectClass) {
            super(objectClass)
        }

        _onCreate() { }
    }
}
