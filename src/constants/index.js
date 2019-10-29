const localIPAddress = '192.168.0.57';
const cloudServerDomain = 'https://api.thingdex.space';
const localServerDomain = `http://${localIPAddress}:4000`;

const domain =
  process.env.REACT_APP_NODE_ENV === 'development'
    ? localServerDomain
    : cloudServerDomain;

module.exports = { domain };
