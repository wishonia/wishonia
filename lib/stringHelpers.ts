function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  )
}

export function convertKeysToCamelCase(obj: any): any {
  const newObj: any = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[toCamelCase(key)] = obj[key]
    }
  }
  return newObj
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function (txt: string): string {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
