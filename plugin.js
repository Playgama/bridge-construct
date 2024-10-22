/*
 * This file is part of Playgama Bridge.
 *
 * Playgama Bridge is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Playgama Bridge is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Playgama Bridge. If not, see <https://www.gnu.org/licenses/>.
 */

'use strict'
{
    const PLUGIN_ID = 'PlaygamaBridge'
    const PLUGIN_VERSION = '1.16.0'
    const PLUGIN_CATEGORY = 'platform-specific'

    const PLUGIN_CLASS = (SDK.Plugins.PlaygamaBridge = class PlaygamaBridgePlugin extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID)

            SDK.Lang.PushContext('plugins.' + PLUGIN_ID.toLowerCase())
            this._info.SetName(lang('.name'))
            this._info.SetDescription(lang('.description'))
            this._info.SetVersion(PLUGIN_VERSION)
            this._info.SetCategory(PLUGIN_CATEGORY)
            this._info.SetAuthor(lang('.author'))
            this._info.SetHelpUrl(lang('.help-url'))
            this._info.SetIsSingleGlobal(true)
            this._info.SetSupportedRuntimes(['c3'])

            SDK.Lang.PushContext('.properties')
            this._info.SetProperties([
                new SDK.PluginProperty('check', 'load-sdk-from-cdn', true),
                new SDK.PluginProperty('text', 'custom-cdn-url', ''),
                new SDK.PluginProperty('text', 'game-distribution-game-id', ''),
                new SDK.PluginProperty('text', 'vk-play-game-id', ''),
                new SDK.PluginProperty('text', 'y8-game-id', ''),
                new SDK.PluginProperty('text', 'adsgram-block-id', ''),
                new SDK.PluginProperty('check', 'show-interstitial-on-init', true)
            ]);

            SDK.Lang.PopContext()
            SDK.Lang.PopContext()
        }
    })

    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS)
}
