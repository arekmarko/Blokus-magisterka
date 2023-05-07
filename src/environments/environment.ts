// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SOCKET_ENDPOINT: 'http://localhost:3000',
  firebase: {
    apiKey: "AIzaSyBLNdf5a81r0OzyiCIydy4crxhsRUwqKcg",
    authDomain: "mag-blokus.firebaseapp.com",
    projectId: "mag-blokus",
    storageBucket: "mag-blokus.appspot.com",
    messagingSenderId: "12453102094",
    appId: "1:12453102094:web:3e387288abd51713da725f",
    measurementId: "G-RVM7LT6HV7"
  },
};
const firebaseConfig = {
  apiKey: "AIzaSyBLNdf5a81r0OzyiCIydy4crxhsRUwqKcg",
  authDomain: "mag-blokus.firebaseapp.com",
  projectId: "mag-blokus",
  storageBucket: "mag-blokus.appspot.com",
  messagingSenderId: "12453102094",
  appId: "1:12453102094:web:3e387288abd51713da725f",
  measurementId: "G-RVM7LT6HV7"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
