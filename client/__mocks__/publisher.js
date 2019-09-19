import moment from "moment";

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

  queryTenantArticles() {
    let article = {
      id: 1317,
      title:
        "If you let any one have it but me, Basil, I shall never forgive you",
      body:
        '<p>I adore simple pleasures," said Lord Henry. "They are the last refuge of the complex. But I don\'t like scenes, except on the stage. What absurd fellows you are, both of you! I wonder who it was defined man as a rational animal. It was the most premature definition ever given. Man is many things, but he is not rational. I am glad he is not, after all--though I wish you chaps would not squabble over the picture. You had much better let me have it, Basil. This silly boy doesn\'t really want it, and I really do."</p><p>"If you let any one have it but me, Basil, I shall never forgive you!" cried Dorian Gray; "and I don\'t allow people to call me a silly boy."</p><p>"You know the picture is yours, Dorian. I gave it to you before it existed."</p><p>"And you know you have been a little silly, Mr. Gray, and that you don\'t really object to being reminded that you are extremely young."</p><p>"I should have objected very strongly this morning, Lord Henry."</p><p>"Ah! this morning! You have lived since then."</p><p>There came a knock at the door, and the butler entered with a laden tea-tray and set it down upon a small Japanese table. There was a rattle of cups and saucers and the hissing of a fluted Georgian urn. Two globe-shaped china dishes were brought in by a page. Dorian Gray went over and poured out the tea. The two men sauntered languidly to the table and examined what was under the covers.</p><p>"Let us go to the theatre to-night," said Lord Henry. "There is sure to be something on, somewhere. I have promised to dine at White\'s, but it is only with an old friend, so I can send him a wire to say that I am ill, or that I am prevented from coming in consequence of a subsequent engagement. I think that would be a rather nice excuse: it would have all the surprise of candour."</p><p>"It is such a bore putting on one\'s dress-clothes," muttered Hallward. "And, when one has them on, they are so horrid.</p> ',
      slug: "if-you-let-any-one-have-it-but-me-basil-i-shall-never-forgive-you",
      published_at: moment()
        .subtract(2, "days")
        .format(),
      status: "published",
      route: {
        requirements: {
          slug: "[a-zA-Z0-9*\\-_]+"
        },
        id: 3,
        content: null,
        static_prefix: "/sports",
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
        name: "sport",
        slug: "sports",
        position: 0,
        articles_count: 0,
        paywall_secured: false,
        _links: {
          self: {
            href: "/api/v2/content/routes/3"
          }
        }
      },
      template_name: null,
      publish_start_date: null,
      publish_end_date: null,
      is_publishable: true,
      metadata: {
        subject: [],
        urgency: 0,
        priority: 5,
        located: null,
        place: [],
        service: [
          {
            code: "s",
            name: "Sports"
          }
        ],
        type: "text",
        byline: null,
        guid:
          "urn:newsml:sp-api.superdesk.pro:2018-12-04T11:01:29.153120:e52dabd2-1f36-454d-bf5b-73e5713857e1",
        edNote: null,
        genre: null,
        language: "en"
      },
      media: [
        {
          id: 2473,
          file: null,
          image: {
            id: 2152,
            file_extension: "jpeg",
            asset_id:
              "2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf",
            width: null,
            height: null
          },
          description: "Italy",
          by_line: null,
          alt_text: "Vicenza, Italy",
          usage_terms: "",
          renditions: [
            {
              width: 1400,
              height: 933,
              name: "baseImage",
              id: 24053,
              image: {
                id: 2153,
                file_extension: "jpeg",
                asset_id:
                  "2018120411124_d5b994456555dfd96288b65716cc7f57dc00a46aa011ae3464a9e2434588efd8",
                width: null,
                height: null
              },
              preview_url: null
            },
            {
              width: 2048,
              height: 1365,
              name: "original",
              id: 24052,
              image: {
                id: 2152,
                file_extension: "jpeg",
                asset_id:
                  "2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf",
                width: null,
                height: null
              },
              preview_url: null
            },
            {
              width: 640,
              height: 426,
              name: "viewImage",
              id: 24051,
              image: {
                id: 2151,
                file_extension: "jpeg",
                asset_id:
                  "2018120411124_8b2b8b497e074e3ade23cd5a2746249c9ccdcd640e849a96efb527de24b2bd2c",
                width: null,
                height: null
              },
              preview_url: null
            },
            {
              width: 180,
              height: 120,
              name: "thumbnail",
              id: 24050,
              image: {
                id: 2150,
                file_extension: "jpeg",
                asset_id:
                  "2018120411124_814eac8d71c489157f48012408766eb5c06b388ba9384e8976400d3993d46d40",
                width: null,
                height: null
              },
              preview_url: null
            }
          ],
          headline: null,
          copyright_holder: null,
          copyright_notice: null,
          _links: {
            download: {
              href:
                "/media/2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf.jpeg"
            }
          }
        }
      ],
      feature_media: {
        id: 2473,
        file: null,
        image: {
          id: 2152,
          file_extension: "jpeg",
          asset_id:
            "2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf",
          width: null,
          height: null
        },
        description: "Italy",
        by_line: null,
        alt_text: "Vicenza, Italy",
        usage_terms: "",
        renditions: [
          {
            width: 1400,
            height: 933,
            name: "baseImage",
            id: 24053,
            image: {
              id: 2153,
              file_extension: "jpeg",
              asset_id:
                "2018120411124_d5b994456555dfd96288b65716cc7f57dc00a46aa011ae3464a9e2434588efd8",
              width: null,
              height: null
            },
            preview_url: null
          },
          {
            width: 2048,
            height: 1365,
            name: "original",
            id: 24052,
            image: {
              id: 2152,
              file_extension: "jpeg",
              asset_id:
                "2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf",
              width: null,
              height: null
            },
            preview_url: null
          },
          {
            width: 640,
            height: 426,
            name: "viewImage",
            id: 24051,
            image: {
              id: 2151,
              file_extension: "jpeg",
              asset_id:
                "2018120411124_8b2b8b497e074e3ade23cd5a2746249c9ccdcd640e849a96efb527de24b2bd2c",
              width: null,
              height: null
            },
            preview_url: null
          },
          {
            width: 180,
            height: 120,
            name: "thumbnail",
            id: 24050,
            image: {
              id: 2150,
              file_extension: "jpeg",
              asset_id:
                "2018120411124_814eac8d71c489157f48012408766eb5c06b388ba9384e8976400d3993d46d40",
              width: null,
              height: null
            },
            preview_url: null
          }
        ],
        headline: null,
        copyright_holder: null,
        copyright_notice: null,
        _links: {
          download: {
            href:
              "/media/2018120411124_69a64bf465f3ee778ad897783483326549a86c99ead0965fd568ba49627e47bf.jpeg"
          }
        }
      },
      lead:
        "And you know you have been a little silly, Mr. Gray, and that you don't really object to being reminded that you are extremely young.",
      code:
        "urn:newsml:sp-api.superdesk.pro:2018-12-04T11:01:29.153120:e52dabd2-1f36-454d-bf5b-73e5713857e1",
      sources: [
        {
          id: 991,
          article_source: {
            id: 39,
            name: "",
            created_at: moment()
              .subtract(2, "days")
              .format(),
            updated_at: moment()
              .subtract(2, "days")
              .format()
          }
        },
        {
          id: 990,
          article_source: {
            id: 38,
            name: "superdesk publisher",
            created_at: moment()
              .subtract(2, "days")
              .format(),
            updated_at: moment()
              .subtract(2, "days")
              .format()
          }
        }
      ],
      extra: null,
      slideshows: [],
      created_at: moment()
        .subtract(2, "days")
        .format(),
      updated_at: moment()
        .subtract(2, "days")
        .format(),
      authors: [
        {
          name: "Sarrah Staffwriter",
          role: "writer",
          jobtitle: [],
          biography:
            "Besides freelance journalism, Sarrah is professional mushroom picker and world-class cook known for her unbeatable borsch.",
          avatar_url:
            "https://sp-demo-daily.s-lab.sourcefabric.org/author/media/sarrah-staffwriter_81c68bf9baac1fe8b57e0bf1190a595e0ed834d1.jpeg",
          twitter: null,
          instagram: null,
          facebook: null,
          id: 1,
          slug: "sarrah-staffwriter",
          avatar: {
            id: "1",
            key: "avatar",
            file: null,
            image: {
              id: 1479,
              file_extension: "jpeg",
              asset_id:
                "sarrah-staffwriter_81c68bf9baac1fe8b57e0bf1190a595e0ed834d1",
              width: null,
              height: null
            },
            _links: {
              download: {
                href:
                  "/author/media/sarrah-staffwriter_81c68bf9baac1fe8b57e0bf1190a595e0ed834d1.jpeg"
              }
            }
          }
        }
      ],
      keywords: [],
      seo_metadata: null,
      is_published_fbia: false,
      article_statistics: {
        impressions_number: 0,
        page_views_number: 0,
        internal_click_rate: 0,
        created_at: moment()
          .subtract(2, "days")
          .format(),
        updated_at: moment()
          .subtract(2, "days")
          .format()
      },
      external_article: null,
      comments_count: 0,
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
      content_lists: [],
      _links: {
        self: {
          href:
            "/api/v2/content/articles/if-you-let-any-one-have-it-but-me-basil-i-shall-never-forgive-you"
        },
        online: {
          href:
            "/sports/if-you-let-any-one-have-it-but-me-basil-i-shall-never-forgive-you"
        },
        related: {
          href: "/api/v2/content/articles/1317/related/"
        },
        slideshows: {
          href: "/api/v2/content/slideshows/1317"
        }
      }
    };

    return Promise.resolve({
      page: 1,
      totalPages: 1,
      _embedded: { _items: [article] }
    });
  }

  queryListArticlesWithDetails() {
    let items = [];
    this.queryLists().then(arr => (items = arr));

    return Promise.resolve({
      page: 1,
      totalPages: 1,
      _embedded: { _items: [...items] }
    });
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
          published_at: moment()
            .subtract(2, "days")
            .format()
        },
        created_at: moment()
          .subtract(2, "days")
          .format(),
        updated_at: moment()
          .subtract(2, "days")
          .format(),
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
        created_at: moment()
          .subtract(2, "days")
          .format(),
        updated_at: moment()
          .subtract(2, "days")
          .format(),
        enabled: true,
        content_list_items_updated_at: moment()
          .subtract(2, "days")
          .format(),
        latest_items: [
          {
            id: 2428,
            content: {
              id: 1755,
              title: "seo test",
              body: "<p>seo test</p>",
              slug: "seo-test",
              published_at: moment()
                .subtract(2, "days")
                .format(),
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
              created_at: moment()
                .subtract(2, "days")
                .format(),
              updated_at: moment()
                .subtract(2, "days")
                .format(),

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
            created_at: moment()
              .subtract(2, "days")
              .format(),
            updated_at: moment()
              .subtract(2, "days")
              .format(),
            enabled: true
          }
        ]
      }
    ]);
  }
}
