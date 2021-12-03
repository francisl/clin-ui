export const getEnvVariable = (envVarName: string) =>
  (process.env[`REACT_APP_${envVarName}`] || '') as string;

export const keycloakConfig = getEnvVariable('KEYCLOAK_CONFIG');

export const bridgeOrigin = getEnvVariable('BRIDGE_ORIGIN');
