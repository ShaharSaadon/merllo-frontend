<template>
  <div class="group-preview-wrapper">
    <div class="group-preview-content">
      <header class="group-preview-header flex space-between align-center drag-me">
        <!-- <h3>{{ group.title }}</h3> -->

        <form @submit.prevent="updateGroup">
          <textarea
            ref="textArea"
            v-model="clonedGroup.title"
            @input="resize($event)"
            rows="1"
            cols="50"
            @keydown.enter.prevent="onGroupEnter"
            @blur="updateGroup"
          ></textarea>
        </form>
      </header>
      <TaskList :tasks="tasks" :groupId="group.id" @updateTasks="updateTasksPos" />

      <footer>
        <div class="add-card-container flex" v-if="!isOnEdit" @click="onEdit">
          <i v-html="getSvg('plus')"></i>
          <p>Add a card</p>
        </div>
        <div class="add-a-card flex" v-if="isOnEdit">
          <textarea
            @keydown.enter.prevent="addTask"
            @click.stop
            @blur="addTask"
            @input="resize($event)"
            v-model="newTask.title"
            ref="newTaskInput"
            placeHolder="Enter a title for this card..."
          >
          </textarea>
          <div class="footer-actions flex algin-center">
            <button>Add card</button>
            <span class="close" @click="closeEdit"></span>
          </div>
        </div>

        <!-- <span @click="$emit('removed')"></span> -->
      </footer>
      <!-- <button @click="$emit('removed')">x</button> -->
    </div>
  </div>
</template>

<script>
import TaskList from './TaskList.vue'
import { svgService } from '../../services/svg.service.js'
// import { boardService } from '../../services/board.service.local.js'
import { boardService } from '../../services/board.service.js'
import { add } from 'lodash'

export default {
  name: 'GroupPreview',
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      clonedGroup: { ...this.group },
      isOnEdit: false,
      newTask: boardService.getEmptyTask(),
      isOnFocus: false,
    }
  },
  methods: {
    getSvg(iconName) {
      return svgService.getMerlloSvg(iconName)
    },
    addTask() {
      if (!this.newTask.title) return
      this.$emit('saveTask', { groupId: this.group.id, task: this.newTask })
      this.newTask = boardService.getEmptyTask()
      this.$nextTick(() => this.$refs.newTaskInput.focus())
    },
    onGroupEnter() {
      this.$refs.textArea.blur()
      this.updateGroup()
    },
    updateGroup() {
      this.$emit('updateGroup', this.clonedGroup)
    },
    updateTasksPos({ tasks, groupId }) {
      this.$emit('updateTasksPos', { tasks, groupId })
    },
    onEdit() {
      this.isOnEdit = true
      this.$nextTick(() => this.$refs.newTaskInput.focus())
    },
    closeEdit() {
      this.isOnEdit = false
      this.newTask = boardService.getEmptyTask()
    },
    resize(e) {
      e.target.style.height = 'maxcontent'
      e.target.style.height = `${e.target.scrollHeight}px`
    },
  },
  computed: {
    tasks() {
      return this.group.tasks
    },
  },
  created() {},
  components: {
    TaskList,
  },
}
</script>

<style></style>
