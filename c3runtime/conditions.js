'use strict'

const C3 = globalThis.C3

{
    C3.Plugins.PlaygamaBridge.Cnds = {
        // common
        IsLastActionCompletedSuccessfully() {
            return this.isLastActionCompletedSuccessfully
        },


        // platform
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


        // game
        OnVisibilityStateChanged() {
            return true
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
        IsStorageSupported(storageType) {
            switch (storageType) {
                case 0:
                    storageType = "local_storage"
                    break
                case 1:
                    storageType = "platform_internal"
                    break
            }

            return window.bridge.storage.isSupported(storageType)
        },
        IsStorageAvailable(storageType) {
            switch (storageType) {
                case 0:
                    storageType = "local_storage"
                    break
                case 1:
                    storageType = "platform_internal"
                    break
            }

            return window.bridge.storage.isAvailable(storageType)
        },


        // advertisement
        IsBannerSupported() {
            return window.bridge.advertisement.isBannerSupported
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
            return window.bridge.social.isExternalLinksAllowed
        },


        // leaderboard
        IsLeaderboardSupported() {
            return window.bridge.leaderboard.isSupported
        },
        IsLeaderboardNativePopupSupported() {
            return window.bridge.leaderboard.isNativePopupSupported
        },
        IsLeaderboardMultipleBoardsSupported() {
            return window.bridge.leaderboard.isMultipleBoardsSupported
        },
        IsLeaderboardSetScoreSupported() {
            return window.bridge.leaderboard.isSetScoreSupported
        },
        IsLeaderboardGetScoreSupported() {
            return window.bridge.leaderboard.isGetScoreSupported
        },
        IsLeaderboardGetEntriesSupported() {
            return window.bridge.leaderboard.isGetEntriesSupported
        },

        OnLeaderboardSetScoreCompleted() {
            return true
        },
        OnLeaderboardGetScoreCompleted() {
            return true
        },
        OnLeaderboardGetEntriesCompleted() {
            return true
        },
        OnLeaderboardShowNativePopupCompleted() {
            return true
        },


        // payments
        IsPaymentsSupported() {
            return window.bridge.payments.isSupported
        },
        IsPaymentsGetCatalogSupported() {
            return window.bridge.payments.isGetCatalogSupported
        },
        IsPaymentsGetPurchasesSupported() {
            return window.bridge.payments.isGetPurchasesSupported
        },
        IsPaymentsConsumePurchaseSupported() {
            return window.bridge.payments.isConsumePurchaseSupported
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
        IsAchievementsSupported() {
            return window.bridge.achievements.isSupported
        },
        IsAchievementsGetListSupported() {
            return window.bridge.achievements.isGetListSupported
        },
        IsAchievementsNativePopupSupported() {
            return window.bridge.achievements.isNativePopupSupported
        },

        OnAchievementsUnlockCompleted() {
            return true
        },
        OnAchievementsGetListCompleted() {
            return true
        },
        OnAchievementsShowNativePopupCompleted() {
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

    }
}
