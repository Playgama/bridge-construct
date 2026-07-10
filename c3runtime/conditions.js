'use strict'

const C3 = globalThis.C3
{
    C3.Plugins.PlaygamaBridge.Cnds = {
        // common
        IsLastActionCompletedSuccessfully() {
            return this.isLastActionCompletedSuccessfully
        },


        // platform
        IsPlatformAudioEnabled() {
            return window.bridge.platform.isAudioEnabled
        },

        OnPlatformAudioStateChanged() {
            return true
        },

        IsPlatformPaused() {
            return window.bridge.platform.isPaused
        },

        OnPlatformPauseStateChanged() {
            return true
        },

        IsPlatformExternalCallsSupported() {
            return window.bridge.platform.isExternalCallsSupported
        },

        OnGetServerTimeCompleted() {
            return true
        },
        HasServerTime() {
            return this.serverTime > 0
        },


        // device
        IsMobile() {
            return window.bridge.device.type === 'mobile'
        },
        IsTablet() {
            return window.bridge.device.type === 'tablet'
        },
        IsDesktop() {
            return window.bridge.device.type === 'desktop'
        },
        IsTv() {
            return window.bridge.device.type === 'tv'
        },


        // player
        IsPlayerAuthorizationSupported() {
            return window.bridge.player.isAuthorizationSupported
        },
        IsPlayerAuthorized() {
            return window.bridge.player.isAuthorized
        },
        IsPlayerGuest() {
            return window.bridge.player.isGuest
        },
        OnAuthorizePlayerCompleted() {
            return true
        },
        DoesPlayerHaveName() {
            return typeof window.bridge.player.name === 'string'
        },
        DoesPlayerHavePhoto(index) {
            return window.bridge.player.photos.length > index
        },


        // advertisement
        OnCheckAdBlockCompleted() {
            return true
        },
        IsAdBlockDetected() {
            return this.isAdBlockDetected
        },


        // storage
        OnStorageDataGetRequestCompleted() {
            return true
        },
        OnStorageDataSetRequestCompleted() {
            return true
        },
        OnStorageDataDeleteRequestCompleted() {
            return true
        },
        HasStorageData(key) {
            if (!this.storageData)
                return 0

            let value = this.storageData[key]
            return value !== null && typeof value !== 'undefined'
        },


        // advertisement
        IsBannerSupported() {
            return window.bridge.advertisement.isBannerSupported
        },
        IsInterstitialSupported() {
            return window.bridge.advertisement.isInterstitialSupported
        },
        IsRewardedSupported() {
            return window.bridge.advertisement.isRewardedSupported
        },
        OnBannerStateChanged() {
            return true
        },
        OnBannerLoading() {
            return true
        },
        OnBannerShown() {
            return true
        },
        OnBannerHidden() {
            return true
        },
        OnBannerFailed() {
            return true
        },

        IsAdvancedBannersSupported() {
            return window.bridge.advertisement.isAdvancedBannersSupported
        },
        OnAdvancedBannersStateChanged() {
            return true
        },
        OnAdvancedBannersLoading() {
            return true
        },
        OnAdvancedBannersShown() {
            return true
        },
        OnAdvancedBannersHidden() {
            return true
        },
        OnAdvancedBannersFailed() {
            return true
        },

        OnInterstitialStateChanged() {
            return true
        },
        OnInterstitialLoading() {
            return true
        },
        OnInterstitialOpened() {
            return true
        },
        OnInterstitialClosed() {
            return true
        },
        OnInterstitialFailed() {
            return true
        },

        OnRewardedStateChanged() {
            return true
        },
        OnRewardedLoading() {
            return true
        },
        OnRewardedOpened() {
            return true
        },
        OnRewardedRewarded() {
            return true
        },
        OnRewardedClosed() {
            return true
        },
        OnRewardedFailed() {
            return true
        },


        // social
        IsShareSupported() {
            return window.bridge.social.isShareSupported
        },
        OnShareCompleted() {
            return true
        },

        IsInviteFriendsSupported() {
            return window.bridge.social.isInviteFriendsSupported
        },
        OnInviteFriendsCompleted() {
            return true
        },

        IsJoinCommunitySupported() {
            return window.bridge.social.isJoinCommunitySupported
        },
        OnJoinCommunityCompleted() {
            return true
        },

        IsCreatePostSupported() {
            return window.bridge.social.isCreatePostSupported
        },
        OnCreatePostCompleted() {
            return true
        },

        IsAddToHomeScreenSupported() {
            return window.bridge.social.isAddToHomeScreenSupported
        },
        OnAddToHomeScreenCompleted() {
            return true
        },

        IsAddToFavoritesSupported() {
            return window.bridge.social.isAddToFavoritesSupported
        },
        OnAddToFavoritesCompleted() {
            return true
        },

        IsRateSupported() {
            return window.bridge.social.isRateSupported
        },
        OnRateCompleted() {
            return true
        },

        IsExternalLinksAllowed() {
            return window.bridge.platform.isExternalLinksAllowed
        },


        // leaderboards
        IsLeaderboardsTypeNotAvailable() {
            return window.bridge.leaderboards.type === 'not_available'
        },
        IsLeaderboardsTypeInGame() {
            return window.bridge.leaderboards.type === 'in_game'
        },
        IsLeaderboardsTypeNative() {
            return window.bridge.leaderboards.type === 'native'
        },
        IsLeaderboardsTypeNativePopup() {
            return window.bridge.leaderboards.type === 'native_popup'
        },

        OnLeaderboardsSetScoreCompleted() {
            return true
        },
        OnLeaderboardsGetEntriesCompleted() {
            return true
        },
        OnLeaderboardsShowNativePopupCompleted() {
            return true
        },


        // payments
        IsPaymentsSupported() {
            return window.bridge.payments.isSupported
        },
        OnPaymentsPurchaseCompleted() {
            return true
        },
        OnPaymentsGetPurchasesCompleted() {
            return true
        },
        OnPaymentsGetCatalogCompleted() {
            return true
        },
        OnPaymentsConsumePurchaseCompleted() {
            return true
        },


        // achievements
        OnAchievementsUnlockCompleted() {
            return true
        },
        OnAchievementsGetListCompleted() {
            return true
        },

        // remote-config
        IsRemoteConfigSupported() {
            return window.bridge.remoteConfig.isSupported
        },

        OnRemoteConfigGotCompleted() {
            return true
        },

        HasRemoteConfigValue(key) {
            if (!this.remoteConfig)
                return 0

            let value = this.remoteConfig[key]
            return value !== null && typeof value !== 'undefined'
        },


        // cross-promo
        OnCrossPromoGetGamesListCompleted() {
            return true
        },

        IsCrossPromoVisible() {
            return window.bridge.crossPromo.isVisible
        },


        // tasks
        OnTasksGetTasksCompleted() {
            return true
        },

        OnTasksAddProgressCompleted() {
            return true
        },

        OnTasksClaimRewardCompleted() {
            return true
        },

        IsTaskCompleted(taskIndex) {
            if (!this.tasksList || !this.tasksList[taskIndex]) {
                return false
            }

            return this.tasksList[taskIndex].completed === true
        },

        IsTaskClaimed(taskIndex) {
            if (!this.tasksList || !this.tasksList[taskIndex]) {
                return false
            }

            return this.tasksList[taskIndex].claimed === true
        },

        IsTaskTargetCompleted(taskIndex, targetIndex) {
            if (!this.tasksList || !this.tasksList[taskIndex]) {
                return false
            }

            const targets = this.tasksList[taskIndex].targets
            if (!targets || !targets[targetIndex]) {
                return false
            }

            return targets[targetIndex].completed === true
        },


        // daily rewards
        OnDailyRewardsGetRewardsCompleted() {
            return true
        },

        OnDailyRewardsGetCurrentDayCompleted() {
            return true
        },

        OnDailyRewardsGetCurrentRewardCompleted() {
            return true
        },

        OnDailyRewardsClaimCurrentRewardCompleted() {
            return true
        },

        IsDailyRewardsCurrentRewardAvailable() {
            return this.dailyRewardsCurrentReward !== null && this.dailyRewardsCurrentReward !== undefined
        },

    }
}
