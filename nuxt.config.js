let port = 443;
let host = 'https://data.vuamarketing.com';
module.exports = {
  dev:false,
  ssr:false,
  target: 'static',
  server: {port, host},
  crypt:{
    key:'ibsd83ibu20isdbe043a89sdhf7wfh79feksdfhdu2erh9221ffb389fn920cdsn',
    index:43
  },
  axios:{
    baseURL:host+':'+port
  },
  limit_log:10,
  router: {
    middleware: ['guest']
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/user/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/account/logout', method: 'post' },
          user: { url: host+':'+port+'/api/account/info', method: 'get',propertyName:'phone'}
        },
        tokenRequired: true,
        tokenType: ''
      }
    }
  },
  head: {
    title: 'Lấy số điện thoại',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Lấy số điện thoại' }
      ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }]
  },
  loading:false,
  srcDir: 'client/',
  css: ['element-ui/lib/theme-chalk/index.css'],
  modules: ['@nuxtjs/axios', '@nuxtjs/auth'],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/dark',
    '@/plugins/copy'
    ],
  build: {
    transpile: [/^element-ui/],
    extend (config, ctx) {
      config.module.rules.push({
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      });
      
    }
  }
};
