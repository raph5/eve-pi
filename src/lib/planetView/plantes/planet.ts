import * as THREE from 'three'

export default class Planet {

  private geometry
  private material
  public mesh

  constructor() {
    
    // build the sphere geametry
    // radius = 100
    // widthSegments = 32
    // heightSegments = 16
    this.geometry = new THREE.SphereGeometry( 100, 32, 16 )

    // build material
    this.material = new THREE.MeshBasicMaterial( { color: 0xff6543, wireframe: true } )

    // build mesh
    this.mesh = new THREE.Mesh( this.geometry, this.material )

  }

}