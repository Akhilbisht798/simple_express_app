const Category = require("../models/category");
const Model = require("../models/model");

const async = require("async");

exports.category_list = (req, res) => {
    Category.find().then((data) => {
        res.render(`collection`, {
            data: data,
        });

    })
}

exports.category_detail = (req, res) => {
    const name = req.params.categoryName;
    async.waterfall(
        [
            function (callback) {
                Category.find({ name: name }).then(obj => {
                    if (obj.length !== 0) callback(null, obj[0]._id)
                    else res.send(`<h1>Not Any Category named: ${name}</h1>`)
                })
            },
            function (args1, callback) {
                Model.find({ category: args1 }).then(data => {
                    callback(null, data);
                })
            }
        ],
        function (err, results) {
            if (err) {
                res.send("Error in getting.")
                return;
            }
            res.render("categoryVeiw", {
                name: name,
                data: results
            });
        }
    )
}

// Add category to the database.
exports.AddCategory = (req, res) => {
    res.render("form");
}

//Get Data from Form and Store it in Database.
exports.AddCategoryToDatabase = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    detail = { name: name, description: description };

    let category_detail = new Category(detail);

    category_detail.save((err) => {
        if (err) {
            console.log("Error in adding data");
            return;
        }
        console.log("New Category: " + category_detail);
        res.redirect("/category");
    })
}

// How to get Category id to save item.
exports.AddItem = (req, res) => {
    const Name = req.params.Name;
    res.render("AddItem", {
        name: Name,
    });
}

exports.AddItemToDatabase = (req, res) => {
    const category = req.params.Name;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;

    async.waterfall(
        [
            function (callback) {
                Category.find({ name: category }).then(obj => {
                    if (obj.length !== 0) callback(null, obj[0]._id);
                    else res.send(`<h1>Not Any Category named: ${name}</h1>`);
                })
            },
            function (args1, callback) {
                detail = {
                    name: name,
                    description: description,
                    inStock: stock,
                    price: price,
                    category: args1
                };

                let model_detail = new Model(detail);

                model_detail.save((err) => {
                    if (err) {
                        console.log("Error in adding data");
                        return;
                    }
                    res.redirect(`/`);
                })
            }
        ]
    )
}