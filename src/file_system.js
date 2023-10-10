const fs = require ('fs');


module.exports = {
    readFile, 
    writeFile
};

function readFile(nameVideojuego){

    try{
        let data = fs.readFileSync(nameVideojuego, 'utf8');
        data = JSON.parse(data);
        return data;
    } catch(error){
        console.error(error);
        return [];
    }
}

function writeFile(nameVideojuego, data){
    try{
        fs.writeFileSync(nameVideojuego, JSON.stringify(data));
    } catch(error){
        console.error(error);
    }
}