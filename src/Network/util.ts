import last from 'licia/last'

export function getType(contentType: string): { type: string; subType: string } {
  if (!contentType) {
    return {
      type: 'unknown',
      subType: 'unknown',
    }
  }

  const type = contentType.split(';')[0].split('/')

  return {
    type: type[0],
    subType: last(type),
  }
}
