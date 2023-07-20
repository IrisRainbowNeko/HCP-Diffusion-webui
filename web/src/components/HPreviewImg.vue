<template>
  <div class="preview-img">
    <div class="preview-img-scroll">
      <div class="preview-img-scroll-wrap">
        <div class="img-block" v-for="(img, index) in currentPreviewImg" :key="img + index">
          <img class="img-item" :src="img.src" @click="currentPreviewIndex = index" />
        </div>
      </div>
    </div>
    <div class="preview-img-main">
      <img
        title="点击查看大图"
        v-if="currentPreviewImg.length"
        class="preview-img-item"
        :src="currentPreviewImg[currentPreviewIndex].src"
        @click="handleHevueImgPreview"
      />

      <div class="empty" v-if="!imgs.length">
        <i class="icon el-icon-picture-outline"></i>
      </div>
      <div class="progress-block" v-if="showProgress">
        <!-- <div class="meter">
          <span :style="{ width: progress + '%' }"></span>
        </div> -->
        <div class="meter orange animate">
          <span :style="{ width: progress + '%' }">
            <span></span>
          </span>
        </div>
        <!-- <el-progress :percentage="progress"></el-progress> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HPreviewImg',
  props: {
    imgs: {
      type: Array,
      default: () => []
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPreviewIndex: 0,
      currentPreviewImg: []
    };
  },
  watch: {
    imgs: {
      handler(val) {
        this.handlePreviewImg(val);
        if (val.length === 0) {
          this.currentPreviewIndex = 0;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.handlePreviewImg(this.imgs);
  },
  computed: {
    showProgress() {
      return this.progress !== 0 && this.progress !== 100;
    }
  },
  methods: {
    previewImg(index) {
      this.currentPreviewIndex = index;
    },
    handleClose() {
      this.currentPreviewIndex = '';
    },
    handlePreviewImg(imgs) {
      this.currentPreviewImg = imgs.map((item) => {
        return {
          id: Math.random(),
          src: item
        };
      });
    },
    handleHevueImgPreview() {
      this.$hevueImgPreview({
        multiple: true, // 开启多图预览模式
        nowImgIndex: this.currentPreviewIndex, // 多图预览，默认展示第二张图片
        imgList: this.imgs, // 需要预览的多图数组
        mainBackground: 'rgba(0, 0, 0, .5)' // 整体背景颜色
      });
    }
  }
};
</script>

<style lang="scss">
.preview-img {
  flex: 7;
  height: 100%;
  background-color: #fff;
  align-items: flex-start;
  overflow: hidden;
  padding-left: 10px;
  @include border-radius();
  @include block-shadow();
  @include flexLayout(row, 20px);
  &-scroll {
    height: 100%;
    width: 140px;
    overflow-y: scroll;
    @include flexLayout(column, 20px);
    &-wrap {
      width: 100%;
      align-items: center;
      padding: 10px 0;
      @include flexLayout(column, 4px);
      .img-block {
        width: 100%;
        height: 80px;
        @include flexLayout(row, 10px);
        justify-content: center;
        &:hover {
          background-color: #f5f5f5;
        }
        .img-item {
          max-width: 100%;
          height: 80px;
          object-fit: contain;
          cursor: pointer;
        }
      }
    }
  }
  &-main {
    flex: 1;
    overflow: hidden;
    @include flexLayout();
    align-items: center;
    justify-content: center;
    position: relative;
    .preview-img-item {
      max-height: 90%;
      max-width: 80%;
      object-fit: contain;
      cursor: pointer;
    }
    .empty {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 26px;
        color: #666;
      }
    }
    .progress-block {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      transition: all 0.5s;
      border-radius: 10px;
      .el-progress {
        width: 90%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.meter {
  width: 400px;
  box-sizing: content-box;
  height: 20px; /* Can be anything */
  position: relative;
  margin: 60px 0 20px 0; /* Just for demo spacing */
  background: #555;
  border-radius: 25px;
  padding: 10px;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
}
.meter > span {
  display: block;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: rgb(43, 194, 83);
  background-image: linear-gradient(center bottom, rgb(43, 194, 83) 37%, rgb(84, 240, 84) 69%);
  box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.1), inset 0 -2px 6px rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}
.meter > span:after,
.animate > span > span {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.7) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.7) 75%,
    transparent 75%,
    transparent
  );
  z-index: 1;
  background-size: 50px 50px;
  animation: move 2s linear infinite;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}

.animate > span:after {
  display: none;
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}

.orange > span {
  background-image: $tabColor2;
}

.red > span {
  background-image: linear-gradient(#f0a3a3, #f42323);
}

.nostripes > span > span,
.nostripes > span::after {
  background-image: none;
}
</style>
