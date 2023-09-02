import Planet from '../planet'
import Atmosphere from "../atmospheres/atmosphere"
import GlobeOceanic from '../globes/globeOceanic'
import { createUniformTexture } from '@utils/threejs/uniformTexture'
import { UniformParameter } from '@utils/threejs/uniformParameter'
import planetTemplate from '@ccpdata/templates/oceanic/oceanic10.json'
import heightMap from '@ccpdata/textures/oceanHeightMap1.png'
import type Time from '@lib/threejs/time'


export default class PlanetOceanic extends Planet {
  
  private globe: GlobeOceanic
  private atmosphere: Atmosphere

  constructor(
    time: Time
  ) {

    super(time)

    // bind settings and textures
    this.bindSettings( planetTemplate.settings )
    // @ts-ignore
    this.bindTextures( planetTemplate.textures )

    // import height map
    const heightMapTexture = createUniformTexture( heightMap, false, 'linear' )
    this.uniforms.heightMap = new UniformParameter( 'heightMap', heightMapTexture )

    // build planet
    this.globe = new GlobeOceanic( this.uniforms )
    this.atmosphere = new Atmosphere( this.uniforms )

    // add planet to scene
    this.add( this.globe, this.atmosphere )

  }

}