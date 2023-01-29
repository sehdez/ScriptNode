const fs = require('fs');
const axios = require('axios');


// fs.readdir('./imagenes', async(err, files) => {
//     // console.log( files[0]);
//     // console.log( array[0]);
//   // files.forEach(async(file) => {
//     for( let i = 0; i< files.length; i++)
//     // if(array.includes(file)){
//       // console.log('Está en la Lista', file)
//     // }else{
//       try {
//         const {data} = await axios.get(`http://127.0.0.1:8000/subir-imagenes?nombre=${files[i]}`)
//         console.log('Todo Bien',data);

//       }catch(error){
//         console.log(error?.response?.data);
//       }
//     // }
//   // });
// });





const request = require('request');
const XLSX = require('xlsx');

// Array de SKUs a descargar
const skus = [10183]
// const skus = [
//     10387,
//     10387,
//     10387,
//     10379,
//     10379,
//     10379,
//     10378,
//     10378,
//     10378,
//     10377,
//     10377,
//     10377,
//     10376,
//     10376,
//     10376,
//     10375,
//     10375,
//     10375,
//     10374,
//     10374,
//     10374,
//     10373,
//     10373,
//     10373,
//     10372,
//     10372,
//     10372,
//     10371,
//     10371,
//     10371,
//     10370,
//     10370,
//     10370,
//     10347,
//     10347,
//     10347,
//     10346,
//     10346,
//     10346,
//     10345,
//     10345,
//     10345,
//     10341,
//     10341,
//     10341,
//     10340,
//     10340,
//     10340,
//     10339,
//     10339,
//     10339,
//     10338,
//     10338,
//     10338,
//     10337,
//     10337,
//     10337,
//     10329,
//     10329,
//     10329,
//     10328,
//     10328,
//     10328,
//     10327,
//     10327,
//     10327,
//     10324,
//     10324,
//     10324,
//     10322,
//     10322,
//     10322,
//     10319,
//     10319,
//     10319,
//     10308,
//     10308,
//     10308,
//     10300,
//     10300,
//     10300,
//     10299,
//     10299,
//     10299,
//     10298,
//     10298,
//     10298,
//     10297,
//     10297,
//     10297,
//     10296,
//     10296,
//     10296,
//     10294,
//     10294,
//     10294,
//     10293,
//     10293,
//     10293,
//     10292,
//     10292,
//     10292,
//     10291,
//     10291,
//     10291,
//     10290,
//     10290,
//     10290,
//     10286,
//     10286,
//     10286,
//     10285,
//     10285,
//     10285,
//     10284,
//     10284,
//     10284,
//     10283,
//     10283,
//     10283,
//     10282,
//     10282,
//     10282,
//     10281,
//     10281,
//     10281,
//     10279,
//     10279,
//     10279,
//     10278,
//     10278,
//     10278,
//     10277,
//     10277,
//     10277,
//     10276,
//     10276,
//     10276,
//     10275,
//     10275,
//     10275,
//     10274,
//     10274,
//     10274,
//     10273,
//     10273,
//     10273,
//     10272,
//     10272,
//     10272,
//     10271,
//     10271,
//     10271,
//     10270,
//     10270,
//     10270,
//     10269,
//     10269,
//     10269,
//     10267,
//     10267,
//     10267,
//     10266,
//     10266,
//     10266,
//     10264,
//     10264,
//     10264,
//     10263,
//     10263,
//     10263,
//     10238,
//     10238,
//     10238,
//     10230,
//     10230,
//     10230,
//     10227,
//     10227,
//     10227,
//     10223,
//     10223,
//     10223,
//     10219,
//     10219,
//     10219,
//     10217,
//     10217,
//     10217,
//     10216,
//     10216,
//     10216,
//     10215,
//     10215,
//     10215,
//     10210,
//     10210,
//     10210,
//     10209,
//     10209,
//     10209,
//     10207,
//     10207,
//     10207,
//     10205,
//     10205,
//     10205,
//     10204,
//     10204,
//     10204,
//     10203,
//     10203,
//     10203,
//     10202,
//     10202,
//     10202,
//     10199,
//     10199,
//     10199,
//     10195,
//     10195,
//     10195,
//     10185,
//     10185,
//     10183,
//     10183
// ]

const workbook = XLSX.readFile('./ProductsWC.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const products = XLSX.utils.sheet_to_json(sheet);
// Crea una función para descargar las imágenes
// function downloadImage(url, sku, i) {
//     request.get(url)
//         .on('error', function(err) {
//             console.log(err);
//         })
//         .pipe(fs.createWriteStream(`${sku}-${i+1}.png`,  {flags: 'w'}));
// }


const util = require('util');

const requestGet = util.promisify(request.get);

function downloadImage(url, sku, i) {
    return requestGet(url)
        .then(response => {
            return new Promise((resolve, reject) => {
                response.pipe(fs.createWriteStream(`imgFixeds/${sku}-${i+1}.png`))
                    .on('finish', resolve('todo bien'))
                    .on('error', reject('todo mal'));
            });
        })
        .catch(err => console.log(err));
}



// Itera sobre los productos en tu archivo excel
// Suponiendo que tienes los productos en una variable llamada "products"
products.forEach(async (product) => {
    // Verifica si el SKU del producto está en el arreglo de SKUs a descargar
    if (skus.includes(product.SKU)) {


        // Separa las URL de las imágenes en un arreglo
        const urls = product['Imágenes']?.split(', ');

        // Itera sobre las URL para descargar cada imagen
        if(urls){
          for ( let i = 0; i < urls.length; i++ ){
            const response = await downloadImage(urls[i], product.SKU, i);
            console.log(response);
          }
            // urls.forEach((url, i) => {
            //     downloadImage(url, product.SKU, i);
            // });

        }
    }
});


