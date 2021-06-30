import PrismaClientReloaderWebpackPlugin from './webpack-plugin'
const PATH_DELIMITER = '[\\\\/]' // match 2 antislashes or one slash

/**
 * On Windows, the Regex won't match as Webpack tries to resolve the
 * paths of the modules. So we need to check for \\ and /
 */
// @ts-ignore
const safePath = (module) => module.split(/[\\\/]/g).join(PATH_DELIMITER)

/**
 * Actual Next.js plugin
 */

const withPrismaPlugin = (nextConfig = {}) => (
  phase: 'phase-export' | 'phase-production-build' | 'phase-production-server' | 'phase-development-server',
  thing: any
) => {
  if (phase === 'phase-development-server') {
    return Object.assign({}, nextConfig, {
      webpack(config: any, options: any) {
        const ignore = ['.prisma/client', '@prisma/client']

        // const includes = ignore.map(module => (new RegExp(`${module}(?!.*node_modules)`)));
        const excludes = [new RegExp(`node_modules(?!/(${ignore.join('|')})(?!.*node_modules))`).toString()]
        const ignored = config.watchOptions.ignored
          .filter((ignored: string) => ignored !== '**/node_modules/**')
          .concat(excludes)
        return Object.assign(config, {
          plugins: [...config.plugins, new PrismaClientReloaderWebpackPlugin()],
          watchOptions: {
            ...config.watchOptions,
            ignored,
          },
        })
      },
    })
  }
  let internalConfigObj = typeof nextConfig === 'function' ? nextConfig(phase, thing) : nextConfig
  return internalConfigObj
}

module.exports = withPrismaPlugin
export default withPrismaPlugin
