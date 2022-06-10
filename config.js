 module.exports = {
  token: process.env.TOKEN,
  prefix: "",
  server: "",

  yes: "✅",
  no: "❌",

  owners: [""],

  special: [""],

 mongo_atlas: {
    username: process.env.username,
    password: process.env.password,
    cluster: process.env.cluster,
    shard: {
      one: process.env.shard1,
      two: process.env.shard2,
      three: process.env.shard3
    }
  },
  webhooks: {
    cmd: {
      ID: '',
      Token: ''
    },
    guild: {
      ID: '',
      Token: ''
    },
	vote: {
		ID: '',
		Token: ''
	}
  },
  cooldown: 100,
  
  topgg: {
	  auth: "",
	  token: ""
  }
};

