import { Carta } from "./Carta.js";

/**@class Clase heredeada de Carta para las cartas tipo Planeswalker */
class Carta_Planeswalker extends Carta
{
    /**@constructor el constructor similar a Cartas pero con la diferencia de @param lealtad*/
    constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number,public lealtad:number)
    {
        super(ID,nombre,coste,color,tipo,rareza,texto,valor)
    }       
    /**@public JSON similar cons la diferencia que añadimos la lealtad */
    toJSON() {
        return {
            ...super.toJSON(),   
            lealtad: this.lealtad
        }     
    }
}

export {Carta_Planeswalker}