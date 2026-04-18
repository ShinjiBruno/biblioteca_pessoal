import {
  provideKeycloak,
  createInterceptorCondition,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';
import { keycloak_client, keycloak_url, keycloak_realm } from '../environments/environment';

// Gateway Krakend URL local
const krakendCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^http:\/\/localhost:8081\/.*$/i,
});

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: keycloak_realm,
      url: keycloak_url,
      clientId: keycloak_client,
    },
    initOptions: {
      // Direciona automaticamente para a tela de login-required quando não autenticado
      onLoad: 'login-required',
      checkLoginIframe: false,
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 3600000,
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [krakendCondition],
      },
    ],
  });
