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
  get: () => {
    return Promise.resolve({
      data: [
        {
          id: 0,
          name: 'Wash the dishes'
        },
        {
          id: 1,
          name: 'Make the bed'
        }
      ]
    });
  }
};