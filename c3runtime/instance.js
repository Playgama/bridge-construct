'use strict'

const C3 = globalThis.C3
{
    C3.Plugins.PlaygamaBridge.Instance = class PlaygamaBridgeInstance extends globalThis.ISDKInstanceBase {
        constructor() {
            super()

            this.conditions = C3.Plugins.PlaygamaBridge.Cnds
            this.actions = C3.Plugins.PlaygamaBridge.Acts

            const properties = this._getInitProperties()

            let cdnUrl = 'https://cdn.jsdelivr.net/gh/playgama/bridge@1.20.0/dist/playgama-bridge.js'
            if (properties[1] !== '') {
                cdnUrl = properties[1]
            }

            if (properties[0]) {
                this.runtime.sdk.addLoadPromise(this.loadSdk(cdnUrl))
            }

            this.runtime.sdk.addLoadPromise(this.initializeSdk())

            this.serverTime = 0
            this.allGames = []
            this.gameById = null
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
                        window.bridge.initialize()
                            .then(() => {
                                window.bridge.advertisement.on('banner_state_changed', state => {
                                    this._trigger(this.conditions.OnBannerStateChanged)

                                    switch (state) {
                                        case window.bridge.BANNER_STATE.LOADING:
                                            this._trigger(this.conditions.OnBannerLoading)
                                            break
                                        case window.bridge.BANNER_STATE.SHOWN:
                                            this._trigger(this.conditions.OnBannerShown)
                                            break
                                        case window.bridge.BANNER_STATE.HIDDEN:
                                            this._trigger(this.conditions.OnBannerHidden)
                                            break
                                        case window.bridge.BANNER_STATE.FAILED:
                                            this._trigger(this.conditions.OnBannerFailed)
                                            break
                                    }
                                })

                                window.bridge.advertisement.on('interstitial_state_changed', state => {
                                    this._trigger(this.conditions.OnInterstitialStateChanged)

                                    switch (state) {
                                        case window.bridge.INTERSTITIAL_STATE.LOADING:
                                            this._trigger(this.conditions.OnInterstitialLoading)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.OPENED:
                                            this._trigger(this.conditions.OnInterstitialOpened)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.CLOSED:
                                            this._trigger(this.conditions.OnInterstitialClosed)
                                            break
                                        case window.bridge.INTERSTITIAL_STATE.FAILED:
                                            this._trigger(this.conditions.OnInterstitialFailed)
                                            break
                                    }
                                })

                                window.bridge.advertisement.on('rewarded_state_changed', state => {
                                    this._trigger(this.conditions.OnRewardedStateChanged)

                                    switch (state) {
                                        case window.bridge.REWARDED_STATE.LOADING:
                                            this._trigger(this.conditions.OnRewardedLoading)
                                            break
                                        case window.bridge.REWARDED_STATE.OPENED:
                                            this._trigger(this.conditions.OnRewardedOpened)
                                            break
                                        case window.bridge.REWARDED_STATE.REWARDED:
                                            this._trigger(this.conditions.OnRewardedRewarded)
                                            break
                                        case window.bridge.REWARDED_STATE.CLOSED:
                                            this._trigger(this.conditions.OnRewardedClosed)
                                            break
                                        case window.bridge.REWARDED_STATE.FAILED:
                                            this._trigger(this.conditions.OnRewardedFailed)
                                            break
                                    }
                                })

                                window.bridge.game.on('visibility_state_changed', state => {
                                    this._trigger(this.conditions.OnVisibilityStateChanged)
                                })

                                resolve()
                            })
                            .catch(error => reject(error))
                    } else {
                        setTimeout(waitForBridgeLoaded, 100)
                    }
                }

                waitForBridgeLoaded()
            })
        }

        _release() {
            super._release()
        }

        _saveToJson() {
            return {
                storageData: this.storageData
            }
        }

        _loadFromJson(o) {
            this.storageData = o.storageData || { }
        }
    }
}
