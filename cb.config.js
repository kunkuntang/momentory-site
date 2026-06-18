/* eslint-disable */
module.exports = {
  plugins: {
    web: {
      name: 'momentory-site',
      dist: './dist',
      bucketType: 'tencent',
      bucketName: 'momentory-site',
      bucketRegion: 'ap-guangzhou',
      bucketAppid: '1251521980',
      ignore: ['.map', 'LICENSE'],
    },
    cdn: {
      version: '1.0.0',
      app_id: 'momentory-site',
      src: './src/assets',
      dist: '',
      cos_bucket: 'application-cdn-1251521980',
    }
  }
}