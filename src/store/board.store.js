import { boardService } from '../services/board.service.local'
// import { boardService } from '../services/board.service'

export function getActionRemoveBoard(boardId) {
  return {
    type: 'removeBoard',
    boardId,
  }
}
export function getActionAddBoard(board) {
  return {
    type: 'addBoard',
    board,
  }
}
export function getActionUpdateBoard(board) {
  return {
    type: 'updateBoard',
    board,
  }
}
export function getActionRemoveGroup(boardId, groupId) {
  return {
    type: 'removeGroup',
    boardId,
    groupId,
  }
}
export function getActionAddGroup(boardId, group) {
  return {
    type: 'addGroup',
    boardId,
    group,
  }
}
export function getActionUpdateGroup(boardId, group) {
  return {
    type: 'updateGroup',
    boardId,
    group,
  }
}
export function getActionSaveTask({ boardId, groupId, task }) {
  return {
    type: 'saveTask',
    boardId,
    groupId,
    task,
  }
}

export const boardStore = {
  state: {
    boards: [],
    watchedBoardId: null,
    currTask: null,
    appHeaderBgc: '',
    isRightSideBarOpen: false,
    bgOpts: [
      {
        bgc: '#07479E',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/707f35bc691220846678.svg)',
        LeftSideBarBgc: 'hsla(215,90%,37.7%,0.9)',
      },
      {
        bgc: '#2F1C0A',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/1cbae06b1a428ad6234a.svg)',
        LeftSideBarBgc: 'hsla(30,63.4%,16.1%,0.9)',

      },
      {
        bgc: '#07479E',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/d106776cb297f000b1f4.svg)',
        LeftSideBarBgc: 'hsla(215,90%,37.7%,0.9)',
      },
      {
        bgc: '#082854',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/8ab3b35f3a786bb6cdac.svg)',
        LeftSideBarBgc: 'hsla(215,84.6%,22.9%,0.9)',
      },
      {
        bgc: '#463699',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/a7c521b94eb153008f2d.svg)',
        LeftSideBarBgc: 'hsla(250,47.9%,45.7%,0.9)',
      },
      {
        bgc: '#872013',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/aec98becb6d15a5fc95e.svg)',
        LeftSideBarBgc: 'hsla(7,75.7%,35.1%,0.9)',
      },
      {
        bgc: '#821659',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/b75536d1afb40980ca57.svg)',
        LeftSideBarBgc: 'hsla(323,70.6%,34.8%,0.9)',
      },
      {
        bgc: '#14553A',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/92e67a71aaaa98dea5ad.svg)',
        LeftSideBarBgc: 'hsla(155,62%,25.6%,0.9)',
      },
      {
        bgc: '#45536A',
        bgImg: 'url(https://a.trellocdn.com/prgb/assets/941e9fef7b1b1129b904.svg)',
        LeftSideBarBgc: 'hsla(218,20.4%,39.4%,0.9)',
      },
    ],
  },
  getters: {
    boards({ boards }) {
      return boards
    },
    watchedBoard({ boards, watchedBoardId }) {
      return boards.find((board) => board._id === watchedBoardId)
    },
    watchedBoardId({ watchedBoardId }) {
      return watchedBoardId
    },
    currTask({ currTask }) {
      return currTask
    },
    appHeaderBgc({ appHeaderBgc }) {
      return appHeaderBgc
    },
    labels(state, getters) {
      return getters.watchedBoard.labels
    },
    getLabelsById(state, getters) {
      return (id) => getters.labels.find((label) => label.id === id)
    },
    LeftSideBarBgc({ LeftSideBarBgc }) {
      return LeftSideBarBgc
    },
    isRightSideBarOpen({ isRightSideBarOpen }) {
      return isRightSideBarOpen
    },
    bgOpts({bgOpts}){
      return bgOpts
    }
    
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setAppHeaderBgc(state, { bgc }) {
      state.appHeaderBgc = bgc
    },
    setWatchedBoardId(state, { boardId }) {
      state.watchedBoardId = boardId
    },
    setCurrTask(state, { boardId, groupId, taskId }) {
      var board = state.boards.find((board) => board._id === boardId)
      var group = board.groups.find((group) => group.id === groupId)
      var task = group.tasks.find((task) => task.id === taskId)
      state.currTask = task
    },
    updateCurrTask(state, { task }) {
      state.currTask = task
    },
    updateBoard(state, { board }) {
      const idx = state.boards.findIndex((c) => c._id === board._id)
      state.boards.splice(idx, 1, board)
    },
    updateBoardEntity(state, { key, val }) {
      const board = state.boards.find((board) => board._id === state.watchedBoardId)
      board[key] = val
    },
    addBoard(state, { board }) {
      state.boards.push(board)
    },
    removeBoard(state, { boardId }) {
      state.boards = state.boards.filter((board) => board._id !== boardId)
    },
    updateGroups(state, { boardId, groups }) {
      var board = state.boards.find((board) => board._id === boardId)
      board.groups = groups
    },
    removeGroup(state, { boardId, groupId }) {
      var board = state.boards.find((board) => board._id === boardId)
      const idx = board.groups.findIndex((group) => group.id === groupId)
      board.groups.splice(idx, 1)
    },
    addGroup(state, { boardId, group }) {
      var board = state.boards.find((board) => board._id === boardId)
      board.groups.push(group)
    },
    updateGroup(state, { boardId, group }) {
      var board = state.boards.find((board) => board._id === boardId)
      const idx = board.groups.findIndex((g) => g.id === group.id)
      board.groups.splice(idx, 1, group)
    },
    updateTasksPos(state, { groupId, tasks }) {
      const board = state.boards.find((board) => board._id === state.watchedBoardId)
      const group = board.groups.find((group) => group.id === groupId)
      group.tasks = tasks
    },
    saveTask(state, { boardId, groupId, task }) {
      var board = state.boards.find((board) => board._id === boardId)
      var group = board.groups.find((group) => group.id === groupId)
      const idx = group.tasks.findIndex((t) => t.id === task.id)
      if (idx !== -1) {
        group.tasks.splice(idx, 1, task)
        state.currTask = task
      } else group.tasks.push(task)
      console.log('board: ', board)
    },
    onToggleMenu(state){
      state.isRightSideBarOpen=!state.isRightSideBarOpen
    }
  },
  actions: {
    async loadBoards(context) {
      try {
        const boards = await boardService.query()
        context.commit({ type: 'setBoards', boards })
      } catch (err) {
        console.log('boardStore: Error in loadBoards', err)
        throw err
      }
    },
    async addBoard(context, { board }) {
      try {
        board = await boardService.save(board)
        context.commit(getActionAddBoard(board))
        return board
      } catch (err) {
        console.log('boardStore: Error in addBoard', err)
        throw err
      }
    },
    async updateBoard(context, { board }) {
      try {
        context.commit(getActionUpdateBoard(board))
        board = await boardService.save(board)
        return board
      } catch (err) {
        console.log('boardStore: Error in updateBoard', err)
        throw err
      }
    },
    async updateBoardEntity(context, { key, val }) {
      try {
        context.commit({ type: 'updateBoardEntity', key, val })
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in updateBoard', err)
        throw err
      }
    },
    async removeBoard(context, { boardId }) {
      try {
        await boardService.remove(boardId)
        context.commit(getActionRemoveBoard(boardId))
      } catch (err) {
        console.log('boardStore: Error in removeBoard', err)
        throw err
      }
    },
    async updateGroups(context, { boardId, groups }) {
      try {
        context.commit({ type: 'updateGroups', boardId, groups })
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in removeGroup', err)
        throw err
      }
    },

    // Group
    async updateGroup(context, { boardId, group }) {
      try {
        context.commit(getActionUpdateGroup(boardId, group))
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in removeGroup', err)
        throw err
      }
    },
    async addGroup(context, { boardId, group }) {
      try {
        context.commit(getActionAddGroup(boardId, group))
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in removeGroup', err)
        throw err
      }
    },
    async removeGroup(context, { boardId, groupId }) {
      try {
        context.commit(getActionRemoveGroup(boardId, groupId))
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in removeGroup', err)
        throw err
      }
    },

    // Task
    async saveTask(context, { groupId, task }) {
      const boardId = context.getters.watchedBoardId
      try {
        if (task.id) {
          context.commit({ type: 'saveTask', boardId, groupId, task })
          task = await boardService.saveTask(boardId, groupId, task)
        } else {
          task = await boardService.saveTask(boardId, groupId, task)
          context.commit({ type: 'saveTask', boardId, groupId, task })
        }
      } catch (err) {
        console.log('boardStore: Error in save task', err)
        throw err
      }
    },

    async removeTask({ commit, getters }, { groupId, taskId }) {
      const savedBoard = JSON.parse(JSON.stringify(getters.watchedBoard))
      const currGroup = savedBoard.groups.find((g) => g.id === groupId)
      const taskIdx = currGroup.tasks.findIndex((task) => (task.id = taskId))
      currGroup.tasks.splice(taskIdx, 1)
      try {
        const board = await boardService.save(savedBoard)
        commit(getActionUpdateBoard(board))
        return board
      } catch (err) {
        console.log('boardStore: Error in delete Task', err)
        throw err
      }
    },
    async updateTasksPos(context, { groupId, tasks }) {
      try {
        context.commit({ type: 'updateTasksPos', groupId, tasks })
        context.dispatch(getActionUpdateBoard(context.getters.watchedBoard))
      } catch (err) {
        console.log('boardStore: Error in', err)
        throw err
      }
    },
  },
}
