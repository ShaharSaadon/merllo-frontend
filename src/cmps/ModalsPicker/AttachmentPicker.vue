<template>
  <div class="attachments-picker">
    <form @submit.prevent="handleFile">
      <h3>Attach a link</h3>
      <input ref="mainInput" placeholder="Paste any link here..." v-model="this.imgUrl" type="text" />
      <h3 v-if="this.imgUrl">Link name (optional)</h3>
      <input v-if="this.imgUrl"  v-model="this.title" type="text" />
      <button class="btn-attach">Attach</button>
    </form>
  </div>
</template>

<script>
import { uploadService } from '../../services/upload.service'
import { utilService } from '../../services/util.service'

export default {
  props: {},
  name: '',
  data() {
    return {
      imgUrl: '',
      title: '',
    }
  },
  methods: {
   async handleFile() {
      const val = await uploadService.handleFile(this.imgUrl)
      val.title = this.title
      this.$emit('updateEntityVal', { key: 'attachments', val })
    },
  },
  computed: {},
  created() {
    this.$nextTick(() => this.$refs.mainInput.focus())
  },
  components: {},
}
</script>
