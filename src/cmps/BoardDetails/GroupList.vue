<template>
  <section class="group-list" ref="group-list">
    <div class="draggable-group-list">
      <Draggable
        v-model="groupList"
        class="list-group"
        ghost-class="ghost"
        item-key="name"
        drag-class="drag"
        @start="drag = true"
        @end="drag = false"
      >
        <template #item="{ element }">
          <div class="group-preview-container">
            <GroupPreview
              :key="element.id"
              :group="element"
              @removed="$emit('removed', element.id)"
              @saveTask="$emit('saveTask', $event)"
              @updateGroup="$emit('updateGroup', $event)"
              @updateTasksPos="updateTasksPos"
            />
          </div>
        </template>
        <template #footer>
          <div class="group-preview-wrapper container">
            <transition>
              <div class="btn-add-another-list flex align-center" v-if="!isAddOpen" @click="isAddOpen = true">
                <span class="plus-icon"></span>
                <span>Add another list</span>
              </div>
            </transition>

            <transition>
              <div v-if="isAddOpen" class="group-preview-content add-new-group">
                <form @submit.prevent="addGroup" class="flex">
                  <textarea v-model="groupToAdd.title" placeHolder="Enter list title..."
                  @input="resize($event)"></textarea>
                  <div class="flex align-center">
                    <button>Add list</button>
                    <span @click.prevent="isAddOpen = false"></span>
                  </div>
                </form>
              </div>
            </transition>
          </div>
        </template>
      </Draggable>
    </div>
  </section>
</template>
<script>
import { eventBus } from '../../services/event-bus.service.js'
import { boardService } from '../../services/board.service.local.js'
import GroupPreview from './GroupPreview.vue'
import Draggable from 'vuedraggable'

export default {
  name: 'GroupList',
  props: {
    groups: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup(),
      isAddOpen: false,
      drag: false,
    }
  },
  methods: {
    addGroup() {
      if (!this.groupToAdd.title) return
      this.$emit('addGroup', this.groupToAdd)
      this.groupToAdd = boardService.getEmptyGroup()
    },
    toggleIsAddOpen() {
      this.isAddOpen = !this.isAddOpen
    },
    updateTasksPos({ tasks, groupId }) {
      this.$emit('updateTasksPos', { tasks, groupId })
    },
    resize(e){
      e.target.style.height='maxcontent'
      e.target.style.height= `${e.target.scrollHeight}px`
    },
  },
  computed: {
    groupList: {
      get() {
        return this.groups
      },
      set(groups) {
        this.$emit('updateGroups', groups)
      },
    },
  },
  created() {},
  components: {
    GroupPreview,
    Draggable,
  },
}
</script>