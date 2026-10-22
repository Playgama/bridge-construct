'use strict'

const C3 = globalThis.C3
{
    const BRIDGE_REMOTE_URL = 'https://bridge.playgama.com/v2/stable/playgama-bridge.js'
    const BRIDGE_LOCAL_URL = 'playgama-bridge.js'
    const BRIDGE_LOAD_TIMEOUT = 2000
    const BRIDGE_POLL_INTERVAL = 100

    C3.Plugins.PlaygamaBridge.Instance = class PlaygamaBridgeInstance extends globalThis.ISDKInstanceBase {
        constructor() {
            super()

            this.conditions = C3.Plugins.PlaygamaBridge.Cnds
            this.actions = C3.Plugins.PlaygamaBridge.Acts

            this.runtime.sdk.addLoadPromise(this.loadSdk())
            this.runtime.sdk.addLoadPromise(this.initializeSdk())

            this.serverTime = 0
            this.crossPromoGames = []
            this.tasksList = []
            this.postRewards = []
            this.dailyRewardsList = []
            this.dailyRewardsCurrentDay = 0
            this.dailyRewardsCurrentReward = null
            this.isAdBlockDetected = false
            this.storageData = null
            this.storageDataGetRequestKeys = []
            this.storageDataSetRequestKeys = []
            this.storageDataSetRequestValues = []
            this.storageDataDeleteRequestKeys = []
            this.remoteConfig = {}
            this.isLastActionCompletedSuccessfully = false
            this.actionParametersContainer = {}
            this.multiplayerRooms = []
            this.multiplayerLastEventPlayer = null
            this.multiplayerLastMessage = null
            this.multiplayerLastRoomLeftReason = ''
            this.multiplayerLastErrorCode = ''

            // combo items order must match aces.json
            this.multiplayerStates = ['disconnected', 'connecting', 'connected', 'reconnecting']
            this.multiplayerTargets = ['others', 'all', 'host']
            this.multiplayerRoomLeaveReasons = ['left', 'connection_lost', 'room_closed']


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

            // utils for multiplayer data
            // Parses a JSON string, falls back to the raw string, empty string means no value
            this.parseJSONValue = function(text) {
                if (text === '' || text === null || typeof text === 'undefined') {
                    return undefined
                }

                try {
                    return JSON.parse(text)
                } catch (error) {
                    return text
                }
            }
            // Converts any JS value to a value Construct expressions can return
            this.toExpressionValue = function(value) {
                if (value === null || typeof value === 'undefined') {
                    return ''
                }

                if (typeof value === 'boolean') {
                    return value ? 1 : 0
                }

                if (typeof value === 'object') {
                    return JSON.stringify(value)
                }

                return value
            }
            this.setMultiplayerError = function(error) {
                console.log(error)
                self.multiplayerLastErrorCode = error && error.code ? error.code : ''
            }
        }

        loadSdk() {
            // Some platforms block external scripts with a Content Security Policy,
            // so fall back to the local copy and then to an inline evaluation of it
            return this._loadScript(BRIDGE_REMOTE_URL)
                .catch(() => this._loadScript(BRIDGE_LOCAL_URL))
                .catch(() => this._loadInlineScript(BRIDGE_LOCAL_URL))
                .catch(() => console.error('[PlaygamaBridge] failed to load the SDK'))
        }

        _loadScript(src) {
            return new Promise((resolve, reject) => {
                const scriptElement = document.createElement('script')
                scriptElement.src = src

                let isSettled = false

                const settle = (isLoaded) => {
                    if (isSettled) {
                        return
                    }

                    isSettled = true
                    clearTimeout(timeout)
                    scriptElement.onload = null
                    scriptElement.onerror = null

                    if (isLoaded && window.bridge) {
                        resolve()
                        return
                    }

                    scriptElement.remove()
                    reject()
                }

                const timeout = setTimeout(() => settle(false), BRIDGE_LOAD_TIMEOUT)

                scriptElement.onload = () => settle(true)
                scriptElement.onerror = () => settle(false)

                document.body.appendChild(scriptElement)
            })
        }

        _loadInlineScript(src) {
            return fetch(src)
                .then(response => (response.ok ? response.text() : Promise.reject()))
                .then(source => {
                    const scriptElement = document.createElement('script')
                    scriptElement.textContent = source
                    document.body.appendChild(scriptElement)

                    return window.bridge ? undefined : Promise.reject()
                })
        }

        initializeSdk() {
            return new Promise((resolve, reject) => {
                const waitForBridgeLoaded = () => {
                    if (window.bridge) {
                        window.bridge.engine = 'construct'
                        window.bridge.gameVersion = this.runtime.projectVersion
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

                                window.bridge.advertisement.on('advanced_banners_state_changed', state => {
                                    this._trigger(this.conditions.OnAdvancedBannersStateChanged)

                                    switch (state) {
                                        case window.bridge.BANNER_STATE.LOADING:
                                            this._trigger(this.conditions.OnAdvancedBannersLoading)
                                            break
                                        case window.bridge.BANNER_STATE.SHOWN:
                                            this._trigger(this.conditions.OnAdvancedBannersShown)
                                            break
                                        case window.bridge.BANNER_STATE.HIDDEN:
                                            this._trigger(this.conditions.OnAdvancedBannersHidden)
                                            break
                                        case window.bridge.BANNER_STATE.FAILED:
                                            this._trigger(this.conditions.OnAdvancedBannersFailed)
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

                                window.bridge.platform.on('audio_state_changed', isEnabled => {
                                    this._trigger(this.conditions.OnPlatformAudioStateChanged)
                                })

                                window.bridge.platform.on('pause_state_changed', isPaused => {
                                    this._trigger(this.conditions.OnPlatformPauseStateChanged)
                                })

                                // the multiplayer module may be missing in older SDK builds
                                if (window.bridge.multiplayer) {
                                    this._subscribeMultiplayerEvents()
                                }

                                resolve()
                            })
                            .catch(error => reject(error))
                    } else {
                        setTimeout(pollForBridge, BRIDGE_POLL_INTERVAL)
                    }
                }

                // Keep every attempt guarded, otherwise a synchronous failure
                // would leave the promise unsettled and freeze the loading screen
                const pollForBridge = () => {
                    try {
                        waitForBridgeLoaded()
                    } catch (error) {
                        reject(error)
                    }
                }

                pollForBridge()
            })
        }

        _subscribeMultiplayerEvents() {
            const multiplayer = window.bridge.multiplayer

            multiplayer.on('multiplayer_state_changed', state => {
                this._trigger(this.conditions.OnMultiplayerStateChanged)
            })

            multiplayer.on('multiplayer_room_left', reason => {
                this.multiplayerLastRoomLeftReason = reason || ''
                this._trigger(this.conditions.OnMultiplayerRoomLeft)
            })

            multiplayer.on('multiplayer_room_updated', room => {
                this._trigger(this.conditions.OnMultiplayerRoomUpdated)
            })

            multiplayer.on('multiplayer_player_joined', player => {
                this.multiplayerLastEventPlayer = player
                this._trigger(this.conditions.OnMultiplayerPlayerJoined)
            })

            multiplayer.on('multiplayer_player_left', player => {
                this.multiplayerLastEventPlayer = player
                this._trigger(this.conditions.OnMultiplayerPlayerLeft)
            })

            multiplayer.on('multiplayer_player_updated', player => {
                this.multiplayerLastEventPlayer = player
                this._trigger(this.conditions.OnMultiplayerPlayerUpdated)
            })

            multiplayer.on('multiplayer_host_changed', player => {
                this.multiplayerLastEventPlayer = player || null
                this._trigger(this.conditions.OnMultiplayerHostChanged)
            })

            multiplayer.on('multiplayer_message_received', message => {
                this.multiplayerLastMessage = message
                this._trigger(this.conditions.OnMultiplayerMessageReceived)
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
