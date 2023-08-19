import { esiFetch } from "./esi";
import { getUserId } from "./sso";
import type SSO from "./sso";

// this class will store all the PI data
export class Installation {

  constructor(
    private sso: SSO,
    public mainCharacter: string,
    public altCharacters: string[]
  ) {}

  async init() {

    console.log( await this.fetchPlanetsData() )
    
  }

  async fetchPlanetsData() {

    const charactersList = [ this.mainCharacter, ...this.altCharacters ]

    const charactersPromise = charactersList.map(async (name) => {
      const token = await this.sso.getToken(name)
      return {
        id: getUserId(token),
        name: name
      }
    })
    const characters = await Promise.all(charactersPromise)
    
    const planetsPromise = characters.map(async (c) => {
      const options = {
        auth: { sso: this.sso, user: c.name }
      }
      const planets: any[] = await esiFetch( `/characters/${c.id}/planets/`, null, null, options )

      const planetsDataPromise = planets.map(async (p) => {
        const planetLayout: any = await esiFetch( `/characters/${c.id}/planets/${p.planet_id}/`, null, null, options )
        return { ...p, planet_layout: planetLayout }
      })

      const planetsData = await Promise.all(planetsDataPromise)

      return { ...c, planets: planetsData }
    })

    return await Promise.all(planetsPromise)

  }

}