const { Schema, model } = require("mongoose")

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refresh_token: { type: String, default: "" },
  firstname: { type: String, default: "" },
  lastname: { type: String, default: "" },
  phone: { type: String, default: "" },
  status: { type: String, default: "" },
  address: { type: String, default: "" },
  brief: { type: String, default: "" },
  ava: {
    type: String,
    required: true,
    default:
      "https://cdn3.iconfinder.com/data/icons/iconoid-ui-essentials/32/ui_user_account_person_username-512.png",
  },
  typeUser: { type: String, required: true, default: "user" },
  date: { type: Date, required: true },
})

module.exports = model("User", schema)
