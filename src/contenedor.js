const fs = require('fs');

class Contenedor {
    constructor() {
      this.products = [];
    }
  
  
    getById(id) {
      id = Number(id);
      try {
        const data = this.getAll();
  
        return data.find((producto) => producto.id === id);
      } catch (error) {
        console.log(
          `Error Code: ${error.code} | Ocurrió un error al intentar obtener un elemento por su ID (${id})`
        );
      }
    }
  
    deleteById(id) {
      try {
        id = Number(id);
        const data = this.getAll();
        const objectIdToBeRemoved = data.find(
          (producto) => producto.id === id
        );
  
        if (objectIdToBeRemoved) {
          const index = data.indexOf(objectIdToBeRemoved);
          data.splice(index, 1);
          return true;
        } else {
          console.log(`ID ${id} no existente`);
          return null;
        }
      } catch (error) {
        console.log(
          `Error Code: ${error.code} | Ocurrió un error al intentar eliminar un elemento por ID (${id})`
        );
      }
    }
  
    updateById(id, newData) {
      try {
        id = Number(id);
        const data = this.getAll();
        const objectIdToBeUpdated = data.find(
          (producto) => producto.id === id
        );
        if (objectIdToBeUpdated) {
          const index = data.indexOf(objectIdToBeUpdated);
          const {title, price, thumbnail} = newData;
  
          data[index]['title'] = title;
          data[index]['price'] = price;
          data[index]['thumbnail'] = thumbnail;
          return true;
        } else {
          console.log(`ID ${id} no existente`);
          return null;
        }
  
      } catch (error) {
        `Error Code: ${error.code} | Ocurrió un error al intentar actualizar un elemento por ID (${id})`
      }
    }
  
    save(object) {
      try {
        const allData = this.getAll();
        let newId;
        newId = allData.length > 0 ? allData[allData.length-1].id +1 : 1;
        object.id = newId;
        allData.push(object);
        return object.id;
      } catch (error) {
        console.log(
          `Error Code: ${error.code} | Ocurrió un error al tratar de guardar el elemento`
        );
      }
    }

    async saveList(prod){ 
      try{
      let contenido = await fs.promises.readFile('../chat.txt')   
      let contenidoObjeto = JSON.parse(contenido)
      contenidoObjeto.push(prod)
      await fs.promises.writeFile('../chat.txt', JSON.stringify(contenidoObjeto))
      }catch (error) {
        console.log(
          `Error Code: ${error.code} |  Ocurrió un error al tratar de guardar el elemento`
        );
      }
  }


      getAll() {
        const data = this.products;
      return data;
    }
  }
  
  module.exports = Contenedor;