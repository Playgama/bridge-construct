'use strict'

const C3 = globalThis.C3

{
    C3.Plugins.PlaygamaBridge.Acts = {
        // action parameters
        AddActionParameter(key, value) {
            this.setObjectValue(key, value, this.actionParametersContainer, true)
        },
        AddBoolActionParameter(key, value) {
            this.setObjectValue(key, value, this.actionParametersContainer, true)
        },


        // platfrom
        SendMessage(message) {
            switch (message) {
                case 0:
                    message = window.bridge.PLATFORM_MESSAGE.GAME_READY
                    break
                case 1:
                    message = window.bridge.PLATFORM_MESSAGE.IN_GAME_LOADING_STARTED
                    break
                case 2:
                    message = window.bridge.PLATFORM_MESSAGE.IN_GAME_LOADING_STOPPED
                    break
                case 3:
                    message = window.bridge.PLATFORM_MESSAGE.GAMEPLAY_STARTED
                    break
                case 4:
                    message = window.bridge.PLATFORM_MESSAGE.GAMEPLAY_STOPPED
                    break
                case 5:
                    message = window.bridge.PLATFORM_MESSAGE.PLAYER_GOT_ACHIEVEMENT
                    break
            }

            window.bridge.platform.sendMessage(message)
        },
        GetServerTime() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.platform.getServerTime()
                    .then(result => {
                        this.isLastActionCompletedSuccessfully = true
                        this.serverTime = result
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnGetServerTimeCompleted)
                        resolve()
                    })
            })
        },


        // player
        AuthorizePlayer() {
            this.isLastActionCompletedSuccessfully = false
            return new Promise(resolve => {
                window.bridge.player.authorize(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnAuthorizePlayerCompleted)
                        resolve()
                    })
            })
        },


        // storage
        AppendStorageDataGetRequest(key) {
            this.storageDataGetRequestKeys.push(key)
        },
        SendStorageDataGetRequest(storageType) {
            this.isLastActionCompletedSuccessfully = false

            switch (storageType) {
                case 0:
                    storageType = null
                    break
                case 1:
                    storageType = "local_storage"
                    break
                case 2:
                    storageType = "platform_internal"
                    break
            }

            return new Promise(resolve => {
                window.bridge.storage.get(this.storageDataGetRequestKeys, storageType)
                    .then(data => {
                        if (!this.storageData) {
                            this.storageData = {}
                        }

                        for (let i = 0; i < data.length; i++) {
                            let key = this.storageDataGetRequestKeys[i]
                            let value = data[i]
                            this.storageData[key] = value
                        }

                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.storageDataGetRequestKeys = []
                        this._trigger(this.conditions.OnStorageDataGetRequestCompleted)
                        resolve()
                    })
            })
        },
        AppendStorageDataSetRequest(key, value) {
            this.storageDataSetRequestKeys.push(key)
            this.storageDataSetRequestValues.push(value)
        },
        SendStorageDataSetRequest(storageType) {
            this.isLastActionCompletedSuccessfully = false

            switch (storageType) {
                case 0:
                    storageType = null
                    break
                case 1:
                    storageType = "local_storage"
                    break
                case 2:
                    storageType = "platform_internal"
                    break
            }

            return new Promise(resolve => {
                window.bridge.storage.set(this.storageDataSetRequestKeys, this.storageDataSetRequestValues, storageType)
                    .then(() => {
                        if (!this.storageData) {
                            this.storageData = {}
                        }

                        for (let i = 0; i < this.storageDataSetRequestKeys.length; i++) {
                            let key = this.storageDataSetRequestKeys[i]
                            this.storageData[key] = this.storageDataSetRequestValues[i]
                        }

                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.storageDataSetRequestKeys = []
                        this.storageDataSetRequestValues = []
                        this._trigger(this.conditions.OnStorageDataSetRequestCompleted)
                        resolve()
                    })
            })
        },
        AppendStorageDataDeleteRequest(key) {
            this.storageDataDeleteRequestKeys.push(key)
        },
        SendStorageDataDeleteRequest(storageType) {
            this.isLastActionCompletedSuccessfully = false

            switch (storageType) {
                case 0:
                    storageType = null
                    break
                case 1:
                    storageType = "local_storage"
                    break
                case 2:
                    storageType = "platform_internal"
                    break
            }

            return new Promise(resolve => {
                window.bridge.storage.delete(this.storageDataDeleteRequestKeys, storageType)
                    .then(() => {
                        if (this.storageData) {
                            for (let i = 0; i < this.storageDataDeleteRequestKeys.length; i++) {
                                let key = this.storageDataDeleteRequestKeys[i]
                                delete this.storageData[key]
                            }
                        }

                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.storageDataDeleteRequestKeys = []
                        this._trigger(this.conditions.OnStorageDataDeleteRequestCompleted)
                        resolve()
                    })
            })
        },


        // advertisement
        SetMinimumDelayBetweenInterstitial(seconds) {
            window.bridge.advertisement.setMinimumDelayBetweenInterstitial(seconds)
        },
        ShowBanner() {
            window.bridge.advertisement.showBanner(this.actionParametersContainer)
            this.actionParametersContainer = {}
        },
        HideBanner() {
            window.bridge.advertisement.hideBanner()
        },
        ShowInterstitial(ignoreDelay) {
            window.bridge.advertisement.showInterstitial(ignoreDelay)
        },
        ShowRewarded() {
            window.bridge.advertisement.showRewarded()
        },
        CheckAdBlock() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.advertisement.checkAdBlock()
                    .then(result => {
                        this.isLastActionCompletedSuccessfully = true
                        this.isAdBlockDetected = result
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnCheckAdBlockCompleted)
                        resolve()
                    })
            })
        },


        // social
        Share() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.share(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnShareCompleted)
                        resolve()
                    })
            })
        },
        InviteFriends() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.inviteFriends(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnInviteFriendsCompleted)
                        resolve()
                    })
            })
        },
        JoinCommunity() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.joinCommunity(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnJoinCommunityCompleted)
                        resolve()
                    })
            })
        },
        CreatePost() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.createPost(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnCreatePostCompleted)
                        resolve()
                    })
            })
        },
        AddToHomeScreen() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.addToHomeScreen()
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnAddToHomeScreenCompleted)
                        resolve()
                    })
            })
        },
        AddToFavorites() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.addToFavorites()
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnAddToFavoritesCompleted)
                        resolve()
                    })
            })
        },
        Rate() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.social.rate()
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnRateCompleted)
                        resolve()
                    })
            })
        },


        LeaderboardSetScore() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboard.setScore(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnLeaderboardSetScoreCompleted)
                        resolve()
                    })
            })
        },
        LeaderboardGetScore() {
            this.leaderboardPlayerScore = null
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboard.getScore(this.actionParametersContainer)
                    .then(score => {
                        this.leaderboardPlayerScore = score
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnLeaderboardGetScoreCompleted)
                        resolve()
                    })
            })
        },
        LeaderboardGetEntries() {
            this.leaderboardEntries = null
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboard.getEntries(this.actionParametersContainer)
                    .then(entries => {
                        this.leaderboardEntries = entries
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnLeaderboardGetEntriesCompleted)
                        resolve()
                    })
            })
        },
        LeaderboardShowNativePopup() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboard.showNativePopup(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnLeaderboardShowNativePopupCompleted)
                        resolve()
                    })
            })
        },


        // payments
        PaymentsPurchase() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.purchase(this.actionParametersContainer)
                    .then(data => {
                        this.isLastActionCompletedSuccessfully = true
                        this.paymentsPurchase = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnPaymentsPurchaseCompleted)
                        resolve()
                    })
            })
        },

        PaymentsGetPurchases() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.getPurchases()
                    .then(data => {
                        this.isLastActionCompletedSuccessfully = true
                        this.paymentsPurchases = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnPaymentsGetPurchasesCompleted)
                        resolve()
                    })
            })
        },

        PaymentsGetCatalog() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.getCatalog()
                    .then(data => {
                        this.isLastActionCompletedSuccessfully = true
                        this.paymentsCatalog = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnPaymentsGetCatalogCompleted)
                        resolve()
                    })
            })
        },

        PaymentsConsumePurchase() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.consumePurchase(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnPaymentsConsumePurchaseCompleted)
                        resolve()
                    })
            })
        },

        // achievements
        AchievementsUnlock() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.achievements.unlock(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnAchievementsUnlockCompleted)
                        resolve()
                    })
            })
        },

        AchievementsGetList() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.achievements.getList(this.actionParametersContainer)
                    .then(data => {
                        this.isLastActionCompletedSuccessfully = true
                        this.achievementsList = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnAchievementsGetListCompleted)
                        resolve()
                    })
            })
        },

        AchievementsShowNativePopup() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.achievements.showNativePopup(this.actionParametersContainer)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnAchievementsShowNativePopupCompleted)
                        resolve()
                    })
            })
        },

        // remote-config
        SendRemoteConfigGetRequest() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.remoteConfig.get(this.actionParametersContainer)
                    .then(data => {
                        this.isLastActionCompletedSuccessfully = true
                        this.remoteConfig = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnRemoteConfigGotCompleted)
                        resolve()
                    })
            })
        },
    }
}
