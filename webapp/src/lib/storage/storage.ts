
// json type
export type jsonable = string | number | boolean | null | jsonable[] | { [key: string]: jsonable }


export class Storage {
  constructor(
    public key: string
  ) {}

  read(): any {
    return localStorage.getItem(this.key) || ''
  }
  set(data: any) {
    localStorage.setItem(this.key, data)
  }
}

export class JsonStorage<T=jsonable> {
  constructor(
    public key: string
  ) {}

  read(): T {
    const serializedData = localStorage.getItem(this.key)
    return JSON.parse(serializedData)
  }
  set(data: T) {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(this.key, serializedData)
  }
}