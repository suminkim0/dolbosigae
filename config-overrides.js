//게시판 관련 설정 파일
const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-url-loader',
        options: {
          limit: 10000, // 10kB 이하의 파일은 Data URL로 처리
        },
      },
    ],
  })
);
