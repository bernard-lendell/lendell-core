/* eslint-disable no-unused-vars */
// import axios from 'axios'
import { Cookies } from 'quasar'
// import { date } from 'quasar'
// import decodeJWT from "jwt-decode";

export const empty = function (arg) {
  return arg === null || arg === undefined || arg === '' || isArrAndEmpty(arg) || isObjAndEmpty(arg)
}

export const isArrAndEmpty = function (arg) {
  return isArr(arg) && arrEmpty(arg)
}

export const isArr = function (arg) {
  return Array.isArray(arg)
}

// For performance, this method does not check if `arr` is really an array.
// Use `isArr` before calling this method, to check if `arr` is really an array.
export const arrEmpty = function (arr) {
  return arr.length === 0
}

export const isObjAndEmpty = function (arg) {
  return isObj(arg) && objEmpty(arg)
}

export const isObj = function (arg) {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null
}

// For performance, this method does not check if `obj` is really an object.
// Use `isObj` before calling this method, to check if `obj` is really an object.
export const objEmpty = function (obj) {
  return Object.keys(obj).length === 0
}

// undefined or null arg will return false
export const isArrAndNotEmpty = function (arg) {
  return isArr(arg) && !arrEmpty(arg)
}

// undefined or null arg will return false
export const isObjAndNotEmpty = function (arg) {
  return isObj(arg) && !objEmpty(arg)
}

export const isStr = function (arg) {
  return typeof arg === 'string'
}

export const isPrimitive = function (val) {
  return (typeof val !== 'object' && typeof val !== 'function') || val === null
}

export const isFlat = function (obj) {
  if (isPrimitive(obj)) throw '`obj` should not be a primitive.'

  for (const key in obj) {
    if (!isPrimitive(obj[key])) return false
  }

  return true
}

export const isNumber = function (arg) {
  return typeof arg === 'number'
}

export const buildHashTable = function (arr, key = 'key') {
  if (arr == null || !Array.isArray(arr)) throw '`arr` argument is required and should be an array.'

  const hash_table = {}
  arr.forEach((obj) => (hash_table[obj[key]] = { ...obj }))
  return hash_table
}

export const buildBreadcrumbs = function (node, hash_table, parent_key = 'parent_key') {
  if (empty(node) || empty(hash_table)) throw 'Incomplete arguments.'

  if (typeof node !== 'object' || Array.isArray(node)) throw '`node` argument should be an object.'
  if (typeof hash_table !== 'object' || Array.isArray(hash_table))
    throw '`hash_table` argument should be an object.'

  let breadcrumbs = []
  let parent_node = hash_table[node[parent_key]] ?? null

  while (parent_node) {
    breadcrumbs.unshift(parent_node.name)
    // Nodes which parent does not exist in the group will be considered root nodes
    if (parent_node[parent_key] && hash_table[parent_node[parent_key]]) {
      parent_node = hash_table[parent_node[parent_key]]
      continue
    }
    parent_node = null
  }

  return breadcrumbs
}

export const buildOptionsArray = function (arr, label, value) {
  if (arr == null || !Array.isArray(arr)) throw '`arr` argument is required and should be an array.'

  for (var result of arr) {
    result.label = result[label]
    result.value = result[value]
  }
  return arr
}

export const buildSingleArray = function (arr, key) {
  if (arr == null || !Array.isArray(arr)) throw '`arr` argument is required and should be an array.'
  let finalArr = []
  for (var result of arr) {
    finalArr.push(result[key])
  }
  return finalArr
}

export const generateEntityCode = function (entityName) {
  return entityName.replace(/[aeiou\s\W]/gi, '').toLowerCase()
}

export const cloneArrOfObj = function (arr) {
  // Shallow clone only, make sure objects in array are all flat
  return arr.map((obj) => ({ ...obj }))
}

export const delay = function (ms) {
  return new Promise((res) => setTimeout(() => res(), ms))
}

export const buildTree = function (arr, nodeKey = '', parentNodeKey = '') {
  if (nodeKey === '' || parentNodeKey === '')
    throw 'buildTree: `nodeKey` and `parentNodeKey` arguments are required.'

  const hashTable = {}
  const tree = []

  arr.forEach((node) => (hashTable[node[nodeKey]] = { ...node, children: [] }))

  arr.forEach((node) => {
    if (node[parentNodeKey] && hashTable[node[parentNodeKey]]) {
      hashTable[node[parentNodeKey]].children.push(hashTable[node[nodeKey]])
    } else {
      tree.push(hashTable[node[nodeKey]])
    }
  })

  return tree
}

// Limits and adds ellipsis to a string.
export const addEllipsis = (str, limit) => {
  if (limit < 3) limit = 3

  if (str.length > limit) {
    return str.substring(0, limit - 3) + '...'
  }

  return str
}

// Renders a one-liner presentable text from a FLAT array or object
// IMPORTANT: Make sure that the arg is an object or an array before calling this function
export const presentifyObj = function (arg) {
  let arr = arg

  if (isObj(arr)) {
    arr = []
    for (const key in arg) {
      arr.push(`${key}: ${arg[key]}`)
    }
  }

  // return `[${arr.join(", ")}]`;
  return arr.join(', ')
}

// Returns a one-liner presentable text from a primitive, FLAT array or FLAT object
export const presentify = function (arg) {
  if (arg === undefined || arg === null || arg === '') return ''
  if (typeof arg === 'function') throw '`arg` should not be a function'

  if (isObj(arg) || isArr(arg)) {
    if (!isFlat(arg)) throw '`arg` when an object or an array, should be shallow or flat.'

    return presentifyObj(arg)
  }

  return arg
}

export const stringifyHWBMI = (val) => {
  return `Height: ${val.height}${val.heightUnitCode}, Weight: ${val.weight}${val.weightUnitCode}, BMI: ${val.bmi}`
}

// Renders a delimited string from a primitive, array or an object (nested or flat) using DFS
export const treeToStr = (val, leafDelimiter = ', ') => {
  if (empty(val)) return ''

  const visited = []
  const toVisit = [val]

  while (toVisit.length > 0) {
    const node = toVisit.shift()

    if (!empty(node.bmi)) {
      // for "Height, Weight and BMI" data
      visited.push(stringifyHWBMI(node))
    } else if (!empty(node.bgImageFileName) && !empty(node.strokes)) {
      // for sketch data
      visited.push(`[Sketch]`)
    } else if (!empty(node.allParamsVisible)) {
      // for Diagnostic data
      visited.push(stringifyDiagnostic(node))
    } else if (!empty(node.value) && !empty(node.label)) {
      // for "value and label" data
      visited.push(
        `(${typeof node.value === 'string' ? node.value.toUpperCase() : node.value}) ${node.label}`,
      )
    } else if ((isObj(node) || isArr(node)) && isFlat(node)) {
      visited.push(presentifyObj(node))
    } else if (isPrimitive(node)) {
      // Omit null and undefined nodes
      if (node !== null && node !== undefined) {
        visited.push(node)
      }
    } else {
      for (const key in node) {
        toVisit.unshift(node[key])
      }
    }
  }

  return visited.join(leafDelimiter)
}

export const treeToMultiLinerStr = function (tree, indentSize = 2) {
  if (!isObj(tree)) throw '`tree` should be an object.'

  const indent = Array(indentSize).fill(' ').join('')
  const result = []
  const toVisit = [
    {
      ...tree,
      indent: '',
    },
  ]

  while (toVisit.length > 0) {
    const node = toVisit.shift()

    result.push(`${node.indent}${node.label}: ${presentify(node.value)}`)

    if (isArrAndNotEmpty(node.children)) {
      toVisit.unshift(
        ...node.children.map((n) => {
          n['indent'] = node.indent + indent
          return n
        }),
      )
    }
  }

  return result.join('\n')
}

export const multiLineToOneLine = (str) => {
  return str.replace(/[\n\r]+/g, ', ')
}

export const stringifyDiagnostic = (diagnostic, limitText = false) => {
  // For backward compatibility
  if (isStr(diagnostic)) return multiLineToOneLine(diagnostic)

  const diagStrArr = []

  const diagDate = diagnostic.date
  const diagName = diagnostic.label
  const diagOthers = diagnostic.others ?? ''
  const diagRemarks = diagnostic.remarks ?? ''

  // const diagCreatedBy = diagnostic.createdBy;

  const diagValues = diagnostic.children
    .map((v) => {
      return `${v.label}: ${v.children
        .map((e) => {
          let ret = limitText ? addEllipsis(e.value, 50) : e.value
          if (e.label === 'Reference Range') {
            ret = !empty(e.value) ? ` (${e.value})` : ''
          }
          return ret
        })
        .join('')}`
    })
    .join(', ')

  if (!empty(diagDate)) diagStrArr.push(diagDate)
  if (!empty(diagName)) diagStrArr.push(diagName)
  if (!empty(diagValues)) diagStrArr.push(multiLineToOneLine(diagValues))
  if (!empty(diagOthers)) diagStrArr.push(multiLineToOneLine(diagOthers))
  if (!empty(diagRemarks)) diagStrArr.push(multiLineToOneLine(diagRemarks))
  // if (!empty(diagCreatedBy)) diagStrArr.push(diagCreatedBy);

  return diagStrArr.join(' | ')
}

export const isDate = function (arg) {
  return Object.prototype.toString.call(arg) === '[object Date]'
}

export const formatDate = function (dateDetails = null) {
  if (empty(dateDetails) || empty(dateDetails.date)) return null
  let formatDateRaw = dateDetails.date
  // if (dateDetails.nonQuasarDate) {
  //   formatDateRaw = new Date(dateDetails.date);
  // } else {
  //   formatDateRaw = date.formatDate(dateDetails.date, "YYYY-MM-DDTHH:mm:ss");
  // }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  let convertedDate = formatDateRaw
  // if (isStr(formatDateRaw)) {
  //   convertedDate = formatDateRaw
  //     .replace(/T/, " ")
  //     .replace(/Z/, " ")
  //     .substr("0", "16");
  // }

  const formattedDate = new Date(convertedDate)
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(formattedDate)

  let formattedMonth = 'short'

  if (dateDetails.withLongMonthName) {
    formattedMonth = 'long'
  }

  let month = new Intl.DateTimeFormat('en', {
    month: `${formattedMonth}`,
  }).format(formattedDate)

  if (dateDetails.straightDate) {
    month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(formattedDate)
  }

  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(formattedDate)
  let minute = formattedDate.getMinutes()
  let hour = formattedDate.getHours()

  if (minute < 10) {
    minute = '0' + minute
  }

  let ampm = 'AM'
  if (hour >= 12) {
    if (hour > 12) {
      hour -= 12
    }
    ampm = 'PM'
  }

  const time = `${hour}:${minute}${ampm}`
  const dayName = days[formattedDate.getDay()]

  if (dateDetails.withDayNameWithTime) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year} ${time} `
  } else if (dateDetails.withLongMonthName) {
    return `${month} ${day}, ${year} (${dayName})`
  } else if (dateDetails.withDayNameOnly) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year}`
  } else if (dateDetails.dateOnly) {
    return `${month.toUpperCase()} ${day}, ${year}`
  } else if (dateDetails.straightDate) return `${year}-${month}-${day}`

  return `${month.toUpperCase()} ${day}, ${year} ${time} `
}

export const req = async function (
  method = 'get',
  url,
  accessToken = null,
  payload,
  vuexContext,
  loggedIn,
) {
  if (empty(url) || empty(vuexContext)) throw '`url` and `vuexContext` are required.'

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  }

  if (!empty(payload)) opts['body'] = JSON.stringify(payload)

  try {
    const response = await fetch(url, opts)
    const userLoggedIn = Cookies.has('userDetails')
    if (response.status === 403 && userLoggedIn) {
      await vuexContext.dispatch('users/logoff', true, { root: true })

      vuexContext.commit('users/setUserDetails', null, { root: true })
      vuexContext.commit('users/setUser', null, { root: true })
      Cookies.remove('userDetails')
      Cookies.remove('user')

      return { error: 'Token has expired.' }
    }

    return await response.json()
  } catch (err) {
    console.log('Failed to fetch. Might be a network problem.')
    return {
      error: err,
    }
  }
}

// export const decodeUserJWT = function (jwt) {
//   let user = null;
//   if (jwt) {
//     user = decodeJWT(jwt);
//     user["accessToken"] = jwt;
//   }
//   return user;
// };

// Unicode \u180E is an invisible char to differentiate "value-label string generated by the system" to "actual string from the user"
export const valueLabelDelimiter = ' \u180E--\u180E '

// Objectify string with encoded "value" and "label"
export const parseValueLabel = function (str) {
  const arr = str.split(valueLabelDelimiter)

  if (empty(arr[1]))
    return arr[0] // string
  else
    return {
      value: arr[0],
      label: arr[1],
    }
}

// Stringify object with value and label property
export const stringifyValueLabel = function (obj) {
  return `${
    isStr(obj.value) ? obj.value.toUpperCase() : obj.value
  }${valueLabelDelimiter}${obj.label}`
}

export const formatFullname = function (firstName, middleName = null, lastName, format = 'normal') {
  if (format === 'normal') return `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`
  else if (format === 'formal')
    return `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`
  else if (format === 'normal_short')
    return `${firstName}${middleName ? ` ${__getMiddleInitial(middleName)}` : ''} ${lastName}`
  else if (format === 'formal_short')
    return `${lastName}, ${firstName}${middleName ? ` ${__getMiddleInitial(middleName)}` : ''}`
}

const __getMiddleInitial = function (middleName = null) {
  if (middleName === null || middleName === '') return ''
  return middleName.substring(0, 1) + '.'
}

export const getAge = function (dateString) {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--

  return age
}

export function round(num, dec_count = 0) {
  return +(Math.round(num + `e+${dec_count}`) + `e-${dec_count}`)
}

export function parseJsonOptions(opts = null) {
  if (opts === null) return null

  if (
    isStr(opts) &&
    ((opts.startsWith('"') && opts.endsWith('"')) ||
      (opts.startsWith('[') && opts.endsWith(']')) ||
      (opts.startsWith('{') && opts.endsWith('}')))
  )
    return JSON.parse(opts)

  return opts
}

export function getDistinct(arr) {
  if (!isArr(arr)) throw 'Argument should be an array.'
  return [...new Set(arr)]
}

// Used to sort array of strings or objects (with string property to be used for sorting) IN PLACE
export const sortStringArr = (arr, key = null, desc = false) => {
  const ret1 = desc ? -1 : 1
  const ret2 = desc ? 1 : -1

  return arr.sort((a, b) =>
    (a[key] ?? a) > (b[key] ?? b) ? ret1 : (a[key] ?? a) < (b[key] ?? b) ? ret2 : 0,
  )
}

// Used to sort array of numbers or objects (with number property to be used for sorting) IN PLACE
export const sortNumberArr = (arr, key = null, desc = false) => {
  arr.sort((a, b) => {
    if (desc) return (b[key] ?? b) - (a[key] ?? a)
    return (a[key] ?? a) - (b[key] ?? b)
  })
}

export const formatForSelectOptions = (arr, label, value) => {
  for (var result of arr) {
    result.label = result[label]
    result.value = result[value]
  }

  return arr
}

export const setInitials = (name) => {
  return name.charAt(0)
}

export const padNumber = (value) => {
  if (value < 10) {
    return '0' + value
  } else {
    return value
  }
}

export const fromAndToDate = (dayDetails) => {
  var days = dayDetails.days // Days you want to subtract
  var currentDay = new Date()
  var last = new Date(currentDay.getTime() - days * 24 * 60 * 60 * 1000)
  var day = last.getDate()
  var month = last.getMonth() + 1
  var year = last.getFullYear()

  const formatYearCurrent = new Intl.DateTimeFormat('en', {
    year: 'numeric',
  }).format(currentDay)
  const formatMonthCurrent = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(currentDay)
  const formatDayCurrent = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(currentDay)
  const fromDate = `${year}/${padNumber(month)}/${padNumber(day)}`
  const toDate = `${formatYearCurrent}/${formatMonthCurrent}/${formatDayCurrent}`
  return {
    fromDate: fromDate,
    toDate: toDate,
  }
}

export const computeAgeFromBirthDate = (dateDetails) => {
  var dob = new Date(dateDetails.birthdate)
  //extract the year, month, and date from user date input
  var dobYear = dob.getYear()
  var dobMonth = dob.getMonth()
  var dobDate = dob.getDate()

  //get the current date from the system
  var now = new Date()
  //extract the year, month, and date from current date
  var currentYear = now.getYear()
  var currentMonth = now.getMonth()
  var currentDate = now.getDate()

  //declare a variable to collect the age in year, month, and days
  var age = {}
  var ageString = ''

  //get years
  let yearAge = currentYear - dobYear
  let monthAge = ''
  let dateAge = ''

  //get months
  if (currentMonth >= dobMonth)
    //get months when current month is greater
    monthAge = currentMonth - dobMonth
  else {
    yearAge--
    monthAge = 12 + currentMonth - dobMonth
  }

  //get days
  if (currentDate >= dobDate)
    //get days when the current date is greater
    dateAge = currentDate - dobDate
  else {
    monthAge--
    dateAge = 31 + currentDate - dobDate

    if (monthAge < 0) {
      monthAge = 11
      yearAge--
    }
  }
  //group the age in a single variable
  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge,
  }

  if (age.years > 0 && age.months > 0 && age.days > 0)
    ageString = age.years + ' years ' + age.months + ' months ' + age.days + ' days '
  else if (age.years == 0 && age.months == 0 && age.days > 0) ageString = '' + age.days + ' days'
  //when current month and date is same as birth date and month
  else if (age.years > 0 && age.months == 0 && age.days == 0)
    ageString = age.years + `${age.years > 1 ? 'years' : 'year'}`
  else if (age.years > 0 && age.months > 0 && age.days == 0)
    ageString = age.years + `${age.years > 1 ? 'years' : 'year'}` + age.months + ' months'
  else if (age.years == 0 && age.months > 0 && age.days > 0)
    ageString = age.months + ' months ' + age.days + ' days'
  else if (age.years > 0 && age.months == 0 && age.days > 0)
    ageString = age.years + `${age.years > 1 ? 'years' : 'year'}` + age.days + ' days'
  else if (age.years == 0 && age.months > 0 && age.days == 0) ageString = age.months + ' months'
  //when current date is same as dob(date of birth)
  else ageString = '0 day'

  return ageString.toUpperCase()
}

export const calculateAge = (birthDate) => {
  return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10)
}

export const removeElementOnArray = (arr, removeArr, key) => {
  for (var i = arr.length; i--; ) {
    if (arr[i][key] === removeArr) arr.splice(i, 1)
  }
  return arr
}

export const convertArrToObj = (arr) => {
  return Object.assign({}, arr)
}

export const getValuesArrOfObj = (arr, key) => {
  return arr.map((a) => a[key])
}

export const groupBy = function (arr, key) {
  return arr.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const groupObjectsBy = function (obj, key) {
  return obj.reduce((groups, item) => {
    const group = groups[key] || []
    group.push(item)
    groups[key] = group
    return groups
  }, {})
}

export const getDatesInRange = function (startDate, endDate, format) {
  const dateStart = new Date(startDate)
  const dateEnd = new Date(endDate)
  const date = new Date(dateStart.getTime())

  const dates = []

  while (date <= dateEnd) {
    if (format.dateOnly) {
      dates.push(formatDate({ date: date.toDateString(), straightDate: true }))
    } else {
      dates.push(new Date(date))
    }
    date.setDate(date.getDate() + 1)
  }

  return dates
}

export const getBase64ImageFromURL = function (url) {
  return new Promise((resolve, reject) => {
    var img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')

    img.onload = () => {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      var dataURL = canvas.toDataURL('image/jpg')

      resolve(dataURL)
    }
    img.onerror = (error) => {
      reject(error)
    }

    img.src = url
  })
}

export const convertBase64toBlob = async function (base64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })

  return URL.createObjectURL(blob)
}

export const removeDuplicates = async function (arr) {
  let jsonObject = arr.map(JSON.stringify)
  let uniqueSet = new Set(jsonObject)
  return Array.from(uniqueSet).map(JSON.parse)
}

export const getObjectKeys = async function (objects) {
  if (Object.keys(objects).length > 0) {
    let keys = []
    for (let object in objects) {
      keys.push(`${object} - ${objects[object].length}`)
    }
    return keys
  }
}

export const getObjectValues = async function (objects) {
  if (Object.keys(objects).length > 0) {
    let values = []
    for (let object in objects) {
      values.push(objects[object])
    }
    return values
  }
}

export const getObjectValuesLength = async function (objects) {
  if (Object.keys(objects).length > 0) {
    let length = []
    for (let object in objects) {
      length.push(objects[object].length)
    }
    return length
  }
}

export const formatAmount = function (amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
