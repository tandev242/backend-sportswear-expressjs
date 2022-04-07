const file = require('./giay-futsal-data.json')

const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");


const addProductFromFileToDB = async () => {
    const arr = file['giay-futsal']
    try {
        for (var item of arr) {
            let name = item.name
            const brandList = {
                adidas: "615d3c620da6f30016fe3509",
                nike: "615d3cd30da6f30016fe3510",
                puma: "615d3ce10da6f30016fe3513",
                kamito: "615d3cf20da6f30016fe3516",
                mizuno: "615daa7f6f704e001619a021",
                asics: "615daaa16f704e001619a024",
            }
            // giay cho tre em : 615d3c620da6f30016fe3509
            // giay co nhan tao : 615d3bea0da6f30016fe34ff
            // giay co tu nhien : 615d3bcb0da6f30016fe34fd
            // giay futsal: 615d3c080da6f30016fe3501
            const key = Object.keys(brandList).find((e) => e == item.brand.toLowerCase())
            let brand = Object.values(brandList).find((e) => e == brandList[key])
            let category = "615d3c080da6f30016fe3501"
            let discountPercent = Math.floor(Math.random() * 20);
            let description = item.description || "Chưa có mô tả về sản phẩm"
            let productPictures = item.productPictures.map(e => {
                return { img: e }
            })
            let price = item.price
            let sizes = [{
                size: "6128b9653483fd6e2401b4de",
                quantity: 50
            },
            {
                size: "6128b96e3483fd6e2401b4e0",
                quantity: 50
            },
            {
                size: "6128b97a3483fd6e2401b4e2",
                quantity: 50
            },
            {
                size: "6128b9823483fd6e2401b4e4",
                quantity: 50
            },
            {
                size: "6128b98e3483fd6e2401b4e6",
                quantity: 50
            },
            {
                size: "6128b9993483fd6e2401b4e8",
                quantity: 50
            },
            ]
            if (!price || !category || !brand || !name || productPictures.length < 4) {

                continue;
            }
            const product = {
                name: name,
                slug: `${slugify(name)}-${shortid.generate()}`,
                price,
                description,
                productPictures,
                sizes,
                discountPercent,
                category,
                brand
            };
            await Product.create(product)
            console.log("thanh cong")
        }
    } catch (err) {
        console.log(err)
    }
}

const updateAdidasId = async () => {
    await Product.updateMany({ brand: "615d3c620da6f30016fe3509" }, {
        $set: {
            brand: "615d3cc80da6f30016fe350d"
        }
    })
    console.log("done")
}

updateAdidasId()