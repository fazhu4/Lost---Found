<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { usePersonStore, useImgStore } from '@/stores'
import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const getToken = usePersonStore()

const getImg = useImgStore()

const textarea = ref('')

const userInfo = ref({
  headerImg: '',
  textarea: '',
})

const headers = ref({
  Authorization: JSON.parse(localStorage.getItem('authToken')), // 根据实际需求修改
})

const imgPath = ref()

const handleSuccess = async (response) => {
  console.log(1)
  console.log('服务器返回:', response)
  // 保存返回的图片URL（根据后端实际返回字段调整）
  userInfo.value.headerImg = response.data
  getImg.setImg(userInfo.value)
  console.log(response.data)
}

const updateRate = () => {
  getImg.setImg(userInfo.value)
}

const handleError = (error, file) => {
  console.error('错误信息:', error)
}

onMounted(() => {
  console.log(getToken.profile)
})

const emit = defineEmits(['validate', 'submit'])

// 验证内容或图片是否至少有一项
const validateContent = () => {
  const isValid = userInfo.value.textarea.trim() !== '' || userInfo.value.headerImg !== ''
  emit('validate', isValid)
  return isValid
}

// 监听内容变化
watch(() => userInfo.value.textarea, validateContent)
watch(() => userInfo.value.headerImg, validateContent)

const state = ref(true)
</script>

<template>
  <div class="fileBox">
    <div class="fileLeft">
      <div class="fileContent">
        <div class="fileWord">文本内容</div>
        <div class="fileIcon"></div>
      </div>
      <el-input v-model="userInfo.textarea" @blur="updateRate" :resize="'none'" type="textarea" placeholder="请在此输入文字" />
    </div>
    <div class="fileRight">
      <div class="imgContent">
        <div class="imgWord">图片内容</div>
        <div class="imgIcon"></div>
      </div>
      <div class="imgInput">
        <el-upload
          class="upload-demo"
          drag
          action="
            http://8.153.198.100:8091/upload/img"
          :headers="headers"
          v-model:file-list="fileList"
          :on-success="handleSuccess"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          name="file"
          multiple
        >
          <div class="bgInline">
            <div class="leftInline"></div>
            <div class="onLoadFile">
              <div class="topLoad">请在此上传您的文件</div>
              <div class="bottomeLoad">
                Drag & drop or
                <div>browse</div>
                your file here
              </div>
            </div>
          </div>
        </el-upload>
        <el-dialog v-model="dialogVisible" class="fullscreen-dialog">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fileBox {
  width: 93%;
  height: auto;
  display: flex;
  gap: 5.2%;
  margin-top: 13px;
  margin-left: 52px;

  .fileLeft {
    width: 47%;
    height: auto;

    .fileContent {
      width: auto;
      height: 24px;
      display: flex;
      align-items: center;
      gap: 2px;

      .fileWord {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
      }

      .fileIcon {
        width: 24px;
        height: 24px;
        background-image: url('@/assets/nose/Note.png');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    .el-textarea {
      position: relative; /* 确保伪元素相对于父元素定位 */
      background-color: transparent; /* 背景透明 */
      overflow: hidden; /* 确保伪元素的圆角不溢出 */
      margin-top: 12px;
    }

    .el-textarea :deep(.el-textarea__inner) {
      width: 100%;
      height: 253px; /* 设置高度 */
      background-color: transparent; /* 背景透明 */
      border: 2px solid; /* 设置边框宽度 */
      border-image: linear-gradient(270deg, rgba(0, 186, 173, 0.6), rgba(42, 130, 228, 0.6)) 1; /* 渐变边框 */
      box-shadow: none; /* 去除阴影 */
      padding: 2px; /* 确保内容不紧贴边框 */
      position: relative; /* 确保伪元素相对于父元素定位 */
      z-index: 1; /* 确保内容在伪元素之上 */
      font-size: 12px;
      color: rgba(135, 135, 135, 1);
      padding-top: 16px;
      padding-left: 11px;
      padding-right: 11px;
    }
  }

  .fileRight {
    width: 47%;
    height: auto;

    .imgContent {
      width: auto;
      height: 24px;
      display: flex;
      align-items: center;
      gap: 2px;

      .imgWord {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
      }

      .imgIcon {
        width: 24px;
        height: 24px;
        background-image: url('@/assets/nose/Add Photo.png');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    .imgInput {
      width: 100%;
      height: 253px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent; /* 背景透明 */
      border: 2px solid; /* 设置边框宽度 */
      border-image: linear-gradient(270deg, rgba(0, 186, 173, 0.6), rgba(42, 130, 228, 0.6)) 1; /* 渐变边框 */
      border-radius: 8px; /* 设置圆角 */
      overflow: hidden; /* 确保伪元素的圆角不溢出 */
      margin-top: 12px;
      padding: 22px;

      .upload-demo {
        width: 100%;
        height: 100%;

        :deep(.el-upload-list) {
          width: 100%;
          height: 233px;
          display: flex;
          align-items: center;
          justify-content: center;

          .el-upload-list__item {
            width: 200px;
            height: 233px;
            background-color: transparent;
            border: none;

            .el-upload-list__item-thumbnail {
              width: 200px;
              height: 233px;
            }
          }
        }

        :deep(.el-upload-list) {
          width: 100%;
          height: 100%;
        }

        :deep(.el-upload) {
          width: 100%;
          height: 100%;
          background-color: transparent;
        }

        :deep(.el-upload-dragger) {
          width: 100%;
          height: 100%;
          background-color: transparent;
          position: relative;

          .bgInline {
            position: absolute;
            width: 98%;
            height: 98%;
            top: 1%;
            left: 1%;
            display: flex;
            align-items: center;
            gap: 140px;

            .leftInline {
              width: 127px;
              height: 149px;
              background-image: url('@/assets/nose/无异常标识 (1).png');
              background-repeat: no-repeat;
              background-size: contain;
              margin-left: 78px;
            }

            .leftInlines {
              width: 127px;
              height: 149px;

              margin-left: 78px;
            }

            .onLoadFile {
              width: 210px;
              height: auto;

              .topLoad {
                width: 100%;
                height: 24px;
                font-size: 16px;
                font-weight: 500;
                color: rgba(143, 155, 179, 1);
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .bottomeLoad {
                width: 100%;
                height: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                color: rgba(143, 155, 179, 1);

                div {
                  height: 16px;
                  margin-right: 2px;
                  margin-left: 2px;
                  color: rgba(6, 118, 237, 1);
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
