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

  queryLists() {
    return Promise.resolve([
      {
        id: 7,
        name: "Most shared",
        description: null,
        type: "automatic",
        cache_life_time: 0,
        limit: null,
        filters: {
          metadata: [],
          route: ["2", "1"],
          published_at: "2018-12-14"
        },
        created_at: "2017-07-04T13:09:49+00:00",
        updated_at: "2019-03-11T14:12:59+00:00",
        enabled: true,
        content_list_items_updated_at: null,
        latest_items: [],
        content_list_items_count: 0
      },
      {
        id: 12,
        name: "Top news",
        description: null,
        type: "manual",
        cache_life_time: 0,
        limit: null,
        filters: [],
        created_at: "2017-07-10T09:19:07+00:00",
        updated_at: "2019-08-05T10:17:06+00:00",
        enabled: true,
        content_list_items_updated_at: "2019-08-05T10:17:06+00:00",
        latest_items: [
          {
            id: 2428,
            content: {
              id: 1755,
              title: "seo test",
              body: "<p>seo test</p>",
              slug: "seo-test",
              published_at: "2019-06-18T11:06:15+00:00",
              status: "published",
              route: {
                requirements: {
                  slug: "[a-zA-Z0-9*\\-_\\/]+"
                },
                id: 5,
                content: null,
                static_prefix: "/culture",
                variable_pattern: "/{slug}",
                parent: null,
                children: [],
                lft: 1,
                rgt: 2,
                level: 0,
                template_name: "category.html.twig",
                articles_template_name: "article.html.twig",
                type: "collection",
                cache_time_in_seconds: 0,
                name: "culture",
                slug: "culture",
                position: 4,
                articles_count: 0,
                paywall_secured: false,
                _links: {
                  self: {
                    href: "/api/v2/content/routes/5"
                  }
                }
              },

              media: [],
              feature_media: null,
              lead: "seo test",
              code:
                "urn:newsml:sp-api.superdesk.pro:2019-06-18T13:04:55.519813:4a6cae01-f6f9-4013-bc8b-dd767aafa674",

              extra: {
                test123: "seo test"
              },
              slideshows: [],
              created_at: "2019-06-18T11:05:31+00:00",
              updated_at: "2019-06-18T11:07:55+00:00",

              tenant: {
                id: 2,
                subdomain: "sp-demo-daily.s-lab",
                domain_name: "sourcefabric.org",
                code: "a1hrzi",
                name: "Daily",
                amp_enabled: true,
                fbia_enabled: true,
                paywall_enabled: true,
                _links: {
                  self: {
                    href: "/api/v2/tenants/a1hrzi"
                  }
                }
              },
              paywall_secured: false,
              content_lists: []
            },
            position: 7,
            sticky: false,
            created_at: "2019-08-05T10:17:06+00:00",
            updated_at: "2019-08-05T10:17:06+00:00",
            enabled: true
          }
        ]
      }
    ]);
  }
}
