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
        PlatformLaunchSource() {
            if (window.bridge.platform.launchSource) {
                return window.bridge.platform.launchSource
            }

            return ''
        },
        PlatformDataValue(key) {
            const data = window.bridge.platform.data
            if (!data || data[key] === undefined) {
                return ''
            }

            return data[key]
        },
        PlatformDataAsJSON() {
            return JSON.stringify(window.bridge.platform.data || {})
        },
        ServerTime() {
            return this.serverTime
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
        PlayerExtraPropertiesCount() {
            let properties = Object.keys(window.bridge.player.extra)
            return properties.length
        },
        PlayerExtraPropertyName(propertyIndex) {
            let properties = Object.keys(window.bridge.player.extra)
            return properties[propertyIndex]
        },
        PlayerExtraPropertyValue(property) {
            let extra = window.bridge.player.extra
            if (typeof property === 'number') {
                let properties = Object.keys(extra)
                let propertyName = properties[property]
                return extra[propertyName]
            }

            return extra[property]
        },


        // storage
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
        AdvancedBannersState() {
            return window.bridge.advertisement.advancedBannersState
        },


        // social
        PostRewardsCount() {
            if (!this.postRewards) {
                return 0
            }

            return this.postRewards.length
        },
        PostRewardId(rewardIndex) {
            const reward = this.postRewards && this.postRewards[rewardIndex]
            return reward ? reward.id : ''
        },
        PostRewardAmount(rewardIndex) {
            const reward = this.postRewards && this.postRewards[rewardIndex]
            return reward ? reward.amount : 0
        },
        PostRewardType(rewardIndex) {
            const reward = this.postRewards && this.postRewards[rewardIndex]
            return reward ? reward.type : ''
        },
        PostRewardsAsJSON() {
            if (!this.postRewards) {
                return '[]'
            }

            return JSON.stringify(this.postRewards)
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
        },


        // cross-promo
        CrossPromoGamesCount() {
            if (!this.crossPromoGames) {
                return 0
            }

            return this.crossPromoGames.length
        },
        CrossPromoGamesPropertiesCount() {
            if (!this.crossPromoGames || this.crossPromoGames.length <= 0) {
                return 0
            }

            let game = this.crossPromoGames[0]
            let properties = Object.keys(game)
            return properties.length
        },
        CrossPromoGamesPropertyName(propertyIndex) {
            if (!this.crossPromoGames || this.crossPromoGames.length <= 0) {
                return ''
            }

            let game = this.crossPromoGames[0]
            let properties = Object.keys(game)
            return properties[propertyIndex]
        },
        CrossPromoGamesPropertyValue(gameIndex, property) {
            if (!this.crossPromoGames || this.crossPromoGames.length <= 0) {
                return ''
            }

            let game = this.crossPromoGames[gameIndex]

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
        CrossPromoGamesAsJSON() {
            if (!this.crossPromoGames) {
                return '[]'
            }

            return JSON.stringify(this.crossPromoGames)
        },


        // tasks
        TasksCount() {
            if (!this.tasksList) {
                return 0
            }

            return this.tasksList.length
        },
        TasksAsJSON() {
            if (!this.tasksList) {
                return '[]'
            }

            return JSON.stringify(this.tasksList)
        },
        TaskId(taskIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            return task ? task.id : ''
        },
        TaskType(taskIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            return task ? task.type : ''
        },
        TaskTargetsCount(taskIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            return task && task.targets ? task.targets.length : 0
        },
        TaskTargetId(taskIndex, targetIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            const target = task && task.targets && task.targets[targetIndex]
            return target ? target.id : ''
        },
        TaskTargetAmount(taskIndex, targetIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            const target = task && task.targets && task.targets[targetIndex]
            return target ? target.amount : 0
        },
        TaskTargetProgress(taskIndex, targetIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            const target = task && task.targets && task.targets[targetIndex]
            return target ? target.progress : 0
        },
        TaskRewardsCount(taskIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            return task && task.rewards ? task.rewards.length : 0
        },
        TaskRewardId(taskIndex, rewardIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            const reward = task && task.rewards && task.rewards[rewardIndex]
            return reward ? reward.id : ''
        },
        TaskRewardAmount(taskIndex, rewardIndex) {
            const task = this.tasksList && this.tasksList[taskIndex]
            const reward = task && task.rewards && task.rewards[rewardIndex]
            return reward ? reward.amount : 0
        },


        // daily rewards
        DailyRewardsCount() {
            if (!this.dailyRewardsList) {
                return 0
            }

            return this.dailyRewardsList.length
        },
        DailyRewardsAsJSON() {
            if (!this.dailyRewardsList) {
                return '[]'
            }

            return JSON.stringify(this.dailyRewardsList)
        },
        DailyRewardsReward(rewardIndex) {
            const reward = this.dailyRewardsList && this.dailyRewardsList[rewardIndex]
            return reward ? reward : ''
        },
        DailyRewardsCurrentDay() {
            return this.dailyRewardsCurrentDay || 0
        },
        DailyRewardsCurrentReward() {
            return this.dailyRewardsCurrentReward || ''
        },


        // multiplayer
        MultiplayerState() {
            return window.bridge.multiplayer.state || ''
        },
        MultiplayerRoomId() {
            return window.bridge.multiplayer.roomId || ''
        },
        MultiplayerPlayerId() {
            return window.bridge.multiplayer.playerId || ''
        },
        MultiplayerHostId() {
            return window.bridge.multiplayer.hostId || ''
        },
        MultiplayerIsHost() {
            return window.bridge.multiplayer.isHost ? 1 : 0
        },
        MultiplayerLaunchRoomId() {
            return window.bridge.multiplayer.launchRoomId || ''
        },
        MultiplayerLastErrorCode() {
            return this.multiplayerLastErrorCode || ''
        },
        MultiplayerLastRoomLeftReason() {
            return this.multiplayerLastRoomLeftReason || ''
        },

        MultiplayerRoomAsJSON() {
            const room = window.bridge.multiplayer.room
            return room ? JSON.stringify(room) : ''
        },
        MultiplayerRoomMaxPlayers() {
            const room = window.bridge.multiplayer.room
            return room ? room.maxPlayers : 0
        },
        MultiplayerRoomProperty(key) {
            const room = window.bridge.multiplayer.room
            return this.toExpressionValue(room && room.properties ? room.properties[key] : null)
        },
        MultiplayerRoomPropertiesAsJSON() {
            const room = window.bridge.multiplayer.room
            return JSON.stringify(room && room.properties ? room.properties : {})
        },

        MultiplayerRoomPlayersCount() {
            return window.bridge.multiplayer.players.length
        },
        MultiplayerRoomPlayersAsJSON() {
            return JSON.stringify(window.bridge.multiplayer.players)
        },
        MultiplayerRoomPlayerId(playerIndex) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return player ? player.id : ''
        },
        MultiplayerRoomPlayerName(playerIndex) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return player && player.name ? player.name : ''
        },
        MultiplayerRoomPlayerIsHost(playerIndex) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return player && player.isHost ? 1 : 0
        },
        MultiplayerRoomPlayerIsConnected(playerIndex) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return player && player.isConnected ? 1 : 0
        },
        MultiplayerRoomPlayerProperty(playerIndex, key) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return this.toExpressionValue(player && player.properties ? player.properties[key] : null)
        },
        MultiplayerRoomPlayerPropertiesAsJSON(playerIndex) {
            const player = window.bridge.multiplayer.players[playerIndex]
            return JSON.stringify(player && player.properties ? player.properties : {})
        },

        MultiplayerLastEventPlayerId() {
            const player = this.multiplayerLastEventPlayer
            return player ? player.id : ''
        },
        MultiplayerLastEventPlayerName() {
            const player = this.multiplayerLastEventPlayer
            return player && player.name ? player.name : ''
        },
        MultiplayerLastEventPlayerProperty(key) {
            const player = this.multiplayerLastEventPlayer
            return this.toExpressionValue(player && player.properties ? player.properties[key] : null)
        },
        MultiplayerLastEventPlayerAsJSON() {
            const player = this.multiplayerLastEventPlayer
            return player ? JSON.stringify(player) : ''
        },

        MultiplayerLastMessageType() {
            const message = this.multiplayerLastMessage
            return message ? message.type : ''
        },
        MultiplayerLastMessageFrom() {
            const message = this.multiplayerLastMessage
            return message && message.from ? message.from : ''
        },
        MultiplayerLastMessageData() {
            const message = this.multiplayerLastMessage
            if (!message || message.data === null || typeof message.data === 'undefined') {
                return ''
            }

            // plain strings are returned as is, everything else as a JSON string
            return typeof message.data === 'string' ? message.data : JSON.stringify(message.data)
        },
        MultiplayerLastMessageDataValue(key) {
            const message = this.multiplayerLastMessage
            const data = message && this.isObject(message.data) ? message.data : null
            return this.toExpressionValue(data ? data[key] : null)
        },

        // The world is the last one set on this player or received from the host
        MultiplayerSyncStateValue(key) {
            const world = window.bridge.multiplayer.syncState
            return this.toExpressionValue(this.isObject(world) ? world[key] : null)
        },

        MultiplayerRoomListCount() {
            return this.multiplayerRooms ? this.multiplayerRooms.length : 0
        },
        MultiplayerRoomListAsJSON() {
            return JSON.stringify(this.multiplayerRooms || [])
        },
        MultiplayerRoomListId(roomIndex) {
            const room = this.multiplayerRooms && this.multiplayerRooms[roomIndex]
            return room ? room.id : ''
        },
        MultiplayerRoomListPlayerCount(roomIndex) {
            const room = this.multiplayerRooms && this.multiplayerRooms[roomIndex]
            return room ? room.playerCount : 0
        },
        MultiplayerRoomListMaxPlayers(roomIndex) {
            const room = this.multiplayerRooms && this.multiplayerRooms[roomIndex]
            return room ? room.maxPlayers : 0
        },
        MultiplayerRoomListProperty(roomIndex, key) {
            const room = this.multiplayerRooms && this.multiplayerRooms[roomIndex]
            return this.toExpressionValue(room && room.properties ? room.properties[key] : null)
        }
    }
}
