<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name + '(' + item.key + ')'"
          :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span class="link-type" @click="handlePreview(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Firstname" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.firstName || 'Not data' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Lastname" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastName || 'Not data' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone || 'Not data' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="110px">
        <template slot-scope="{row}">
          <el-tag>{{ row.email || 'Not data' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Username" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username || 'Not data' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Rating" width="160px" align="center">
        <template slot-scope="{row}">
          <span :style="{ color: raitingColoring(row.rating) }">{{ row.rating }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bio" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bio || 'Not data' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Followers" width="80px">
        <template slot-scope="{row}">
          <span style="color:green;">{{ row.numFollowers }}</span>
          <svg-icon style="color: green;" icon-class="arrow_up" class="meta-item__icon" />
          <span style="color:red; margin-left: 10px;">{{ row.numNegativeFollowers }}</span>
          <svg-icon style="color: red;" icon-class="arrow_down" class="meta-item__icon" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="Reactions" align="center" width="95">
        <template slot-scope="{row}">
          <span style="color:green;">{{ row.numPositiveReactions }}</span>
          <svg-icon style="color: green;" icon-class="arrow_up" class="meta-item__icon" />
          <span style="color:red; margin-left: 10px;">{{ row.numNegativeReactions }}</span>
          <svg-icon style="color: red;" icon-class="arrow_down" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Reposts" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.numReposts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Replies" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.numReplies }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :offset.sync="listQuery.offset"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div class="dialog-inner">
        <div class="dialog-row">
          <p>Title</p>
          <h1>{{ temp.title || 'No data' }}</h1>
        </div>
        <!-- <div class="dialog-row">
          <p>Title</p>
          <h1>{{ temp.title || 'No data' }}</h1>
        </div> -->
        <json-editor :value="temp" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.dialog-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dialog-row {
  display: flex;
  flex-direction: column;
  gap: 10px;

  * {
    margin: 0;
  }
}
</style>

<script>
import { fetchPv, createArticle, updateArticle, fetchUser } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'ComplexTable',
  components: { Pagination, JsonEditor },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 20,
        search: null,
        offset: 1
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: true,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        view: 'Preview'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const query = {}
      for (const [key, value] of Object.entries(this.listQuery)) {
        if (!value) continue
        query[key] = value
      }
      fetchUser({
        ...query

      }).then(response => {
        this.list = response.results
        this.total = response.count
      }).finally(() => {
        this.listLoading = false
      })
    },
    raitingColoring(rating) {
      switch (true) {
        case rating < 5:
          return 'red'
        case rating >= 5 && rating < 10:
          return 'orange'
        default:
          return 'green'
      }
    },
    handleFilter() {
      if (!this.listQuery.search) {
        this.listQuery.search = null
      }
      this.listQuery.after = null
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.reversed = true
      } else {
        this.listQuery.reversed = false
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlePreview(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
