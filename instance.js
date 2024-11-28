'use strict'
{
    const PLUGIN_CLASS = SDK.Plugins.PlaygamaBridge

    PLUGIN_CLASS.Instance = class PlaygamaBridgeInstance extends SDK.IInstanceBase {
        constructor(sdkType, inst){
            super(sdkType, inst)
        }

        Release() { }

        OnCreate() { }

        OnPropertyChanged(id, value) { }

        LoadC2Property(name, valueString) {
            return false
        }
    }
}
