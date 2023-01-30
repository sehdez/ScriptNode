const fs = require('fs');
const axios = require('axios');


fs.readdir('./imagenes', async(err, files) => {
    for( let i = 0; i< files.length; i++){
    // if(array.includes(file)){
      // console.log('Está en la Lista', file)
    // }else{
      try {
        const {data} = await axios.get(`http://127.0.0.1:8000/subir-imagenes?nombre=${files[i]}`)
        console.log('Todo Bien',data);

      }catch(error){
        console.log(error?.response?.data);
      }
    }
    // }
  // });
});