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
    C3.Plugins.PlaygamaBridge.Instance = class PlaygamaBridgeInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst)

            this.conditions = C3.Plugins.PlaygamaBridge.Cnds
            this.actions = C3.Plugins.PlaygamaBridge.Acts

            let cdnUrl = 'https://cdn.jsdelivr.net/gh/playgama/bridge@1.16.0/dist/playgama-bridge.js'
            if (properties[1] !== '') {
                cdnUrl = properties[1]
            }

            this.gameDistributionGameId = properties[2]
            this.vkPlayGameId = properties[3]
            this.y8GameId = properties[4]
            this.adsgramBlockId = properties[5]

            if (properties[0]) {
                this._runtime.AddLoadPromise(this.loadSdk(cdnUrl))
            }

            this._runtime.AddLoadPromise(this.initializeSdk())

            if (properties[6]) {
                this.showInterstitialOnInit = properties[6]
            }

            this.serverTime = 0
            this.isAdBlockDetected = false
            this.storageData = null
            this.storageDataGetRequestKeys = []
            this.storageDataSetRequestKeys = []
            this.storageDataSetRequestValues = []
            this.storageDataDeleteRequestKeys = []
            this.remoteConfig = {}
            this.isLastActionCompletedSuccessfully = false
            this.actionParametersContainer = {}


            // utils for action parameters
            let self = this
            this.isObject = function(val) {
                return Object.prototype.toString.call(val) === '[object Object]'
            }
            this.blacklist = ['__proto__', 'prototype', 'constructor']
            this.blacklistFilter = function (part) { return self.blacklist.indexOf(part) === -1 }
            this.parsePath = function(path, sep) {
                if (path.indexOf('[') >= 0) {
                    path = path.replace(/\[/g, sep).replace(/]/g, '')
                }

                const parts = path.split(sep)
                const check = parts.filter(self.blacklistFilter)

                if (check.length !== parts.length) {
                    throw Error('Refusing to update blacklisted property ' + path)
                }

                return parts
            }
            this.hasOwnProperty = Object.prototype.hasOwnProperty
            this.setObjectValue = function(path, val, obj, merge) {
                let i
                let j
                let keys
                let k

                if (typeof val === 'undefined') {
                    return obj
                }
                keys = self.parsePath(path, '.')

                for (i = 0; i < keys.length; i++) {
                    k = keys[i]
                    if (i === keys.length - 1) {
                        if (merge && self.isObject(val) && self.isObject(obj[k])) {
                            for (j in val) {
                                if (self.hasOwnProperty.call(val, j)) {
                                    obj[k][j] = val[j]
                                }
                            }
                        } else if (merge && Array.isArray(obj[k]) && Array.isArray(val)) {
                            for (let j = 0; j < val.length; j++) {
                                obj[keys[i]].push(val[j])
                            }
                        } else {
                            obj[k] = val
                        }
                    } else if (!self.hasOwnProperty.call(obj, k) || (!self.isObject(obj[k]) && !Array.isArray(obj[k]))) {
                        if (/^\d+$/.test(keys[i + 1])) {
                            obj[k] = []
                        } else {
                            obj[k] = {}
                        }
                    }
                    obj = obj[k]
                }
                return obj
            }
        }

        loadSdk(cdnUrl) {
            return new Promise((resolve, reject) => {
                try {
                    ((d) => {
                        let t = d.getElementsByTagName('script')[0]
                        let s = d.createElement('script')
                        s.src = cdnUrl
                        s.async = true
                        s.onload = () => {
                            resolve()
                        }
                        t.parentNode.insertBefore(s, t)
                    })(document)
                } catch (error) {
                    console.error(error)
                    reject(error)
                }
            })
        }

        initializeSdk() {
            return new Promise((resolve, reject) => {
                const waitForBridgeLoaded = () => {
                    if (window.bridge !== undefined) {
                        let bridgeOptions = {
                            platforms: { }
                        }

                        if (this.gameDistributionGameId !== '') {
                            bridgeOptions.platforms['game_distribution'] = { gameId: this.gameDistributionGameId }
                        }

                        if (this.vkPlayGameId !== '') {
                            bridgeOptions.platforms['vk_play'] = { gameId: this.vkPlayGameId }
                        }

                        if (this.y8GameId !== '') {
                            bridgeOptions.platforms['y8'] = { gameId: this.y8GameId }
                        }

                        if (this.adsgramBlockId !== '') {
                            bridgeOptions.platforms['telegram'] = { adsgramBlockId: this.adsgramBlockId }
                        }

                        window.bridge.initialize(bridgeOptions)
                            .then(() => {
                                window.bridge.advertisement.on('banner_state_changed', state => {
                                    this.Trigger(this.conditions.OnBannerStateChanged)

                                    switch (state) {
                                        case window.bridge.BANNER_STATE.LOADING:
                                            this.Trigger(this.conditions.OnBannerLoading)
                                            break
                                        case window.bridge.BANNER_STATE.SHOWN:
                                            this.Trigger(this.conditions.OnBannerShown)
                                            break
                                        case window.bridge.BANNER_STATE.HIDDEN:
                                            this.Trigger(this.conditions.OnBannerHidden)
                                            break
                                        case window.bridge.BANNER_STATE.FAILED:
                                            this.Trigger(this.conditions.OnBannerFailed)
                                            break
                                    }
                                })

                                window.bridge.advertisement.on('interstitial_state_changed', state => {
                                    this.Trigger(this.conditions.OnInterstitialStateChanged)

                                    switch (state) {
                                        case window.bridge.INTERSTITIAL_STATE.LOADING:
                                            this.Trigger(this.conditions.OnInterstitialLoading)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.OPENED:
                                            this.Trigger(this.conditions.OnInterstitialOpened)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.CLOSED:
                                            this.Trigger(this.conditions.OnInterstitialClosed)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.FAILED:
                                            this.Trigger(this.conditions.OnInterstitialFailed)
                                            break
                                    }
                                })

                                window.bridge.advertisement.on('rewarded_state_changed', state => {
                                    this.Trigger(this.conditions.OnRewardedStateChanged)

                                    switch (state) {
                                        case window.bridge.REWARDED_STATE.LOADING:
                                            this.Trigger(this.conditions.OnRewardedLoading)
                                            break
                                        case window.bridge.REWARDED_STATE.OPENED:
                                            this.Trigger(this.conditions.OnRewardedOpened)
                                            break
                                        case window.bridge.REWARDED_STATE.REWARDED:
                                            this.Trigger(this.conditions.OnRewardedRewarded)
                                            break
                                        case window.bridge.REWARDED_STATE.CLOSED:
                                            this.Trigger(this.conditions.OnRewardedClosed)
                                            break
                                        case window.bridge.REWARDED_STATE.FAILED:
                                            this.Trigger(this.conditions.OnRewardedFailed)
                                            break
                                    }
                                })

                                window.bridge.game.on('visibility_state_changed', state => {
                                    this.Trigger(this.conditions.OnVisibilityStateChanged)
                                })

                                resolve()

                                if (this.showInterstitialOnInit) {
                                    if (window.bridge.platform.id === window.bridge.PLATFORM_ID.GAME_DISTRIBUTION) {
                                        window.bridge.advertisement.showInterstitial()
                                    }
                                }
                            })
                            .catch(error => reject(error))
                    } else {
                        setTimeout(waitForBridgeLoaded, 100)
                    }
                }

                waitForBridgeLoaded()
            })
        }

        Release() {
            super.Release()
        }

        SaveToJson() {
            return {
                storageData: this.storageData
            }
        }

        LoadFromJson(o) {
            this.storageData = o.storageData || { }
        }

        GetDebuggerProperties() {
            return [{
                title: 'PlaygamaBridge',
                properties: []
            }]
        }


    }
}
