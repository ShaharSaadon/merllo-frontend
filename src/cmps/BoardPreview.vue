<template>
  <li class="board-preview" :style="board.style">
    <router-link :to="'board/' + board._id">
      <div class="fade"></div>
      <div class="container">
        <div class="board-title">{{ board.title }}</div>
        <!-- <button @click="$emit('removeBoard', board._id)">x</button> -->
        <!-- <button @click="$emit('updateBoard', board)">Update</button> -->
      </div>
    </router-link>
    <button :class="getStarClass" @click.stop="onToggleStarred" class="btn-star-toggle"></button>
  </li>
</template>

<script>
export default {
  name: 'BoardPreview',
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    async onToggleStarred() {
      this.$emit('updateBoardEntity', this.board._id, 'isStarred', !this.board.isStarred)
    },
  },
  computed: {
    getStarClass() {
      return this.board.isStarred ? 'starred' : ''
    },
  },
  created() {},
  components: {},
}
</script>

<style></style>
