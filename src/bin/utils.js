export const encodeByte = byte => {
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let rank = 0
  while (byte >= 1000) {
    byte /= 1000
    rank++
  }
  const nums = byte.toPrecision(4).split('.')
  if (nums.length > 1) {
    return nums[0] + '.' + nums[1][0] + suffixes[rank]
  } else {
    return nums[0] + suffixes[rank]
  }
}

export const displayDateTime = (createdAt, updatedAt) => {
  const d = new Date(createdAt)
  if (createdAt === updatedAt) {
    return (
      d
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      d
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      d
        .getSeconds()
        .toString()
        .padStart(2, '0')
    )
  } else {
    const u = new Date(updatedAt)
    let result =
      u
        .getHours()
        .toString()
        .padStart(2, '0') +
      ':' +
      u
        .getMinutes()
        .toString()
        .padStart(2, '0') +
      ':' +
      u
        .getSeconds()
        .toString()
        .padStart(2, '0')
    if (d.getDate() !== u.getDate() || d.getMonth() !== u.getMonth()) {
      result =
        (u.getMonth() + 1).toString().padStart(2, '0') +
        '/' +
        u
          .getDate()
          .toString()
          .padStart(2, '0') +
        ' ' +
        result
    }
    if (d.getFullYear() !== u.getFullYear()) {
      result = u.getFullYear().toString() + '/' + result
    }
    return result
  }
}

export const isGif = mime => {
  return mime.split('/')[0] === 'image' && mime.split('/')[1] === 'gif'
}

export const isSvg = mime => {
  return mime.split('/')[0] === 'image' && mime.split('/')[1] === 'svg+xml'
}

export const isImage = mime => {
  return mime.split('/')[0] === 'image'
}

export const isVideo = mime => {
  return mime.split('/')[0] === 'video'
}

export const isAudio = mime => {
  return mime.split('/')[0] === 'audio'
}

function isFile(text) {
  try {
    const data = JSON.parse(text)
    if (
      data['type'] === 'file' &&
      typeof data['id'] === 'string' &&
      typeof data['raw'] === 'string'
    ) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
function isMessage(text) {
  try {
    const data = JSON.parse(text)
    if (
      data['type'] === 'message' &&
      typeof data['id'] === 'string' &&
      typeof data['raw'] === 'string'
    ) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

export const detectFiles = text => {
  let isInside = false
  let startIndex = -1
  let isString = false
  const ret = []
  for (let i = 0; i < text.length; i++) {
    if (isInside) {
      if (text[i] === '"') {
        isString ^= true
      } else if (!isString && text[i] === '}') {
        isInside = false
        if (
          isFile(text.substr(startIndex + 1, i - startIndex)) ||
          isMessage(text.substr(startIndex + 1, i - startIndex))
        ) {
          ret.push(JSON.parse(text.substr(startIndex + 1, i - startIndex)))
        } else {
          i = startIndex + 1
        }
      }
    } else {
      if (i < text.length - 1 && text[i] === '!' && text[i + 1] === '{') {
        startIndex = i
        i++
        isInside = true
        isString = false
      }
    }
  }
  return ret
}

export const isMac = () => {
  return window.navigator.platform.includes('Mac')
}
