import { Strategy as OAuth2Strategy } from "passport-oauth2";
import { randomUUID } from "crypto";

interface GenericUser {
  id: string;
  username?: string;
  email?: string;
  displayName?: string;
}

export const createOAuthStrategy = (
  authorizationURL: string,
  tokenURL: string,
  userInfoURL: string,
  clientID: string,
  clientSecret: string,
  callbackURL: string,
  providerName = "oauth"
) => {
  const strategy = new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL,
      clientID,
      clientSecret,
      callbackURL,
      state: true,
    },
    async (accessToken: string, refreshToken: string, _profile: any, done: any) => {
      try {
        if (!userInfoURL) {
          // Fallback: build a minimal user
          const user = {
            id: randomUUID(),
            email: `${randomUUID()}@${providerName}.oauth`,
            firstName: providerName,
            lastName: "User",
            role: "operator" as const,
            externalProvider: providerName,
          };
          return done(null, user);
        }

        const userResponse = await fetch(userInfoURL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile from provider");
        }

        const userData: GenericUser = await userResponse.json();

        const user = {
          id: userData.id || randomUUID(),
          email: userData.email || `${userData.username || userData.id}@${providerName}.oauth`,
          firstName: userData.displayName || userData.username || providerName,
          lastName: providerName,
          role: "operator" as const,
          externalId: userData.id,
          externalProvider: providerName,
          accessToken,
          refreshToken,
        };

        return done(null, user);
      } catch (err: any) {
        return done(err);
      }
    }
  );

  strategy.userProfile = async (accessToken: string, done: any) => {
    try {
      if (!userInfoURL) return done(null, {});
      const response = await fetch(userInfoURL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const profile = await response.json();
      done(null, profile);
    } catch (err: any) {
      done(err);
    }
  };

  return strategy;
};

export const createDevStrategy = () => {
  const strategy = new OAuth2Strategy(
    {
      authorizationURL: "http://localhost:3000/oauth/authorize",
      tokenURL: "http://localhost:3000/oauth/token",
      clientID: "dev-client-id",
      clientSecret: "dev-client-secret",
      callbackURL: "http://localhost:3000/auth/callback",
    },
    (_accessToken: string, _refreshToken: string, _profile: any, done: any) => {
      const user = {
        id: randomUUID(),
        email: "dev@pixlabel.test",
        firstName: "Dev",
        lastName: "User",
        role: "admin" as const,
      };
      done(null, user);
    }
  );

  return strategy;
};
