import * as THREE from 'three'

// class specialised in build textures form eveonline shaders
export function createUniformTexture(
  textureUrl: string,
  repeat: boolean = false,
  minFilter: 'linear'|'linearMipmap' = 'linearMipmap',
  anisotropy: number = 4
) {
  const texture = new THREE.TextureLoader().load( textureUrl )
  texture.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
  texture.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
  texture.minFilter = minFilter === 'linearMipmap' ? THREE.LinearMipMapLinearFilter : THREE.LinearFilter
  texture.anisotropy = anisotropy
  return texture
}