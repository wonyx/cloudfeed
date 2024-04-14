export function stringify(val: any[]) {
  return val.map(v => JSON.stringify(v)).join('\n')
}

export default { stringify }
