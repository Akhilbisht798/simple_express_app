const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Model = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    inStock: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
});

Model.virtual("url").get(function () {
    return `/catalog/model/${this._id}`;
});

module.exports = mongoose.model("models", Model);