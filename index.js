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
const skus = [
    10552,
    10183,
    4459,
    4460,
    4457,
    4456,
    4467,
    4471,
    3751,
    3657,
    3962,
    2497,
    2160,
    2489,
    2496,
    3579,
    5672,
    5160,
    10153,
    10149,
    10139,
    10137,
    10122,
    10111,
    10106,
    5089,
    1450,
    10709,
    10707,
    10706,
    10705,
    10704,
    10702,
    10701,
    10700,
    10699,
    10698,
    10697,
    10670,
    10669,
    10668,
    10667,
    10666,
    10665,
    10664,
    10620,
    10610,
    10607,
    10606,
    10591,
    10575,
    10547,
    10538,
    10536,
    10535,
    10534,
    10531,
    10525,
    10523,
    10518,
    10515,
    10514,
    10501,
    10493,
    10488,
    10482,
    10469,
    10387,
    10379,
    10378,
    10377,
    10376,
    10375,
    10374,
    10373,
    10372,
    10371,
    10370,
    10347,
    10346,
    10345,
    10344,
    10341,
    10340,
    10339,
    10338,
    10337,
    10329,
    10328,
    10327,
    10324,
    10322,
    10319,
    10308,
    10302,
    10300,
    10299,
    10298,
    10297,
    10296,
    10294,
    10293,
    10292,
    10291,
    10290,
    10286,
    10285,
    10284,
    10283,
    10282,
    10281,
    10279,
    10278,
    10277,
    10276,
    10275,
    10274,
    10273,
    10272,
    10271,
    10270,
    10269,
    10267,
    10266,
    10265,
    10264,
    10263,
    10262,
    10251,
    10238,
    10230,
    10227,
    10223,
    10219,
    10217,
    10216,
    10215,
    10212,
    10210,
    10209,
    10207,
    10205,
    10204,
    10203,
    10202,
    10199,
    10198,
    10195,
    10185,
    4601
    
]

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
                response.pipe(fs.createWriteStream(`images/${sku}-${i+1}.png`,  {flags: 'w'}))
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


