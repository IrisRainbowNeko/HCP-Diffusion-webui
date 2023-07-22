const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  productionSourceMap: false,
  publicPath: '/',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/static': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/static': '/static'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/style/variables.scss";'
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'HCP Diffusion WebUI';
      return args;
    });
  },
  configureWebpack: (config) => {
    // 公共代码抽离
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true
          },
          runtimeChunk: {
            name: 'manifest'
          }
        }
      }
    };
  }
});
