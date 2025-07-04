'use strict'

const C3 = globalThis.C3
{
    C3.Plugins.PlaygamaBridge.Exps = {
        // platform
        PlatformId() {
            return window.bridge.platform.id
        },
        PlatformLanguage() {
            return window.bridge.platform.language
        },
        PlatformPayload() {
            return window.bridge.platform.payload
        },
        PlatformTld() {
            if (window.bridge.platform.tld) {
                return window.bridge.platform.tld
            }

            return ''
        },
        ServerTime() {
            return this.serverTime
        },
        PlatformAllGamesCount() {
            if (!this.allGames) {
                return 0
            }

            return this.allGames.length
        },
        PlatformAllGamesPropertiesCount() {
            if (!this.allGames || this.allGames.length <= 0) {
                return 0
            }

            let game = this.allGames[0]
            let properties = Object.keys(game)
            return properties.length
        },
        PlatformAllGamesPropertyName(propertyIndex) {
            if (!this.allGames || this.allGames.length <= 0) {
                return ''
            }

            let game = this.allGames[0]
            let properties = Object.keys(game)
            return properties[propertyIndex]
        },
        PlatformAllGamesPropertyValue(gameIndex, property) {
            if (!this.allGames || this.allGames.length <= 0) {
                return ''
            }

            let game = this.allGames[gameIndex]

            if (!game) {
                return ''
            }

            if (typeof property === 'number') {
                let properties = Object.keys(game)
                let propertyName = properties[property]
                return game[propertyName]
            }

            return game[property]
        },
        PlatformGameByIdPropertiesCount() {
            if (!this.gameById) {
                return 0
            }

            let properties = Object.keys(this.gameById)
            return properties.length
        },
        PlatformGameByIdPropertyName(propertyIndex) {
            if (!this.gameById) {
                return ''
            }

            let properties = Object.keys(this.gameById)
            return properties[propertyIndex]
        },
        PlatformGameByIdPropertyValue(property) {
            if (!this.gameById) {
                return ''
            }

            if (typeof property === 'number') {
                let properties = Object.keys(this.gameById)
                let propertyName = properties[property]
                return this.gameById[propertyName]
            }

            return this.gameById[property]
        },


        // device
        DeviceType() {
            return window.bridge.device.type
        },


        // player
        PlayerId() {
            return window.bridge.player.id
        },
        PlayerName() {
            return window.bridge.player.name
        },
        PlayerPhotosCount() {
            return window.bridge.player.photos.length
        },
        PlayerPhoto(index) {
            return window.bridge.player.photos[index]
        },


        // game
        VisibilityState() {
            return window.bridge.game.visibilityState
        },


        // storage
        DefaultStorageType() {
            return window.bridge.storage.defaultType
        },
        StorageData(key) {
            if (!this.storageData) {
                return null
            }

            return this.storageData[key]
        },
        StorageDataAsJSON(key) {
            if (!this.storageData) {
                return null
            }

            let value = this.storageData[key]
            if (typeof value !== 'string') {
                value = JSON.stringify(value)
            }

            return value
        },


        // advertisement
        MinimumDelayBetweenInterstitial() {
            return window.bridge.advertisement.minimumDelayBetweenInterstitial
        },
        BannerState() {
            return window.bridge.advertisement.bannerState
        },
        InterstitialState() {
            return window.bridge.advertisement.interstitialState
        },
        RewardedState() {
            return window.bridge.advertisement.rewardedState
        },
        RewardedPlacement() {
            return window.bridge.advertisement.rewardedPlacement
        },


        // leaderboards
        LeaderboardsType() {
            return window.bridge.leaderboards.type
        },
        LeaderboardEntriesCount() {
            if (!this.leaderboardEntries) {
                return 0
            }

            return this.leaderboardEntries.length
        },
        LeaderboardEntryId(entryIndex) {
            if (!this.leaderboardEntries || this.leaderboardEntries.length <= 0) {
                return ''
            }

            let entry = this.leaderboardEntries[entryIndex]
            return entry['id']
        },
        LeaderboardEntryName(entryIndex) {
            if (!this.leaderboardEntries || this.leaderboardEntries.length <= 0) {
                return ''
            }

            let entry = this.leaderboardEntries[entryIndex]
            return entry['name']
        },
        LeaderboardEntryPhoto(entryIndex) {
            if (!this.leaderboardEntries || this.leaderboardEntries.length <= 0) {
                return ''
            }

            let entry = this.leaderboardEntries[entryIndex]
            return entry['photo']
        },
        LeaderboardEntryScore(entryIndex) {
            if (!this.leaderboardEntries || this.leaderboardEntries.length <= 0) {
                return ''
            }

            let entry = this.leaderboardEntries[entryIndex]
            return entry['score']
        },
        LeaderboardEntryRank(entryIndex) {
            if (!this.leaderboardEntries || this.leaderboardEntries.length <= 0) {
                return ''
            }

            let entry = this.leaderboardEntries[entryIndex]
            return entry['rank']
        },

        // achievements
        AchievementsCount() {
            if (!this.achievementsList) {
                return 0
            }

            return this.achievementsList.length
        },

        AchievementPropertiesCount() {
            if (this.achievementsList || this.achievementsList.length <= 0) {
                return 0
            }

            let achievement = this.achievementsList[0]
            let properties = Object.keys(achievement)
            return properties.length
        },

        AchievementPropertyName(propertyIndex) {
            if (!this.achievementsList || this.achievementsList.length <= 0) {
                return ''
            }

            let achievement = this.achievementsList[0]
            let properties = Object.keys(achievement)
            return properties[propertyIndex]
        },

        AchievementPropertyValue(achievementIndex, property) {
            if (!this.achievementsList || this.achievementsList.length <= 0) {
                return ''
            }

            let achievement = this.achievementsList[achievementIndex]
            if (typeof property === 'number') {
                let properties = Object.keys(achievement)
                let propertyName = properties[property]
                return achievement[propertyName]
            }

            return achievement[property]
        },

        // payments
        PaymentsLastPurchasePropertiesCount() {
            if (!this.paymentsPurchase) {
                return 0
            }

            let properties = Object.keys(this.paymentsPurchase)
            return properties.length
        },
        PaymentsLastPurchasePropertyName(propertyIndex) {
            if (!this.paymentsPurchase) {
                return ''
            }

            let properties = Object.keys(this.paymentsPurchase)
            return properties[propertyIndex]
        },
        PaymentsLastPurchasePropertyValue(property) {
            if (!this.paymentsPurchase) {
                return ''
            }

            if (typeof property === 'number') {
                let properties = Object.keys(this.paymentsPurchase)
                let propertyName = properties[property]
                return this.paymentsPurchase[propertyName]
            }

            return this.paymentsPurchase[property]
        },

        PaymentsPurchasesCount() {
            if (!this.paymentsPurchases) {
                return 0
            }

            return this.paymentsPurchases.length
        },
        PaymentsPurchasePropertiesCount() {
            if (!this.paymentsPurchases || this.paymentsPurchases.length <= 0) {
                return 0
            }

            let purchase = this.paymentsPurchases[0]
            let properties = Object.keys(purchase)
            return properties.length
        },
        PaymentsPurchasePropertyName(propertyIndex) {
            if (!this.paymentsPurchases || this.paymentsPurchases.length <= 0) {
                return ''
            }

            let purchase = this.paymentsPurchases[0]
            let properties = Object.keys(purchase)
            return properties[propertyIndex]
        },
        PaymentsPurchasePropertyValue(purchaseIndex, property) {
            if (!this.paymentsPurchases || this.paymentsPurchases.length <= 0) {
                return ''
            }

            let purchase = this.paymentsPurchases[purchaseIndex]
            if (typeof property === 'number') {
                let properties = Object.keys(purchase)
                let propertyName = properties[property]
                return purchase[propertyName]
            }

            return purchase[property]
        },

        PaymentsCatalogItemsCount() {
            if (!this.paymentsCatalog) {
                return 0
            }

            return this.paymentsCatalog.length
        },
        PaymentsCatalogItemPropertiesCount() {
            if (!this.paymentsCatalog || this.paymentsCatalog.length <= 0) {
                return 0
            }

            let item = this.paymentsCatalog[0]
            let properties = Object.keys(item)
            return properties.length
        },
        PaymentsCatalogItemPropertyName(propertyIndex) {
            if (!this.paymentsCatalog || this.paymentsCatalog.length <= 0) {
                return ''
            }

            let item = this.paymentsCatalog[0]
            let properties = Object.keys(item)
            return properties[propertyIndex]
        },
        PaymentsCatalogItemPropertyValue(itemIndex, property) {
            if (!this.paymentsCatalog || this.paymentsCatalog.length <= 0) {
                return ''
            }

            let item = this.paymentsCatalog[itemIndex]
            if (typeof property === 'number') {
                let properties = Object.keys(item)
                let propertyName = properties[property]
                return item[propertyName]
            }

            return item[property]
        },
        PaymentsFirstCatalogItemPropertyValue(filterProperty, filterPropertyValue, property) {
            if (!this.paymentsCatalog || this.paymentsCatalog.length <= 0) {
                return ''
            }

            let item = this.paymentsCatalog.find(item => item[filterProperty] === filterPropertyValue)
            if (!item) {
                return ''
            }

            if (typeof property === 'number') {
                let properties = Object.keys(item)
                let propertyName = properties[property]
                return item[propertyName]
            }

            return item[property]
        },


        // remote-config
        RemoteConfigValue(key) {
            if (!this.remoteConfig) {
                return null
            }

            return this.remoteConfig[key]
        }
    }
}
