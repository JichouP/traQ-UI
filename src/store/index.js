import Vue from 'vue'
import Vuex from 'vuex'
import client from '@/bin/client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaded: false,
    channelData: [],
    channelMap: {},
    memberData: [],
    memberMap: {},
    tagData: [],
    tagMap: {},
    currentChannel: {},
    clipedMessages: {},
    unreadMessages: {},
    staredChannels: [],
    messages: [],
    messagesNum: 0,
    currentChannelTopic: {},
    currentChannelPinnedMessages: [],
    currentChannelNotifications: [],
    me: null,
    menuContent: 'channels',
    heartbeatStatus: {userStatuses: []},
    baseURL: process.env.NODE_ENV === 'development' ? 'https://traq-dev.herokuapp.com' : ''
  },
  mutations: {
    setMe (state, me) {
      state.me = me
    },
    setChannelData (state, newChannelData) {
      newChannelData.sort((lhs, rhs) => lhs.name > rhs.name)
      state.channelData = newChannelData
      function dfs (channel) {
        state.channelMap[channel.channelId] = channel
      }
      state.channelData.forEach(dfs)
    },
    setMemberData (state, newMemberData) {
      state.memberData = newMemberData
      state.memberData.forEach(member => {
        state.memberMap[member.userId] = member
      })
    },
    setTagData (state, newTagData) {
      state.tagData = newTagData
      state.tagData.forEach(tag => {
        state.tagMap[tag.tagId] = tag
      })
    },
    addMessages (state, message) {
      state.messages.push(message)
      state.messagesNum++
    },
    setMessages (state, messages) {
      state.messages = messages
    },
    updateMessage (state, message) {
      const index = state.messages.findIndex(mes => mes.messageId === message.messageId)
      if (index === -1) {
        return false
      }
      Vue.set(state.messages, index, message)
      return true
    },
    deleteMessage (state, messageId) {
      state.messages = state.messages.filter(message => message.messageId !== messageId)
    },
    setChannel (state, channelName) {
      if (!state.channelMap[channelName]) return
      state.channelName = channelName
      state.channelId = state.channelMap[channelName].channelId
      state.currentChannel = state.channelMap[channelName]
      state.messagesNum = 0
      state.messages = []
      this.dispatch('getMessages')
    },
    changeChannel (state, channel) {
      state.currentChannel = channel
      state.messagesNum = 0
      state.messages = []
    },
    loadStart (state) {
      state.loaded = false
    },
    loadEnd (state) {
      state.loaded = true
    },
    changeMenuContent (state, contentName) {
      state.menuContent = contentName
    },
    setClipedMessages (state, data) {
      data.forEach(message => {
        Vue.set(state.clipedMessages, message.messageId, message)
      })
    },
    setUnreadMessages (state, data) {
      data.forEach(message => {
        Vue.set(state.unreadMessages, message.messageId, message)
      })
    },
    setStaredChannels (state, data) {
      state.staredChannels = data
    },
    updateHeartbeatStatus (state, data) {
      state.heartbeatStatus = data
    },
    setCurrentChannelTopic (state, data) {
      state.currentChannelTopic = data
    },
    setCurrentChannelPinnedMessages (state, data) {
      state.currentChannelPinnedMessages = data
    },
    setCurrentChannelNotifications (state, data) {
      state.currentChannelNotifications = data
    }
  },
  getters: {
    childrenChannels (state) { return parentId => state.channelData.filter(channel => channel.parent === parentId && channel.name !== '') },
    getChannelByName (state, getters) {
      return channelName => {
        const channelLevels = channelName.split('/')
        let channel = null
        let channelId = ''
        channelLevels.forEach(name => {
          const levelChannels = getters.childrenChannels(channelId)
          channel = levelChannels.find(ch => ch.name === name)
          if (channel === undefined) return null
          channelId = channel.channelId
        })
        return channel
      }
    },
    getUserByName (state, getters) {
      return userName => {
        const user = state.memberData.find(user => user.name === userName)
        if (user) {
          return user
        } else {
          return null
        }
      }
    },
    getChannelPathById (state) {
      return channelId => {
        let current = state.channelMap[channelId]
        let path = current.name
        while (true) {
          const next = state.channelMap[current.parent]
          if (!next.name) {
            return path
          }
          path = next.name + '/' + path
          current = next
        }
      }
    },
    getTagByContent (state) {
      return tagContent => {
        const tag = state.tagData.find(tag => tag.tag === tagContent)
        if (tag) {
          return tag
        } else {
          return null
        }
      }
    },
    getFileDataById (state) {
      return fileId => {
        return client.getFileMeta(fileId)
      }
    },
    isPinned (state) {
      return messageId => {
        return state.currentChannelPinnedMessages.find(pin => pin.message.messageId === messageId)
      }
    },
    getMyId (state) {
      return state.me.userId
    },
    getMyName (state) {
      return state.me.name
    },
    notificationsOnMembers (state) {
      return state.currentChannelNotifications.map(id => state.memberMap[id])
    },
    notificationsOffMembers (state) {
      return state.memberData.filter(member => !state.currentChannelNotifications.find(id => id === member.userId))
    }
  },
  actions: {
    whoAmI ({state, commit}) {
      return client.whoAmI()
      .then(res => {
        commit('setMe', res.data)
      })
      .catch(() => {
        commit('setMe', null)
      })
    },
    getMessages ({state, commit}) {
      let nowChannel = state.currentChannel
      return client.loadMessages(state.currentChannel.channelId, 50, state.messagesNum)
      .then(res => {
        if (nowChannel === state.currentChannel) {
          state.messagesNum += res.data.length
          commit('setMessages', res.data.reverse().concat(state.messages))
        }
      })
    },
    updateChannels ({state, commit}) {
      return client.getChannels()
      .then(res => {
        commit('setChannelData', res.data)
      })
    },
    updateMembers ({state, commit}) {
      return client.getMembers()
      .then(res => {
        commit('setMemberData', res.data)
      })
    },
    updateTags ({state, commit}) {
      return client.getAllTags()
      .then(res => {
        commit('setTagData', res.data)
      })
    },
    updateClipedMessages ({state, commit}) {
      return client.getClipedMessages()
      .then(res => {
        commit('setClipedMessages', res.data)
      })
    },
    updateUnreadMessages ({state, commit}) {
      return client.getUnreadMessages()
      .then(res => {
        commit('setUnreadMessages', res.data)
      })
    },
    updateStaredChannels ({state, commit}) {
      return client.getStaredChannels()
      .then(res => {
        commit('setStaredChannels', res.data)
      })
    },
    getCurrentChannelTopic ({state, commit}, channelId) {
      return client.getChannelTopic(channelId)
      .then(res => {
        commit('setCurrentChannelTopic', res.data)
      })
    },
    getCurrentChannelPinnedMessages ({state, commit}, channelId) {
      return client.getPinnedMessages(channelId)
      .then(res => {
        commit('setCurrentChannelPinnedMessages', res.data)
      })
    },
    getCurrentChannelNotifications ({state, commit}, channelId) {
      return client.getNotifications(channelId)
      .then(res => {
        commit('setCurrentChannelNotifications', res.data)
      })
    }
  }
})
