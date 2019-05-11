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

    const materialList = await recollect.getMaterialList(name)
    if (!materialList) {
      print.error('Oops no result')
      return
    }
    print.debug(materialList)
  },
}
