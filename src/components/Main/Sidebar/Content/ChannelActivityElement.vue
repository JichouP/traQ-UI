<template lang="pug">
div.channel-activity-wrap
  div.channel-activity-box(@click="channelLink()"
                           :class="{'activity-watched': isWatched}")
    div.channel-activity-channel
      div.channel-activity-before(:class="channelBeforeClass")
        | #
      div.channel-activity-name
        | {{ channelName }}
    hr.channel-activity-separator
    p.channel-recent-message
      span.channel-recent-message-author
        | {{ authorName }}
      span.channel-recent-message-content
        | {{ sanitizedMessage }}
      span.channel-recent-message-attachment-info(v-if="hasFile")
        | ファイルを送信しました
      span.channel-recent-message-attachment-info(v-if="hasMessage")
        | メッセージを引用しました
</template>

<script>
import md from '@/bin/markdown-it'
import { detectFiles } from '@/bin/utils'

export default {
  name: 'ChannelActivityElement',
  props: {
    model: Object
  },
  methods: {
    channelLink() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      this.$router.push(
        `/channels/${this.$store.getters.getChannelPathById(
          this.model.parentChannelId
        )}`
      )
    }
  },
  computed: {
    channelName() {
      return this.$store.state.channelMap[this.model.parentChannelId].name
    },
    authorName() {
      return this.$store.state.memberMap[this.model.userId].name
    },
    unreadNum() {
      return this.$store.getters.getChannelUnreadMessageNum(
        this.model.parentChannelId
      )
    },
    isWatched() {
      return (
        this.$store.state.currentChannel.channelId ===
        this.model.parentChannelId
      )
    },
    channelBeforeClass() {
      return { 'has-unread': this.unreadNum > 0 }
    },
    parsed() {
      const parsed = md.parseInline(this.model.content)
      return parsed[0].children
    },
    attachments() {
      return detectFiles(this.model.content)
    },
    hasMessage() {
      return this.attachments.filter(a => a.type === 'message').length > 0
    },
    hasFile() {
      return this.attachments.filter(a => a.type === 'file').length > 0
    },
    sanitizedMessage() {
      const parsed = md.parseInline(this.model.content)
      const tokens = parsed[0].children
      const message = []
      for (let token of tokens) {
        if (token.type === 'regexp-0') {
          // emoji
          message.push(token.meta.match[0])
        } else if (token.type === 'softbreak') {
          // newline
          message.push(' ')
        } else {
          message.push(token.content)
        }
      }
      return message.join('')
    }
  }
}
</script>

<style lang="sass">
.channel-activity-wrap
  display: block
.channel-activity-box
  position: relative
  margin: 0 0
  cursor: pointer
  padding: 16px
  word-break: break-all;
  border-bottom: 1px solid rgba(0,0,0,0.1)
  color: white
  &:hover
    background: rgba(0,0,0,0.1)
  &.activity-watched
    background: white
    color: $primary-color
.channel-activity-channel
  display: flex
  position: relative
  color: $text-light-color
  margin-bottom: 8px
  font-weight: bold
  flex: 1
  text-align: left
  cursor: pointer
  white-space: nowrap
  z-index: 1
  user-select: none
  height: 18px
.channel-activity-before
  position: relative
  display: flex
  flex: 0 0 20px
  justify-content: center
  align-items: center
  width: 20px
  height: 20px
  color: $text-light-color
  margin-right: 0.5rem
  font:
    weight: bold
    size: 1.5rem;
  .activity-watched &
    color: $primary-color
  &.has-unread::after
    content: ''
    position: absolute
    display: block
    width: 7px
    height: 7px
    right: -3px
    top: -3px
    border-radius: 100%
    background: $notification-color
.channel-activity-name
  width: 100%
  overflow: hidden
  .activity-watched &
    color: $primary-color
.channel-activity-separator
  border-color: rgba(255, 255, 255, 0.5)
  margin-left: 1.5rem

.channel-recent-message
  margin-left: 1.5rem
  max-height: 2rem
  font-size: 0.9rem
  overflow: hidden
  text-overflow: ellipsis

.channel-recent-message-author
  font-weight: bold
  margin-right: 1rem

.channel-toggle
  border: solid 1px $text-light-color
  border-radius: 5px
  &.has-unread-child
    border:
      color: $notification-color
      width: $notification-color
  .channel-opened &
    background: $text-light-color
    color: $primary-color
  .channel-watched &
    border-color: $primary-color
  .channel-watched.channel-opened &
    background: $primary-color
    color: $text-light-color
    border-color: $primary-color
.list-complete-enter-active, .list-complete-leave-active
  transition: all .2s ease
.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateX(-5px)

.channel-recent-message-attachment-info
  font-style: italic
</style>
