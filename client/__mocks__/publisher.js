export default class Publisher {
  setToken() {
    return Promise.resolve(true);
  }

  setTenant(site) {
    return Promise.resolve(true);
  }

  querySites() {
    return Promise.resolve([
      {
        id: 1,
        subdomain: "site1",
        domain_name: "sourcefabric.org",
        name: "Site1",
        code: "site1",
        theme_name: "swp/daily-theme",
        amp_enabled: true,
        output_channel: null,
        articles_count: 146,

        fbia_enabled: false,
        paywall_enabled: false
      },
      {
        id: 2,
        subdomain: "site2",
        domain_name: "sourcefabric.org",
        name: "Site2",
        code: "site2",
        theme_name: "swp/daily-theme",
        amp_enabled: true,
        output_channel: null,
        articles_count: 146,
        fbia_enabled: true,
        paywall_enabled: true
      }
    ]);
  }

  queryRoutes(type) {
    return Promise.resolve([
      { id: 1, name: "route1" },
      { id: 2, name: "route2" }
    ]);
  }
}
