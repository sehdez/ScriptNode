const fs = require('fs');
const axios = require('axios');


fs.readdir('./imagenes', async(err, files) => {
    const skuListFiltered = files.map(file => file.split('-')[0]).filter((sku, i, self) => self.indexOf(sku) === i);
    
    for( let i = 0; i< skuListFiltered.length; i++){
      try {
        const {data} = await axios.get(`http://127.0.0.1:8000/subir-imagenes-shopify?sku=${skuListFiltered[i]}`)
        console.log('Todo Bien',data);

      }catch(error){
        console.log(error?.response?.data);
      }
    }
});

