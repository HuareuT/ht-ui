<template>
  <div class="tt-upload">
    <div class="tt-upload__container">
      <!-- 示例文件展示 -->
      <div class="tt-upload__item-wrapper" v-if="props.exampleUrl">
        <div class="tt-upload__item" @click="previewExampleFile">
          <img
            :src="exampleUrl"
            alt="示例图片加载中..."
            class="tt-upload__file"
            v-if="getFileType(exampleUrl) === 'IMAGE'"
          />
          <video
            :src="exampleUrl"
            alt="示例视频加载中..."
            class="tt-upload__file"
            v-else-if="getFileType(exampleUrl) === 'VIDEO'"
          ></video>
          <div
            class="tt-upload__placeholder tt-upload__placeholder--pdf"
            v-else-if="getFileType(exampleUrl) === 'PDF'"
          >
            <FilePdfOutlined class="tt-upload__file-icon" />
            <span class="tt-upload__file-text">PDF文件</span>
          </div>
          <div class="tt-upload__placeholder tt-upload__placeholder--other" v-else>
            <FileOutlined class="tt-upload__file-icon" />
            <span class="tt-upload__file-text">{{ getFileExtension(exampleUrl) }}</span>
          </div>
          <div class="tt-upload__example-badge">
            {{ exampleDisplayName }}
          </div>
        </div>
      </div>

      <!-- 已上传文件列表 -->
      <div
        class="tt-upload__item-wrapper"
        v-for="(item, index) in uploadedFiles"
        :key="`${item.name}-${index}`"
      >
        <div class="tt-upload__file-name" v-if="showName && item.name">{{ item.name }}</div>
        <div class="tt-upload__item">
          <!-- 上传中状态 -->
          <div v-if="!item.url && item.status === 'uploading'" class="tt-upload__uploading">
            <div class="tt-upload__progress">
              <div class="tt-upload__progress-text">{{ item.percent || 0 }}%</div>
              <div class="tt-upload__progress-bar">
                <div
                  class="tt-upload__progress-fill"
                  :style="{ width: (item.percent || 0) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 上传完成状态 -->
          <template v-else-if="item.url">
            <img
              :src="item.url"
              alt="图片加载中..."
              class="tt-upload__file"
              v-if="getFileType(item.url) === 'IMAGE'"
            />
            <video
              :src="item.url"
              alt="视频加载中..."
              class="tt-upload__file"
              v-else-if="getFileType(item.url) === 'VIDEO'"
            ></video>
            <div
              class="tt-upload__placeholder tt-upload__placeholder--pdf"
              v-else-if="getFileType(item.url) === 'PDF'"
            >
              <FilePdfOutlined class="tt-upload__file-icon" />
              <span class="tt-upload__file-text">PDF文件</span>
            </div>
            <div class="tt-upload__placeholder tt-upload__placeholder--other" v-else>
              <FileOutlined class="tt-upload__file-icon" />
              <span class="tt-upload__file-text">{{ getFileExtension(item.url) }}</span>
            </div>
          </template>

          <!-- 操作遮罩层 -->
          <div class="tt-upload__actions">
            <div
              class="tt-upload__action-btn tt-upload__action-btn--preview"
              @click.stop="previewFile(item, index)"
              v-if="allowedActions.includes('preview')"
              title="预览"
            >
              <EyeOutlined />
            </div>
            <div
              class="tt-upload__action-btn tt-upload__action-btn--reupload"
              @click.stop="reuploadFile(index)"
              v-if="allowedActions.includes('again')"
              title="重新上传"
            >
              <ReloadOutlined />
            </div>
            <div
              class="tt-upload__action-btn tt-upload__action-btn--delete"
              @click.stop="removeFile(index)"
              v-if="allowedActions.includes('delete')"
              title="删除"
            >
              <DeleteOutlined />
            </div>
            <div
              class="tt-upload__ps-check"
              @click.stop="checkFileForPhotoshop(item)"
              v-if="allowedActions.includes('ps') && getFileType(item.url) === 'IMAGE'"
            >
              <a-button type="link" size="mini" :loading="item.psCheckLoading">PS检测</a-button>
            </div>
          </div>

          <!-- 上传错误状态 -->
          <div class="tt-upload__error" v-if="item.status === 'error'">
            <i class="tt-upload__error-icon">!</i>
            <div class="tt-upload__error-text">上传失败</div>
          </div>
        </div>
      </div>

      <!-- 上传触发器 -->
      <div class="tt-upload__trigger" @click="triggerFileSelect" v-if="canUploadMore">
        <div class="tt-upload__trigger-content">
          <div class="tt-upload__trigger-icon">+</div>
          <div class="tt-upload__trigger-text">{{ placeholder }}</div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="fileInputElement"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileSelect"
      class="tt-upload__hidden-input"
    />

    <!-- 文件预览模态框 -->
    <preview-file-modal
      ref="previewModalRef"
      :fileList="previewFiles"
      title="文件预览"
      :width="800"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import {
    EyeOutlined,
    ReloadOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    FileOutlined,
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import PreviewFileModal from '../preview-file-modal/index.vue';

  // 组件属性定义
  const props = defineProps({
    // 文件列表数据
    value: {
      type: Array,
      default: () => [],
    },
    // 示例文件URL
    exampleUrl: {
      type: String,
      default: '',
    },
    // 允许的文件类型
    accept: {
      type: String,
      default: 'image/*',
    },
    // 最大上传数量（-1表示不限制）
    maxCount: {
      type: Number,
      default: 9,
    },
    // 文件大小限制（MB）
    maxSize: {
      type: Number,
      default: 100,
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否显示文件名
    showName: {
      type: Boolean,
      default: false,
    },
    // 上传区域尺寸
    size: {
      type: Number,
      default: 100,
    },
    // 允许的操作类型
    handle: {
      type: String,
      default: 'preview,again,delete',
    },
    // 上传按钮占位文本
    placeholder: {
      type: String,
      default: '上传文件',
    },
    // 是否拦截预览操作
    interceptorPreview: {
      type: Boolean,
      default: false,
    },
    // 上传接口地址
    url: {
      type: String,
      default: '',
    },
    // 请求头配置
    headers: {
      type: Object,
      default: () => ({}),
    },
  });

  // 事件定义
  const emit = defineEmits(['update:value', 'preview', 'checkPs']);

  // 响应式引用
  const previewModalRef = ref(null);
  const fileInputElement = ref(null);
  const uploadedFiles = ref([]);
  const previewFiles = ref([]);

  // 文件类型常量定义
  const FILE_TYPES = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    PDF: 'PDF',
    OTHER: 'OTHER',
  };

  const FILE_EXTENSIONS = {
    [FILE_TYPES.IMAGE]: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    [FILE_TYPES.VIDEO]: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
    [FILE_TYPES.PDF]: ['pdf'],
  };

  // 监听外部数据变化
  watch(
    () => props.value,
    newValue => {
      uploadedFiles.value = Array.isArray(newValue) ? [...newValue] : [];
    },
    {
      immediate: true,
      deep: true,
    }
  );

  // 计算属性：是否可以继续上传
  const canUploadMore = computed(() => {
    return props.maxCount === -1 || uploadedFiles.value.length < props.maxCount;
  });

  // 计算属性：允许的操作类型
  const allowedActions = computed(() => {
    return props.handle.split(',').map(action => action.trim());
  });

  // 计算属性：示例文件显示名称
  const exampleDisplayName = computed(() => {
    const fileType = getFileType(props.exampleUrl);
    switch (fileType) {
      case FILE_TYPES.IMAGE:
        return '示例图片';
      case FILE_TYPES.VIDEO:
        return '示例视频';
      default:
        return '示例文件';
    }
  });

  /**
   * 获取文件类型
   * @param {string} url 文件URL
   * @returns {string} 文件类型
   */
  const getFileType = url => {
    if (!url) return FILE_TYPES.OTHER;

    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return FILE_TYPES.OTHER;

    for (const [type, extensions] of Object.entries(FILE_EXTENSIONS)) {
      if (extensions.includes(extension)) {
        return type;
      }
    }

    return FILE_TYPES.OTHER;
  };

  /**
   * 获取文件扩展名显示文本
   * @param {string} url 文件URL
   * @returns {string} 扩展名文本
   */
  const getFileExtension = url => {
    if (!url) return '未知文件';
    const extension = url.split('.').pop()?.toUpperCase();
    return extension || '未知文件';
  };

  /**
   * 验证文件是否符合要求
   * @param {File} file 文件对象
   * @returns {boolean} 是否通过验证
   */
  const validateFile = file => {
    // 检查文件大小
    const maxSizeBytes = props.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      message.warning(`文件 ${file.name} 超过最大限制 ${props.maxSize}MB`);
      return false;
    }
    return true;
  };

  /**
   * 创建文件对象
   * @param {File} file 原始文件
   * @returns {Object} 文件对象
   */
  const createFileObject = file => {
    return {
      name: file.name,
      percent: 0,
      status: 'uploading',
      file,
      tempUrl: URL.createObjectURL(file),
      psCheckLoading: false,
    };
  };

  /**
   * 触发文件选择
   */
  const triggerFileSelect = () => {
    fileInputElement.value?.click();
  };

  /**
   * 处理文件选择
   * @param {Event} event 文件选择事件
   */
  const handleFileSelect = event => {
    const files = event.target.files;
    if (!files?.length) return;

    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(validateFile);

    // 检查数量限制
    if (props.maxCount !== -1) {
      const availableSlots = props.maxCount - uploadedFiles.value.length;
      if (availableSlots <= 0) {
        message.warning(`最多只能上传${props.maxCount}个文件`);
        clearFileInput();
        return;
      }

      const filesToUpload = validFiles.slice(0, availableSlots);
      if (validFiles.length > availableSlots) {
        message.warning(`已超出最大上传数量，仅上传前${availableSlots}个文件`);
      }

      filesToUpload.forEach(processFileUpload);
    } else {
      validFiles.forEach(processFileUpload);
    }

    clearFileInput();
  };

  /**
   * 处理单个文件上传
   * @param {File} file 文件对象
   */
  const processFileUpload = file => {
    const fileObject = createFileObject(file);
    const fileIndex = uploadedFiles.value.length;

    uploadedFiles.value.push(fileObject);
    executeUpload(file, fileIndex);
  };

  /**
   * 执行文件上传
   * @param {File} file 文件对象
   * @param {number} fileIndex 文件索引
   */
  const executeUpload = async (file, fileIndex) => {
    if (!props.url) {
      console.warn('未配置上传URL');
      uploadedFiles.value[fileIndex].status = 'error';
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // 配置请求
      xhr.open('POST', props.url, true);
      Object.entries(props.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // 监听上传进度
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          uploadedFiles.value[fileIndex].percent = percent;
        }
      };

      // 处理上传完成
      xhr.onload = () => {
        handleUploadComplete(xhr, fileIndex);
      };

      // 处理上传错误
      xhr.onerror = () => {
        handleUploadError(fileIndex, '网络错误');
      };

      xhr.send(formData);
    } catch (error) {
      console.error('上传失败:', error);
      handleUploadError(fileIndex, error.message);
    }
  };

  /**
   * 处理上传完成
   * @param {XMLHttpRequest} xhr 请求对象
   * @param {number} fileIndex 文件索引
   */
  const handleUploadComplete = (xhr, fileIndex) => {
    try {
      const response = JSON.parse(xhr.response);

      if (xhr.status === 200 && response?.code === 0) {
        // 上传成功
        const fileItem = uploadedFiles.value[fileIndex];
        const tempUrl = fileItem.tempUrl;

        // 更新文件信息
        Object.assign(fileItem, {
          url: response.data || '',
          status: 'done',
          percent: 100,
        });

        // 清理临时URL
        if (tempUrl) {
          URL.revokeObjectURL(tempUrl);
          delete fileItem.tempUrl;
        }

        // 触发更新事件
        emit('update:value', uploadedFiles.value, fileItem);
      } else {
        // 上传失败
        const errorMessage = response?.message || '上传失败';
        handleUploadError(fileIndex, errorMessage);
      }
    } catch (error) {
      handleUploadError(fileIndex, '响应解析失败');
    }
  };

  /**
   * 处理上传错误
   * @param {number} fileIndex 文件索引
   * @param {string} errorMessage 错误信息
   */
  const handleUploadError = (fileIndex, errorMessage) => {
    uploadedFiles.value[fileIndex].status = 'error';
    message.error(errorMessage || '上传文件失败');
  };

  /**
   * 预览文件
   * @param {Object} fileItem 文件项
   * @param {number} index 文件索引
   */
  const previewFile = (fileItem, index) => {
    if (props.interceptorPreview) {
      emit('preview', fileItem, index);
      return;
    }

    previewFiles.value = uploadedFiles.value.map(item => ({ ...item }));
    nextTick(() => {
      previewModalRef.value?.open(index);
    });
  };

  /**
   * 预览示例文件
   */
  const previewExampleFile = () => {
    previewFiles.value = [
      {
        url: props.exampleUrl,
        name: exampleDisplayName.value,
      },
    ];

    nextTick(() => {
      previewModalRef.value?.open(0);
    });
  };

  /**
   * 重新上传文件
   * @param {number} index 文件索引
   */
  const reuploadFile = index => {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = props.accept;

    tempInput.addEventListener('change', event => {
      const files = event.target.files;
      if (!files?.length) return;

      const file = files[0];
      if (!validateFile(file)) return;

      // 更新文件状态
      const currentFile = uploadedFiles.value[index];
      Object.assign(currentFile, {
        name: file.name,
        percent: 0,
        status: 'uploading',
        file,
      });

      executeUpload(file, index);
    });

    tempInput.click();
  };

  /**
   * 删除文件
   * @param {number} index 文件索引
   */
  const removeFile = index => {
    const fileItem = uploadedFiles.value[index];

    // 清理临时URL
    if (fileItem.tempUrl) {
      URL.revokeObjectURL(fileItem.tempUrl);
    }

    uploadedFiles.value.splice(index, 1);
    emit('update:value', uploadedFiles.value);
  };

  /**
   * PS检测
   * @param {Object} fileItem 文件项
   */
  const checkFileForPhotoshop = fileItem => {
    emit('checkPs', fileItem);
  };

  /**
   * 清空文件输入框
   */
  const clearFileInput = () => {
    if (fileInputElement.value) {
      fileInputElement.value.value = '';
    }
  };

  // 组件销毁时清理临时URL
  watch(
    () => uploadedFiles.value,
    (newFiles, oldFiles) => {
      if (oldFiles) {
        oldFiles.forEach(file => {
          if (file.tempUrl && !newFiles.find(newFile => newFile.tempUrl === file.tempUrl)) {
            URL.revokeObjectURL(file.tempUrl);
          }
        });
      }
    },
    { deep: true }
  );
</script>

<style scoped>
  .tt-upload__container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-end;
  }

  .tt-upload__item-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    width: v-bind('props.size + "px"');
    overflow: hidden;
  }

  .tt-upload__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: v-bind('props.size + "px"');
    height: v-bind('props.size + "px"');
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    background-color: #f5f5f5;
  }
  .tt-upload__item:hover .tt-upload__actions {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .tt-upload__file {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tt-upload__file-name {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  .tt-upload__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .tt-upload__placeholder--pdf {
    background-color: #fff2f0;
  }
  .tt-upload__placeholder--pdf .tt-upload__file-icon {
    color: #ff4d4f;
  }
  .tt-upload__placeholder--pdf .tt-upload__file-text {
    color: #ff4d4f;
  }
  .tt-upload__placeholder--other {
    background-color: #f0f5ff;
  }
  .tt-upload__placeholder--other .tt-upload__file-icon {
    color: #1890ff;
  }
  .tt-upload__placeholder--other .tt-upload__file-text {
    color: #1890ff;
  }

  .tt-upload__file-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .tt-upload__file-text {
    font-size: 12px;
    font-weight: 500;
  }

  .tt-upload__example-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 4px 8px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: #fff;
    font-size: 12px;
    text-align: center;
  }

  .tt-upload__actions {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 10;
    transition: opacity 0.3s ease;
  }

  .tt-upload__action-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
  }
  .tt-upload__action-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .tt-upload__ps-check {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    text-align: center;
    cursor: pointer;
    padding: 4px 0;
    user-select: none;
  }

  .tt-upload__uploading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
  }

  .tt-upload__progress {
    width: 80%;
    text-align: center;
  }
  .tt-upload__progress-text {
    color: #666;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .tt-upload__progress-bar {
    width: 100%;
    height: 6px;
    background-color: #e8e8e8;
    border-radius: 3px;
    overflow: hidden;
  }
  .tt-upload__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .tt-upload__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 77, 79, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  .tt-upload__error-icon {
    color: #ff4d4f;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ff4d4f;
  }
  .tt-upload__error-text {
    color: #ff4d4f;
    font-size: 12px;
    font-weight: 500;
  }

  .tt-upload__trigger {
    border: 2px dashed #d9d9d9;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fafafa;
    border-radius: 8px;
    height: v-bind('props.size + "px"');
    min-width: v-bind('props.size*2 + "px"');
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tt-upload__trigger:hover {
    border-color: #1890ff;
    background-color: #f0f5ff;
  }
  .tt-upload__trigger:hover .tt-upload__trigger-icon,
  .tt-upload__trigger:hover .tt-upload__trigger-text {
    color: #1890ff;
  }
  .tt-upload__trigger-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
  }
  .tt-upload__trigger-icon {
    font-size: 24px;
    color: #bfbfbf;
    margin-bottom: 8px;
    font-weight: 300;
  }
  .tt-upload__trigger-text {
    color: #666;
    font-size: 12px;
    text-align: center;
    line-height: 1.2;
  }

  .tt-upload__hidden-input {
    display: none !important;
  }
</style>
