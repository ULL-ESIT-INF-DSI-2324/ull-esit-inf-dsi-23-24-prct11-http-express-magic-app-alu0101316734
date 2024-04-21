import { Application,Request,Response } from "express";
import express from "express";
import { Carta } from "../Cartas/Carta.js";
import { GestorFichero, Union, atributos_modificar } from "../GestorFicheros/GestorFichero.js";
import { Carta_Criatura } from "../Cartas/Carta_Criatura.js";
import { Carta_Planeswalker } from "../Cartas/Carta_Planeswalker.js";


/**@class clase servidor que nos sirve para conectarnos */
class Server{
  /**@private __app__ variable en la cual almacenaremos nuestra app */
    private app:Application;
    /**
     * @constructor recibe el puerto donde se conecta el servidor  además llamaos a configure
     * */
 constructor( private port:number)
 {
    this.app=express()
    this.configure()
 }
  /**@private __configure__ llamaos a `express.json()` para pasarlo a objeto */
  private configure():void
  {
    this.app.use(express.json())
  }
  /**@private los verbos para cada uno de las acciones que hacer  */
  private verbos():void
  {
    
    this.app.post('/cards',(rep:Request,res:Response)=>{
        /**@const data aqui almacenamos el cuerpo y lo parseamos automaticamente */
        const data = rep.body
        let user:string="";
        if(rep.query.user)
        {
           user=rep.query.user as string
        }else{
          res.status(400).send('User not especific')
        }
        /**@const gestor creamos una instancia del usuario  */
        const gestor= new GestorFichero(user)
        let carta:Union;
        if(data)
        {
           if(data.estadistica === undefined && data.lealtad === undefined)
           {
            carta= new Carta(data.id,data.nombre,data.coste,data.color,data.tipo,data.rareza,data.texto,data.valor)
           }
            else if(data.estadistica)
            carta= new Carta_Criatura(data.id,data.nombre,data.coste,data.color,data.tipo,data.rareza,data.texto,data.valor,data.estadistica)
          else if(data.lealtad)
            carta= new Carta_Planeswalker(data.id,data.nombre,data.coste,data.color,data.tipo,data.rareza,data.texto,data.valor,data.lealtad)
          else
           res.status(400).send('Error body incorrect')
          if(carta)
          gestor.escribir_archivo(carta,(err)=>{
            if(err)
            {
              res.status(500).send('Error a la hora de enviar un archivo')
            }else{
              res.status(201).send('Archivo creado exitosamente')
            }
          })
          
        }else
        {
          res.status(400).send('Error body incorrect')
        }
        
    })
    this.app.get('/cards', (req: Request, res: Response) => {
      if (!req.query.user) {
          res.status(400).send('User not specified');
      }
      /**@const user pasamos el query de l usuairo a string  */
      const user: string = req.query.user as string;
      const gestor = new GestorFichero(user);
  
      if (req.query.id) {
          const id = Number(req.query.id);
          gestor.search_archivo('./usuarios/' + user, id, (err, carta) => {
              if (err) {
                  res.status(500).send('Error internal in the server');
              }
              if (!carta) {
                  res.status(404).send('Card not found');
              }
              if(carta)
              {
                let total: string = "---------------------------------\n";
                total += `ID: ${carta.ID}\n`;
                total += `Nombre: ${carta.nombre}\n`;
                total += `Coste: ${carta.coste}\n`;
                total += `Color: ${carta.color}\n`;
                total += `Tipo: ${carta.tipo}\n`;
                total += `Rareza: ${carta.rareza}\n`;
                total += `Texto: ${carta.texto}\n`;
                total += `Valor: ${carta.valor}\n`;
                if (carta instanceof Carta_Criatura) {
                    total += `Fuerza ${carta.estadistica[0]}\n`;
                    total += `Vida: ${carta.estadistica[1]}\n`;
                }
                if (carta instanceof Carta_Planeswalker) {
                    total += `Lealtad: ${carta.lealtad}\n`;
                }
                res.status(200).send(total);
              }

          });
      } else {
          gestor.mostrar_archivo('./usuarios/' + user, (err, data) => {
              if (err) {
                   res.status(500).send('Error internal in the server');
              }
              if (!data || data.length === 0) {
                  res.status(404).send('No cards found for the user');
              }
              let total: string = "";
              if(data)
              data.forEach(carta => {
               if(carta)
               {
                total += "---------------------------------\n";
                total += `ID: ${carta.ID}\n`;
                total += `Nombre: ${carta.nombre}\n`;
                total += `Coste: ${carta.coste}\n`;
                total += `Color: ${carta.color}\n`;
                total += `Tipo: ${carta.tipo}\n`;
                total += `Rareza: ${carta.rareza}\n`;
                total += `Texto: ${carta.texto}\n`;
                total += `Valor: ${carta.valor}\n`;
                if (carta instanceof Carta_Criatura) {
                    total += `Fuerza ${carta.estadistica[0]}\n`;
                    total += `Vida: ${carta.estadistica[1]}\n`;
                }
                if (carta instanceof Carta_Planeswalker) {
                    total += `Lealtad: ${carta.lealtad}\n`;
                }
               }
              });
              res.status(200).send(total);
          });
      }
  });
  
    this.app.delete('/cards',(req:Request,res:Response)=>{
      let user:string='';
      let id:number=0;
      if(req.query.user)
         user=req.query.user as string
      else
        res.status(400).send('User not especific')
      if(req.query.id)
         id=Number(req.query.id)
      else
        res.status(400).send('id not especific')
      const gestor= new GestorFichero(user)
      gestor.borrar_archivo('./usuarios/' + user,id,(err) =>{
        if(err)
        {
          res.status(500).send('internal server error')
        }else{
          res.status(200).send('Borrado exitosamente')
        }
      })
    })

    this.app.patch('/cards',(req:Request,res:Response)=>{
      let user:string='';
      let id:number=0;
      if(req.query.user)
         user=req.query.user as string
      else
        return res.status(400).send('User not especific')
      if(req.query.id)
        id=Number(req.query.id)
     else
        return res.status(400).send('id not especific')      
      let atributos:atributos_modificar={
        ID: req.body.id,
        ID_buscar: Number(req.query.id),
        nombre: req.body.nombre,
        color: req.body.color,
        coste: req.body.coste,
        tipo:  req.body.tipo,
        rareza: req.body.rareza,
        texto: req.body.texto,
        valor: req.body.valor,
        estadistica: req.body.estadistica,
        lealtad: req.body.lealtad
      }
      const gestor = new GestorFichero(user);
      if(atributos.ID_buscar)
      gestor.modificar_archivo('./usuarios/'+user,atributos.ID_buscar,atributos,(err)=>{
        if(err)
        {
          return res.status(500).send('Internal error')
        }else{
          return res.status(200).send('Carta Modificada con exito')
        }
      })
      return;
    })
  }
  /**@public sirve para iniciar el servidor y llamar al verbo y escuchamos en el puerto especifico  */
 public start():void
 {
    this.verbos();
    this.app.listen(this.port,()=>{
        console.log('Servidor conectado')
    })
 }
}


export {Server}