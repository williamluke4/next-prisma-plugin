import withPrismaPlugin from '../index'

describe('withPrismaPlugin', () => {
  it('should keep nextConfig object properties in other phases', () => {
    const nextConfig = { foo: 'bar' }

    const newConfig = withPrismaPlugin(nextConfig)('phase-export', {})
    expect(newConfig).toEqual(nextConfig)
  })

  it('should call nextConfig function in other phases', () => {
    const nextConfig = () => ({ foo: 'bar' })

    const newConfig = withPrismaPlugin(nextConfig)('phase-export', {})
    expect(newConfig).toEqual(nextConfig())
  })

  it('should add webpack property', () => {
    const nextConfig = { foo: 'bar' }

    const newConfig = withPrismaPlugin(nextConfig)('phase-development-server', {})
    expect(newConfig).toHaveProperty('webpack')
  })

  it('should call nextConfig function and add webpack property', () => {
    const nextConfig = () => ({ foo: 'bar' })

    const newConfig = withPrismaPlugin(nextConfig)('phase-development-server', {})
    expect(newConfig).toHaveProperty('webpack')
  })

  it('should call nextConfig.webpack function', () => {
    const nextConfig = () => ({ webpack: (config: {}) => ({ ...config, foo: 'bar' }) })

    const newConfig = withPrismaPlugin(nextConfig)('phase-development-server', {})
    expect(newConfig).toHaveProperty('webpack')
    expect(newConfig.webpack({ plugins: [], watchOptions: { ignored: [] } })).toMatchObject({
      foo: 'bar',
    })
  })
})
