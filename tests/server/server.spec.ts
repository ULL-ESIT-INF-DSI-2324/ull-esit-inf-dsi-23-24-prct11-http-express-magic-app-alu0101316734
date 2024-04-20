import "mocha"
import { expect } from "chai"
import request from "request"
import {Server} from "../../src/servidor/servidor.js"



describe('Pruebas del servidor',( )=>{
    it('Escribimos en el archivo una carta normal',(done)=>{
        const jsonData= {
                "id": 1,
                "nombre" : "Black Lotus",
                "color": "negro",
                "coste": 4,
                "tipo": "Encantamiento",
                "rareza": "mitica",
                "texto": "Una carta de negra",
                "valor": 10 
        }
        const url = 'http://localhost:3000/cards?user=test'
        request.post({url:url,json: true,body: jsonData },(_,response)=>{
           expect(response.body).to.be.equal('Archivo creado exitosamente')
           done();
        })
    })
    it('Escribimos en el archivo una carta Planeswalker',(done) =>{
        const jsonData= {
            "id": 4,
            "nombre" : "Criaturatest",
            "color": "azul",
            "coste": 4,
            "tipo": "Criatura",
            "rareza": "mitica",
            "texto": "Una carta de Criatura",
            "valor": 10,
            "estadistica": [2,4]
    }
    const url = 'http://localhost:3000/cards?user=test'
    request.post({url:url,json: true,body: jsonData },(_,response)=>{
       expect(response.body).to.be.equal('Archivo creado exitosamente')
       done();
    })        
    })
    it('Escribimos en el archivo una carta Criatura',(done) =>{
        const jsonData= {
            "id": 7,
            "nombre" : "Planeswalkertest",
            "color": "azul",
            "coste": 4,
            "tipo": "Planeswalker",
            "rareza": "mitica",
            "texto": "Una carta de Criatura",
            "valor": 10,
            "lealtad": 3
    }
    const url = 'http://localhost:3000/cards?user=test'
    request.post({url:url,json: true,body: jsonData },(_,response)=>{
       expect(response.body).to.be.equal('Archivo creado exitosamente')
       done();
    })        
    })
    it('Escribimos en el archivo una carta y da error ',(done) =>{
        const jsonData= {
            "id": 7,
            "nombre" : "Criaturatest",
            "color": "azul",
            "coste": 4,
            "tipo": "Criatura",
            "rareza": "mitica",
            "texto": "Una carta de Criatura",
            "valor": 10,
            "estadistica": [2,4]
    }
    const url = 'http://localhost:3000/cards?user=errror'
    request.post({url:url,json: true,body: jsonData },(_,response)=>{
       expect(response.body).to.be.equal('Error a la hora de enviar un archivo')
       done();
    })        
    })    
    it('Leemos todas las cartas de un usuario',(done) =>{
       const url = 'http://localhost:3000/cards?user=test'
       request.get({url:url,json: true},(_,response)=>{
        expect(response.body).to.be.not.equal('Error internal in the server')
        done()
       })
    })
    it('Buscamos una carta del ususario',(done) =>{
        const url = 'http://localhost:3000/cards?user=test&id=7'
        request.get({url:url,json: true},(_,response)=>{
            expect(response.body).to.be.not.equal('Error internal in the server')
            done()
        })        
    })
    it('Eliminamos una carta del usuario',(done)=>{
        const jsonData= {
            "id": 9,
            "nombre" : "Borrar",
            "color": "azul",
            "coste": 4,
            "tipo": "Criatura",
            "rareza": "mitica",
            "texto": "Una carta de Criatura",
            "valor": 10,
            "estadistica": [2,4]
    }
    const url = 'http://localhost:3000/cards?user=test'
    const urldelete = 'http://localhost:3000/cards?user=test&id=9'
    request.post({url:url,json: true,body: jsonData },()=>{
       request.delete({url:urldelete,json: true},(_,response)=>{
         expect(response.body).to.be.equal('Borrado exitosamente')
         done();
       })
       
    }) 
    })
    it('Modificamos una carta del usuario', (done) =>{
        const url='http://localhost:3000/cards?user=test&id=7'
        const dataJSON={
            "id": 7,
            "nombre" : "Borrar modifcado",
            "color": "negro",
            "coste": 8,
            "tipo": "Criatura",
            "rareza": "comun",
            "texto": "Una carta de Criatura modifcada",
            "valor": 5,
            "estadistica": [1,2]            
        }
        request.patch({url:url,json: true,body:dataJSON},(_,response) =>{
          expect(response.body).to.be.equal('Carta Modificada con exito')
          done()
        })
    })

})