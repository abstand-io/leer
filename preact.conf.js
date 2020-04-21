export default (config, env, helpers) => {
  config.externals = {
    ...config.externals,
    moment: 'moment'
  };
};