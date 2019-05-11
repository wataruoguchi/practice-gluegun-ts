import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'wizard',
  run: async (toolbox: GluegunToolbox) => {
    // User interactive part
    const { parameters, print, prompt, recollect } = toolbox

    let name :string = parameters.first
    if (!name) {
      const result = await prompt.ask({
        type: 'input',
        name: 'name',
        message: 'Please search for an item.',
      })
      if (result && result.name) name = result.name
    }

    if (!name) {
      print.error('No material name specified.')
      return
    }

    // Do I need to define the type? MaterialListItem[]
    const materialList = await recollect.getMaterialList(name)
    if (!materialList) {
      print.error('Oops no result')
      return
    }

    const topSuggestedMaterial = await recollect.getMaterialPage(materialList[0].id)
    if (!topSuggestedMaterial) {
      print.error('You could not fetch the page')
      return
    }
    print.debug(topSuggestedMaterial)
  },
}
