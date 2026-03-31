import type { AuthConfig, FeatureConfig } from "./types.js";

export class ConfigurationLoader {
  loadApiUrl(): string {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      throw new Error("API_URL environment variable is required");
    }

    return apiUrl;
  }

  loadAuthConfig(): AuthConfig {
    const accessToken = process.env.ACCESS_TOKEN;
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    // Token-based authentication
    if (accessToken) {
      return {
        type: "token",
        token: accessToken,
      };
    }

    // Email/password authentication
    if (email && password) {
      return {
        type: "email_password",
        email,
        password,
      };
    }

    throw new Error(
      "Authentication credentials not found. Please provide either ACCESS_TOKEN or both EMAIL and PASSWORD environment variables.",
    );
  }

  loadEndpointConfigurations(features: FeatureConfig[]): FeatureConfig[] {
    // Validate endpoint configurations
    for (const feature of features) {
      if (!feature.name) {
        throw new Error("Feature name is required");
      }

      if (!feature.endpoints || feature.endpoints.length === 0) {
        throw new Error(
          `Feature "${feature.name}" has no endpoints configured`,
        );
      }

      for (const endpoint of feature.endpoints) {
        if (!endpoint.path) {
          throw new Error(
            `Endpoint in feature "${feature.name}" is missing path`,
          );
        }

        if (!endpoint.method) {
          throw new Error(
            `Endpoint "${endpoint.path}" in feature "${feature.name}" is missing method`,
          );
        }

        if (!endpoint.schema) {
          throw new Error(
            `Endpoint "${endpoint.path}" in feature "${feature.name}" is missing schema`,
          );
        }
      }
    }

    return features;
  }
}
