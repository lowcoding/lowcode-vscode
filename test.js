const {
  getLatestVersion,
  getNpmLatestSemverVersion,
  getNpmRegistry,
  getUnpkgHost,
  getNpmClient,
  isAliNpm,
  getNpmInfo,
  checkAliInternal,
  getNpmTarball,
  getAndExtractTarball,
  packageJSONFilename,
  readPackageJSON,
  getPackageLocalVersion,
} = require('ice-npm-utils');
// getNpmLatestSemverVersion('@lowcoding/create-mock', '1.0.0').then((res) => {
//   console.log(res);
// });
// getLatestVersion('@lowcoding/create-mock').then((res) => {
//   console.log(res);
// });
// console.log(getNpmRegistry('@lowcoding/create-mock'));
getNpmTarball('@lowcoding/create-mock').then((res) => {
  console.log(res);
});
