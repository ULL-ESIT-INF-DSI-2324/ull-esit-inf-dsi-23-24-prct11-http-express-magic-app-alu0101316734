import { Carta } from "./Carta.js";
/** @type __stats__ es una tupla de numeros para representar la fuerza y la vida  */
export type stats = [number,number]

/**@class Carta_Criatura clase heredad de Carta que añadimos el atributo de estadistica */
class Carta_Criatura extends Carta
{
  /** @constructor @constructor el constructor similar a Cartas pero con la diferencia de @param estadistica */
    constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number,public estadistica:stats)
    {
        super(ID,nombre,coste,color,tipo,rareza,texto,valor)
    }    
    /**@public JSON similar cons la diferencia que añadimos la fuerza y vida */
    toJSON()
    {
      return {
         ...super.toJSON(),
         fuerza: this.estadistica[0],
         vida: this.estadistica[1]
      }
    }
}

export {Carta_Criatura}