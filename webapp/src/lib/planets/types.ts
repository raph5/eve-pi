
export interface Template {
  textures: {
    [key: string]: {
      src: string
      repeat: boolean,
      minFilter: 'linear'|'linearMipmap',
      anisotropy: number
    }
  }
  settings: {
    [key: string]: number | number[]
  }
}