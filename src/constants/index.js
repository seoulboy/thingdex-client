const localIPAddress = '192.168.0.47'
const cloudDomain = 'http://thingdex-env.v3jdr8esif.ap-northeast-2.elasticbeanstalk.com'
const localDomain = `http://${localIPAddress}:4000`

const domain = process.env.REACT_APP_NODE_ENV === 'development' ? localDomain : cloudDomain;

module.exports = { domain };
