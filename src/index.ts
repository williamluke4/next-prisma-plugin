import PrismaClientReloaderWebpackPlugin from './webpack-plugin'

/**
 * On Windows, the Regex won't match as Webpack tries to resolve the
 * paths of the modules. So we need to check for \\ and /
 */
//const PATH_DELIMITER = '[\\\\/]' // match 2 antislashes or one slash
// @ts-ignore
//const safePath = (module) => module.split(/[\\\/]/g).join(PATH_DELIMITER)

/**
 * Actual Next.js plugin
 */

const withPrismaPlugin = (nextConfig = {}) => (
  phase: 'phase-export' | 'phase-production-build' | 'phase-production-server' | 'phase-development-server',
  thing: any
) => {
  let internalConfigObj: Record<string, any> =
    typeof nextConfig === 'function' ? nextConfig(phase, thing) : nextConfig

  if (phase === 'phase-development-server') {
    return Object.assign({}, internalConfigObj, {
      webpack(config: Record<string, any>, options: Object) {
        const ignore = ['.prisma/client', '@prisma/client']

        // const includes = ignore.map(module => (new RegExp(`${module}(?!.*node_modules)`)));
        const excludes = [new RegExp(`node_modules(?!/(${ignore.join('|')})(?!.*node_modules))`)]
        const ignored = config.watchOptions.ignored
          .filter((ignored: string) => ignored !== '**/node_modules/**')
          .concat(excludes)

        config.plugins.push(new PrismaClientReloaderWebpackPlugin())
        config.watchOptions = {
          ...config.watchOptions,
          ignored,
        }

        if (typeof internalConfigObj.webpack === 'function') {
          return internalConfigObj.webpack(config, options)
        }

        return config
      },
    })
  }

  return internalConfigObj
}

module.exports = withPrismaPlugin
export default withPrismaPlugin
