<template>
  <div @click="$emit('closeFastEdit')" class="quick-edit-background"></div>
  <section :style="quickEditPos" class="quick-edit">
    <div class="main-edit">
      <textarea
        ref="textarea"
        @keydown.enter="saveTaskAndClose"
        type="text"
        v-model="currTask.title"
        v-if="currTask"
      ></textarea>
      <button class="btn-save" @click="saveTaskAndClose">Save</button>
    </div>
    <div class="quick-edit-buttons" :class="{ 'menu-to-left': menuToLeft }">
      <button class="quick-edit-btn" @click="$emit('closeFastEdit')">
        <RouterLink style="text-decoration: none" :to="'/board/' + boardId + '/' + this.groupId + '/' + task.id">
          <span class="open icon"></span>
          Open card
        </RouterLink>
      </button>

      <button
        class="quick-edit-btn"
        @click.stop="toggleModal(cmp.cmpType, $event)"
        v-for="cmp in cmps"
        :key="cmp.title"
      >
        <span class="icon" :class="cmp.class"></span>{{ cmp.title }}
      </button>
    </div>
  </section>

  <ModalPicker
    ref="modal"
    v-if="modal.isModalOpen"
    :modal="modal"
    @closeModal="toggleModal"
    @updateEntityVal="updateEntityVal"
    @switchDynamicCmp="toggleModal"
    @updateLabel="updateLabel"
    @removeLabel="removeLabel"
    @saveTask="saveTask"
    @removeEntityVal="removeEntityVal"
    :style="modalPos"
  />
</template>

<script>
import ModalPicker from '../../cmps/ModalPicker.vue'
import { utilService } from '../../services/util.service'
export default {
  name: 'QuickEdit',
  emits: ['closeFastEdit'],
  props: {
    quickEditPos: {
      type: Object,
    },
  },
  data() {
    return {
      modal: {
        type: '',
        isModalOpen: false,
        pos: { top: null, left: null },
      },
      menuToLeft: false,
      cmps: [
        { class: 'members', cmpType: 'MemberPicker', title: ' Change members' },
        { class: 'labels', cmpType: 'LabelPicker', title: ' Edit labels' },
        { class: 'dates', cmpType: 'DatePicker', title: ' Edit dates' },
        { class: 'cover', cmpType: 'CoverPicker', title: ' Change cover' },
        { class: 'delete', cmpType: 'removeModal', title: 'Delete' },
      ],
      currTask: null,
    }
  },
  created() {
    const x = this.quickEditPos.left.slice(0, this.quickEditPos.left.length - 2)
    const { width } = window.visualViewport
    if (width - x < 450) this.menuToLeft = true
    this.$nextTick(() => {
      this.$refs.textarea.focus()
      this.$refs.textarea.select()
    })
  },
  methods: {
    toggleModal(cmpType, ev, id) {
      if (ev) this.setModalPos(ev)
      let isModalOpen = true
      let type = cmpType

      if (this.modal.type === cmpType || !cmpType) {
        isModalOpen = false
        type = null
      }
      this.modal.isModalOpen = isModalOpen
      this.modal.type = type
      if (id) this.modal.id = id
      if (isModalOpen) {
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.modal.pos.height = this.$refs.modal.$el.offsetHeight
          })
        })
      }
    },
    setModalPos(ev) {
      const target = ev.target.localName === 'span' ? ev.target.offsetParent : ev.target
      let { x, y, height } = target.getBoundingClientRect()
      y += height + 4
      this.modal.pos.left = x
      this.modal.pos.top = y
    },
    async saveTask({ key, newVal, activity }) {
      if (!activity) activity = ['added', key, 'from', this.task.title]
      const task = JSON.parse(JSON.stringify(this.currTask))
      task[key] = newVal
      const groupId = this.currTask.groupId
      try {
        this.$store.dispatch({ type: 'saveTask', groupId, task, activity })
        // showSuccessMsg('Task added')
      } catch (err) {
        console.log(err)
        // showErrorMsg('Cannot add Task')
      }
    },
    saveTaskAndClose() {
      this.saveTask({key:'title', newVal: this.currTask.title})
      this.$emit('closeFastEdit')

    },
    updateEntityVal({ key, val }) {
      let activity
      const valToChange = JSON.parse(JSON.stringify(this.task[key]))
      const itemId = val.id ?? val
      // finds the item index and pushes or removes
      const idx = valToChange.findIndex((item) => item.id === itemId)
      if (idx === -1) {
        valToChange.push(val)
        activity = ['added', `${key.slice(0, -1)}`, 'to', this.task.title]
      } else {
        valToChange.splice(idx, 1, val)
      }
      this.saveTask({ key, newVal: valToChange, activity })
    },
    updateLabel(label) {
      const labels = JSON.parse(JSON.stringify(this.labels))
      const idx = labels.findIndex((l) => l.id === label.id)
      if (idx === -1) {
        label.id = utilService.makeId()
        labels.push(label)
      } else {
        labels.splice(idx, 1, label)
      }
      this.$store.dispatch('updateBoardEntity', { key: 'labels', val: labels })
    },
    removeLabel(labelId) {
      const labels = JSON.parse(JSON.stringify(this.labels))
      const idx = labels.findIndex((l) => l.id === labelId)
      labels.splice(idx, 1)
      this.$store.dispatch('updateBoardEntity', { key: 'labels', val: labels })
    },
    removeEntityVal({ key, val }) {
      let activity
      const task = JSON.parse(JSON.stringify(this.task))
      let idx
      if (val.id) {
        idx = task[key].findIndex((item) => item.id === val.id)
      } else {
        idx = task[key].findIndex((id) => id === val)
      }
      task[key].splice(idx, 1)
      activity = ['removed', `${key.slice(0, -1)}`, 'from', this.task.title]
      this.saveTask({ key, newVal: task[key], activity })
    },
  },
  computed: {
    boardId() {
      return this.$route.params.id
    },
    task() {
      return this.$store.getters.currTask
    },
    taskId() {
      return this.task.id
    },
    groupId() {
      return this.task.groupId
    },
    labels() {
      return JSON.parse(JSON.stringify(this.$store.getters.labels))
    },
    modalPos() {
      let x = this.modal.pos.left
      let y = this.modal.pos.top
      let modalHeight = this.modal.pos.height
      const { width, height } = window.visualViewport
      if (width - x < 304) x = width - 308
      if (y + modalHeight > height) y = 48
      return { top: y + 'px', left: x + 'px' }
    },
  },
  mounted() {
    this.currTask = { ...this.task }
  },
  components: {
    ModalPicker,
  },
}
</script>

<style></style>
