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


        // platform
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
        GetAllGames() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.platform.getAllGames()
                    .then((games) => {
                        this.isLastActionCompletedSuccessfully = true
                        this.allGames = games
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnGetAllGamesCompleted)
                        resolve()
                    })
            })
        },
        GetGameById() {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.platform.getGameById(this.actionParametersContainer)
                    .then((game) => {
                        this.isLastActionCompletedSuccessfully = true
                        this.gameById = game
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this.actionParametersContainer = {}
                        this._trigger(this.conditions.OnGetGameByIdCompleted)
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
        ShowBanner(position, placement) {
            window.bridge.advertisement.showBanner(position, placement)
        },
        HideBanner() {
            window.bridge.advertisement.hideBanner()
        },
        ShowInterstitial(placement) {
            window.bridge.advertisement.showInterstitial(placement)
        },
        ShowRewarded(placement) {
            window.bridge.advertisement.showRewarded(placement)
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


        // leaderboards
        LeaderboardsSetScore(id, score) {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboards.setScore(id, score)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnLeaderboardsSetScoreCompleted)
                        resolve()
                    })
            })
        },
        LeaderboardsGetEntries(id) {
            this.leaderboardEntries = null
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboards.getEntries(id)
                    .then(entries => {
                        this.leaderboardEntries = entries
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnLeaderboardsGetEntriesCompleted)
                        resolve()
                    })
            })
        },
        LeaderboardsShowNativePopup(id) {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.leaderboards.showNativePopup(id)
                    .then(() => {
                        this.isLastActionCompletedSuccessfully = true
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnLeaderboardsShowNativePopupCompleted)
                        resolve()
                    })
            })
        },


        // payments
        PaymentsPurchase(id) {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.purchase(id, this.actionParametersContainer)
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

        PaymentsConsumePurchase(id) {
            this.isLastActionCompletedSuccessfully = false

            return new Promise(resolve => {
                window.bridge.payments.consumePurchase(id)
                    .then((data) => {
                        this.isLastActionCompletedSuccessfully = true
                        this.paymentsPurchase = data
                    })
                    .catch(error => console.log(error))
                    .finally(() => {
                        this._trigger(this.conditions.OnPaymentsConsumePurchaseCompleted)
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
