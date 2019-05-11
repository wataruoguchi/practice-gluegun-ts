import { GluegunToolbox } from 'gluegun'

interface MaterialListItem {
  // Practice - just to validate the response data
  type: string
  title: string
  locale: string
  service_id: string
  area_name: string
  id: string
  area_id: string
  score: string
  synonym: string|null
}

interface MaterialItem {
  title: string
  id: string
}

module.exports = (toolbox: GluegunToolbox) => {
  const api = toolbox.http.create({
    baseURL: 'https://wataru.recollect.net/api',
  })

  function parseMaterialListRes(response: any) :MaterialItem[] {
    // Parse the response - also it lets you to modify the data
    if (response && response.status && response.status === 200 && response.data) {
      const responseData :MaterialListItem[] = response.data
      // Pro tip: you can modify the response here
      const result :MaterialItem[] = responseData.map((row) => {
        const item :MaterialItem = {
          id: row.id,
          title: row.title,
        }
        return item
      })
      return result
    }
  }

  async function getMaterialList(name :string): Promise<MaterialItem[] | null> {
    // Well, you know it's ugly
    const res: any = await api.get(`/areas/Vancouver/services/waste/pages?type=material&include_links=true&locale=en&accept_list=true&suggest=${name}`)
    return parseMaterialListRes(res)
  }

  function parseMaterialPageRes(response: any) :[] {
    if (response && response.status && response.status === 200 && response.data) {
      const result = response.data.sections
      return result
    }
  }

  async function getMaterialPage(id :string): Promise<[] | null> {
    const res: any = await api.get(`/areas/Vancouver/services/waste/pages/en/${id}.json`)
    return parseMaterialPageRes(res)
  }

  toolbox.recollect = { getMaterialList, getMaterialPage }
}

