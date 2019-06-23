module.exports = {
  // Databases.
  database: {
    // MongoDB.
    data: {
      host: 'localhost',
      port: 28001,
      db: 'nyao',
      reconnectTimeout: 5000, // ms.
    },
    // Redis.
    session: {
      host: 'localhost',
      port: 6379,
      prefix: 'nyao_',
    },
  },

  // Passport (OAuth & local login).
  passport: {
    github: {
      clientID: 'bc581668ca518f90fbad',
      clientSecret: '80d32aeb4f0b6ad07356992ba9e5b5caf9a33853',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
    },
    google: {
      clientID: '975313662702-f08g79j0bvqjtpmn2as2b2t05nv9kf8i.apps.googleusercontent.com',
      clientSecret: 'EuxIfHTcqU2XXoxPzjCh3-wh',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
  },

  // Running behind a proxy?
  proxy: false,
  host: `localhost:${process.env.PORT}`, // How can others (inc. external peers) reach you?
                                         // i.e. https://example.com/api

  // Session cookie.
  session: {
    key: 'SID',
    secret: 'radu bompa',
  },

  /**
   * Config below shouldn't need to be modified.
   */
  githubIpRange: '192.30.252.0/22',
}
