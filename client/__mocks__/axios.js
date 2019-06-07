// import axios from "axios"

// // Mock out all top level functions, such as get, put, delete and post:
// jest.mock("axios")

// axios.get.mockImplementation(url => {
//     if (url === 'www.example.com') {
//         return Promise.resolve({ data: {...} })
//     } else {

//     }
// })

'use strict';
module.exports = {
  get: (url) => {
    let data = {}

    if (url.includes('example.com/tenants')) {
        data = {
            _embedded: {_items: [
                {
                    "id":1,
                    "subdomain":"tenant1",
                    "domain_name":"sourcefabric.org",
                    "name":"TENANT1",
                    "code":"tenant1",
                    "organization":{
                        "id":1,
                        "name":"test",
                        "code":"0gjdk8"
                    },
                    "created_at":"2017-06-30T09:36:00+00:00",
                    "updated_at":"2019-04-16T19:45:19+00:00",
                    "enabled":true,
                    "theme_name":"swp\/daily-theme",
                    "amp_enabled":true,
                    "output_channel":null,
                    "articles_count":140,
                    "fbia_enabled":false,
                    "paywall_enabled":false
                },
                {
                    "id":2,
                    "subdomain":"tenant2",
                    "domain_name":"sourcefabric.org",
                    "name":"TENANT2",
                    "code":"tenant2",
                    "organization":{
                        "id":1,
                        "name":"test",
                        "code":"0gjdk8"
                    },
                    "created_at":"2017-06-30T09:36:00+00:00",
                    "updated_at":"2019-04-16T19:45:19+00:00",
                    "enabled":true,
                    "theme_name":"swp\/daily-theme",
                    "amp_enabled":true,
                    "output_channel":null,
                    "articles_count":140,
                    "fbia_enabled":false,
                    "paywall_enabled":false
                }
            ]}
        }
    }


    console.log("\x1b[44m\x1b[37m%s\x1b[0m", "API URL: " + url)
    return Promise.resolve({data: data})
  }
};

