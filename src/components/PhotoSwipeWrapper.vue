<template>
  <div class="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"/>
    <div class="pswp__scroll-wrap">
      <div class="pswp__container">
        <div class="pswp__item"/>
        <div class="pswp__item"/>
        <div class="pswp__item"/>
      </div>
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <div class="pswp__counter"/>
          <button class="pswp__button pswp__button--close" />
          <button class="pswp__button pswp__button--zoom" />
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"/>
              </div>
            </div>
          </div>
        </div>
        <div
          class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"/>
        </div>
        <button class="pswp__button pswp__button--arrow--left" />
        <button class="pswp__button pswp__button--arrow--right" />
        <div class="pswp__caption">
          <div class="pswp__caption__center"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PhotoSwipeFn from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default.js'

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

export default {
  name: 'PhotoSwipeWrapper',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
    }
  },

  data() {
    return {
      events: [
        'beforeChange',
        'afterChange',
        'imageLoadComplete',
        'resize',
        'gettingData',
        'mouseUsed',
        'initialZoomIn',
        'initialZoomInEnd',
        'initialZoomOut',
        'initialZoomOutEnd',
        'parseVerticalMargin',
        'close',
        'unbindEvents',
        'destroy',
        'updateScrollOffset',
        'preventDragEvent',
        'shareLinkClick',
      ]
    }
  },

  watch: {
    items: {
      handler: function() {
        if (this.pswp && this.isOpen) {
          this.pswp.invalidateCurrItems()
          this.pswp.updateSize(true)
        }
      },

      deep: true
    },

    isOpen (val) {
      if (val) {
        this.openPhotoSwipe(this.items, this.options)
      }

      else {
        this.close()
      }
    },
  },

  methods: {
    openPhotoSwipe (items, options) {
      let pswpElement = this.$el

      this.pswp = new PhotoSwipeFn(
        pswpElement,
        PhotoSwipeUIDefault,
        items,
        options
      )

      this.events.forEach(e => {
        this.pswp.listen(e, (...args) => {
          args.unshift(this)
          this.$emit(e, [...args])
        })
      })

      this.pswp.init()
    },

    close () {
      if (this.pswp) {
        this.pswp.close()
      }
    },
  },

  mounted () {
    if (this.isOpen) {
      this.openPhotoSwipe(this.items, this.options)
    }
  },

  beforeDestroy () {
    this.close()
  },
}
</script>