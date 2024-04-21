import fs from 'fs'
import { Carta } from '../Cartas/Carta.js'
import { Carta_Planeswalker } from '../Cartas/Carta_Planeswalker.js'
import { Carta_Criatura } from '../Cartas/Carta_Criatura.js'

/**
 * @type __Union__ Es la union del tipo de cartas  y indefinido */
export type Union = Carta | Carta_Criatura | Carta_Planeswalker |undefined

/**
 * @type __Unionsin__ Es la union del tipo de cartas  sin undefiend */
export type Unionsin = Carta | Carta_Criatura | Carta_Planeswalker


/**@type __stats__ Los stats de las  criaturas */
export type stats = [number,number]
/** @interface atributos_modificar son todos los atributos que sirben para buscar y modifcar */
export interface atributos_modificar 
{
  ID_buscar?:number;
  ID?:number;
  nombre?: string;
  coste?:number;
  color?:string;
  tipo?:string;
  rareza?:string;
  texto?:string;
  valor?:number;
  estadistica?:stats;
  lealtad?:number
}  
/** @class __GestorFichero__ clase en donde gestinaremos los ficheros de la carta */
class GestorFichero
{
     /**
      * @constructor 
      * @param nombre_usuario nombre de ususario que quiere gestionar los ficheros
      */
    constructor(private nombre_usuario:string)
    {}
    /**
     * @public para escribir un archivo en la carpeta del usuario
     * @param Carta nueva carta a añadir
     * @param callback gestiona errores de manera asincrona
     *   */
    public escribir_archivo(Carta:Unionsin,callback:(err:Error | undefined) => void) {
        //Parseamos un archo
        const data = JSON.stringify(Carta)
        fs.access('./usuarios/'+ this.nombre_usuario,(err) =>{
          if(err)
          {
              fs.mkdir('./usuarios/'+ this.nombre_usuario,(err) =>{
                 if(err)
                 {
                    callback(err)
                 }else
                 {
                  fs.writeFile('./usuarios/'+ this.nombre_usuario + '/'+Carta.nombre + '.json', data,(err) =>{
                    if(err)
                    {
                            callback(err)
                    }
                    else
                    {
                      callback(undefined)
                    }
            
                    })
                 }
              })
          }else
          {
            fs.writeFile('./usuarios/'+ this.nombre_usuario + '/'+Carta.nombre + '.json', data,(err) =>{
              if(err)
              {
                console.error('El error al escribir un archivo',err.message);
                      callback(err)
              }
              else
              {
                callback(undefined)
              }
      
              })
          }

        } )

      }
     /**
     * @public para mostrar los archivos en la carpeta del usuario
     * @param path ruta donde esta el usuario
     * @param callback gestiona errores de manera asincrona y el dato de manera asincorna
     *   */   
      mostrar_archivo(path:string, callback:(err:Error |undefined,cartas:Union[] | undefined)=>void) {
        fs.access(path, (err) => {
            if (err) {
                callback(err, undefined);
            } else {
                fs.readdir(path, (err, archivos) => {
                    if (err) {
                        callback(err, undefined);
                        return;
                    }
                    let cartas:Union[] = [];
                    let archivosLeidos:number = 0;
                    archivos.forEach((archivo) => {
                        fs.readFile(path + '/' + archivo, (err, data) => {
                            if (err) {
                                callback(err, undefined);
                                return;
                            }
    
    
                            const argv = JSON.parse(data.toString());
                            let carta:Unionsin;
    
    
                            if (argv.estadistica !== undefined && argv.lealtad === undefined) {
                                const estadistica = JSON.parse(String(argv.estadistica));
                                carta = new Carta_Criatura(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor, [estadistica[0], estadistica[1]]);
                            } else if (argv.estadistica === undefined && argv.lealtad !== undefined) {
                                carta = new Carta_Planeswalker(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor, argv.lealtad);
                            } else {
                                carta = new Carta(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor);
                            }
    
    
                            cartas.push(carta);
    
    
                            archivosLeidos++;
    
                            if (archivosLeidos === archivos.length) {
                              callback(undefined, cartas);
                          }

                        });
                    });
                });
            }
        });
    }
     /**
     * @public para buscar un archivo en la carpeta del usuario
     * @param path ruta donde esta el usuario
     * @param id_buscar el id de la carta que queremos buscar
     * @param callback gestiona errores de manera asincrona y el dato de manera asincorna
     *   */   
search_archivo(path:string, id_buscar:number, callback:(err:Error |undefined,carta:Union |undefined)=>void) {
  let carta_encontrada:boolean = false;


  fs.access(path, (err) => {
      if (err) {
          callback(err, undefined);
      } else {
          fs.readdir(path, (err, archivos) => {
              if (err) {
                  callback(err, undefined);
              } else {
                  archivos.forEach((element) => {
                      if (carta_encontrada) return; // Si ya encontramos la carta, salimos del bucle


                      let carta:Union;
                      fs.readFile(path + '/' + element, (err, data) => {
                          if (err) {
                              callback(err, undefined);
                          } else {
                              const argv = JSON.parse(data.toString());
                              if (argv.estadistica !== undefined && argv.lealtad === undefined) {
                                  const estadistica = JSON.parse(String(argv.estadistica));
                                  carta = new Carta_Criatura(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor, [estadistica[0], estadistica[1]]);
                              } else if (argv.estadistica === undefined && argv.lealtad !== undefined) {
                                  carta = new Carta_Planeswalker(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor, argv.lealtad);
                              } else {
                                  carta = new Carta(argv.id, argv.nombre, argv.coste, argv.color, argv.tipo, argv.rareza, argv.texto, argv.valor);
                              }

                              if (carta.ID === id_buscar) {
                                  carta_encontrada = true;
                                  callback(undefined, carta);
                              }
                          }
                      });
                  });
              }
          });
      }
  });
}
     /**
     * @public para borrar un archivo en la carpeta del usuario
     * @param path ruta donde esta el usuario
     * @param id el id de la carta que queremos borrar
     * @param callback gestiona errores de manera asincrona
     *   */   
  borrar_archivo(path:string,id:number,callback:(err:Error | undefined)=>void)
  {
    fs.access(path,(err) =>{
      if(err)
      {
        callback(err)
      }else
     {
       fs.readdir(path,(err,archivos)=>{
         if(err)
         {
           callback(err)
         }
         else
         {
           archivos.forEach(element => {
             fs.readFile(path + '/' + element,(err,data)=>{
              if(err)
              {
                 callback(err)
              }
              else{
                const dataJSON = JSON.parse(data.toString())
                if(dataJSON.id === id)
                {
                  fs.unlink(path + '/' + element,(err)=>{
                    if(err)
                    {
                      callback(err)
                    }else
                    {
                      callback(undefined)
                    }
                 })
                }
              }
             })
           });
         }
       });
     }
   })    
  }
     /**
     * @public para buscar un archivo en la carpeta del usuario
     * @param path ruta donde esta el usuario
     *  @param atributos atributos que queremos modificar
     * @param id el id de la carta que queremos modifcar
     * @param callback gestiona errores de manera asincrona y el dato de manera asincorna
     *   */   
  modificar_archivo(path:string,id:number,atributos:atributos_modificar,callback:(err:Error|undefined)=>void)
  {
      fs.access(path,(err) =>{
        if(err)
        {
          callback(err)
        }else
       {
         fs.readdir(path,(err,archivos)=>{
           if(err)
           {
             callback(err)
           }
           else
           {
             archivos.forEach(element => {
               let carta:Unionsin;
               fs.readFile(path + '/' +element,(err,data)=>{
                if(err)
                {
                  callback(err)
                }else{
                  const argv=JSON.parse(data.toString())
                  if (argv.estadistica !== undefined && argv.lealtad === undefined)
                  {
                     let estadistica = JSON.parse(String(argv.estadistica))
                     carta = new Carta_Criatura(argv.id,argv.nombre,argv.coste,argv.color,argv.tipo,argv.rareza,argv.texto,argv.valor,[estadistica[0],estadistica[1]])
                  }     
                  else     
                   if(argv.estadistica === undefined && argv.lealtad !== undefined)
                   carta = new Carta_Planeswalker(argv.id,argv.nombre,argv.coste,argv.color,argv.tipo,argv.rareza,argv.texto,argv.valor,argv.lealtad)
                   else
                   if(argv.estadistica === undefined && argv.lealtad === undefined)
                     carta= new Carta(argv.id,argv.nombre,argv.coste,argv.color,argv.tipo,argv.rareza,argv.texto,argv.valor)
                        //La carta que tenemos que cambiar
                   if(carta.ID === id)
                   {
                    /**
                     * @const nombreAtributo el nombre del atributo que queremos cambiar 
                     * @const valorNuevo el valor que queremos insertar al atributo nuevo 
                     * */
                     for (const [nombreAtributo, valorNuevo] of Object.entries(atributos)) {
                      if(valorNuevo !== undefined)
                      switch(nombreAtributo)
                      {
                        case 'ID':
                          carta.ID=valorNuevo
                          break;
                        case 'nombre':
                          carta.nombre=valorNuevo
                          break;
                        case 'tipo':
                          carta.tipo=valorNuevo
                          break;
                        case 'color':
                          carta.color=valorNuevo
                          break;
                        case 'rareza':
                          carta.rareza=valorNuevo
                          break;
                        case 'texto':
                          carta.texto=valorNuevo
                          break;
                        case 'coste':
                          carta.coste=valorNuevo
                          break;
                        case 'valor':
                          carta.valor=valorNuevo
                          break;
                      }
                      /**Comprobamos que es una criatura */
                      if(carta instanceof Carta_Criatura)
                      {
                        if(nombreAtributo === 'fuerza' && valorNuevo !== undefined)
                          carta.estadistica[0]=valorNuevo
                        else if(nombreAtributo === 'vida')
                          carta.estadistica[1]=valorNuevo
                      }
                      /** Comprobamos que es un planeswalker */
                      if( carta instanceof Carta_Planeswalker)
                        if(nombreAtributo === 'lealtad'&& valorNuevo !== undefined)
                          carta.lealtad=valorNuevo
                    }
                    const stringJSON=JSON.stringify(carta)
                    fs.writeFile(path + '/' +element,stringJSON,(err)=>{
                      if(err)
                        {
                          callback(err)
                        }
                        else
                        {
                          callback(undefined)
                        }
                   })                  
                  }
                 
                }
               });
             });
           }
         });
       }
     })   
  }    
}

export {GestorFichero}