const uuidv4 = require('uuid/v4')


Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

function drag_dialog() {
    // make vuetify dialogs movable
    // https://github.com/vuetifyjs/vuetify/issues/4058#issuecomment-450636420
    const d = {};
    document.addEventListener("mousedown", e => {
        const closestDialog = e.target.closest(".v-dialog.v-dialog--active");
        if (e.button === 0 && closestDialog != null && e.target.classList.contains("modal-move")) { // element which can be used to move element
            d.el = closestDialog; // element which should be moved
            d.mouseStartX = e.clientX;
            d.mouseStartY = e.clientY;
            d.elStartX = d.el.getBoundingClientRect().left;
            d.elStartY = d.el.getBoundingClientRect().top;
            d.el.style.position = "fixed";
            d.el.style.margin = 0;
            d.oldTransition = d.el.style.transition;
            d.el.style.transition = "none"
        }
    });
    document.addEventListener("mousemove", e => {
        if (d.el === undefined) return;
        d.el.style.left = Math.min(
            Math.max(d.elStartX + e.clientX - d.mouseStartX, 0),
            window.innerWidth - d.el.getBoundingClientRect().width
        ) + "px";
        d.el.style.top = Math.min(
            Math.max(d.elStartY + e.clientY - d.mouseStartY, 0),
            window.innerHeight - d.el.getBoundingClientRect().height
        ) + "px";
    });
    document.addEventListener("mouseup", () => {
        if (d.el === undefined) return;
        d.el.style.transition = d.oldTransition;
        d.el = undefined
    });
    setInterval(() => { // prevent out of bounds
        const dialog = document.querySelector(".v-dialog.v-dialog--active");
        if (dialog === null) return;
        dialog.style.left = Math.min(parseInt(dialog.style.left), window.innerWidth - dialog.getBoundingClientRect().width) + "px";
        dialog.style.top = Math.min(parseInt(dialog.style.top), window.innerHeight - dialog.getBoundingClientRect().height) + "px";
    }, 100);
}

drag_dialog()


class Tools {
  constructor() {
    
  }

  deepcopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  gen_uid() {
    return uuidv4()
  }

  is_valid_email(email) {
    if (!email) return false
      
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email.replaceAll(/\s/g,'')).toLowerCase())
  }

  get_cookie(cname) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')

    for (let i = 0; i <ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }

    return ''
  }

  get_logo(name) {
    return require(`@/assets/logos/${name}.png`)
  }

  set_favicon(app) {
    setTimeout(() => {
      const favicon = document.getElementById("favicon")

      favicon.href = this.get_logo(app + '_30x30')
    }, 100)
  }

  get_file_data(e, callback) {
    let file = e.target.files[0]
    let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()
    let name = file.name.slice(0, file.name.lastIndexOf('.'))
    name = name.trim()
    let mini = null
    let data = new FormData()

    data.append('name', name)
    data.append('ext', ext)

    if (!file.name.includes('.')) {
      name = file.name
      ext = ''
    }

    let extensions = ['jpg', 'jpeg', 'png', 'gif']

    if (extensions.includes(ext)) {
      let reader = new FileReader()
      let img = document.createElement('img')

      reader.onload = (event) => {
        img.src = event.target.result

        img.onload = () => {
          file = this.createResizedCanvas(img, 1500)
          let width = file.width
          let height = file.height
          file = this.canvasToBlob(file)

          mini = this.createResizedCanvas(img, 75)
          mini = this.canvasToBlob(mini)

          data.append('file', file)
          data.append('mini', mini)
          data.append('width', width)
          data.append('height', height)

          callback(data)

          e.target.value = ''
        }
      }

      reader.readAsDataURL(file)
    }

    else {
      data.append('file', file)

      callback(data)
      
      e.target.value = ''
    }
  }

  calcRatio(width, height, max) {
    if (width > height) {
      if (width > max) {
        height *= max / width
        width = max
      }
    } else {
      if (height > max) {
        width *= max / height
        height = max
      }
    }

    return {width: width, height: height}
  }

  createResizedCanvas(img, max) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    let ratio = this.calcRatio(img.width, img.height, max)

    canvas.width = ratio.width
    canvas.height = ratio.height
    ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, ratio.width, ratio.height)

    return canvas
  }

  canvasToBlob(canvas) {
    let dataurl = canvas.toDataURL('image/jpeg')

    let blobBin = atob(dataurl.split(',')[1])
    let array = []

    for(let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i))
    }

    let img = new Blob([new Uint8Array(array)], {type: 'image/jpeg'})

    return img
  }

  format_date(date) {
    if (date) {
      let [year, month, day] = date.split('-')

      if (day.length == 1) day = '0' + day
      if (month.length == 1) month = '0' + month

      return `${day}/${month}/${year}`
    }

    return ''
  }

  format_date_no_year(date) {
    if (date) {
      let [year, month, day] = date.split('-')
      year

      if (day.length == 1) day = '0' + day
      if (month.length == 1) month = '0' + month

      return `${day}/${month}`
    }

    return ''
  }

  format_date_month_name_year(date, lang) {
    if (date) {
      date = new Date(date)

      let month = date.toLocaleString(lang, {month: 'long'})
      let month_capitalized = month.charAt(0).toUpperCase() + month.slice(1)

      return `${month_capitalized} ${date.getFullYear()}`
    }

    return ''
  }

  format_datetime(datetime) {
    let date = new Date(datetime)

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hour = date.getHours()
    let minute = date.getMinutes()

    if (day < 9) day = '0' + String(day)
    if (month < 9) month = '0' + String(month)
    if (hour < 9) hour = '0' + String(hour)
    if (minute < 9) minute = '0' + String(minute)


    return `${day}/${month}/${year} - ${hour}:${minute}`
  }

  get_fused_children(obj) {
    let children = Array()

    let child_types = [
      'folder',
      'task',
      'subtask',
      'file',
      'input',
      'note',
      'code',
      'call',
      'link',
      'template',
    ]

    for (let type of child_types) {
      if (obj[type + 's']) {
        for (let child of obj[type + 's']) {
          child.children = this.get_fused_children(child)
        }


        children = children.concat(obj[type + 's'])
      }
    }

    children.sort((a, b) => a.link.position - b.link.position)

    return children
  }

  get_file_icon(ext) {
    if (ext) {
      ext = ext.toLowerCase()

      if (ext == 'pdf') {
        return 'mdi-file-pdf'
      }

      else if (['txt'].includes(ext)) {
        return 'mdi-file-document'
      }

      else if (['doc', 'docx'].includes(ext)) {
        return 'mdi-file-word'
      }

      else if (['xls', 'xlsx'].includes(ext)) {
        return 'mdi-file-excel'
      }

      else if (['mp3', 'm4a', 'wav', 'wma', 'aac'].includes(ext)) {
        return 'mdi-file-video'
      }

      else if (['mp4', 'avi', 'mov', 'flv', 'mkv'].includes(ext)) {
        return 'mdi-file-music'
      }

      else if (['tiff', 'gif', 'png', 'jpg', 'jpeg'].includes(ext)) {
        return 'mdi-image'
      }
    }

    return 'mdi-file'
  }
}

export default new Tools