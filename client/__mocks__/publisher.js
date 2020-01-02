export default class Publisher {
  setToken() {
    return Promise.resolve(true);
  }

  getToken() {
    return 'abcd';
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
        routes: [{
          id: 1,
          type: "collection",
          name: "sport",
          slug: "sport"
        },
        {
          id: 2,
          type: "collection",
          name: "business",
          slug: "business"
        }],
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
        paywall_enabled: true,
        routes: [{
          id: 1,
          type: "collection",
          name: "sport",
          slug: "sport"
        },
        {
          id: 2,
          type: "collection",
          name: "business",
          slug: "business"
        }],
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
      published_at: "2019-12-28T12:09:32+01:00",
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
            created_at: "2019-12-28T12:09:32+01:00",
            updated_at: "2019-12-28T12:09:32+01:00"
          }
        },
        {
          id: 990,
          article_source: {
            id: 38,
            name: "superdesk publisher",
            created_at: "2019-12-28T12:09:32+01:00",
            updated_at: "2019-12-28T12:09:32+01:00"
          }
        }
      ],
      extra: null,
      slideshows: [],
      created_at: "2019-12-28T12:09:32+01:00",
      updated_at: "2019-12-28T12:09:32+01:00",
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
        created_at: "2019-12-28T12:09:32+01:00",
        updated_at: "2019-12-28T12:09:32+01:00"
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

  queryMonitoringArticles() {
    return Promise.resolve({
      "page": 1,
      "limit": 20,
      "pages": 32,
      "total": 632,
      "_links": {
        "self": {
          "href": "/api/v2/packages/?sorting%5BupdatedAt%5D=desc&status%5B0%5D=published&status%5B1%5D=unpublished&page=1&limit=20"
        },
        "first": {
          "href": "/api/v2/packages/?sorting%5BupdatedAt%5D=desc&status%5B0%5D=published&status%5B1%5D=unpublished&page=1&limit=20"
        },
        "last": {
          "href": "/api/v2/packages/?sorting%5BupdatedAt%5D=desc&status%5B0%5D=published&status%5B1%5D=unpublished&page=32&limit=20"
        },
        "next": {
          "href": "/api/v2/packages/?sorting%5BupdatedAt%5D=desc&status%5B0%5D=published&status%5B1%5D=unpublished&page=2&limit=20"
        }
      },
      "_embedded": {
        "_items": [
          {
            "id": 686,
            "guid": "urn:newsml:sp-api.superdesk.pro:2019-11-28T19:44:39.315852:9517b504-ac24-48dd-8649-6d28b9038122",
            "headline": "Med test1.3",
            "slugline": null,
            "language": "en",
            "type": "text",
            "evolvedfrom": null,
            "firstpublished": "2019-11-28T18:48:56+0000",
            "extra_items": [],
            "body_html": "<p>&nbsp;</p>\n<div class=\"embed-block\"><div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe src=\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpyVENBPj5c&amp;key=87ca3314a9fa775b5c3a7726100694b0\" style=\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\" allowfullscreen scrolling=\"no\" allow=\"encrypted-media; accelerometer; gyroscope; picture-in-picture\"></iframe></div></div></div>\n<p>text here</p>\n<p>link <a href=\"https://google.ca\">here</a></p>\n<p><br/></p>\n<!-- EMBED START Image {id: \"editor_2\"} -->\n<figure>\n    <img src=\"https://superdesk-pro-a.s3-eu-west-1.amazonaws.com/sd-sp/2019051320054/1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d.jpg\" alt=\"d\" />\n    <figcaption>f</figcaption>\n</figure>\n<!-- EMBED END Image {id: \"editor_2\"} -->",
            "feature_media": null,
            "created_at": "2019-11-28T18:49:02+00:00",
            "updated_at": "2019-11-28T18:53:11+00:00",
            "articles": [
              {
                "id": 2160,
                "title": "Med test1.3",
                "body": "<p>&nbsp;</p> <div class=\"embed-block\"><div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe src=\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpyVENBPj5c&amp;key=87ca3314a9fa775b5c3a7726100694b0\" style=\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\" allowfullscreen scrolling=\"no\" allow=\"encrypted-media; accelerometer; gyroscope; picture-in-picture\"></iframe></div></div></div> <p>text here</p> <p>link <a href=\"https://google.ca\">here</a></p> <p><br/></p> <!-- EMBED START Image {id: \"editor_2\"} --> <figure><img src=\"/uploads/swp/0gjdk8/media/2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d.jpeg\" data-media-id=\"editor_2\" data-image-id=\"2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d\" data-rendition-name=\"original\" width=\"1280\" height=\"1024\" loading=\"lazy\" alt=\"d\"><figcaption>f<span></span><span></span></figcaption></figure> <!-- EMBED END Image {id: \"editor_2\"} -->",
                "slug": "med-test1-3-vw6o03mj",
                "published_at": "2019-11-28T18:49:02+00:00",
                "status": "published",
                "route": {
                  "id": 13,
                  "type": "collection",
                  "name": "sports",
                  "slug": "sports",
                  "_links": { "self": { "href": "/api/v2/content/routes/13" } }
                },
                "lead": "Med test1.3",
                "slideshows": [],
                "created_at": "2019-11-28T18:49:02+00:00",
                "updated_at": "2019-11-28T18:53:13+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 4,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 4,
                  "subdomain": "sp-demo-tribune.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "The Tribune",
                  "code": "ml2woe",
                  "_links": { "self": { "href": "/api/v2/tenants/ml2woe" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/med-test1-3-vw6o03mj"
                  },
                  "online": { "href": "/sports/med-test1-3-vw6o03mj" },
                  "related": { "href": "/api/v2/content/articles/2160/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2160" }
                }
              },
              {
                "id": 2159,
                "title": "Med test1.3",
                "body": "<p>&nbsp;</p> <div class=\"embed-block\"><div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe src=\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpyVENBPj5c&amp;key=87ca3314a9fa775b5c3a7726100694b0\" style=\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\" allowfullscreen scrolling=\"no\" allow=\"encrypted-media; accelerometer; gyroscope; picture-in-picture\"></iframe></div></div></div> <p>text here</p> <p>link <a href=\"https://google.ca\">here</a></p> <p><br/></p> <!-- EMBED START Image {id: \"editor_2\"} --> <figure><img src=\"/uploads/swp/0gjdk8/media/2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d.jpeg\" data-media-id=\"editor_2\" data-image-id=\"2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d\" data-rendition-name=\"original\" width=\"1280\" height=\"1024\" loading=\"lazy\" alt=\"d\"><figcaption>f<span></span><span></span></figcaption></figure> <!-- EMBED END Image {id: \"editor_2\"} -->",
                "slug": "med-test1-3-hp5azrf4",
                "published_at": "2019-11-28T18:49:02+00:00",
                "status": "published",
                "route": {
                  "id": 2,
                  "type": "collection",
                  "name": "business",
                  "slug": "business",
                  "_links": { "self": { "href": "/api/v2/content/routes/2" } }
                },
                "lead": "Med test1.3",
                "slideshows": [],
                "created_at": "2019-11-28T18:49:02+00:00",
                "updated_at": "2019-11-28T18:53:12+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 2,
                  "subdomain": "sp-demo-daily.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Daily",
                  "code": "a1hrzi",
                  "_links": { "self": { "href": "/api/v2/tenants/a1hrzi" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/med-test1-3-hp5azrf4"
                  },
                  "online": { "href": "/business/med-test1-3-hp5azrf4" },
                  "related": { "href": "/api/v2/content/articles/2159/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2159" }
                }
              },
              {
                "id": 2161,
                "title": "Med test1.3",
                "body": "<p>&nbsp;</p> <div class=\"embed-block\"><div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe src=\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpyVENBPj5c&amp;key=87ca3314a9fa775b5c3a7726100694b0\" style=\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\" allowfullscreen scrolling=\"no\" allow=\"encrypted-media; accelerometer; gyroscope; picture-in-picture\"></iframe></div></div></div> <p>text here</p> <p>link <a href=\"https://google.ca\">here</a></p> <p><br/></p> <!-- EMBED START Image {id: \"editor_2\"} --> <figure><img src=\"/uploads/swp/0gjdk8/media/2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d.jpeg\" data-media-id=\"editor_2\" data-image-id=\"2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d\" data-rendition-name=\"original\" width=\"1280\" height=\"1024\" loading=\"lazy\" alt=\"d\"><figcaption>f<span></span><span></span></figcaption></figure> <!-- EMBED END Image {id: \"editor_2\"} -->",
                "slug": "med-test1-3-wjkwcf7p",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "Med test1.3",
                "slideshows": [],
                "created_at": "2019-11-28T18:49:02+00:00",
                "updated_at": "2019-11-28T18:53:13+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 133,
                  "subdomain": "sp-demo-na2nd.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "NA2nd",
                  "code": "sot30o",
                  "_links": { "self": { "href": "/api/v2/tenants/sot30o" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/med-test1-3-wjkwcf7p"
                  },
                  "online": [
                    {
                      "href": "/api/v2/content/articles/?slug=med-test1-3-wjkwcf7p"
                    },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2161/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2161" }
                }
              },
              {
                "id": 2162,
                "title": "Med test1.3",
                "body": "<p>&nbsp;</p> <div class=\"embed-block\"><div><div style=\"left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;\"><iframe src=\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpyVENBPj5c&amp;key=87ca3314a9fa775b5c3a7726100694b0\" style=\"border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;\" allowfullscreen scrolling=\"no\" allow=\"encrypted-media; accelerometer; gyroscope; picture-in-picture\"></iframe></div></div></div> <p>text here</p> <p>link <a href=\"https://google.ca\">here</a></p> <p><br/></p> <!-- EMBED START Image {id: \"editor_2\"} --> <figure><img src=\"/uploads/swp/0gjdk8/media/2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d.jpeg\" data-media-id=\"editor_2\" data-image-id=\"2019051320054_1783d3d6604c967c518e4064bdb484987111d37697eb10f777ad611c1deaf39d\" data-rendition-name=\"original\" width=\"1280\" height=\"1024\" loading=\"lazy\" alt=\"d\"><figcaption>f<span></span><span></span></figcaption></figure> <!-- EMBED END Image {id: \"editor_2\"} -->",
                "slug": "med-test1-3-bayk6z6j",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "Med test1.3",
                "slideshows": [],
                "created_at": "2019-11-28T18:49:02+00:00",
                "updated_at": "2019-11-28T18:53:14+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 5,
                  "subdomain": "sp-demo-default.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Default theme",
                  "code": "1bl1ia",
                  "_links": { "self": { "href": "/api/v2/tenants/1bl1ia" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/med-test1-3-bayk6z6j"
                  },
                  "online": [
                    {
                      "href": "/api/v2/content/articles/?slug=med-test1-3-bayk6z6j"
                    },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2162/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2162" }
                }
              }
            ],
            "status": "published"
          },
          {
            "id": 685,
            "guid": "urn:newsml:sp-api.superdesk.pro:2019-11-26T16:29:25.238786:2dbcf366-fe23-4700-a985-72dc1474e1bc",
            "headline": "Test Headline",
            "slugline": "pope-visit-alabama",
            "language": "en",
            "type": "text",
            "evolvedfrom": null,
            "firstpublished": "2019-11-26T15:35:12+0000",
            "extra_items": [],
            "body_html": "<p>Test test</p>",
            "feature_media": null,
            "created_at": "2019-11-26T15:35:13+00:00",
            "updated_at": "2019-11-26T15:35:13+00:00",
            "articles": [
              {
                "id": 2158,
                "title": "Test Headline",
                "body": "<p>Test test</p>",
                "slug": "pope-visit-alabama",
                "published_at": "2019-11-26T15:35:13+00:00",
                "status": "published",
                "route": {
                  "id": 5,
                  "type": "collection",
                  "name": "culture",
                  "slug": "culture",
                  "_links": { "self": { "href": "/api/v2/content/routes/5" } }
                },
                "lead": "Test abstract",
                "slideshows": [],
                "created_at": "2019-11-26T15:35:13+00:00",
                "updated_at": "2019-11-26T15:35:13+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 2,
                  "subdomain": "sp-demo-daily.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Daily",
                  "code": "a1hrzi",
                  "_links": { "self": { "href": "/api/v2/tenants/a1hrzi" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": { "href": "/api/v2/content/articles/pope-visit-alabama" },
                  "online": { "href": "/culture/pope-visit-alabama" },
                  "related": { "href": "/api/v2/content/articles/2158/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2158" }
                }
              },
              {
                "id": 2157,
                "title": "Test Headline",
                "body": "<p>Test test</p>",
                "slug": "pope-visit-alabama",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "Test abstract",
                "slideshows": [],
                "created_at": "2019-11-26T15:35:13+00:00",
                "updated_at": "2019-11-26T15:35:13+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 5,
                  "subdomain": "sp-demo-default.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Default theme",
                  "code": "1bl1ia",
                  "_links": { "self": { "href": "/api/v2/tenants/1bl1ia" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": { "href": "/api/v2/content/articles/pope-visit-alabama" },
                  "online": [
                    { "href": "/api/v2/content/articles/?slug=pope-visit-alabama" },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2157/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2157" }
                }
              },
              {
                "id": 2156,
                "title": "Test Headline",
                "body": "<p>Test test</p>",
                "slug": "pope-visit-alabama",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "Test abstract",
                "slideshows": [],
                "created_at": "2019-11-26T15:35:13+00:00",
                "updated_at": "2019-11-26T15:35:13+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 133,
                  "subdomain": "sp-demo-na2nd.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "NA2nd",
                  "code": "sot30o",
                  "_links": { "self": { "href": "/api/v2/tenants/sot30o" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": { "href": "/api/v2/content/articles/pope-visit-alabama" },
                  "online": [
                    { "href": "/api/v2/content/articles/?slug=pope-visit-alabama" },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2156/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2156" }
                }
              }
            ],
            "status": "published"
          },
          {
            "id": 679,
            "guid": "urn:newsml:sp-api.superdesk.pro:2019-11-25T13:08:13.086676:48c543a1-f0b2-4f81-bcfd-7009f16d1f75",
            "headline": "Pawe\u0142 schedule #1",
            "slugline": null,
            "language": "en",
            "type": "text",
            "evolvedfrom": null,
            "firstpublished": "2019-11-25T12:39:50+0000",
            "extra_items": [],
            "body_html": "<p>some body</p>",
            "feature_media": null,
            "created_at": "2019-11-25T13:10:18+00:00",
            "updated_at": "2019-11-25T13:10:18+00:00",
            "articles": [
              {
                "id": 2138,
                "title": "Pawe\u0142 schedule #1",
                "body": "<p>some body</p>",
                "slug": "pawel-schedule-1-dq280m4c",
                "published_at": "2019-11-25T13:10:18+00:00",
                "status": "published",
                "route": {
                  "id": 2,
                  "type": "collection",
                  "name": "business",
                  "slug": "business",
                  "_links": { "self": { "href": "/api/v2/content/routes/2" } }
                },
                "lead": "schedule #1 abstract",
                "slideshows": [],
                "created_at": "2019-11-25T13:10:18+00:00",
                "updated_at": "2019-11-25T13:10:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 2,
                  "subdomain": "sp-demo-daily.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Daily",
                  "code": "a1hrzi",
                  "_links": { "self": { "href": "/api/v2/tenants/a1hrzi" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/pawel-schedule-1-dq280m4c"
                  },
                  "online": { "href": "/business/pawel-schedule-1-dq280m4c" },
                  "related": { "href": "/api/v2/content/articles/2138/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2138" }
                }
              },
              {
                "id": 2139,
                "title": "Pawe\u0142 schedule #1",
                "body": "<p>some body</p>",
                "slug": "pawel-schedule-1-z9hpqk3f",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "schedule #1 abstract",
                "slideshows": [],
                "created_at": "2019-11-25T13:10:18+00:00",
                "updated_at": "2019-11-25T13:10:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 133,
                  "subdomain": "sp-demo-na2nd.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "NA2nd",
                  "code": "sot30o",
                  "_links": { "self": { "href": "/api/v2/tenants/sot30o" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/pawel-schedule-1-z9hpqk3f"
                  },
                  "online": [
                    {
                      "href": "/api/v2/content/articles/?slug=pawel-schedule-1-z9hpqk3f"
                    },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2139/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2139" }
                }
              },
              {
                "id": 2140,
                "title": "Pawe\u0142 schedule #1",
                "body": "<p>some body</p>",
                "slug": "pawel-schedule-1-uvuvzsew",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "schedule #1 abstract",
                "slideshows": [],
                "created_at": "2019-11-25T13:10:18+00:00",
                "updated_at": "2019-11-25T13:10:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 5,
                  "subdomain": "sp-demo-default.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Default theme",
                  "code": "1bl1ia",
                  "_links": { "self": { "href": "/api/v2/tenants/1bl1ia" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/pawel-schedule-1-uvuvzsew"
                  },
                  "online": [
                    {
                      "href": "/api/v2/content/articles/?slug=pawel-schedule-1-uvuvzsew"
                    },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2140/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2140" }
                }
              }
            ],
            "status": "published"
          },
          {
            "id": 678,
            "guid": "urn:newsml:sp-api.superdesk.pro:2019-11-25T13:57:44.043090:8135e151-08b5-41b6-9dde-ae449b69e67c",
            "headline": "Test Publish #3",
            "slugline": null,
            "language": "en",
            "type": "text",
            "evolvedfrom": null,
            "firstpublished": "2019-11-25T12:58:12+0000",
            "extra_items": [],
            "body_html": "<p>sad f asdf asdf asdf s</p>",
            "feature_media": null,
            "created_at": "2019-11-25T12:58:18+00:00",
            "updated_at": "2019-11-25T12:58:19+00:00",
            "articles": [
              {
                "id": 2136,
                "title": "Test Publish #3",
                "body": "<p>sad f asdf asdf asdf s</p>",
                "slug": "test-publish-3-2uwp5607",
                "published_at": null,
                "status": "new",
                "route": {
                  "id": 36,
                  "type": "collection",
                  "name": "sports",
                  "slug": "sports",
                  "_links": { "self": { "href": "/api/v2/content/routes/36" } }
                },
                "lead": "asd fsadf sadf",
                "slideshows": [],
                "created_at": "2019-11-25T12:58:18+00:00",
                "updated_at": "2019-11-25T12:58:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 5,
                  "subdomain": "sp-demo-default.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Default theme",
                  "code": "1bl1ia",
                  "_links": { "self": { "href": "/api/v2/tenants/1bl1ia" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/test-publish-3-2uwp5607"
                  },
                  "online": { "href": "/sports/test-publish-3-2uwp5607" },
                  "related": { "href": "/api/v2/content/articles/2136/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2136" }
                }
              },
              {
                "id": 2137,
                "title": "Test Publish #3",
                "body": "<p>sad f asdf asdf asdf s</p>",
                "slug": "test-publish-3-9fpol2bj",
                "published_at": "2019-11-25T12:58:18+00:00",
                "status": "published",
                "route": {
                  "id": 3,
                  "type": "collection",
                  "name": "sport",
                  "slug": "sports",
                  "_links": { "self": { "href": "/api/v2/content/routes/3" } }
                },
                "lead": "asd fsadf sadf",
                "slideshows": [],
                "created_at": "2019-11-25T12:58:18+00:00",
                "updated_at": "2019-11-25T12:58:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 2,
                  "subdomain": "sp-demo-daily.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "Daily",
                  "code": "a1hrzi",
                  "_links": { "self": { "href": "/api/v2/tenants/a1hrzi" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/test-publish-3-9fpol2bj"
                  },
                  "online": { "href": "/sports/test-publish-3-9fpol2bj" },
                  "related": { "href": "/api/v2/content/articles/2137/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2137" }
                }
              },
              {
                "id": 2135,
                "title": "Test Publish #3",
                "body": "<p>sad f asdf asdf asdf s</p>",
                "slug": "test-publish-3-7kf2o4l0",
                "published_at": null,
                "status": "new",
                "route": null,
                "lead": "asd fsadf sadf",
                "slideshows": [],
                "created_at": "2019-11-25T12:58:18+00:00",
                "updated_at": "2019-11-25T12:58:18+00:00",
                "seo_metadata": null,
                "feature_media": null,
                "is_published_fbia": false,
                "article_statistics": {
                  "impressions_number": 0,
                  "page_views_number": 0,
                  "internal_click_rate": 0.0
                },
                "comments_count": 0,
                "tenant": {
                  "id": 133,
                  "subdomain": "sp-demo-na2nd.s-lab",
                  "domain_name": "sourcefabric.org",
                  "name": "NA2nd",
                  "code": "sot30o",
                  "_links": { "self": { "href": "/api/v2/tenants/sot30o" } },
                  "fbia_enabled": true,
                  "paywall_enabled": true
                },
                "_links": {
                  "self": {
                    "href": "/api/v2/content/articles/test-publish-3-7kf2o4l0"
                  },
                  "online": [
                    {
                      "href": "/api/v2/content/articles/?slug=test-publish-3-7kf2o4l0"
                    },
                    { "href": "/api/v2/content/articles/" }
                  ],
                  "related": { "href": "/api/v2/content/articles/2135/related/" },
                  "slideshows": { "href": "/api/v2/content/slideshows/2135" }
                }
              }
            ],
            "status": "published"
          }
        ]
      }
    }
    );
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
          published_at: "2019-12-28T12:09:32+01:00"
        },
        created_at: "2019-12-28T12:09:32+01:00",
        updated_at: "2019-12-28T12:09:32+01:00",
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
        created_at: "2019-12-28T12:09:32+01:00",
        updated_at: "2019-12-28T12:09:32+01:00",
        enabled: true,
        content_list_items_updated_at: "2019-12-28T12:09:32+01:00",
        latest_items: [
          {
            id: 2428,
            content: {
              id: 1755,
              title: "seo test",
              body: "<p>seo test</p>",
              slug: "seo-test",
              published_at: "2019-12-28T12:09:32+01:00",
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
              created_at: "2019-12-28T12:09:32+01:00",
              updated_at: "2019-12-28T12:09:32+01:00",

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
            created_at: "2019-12-28T12:09:32+01:00",
            updated_at: "2019-12-28T12:09:32+01:00",
            enabled: true
          }
        ]
      }
    ]);
  }
}
