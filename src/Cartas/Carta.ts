/**@enum Los colores posibles de las cartas */
enum Color { blanco,azul,negro,rojo,verde,incoloro,multicolor}
/**@enum Los tipos de las cartas */
enum Tipo {Encantamiento,Tierra,Criatura,Conjuro,Instantaneo,Artefacto,Planeswalker}
/**@enum todas las rarezas posibles de las cartas */
enum Rareza {comun, infrecuente, rara , mitica}


/**@interface Carta_interface los atributos de las cartas que se implmentara en la clase original */
interface Carta_interface
{
  ID:number;
  coste:number;
  color:string;
  tipo:string;
  rareza:string;
  texto:string;
  valor:number;
}

/**@class La clase carta donde  almacena los atributos de esta y luego trabajar con ellas*/
class Carta implements Carta_interface
{
  /**@constructor si son argumentos invalidos para construir una carta devuelve un throw */
  constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number)
  {
    if(!(color in Color))
    /** @throws lanzamos un error en el caso del color sea no permitodo */
       throw new Error(`El color '${color}' no existe`);
    if(!(tipo in Tipo))
    /** @throws lanzamos el error si el tipo no es el adecuado */
       throw new Error(`El tipo '${tipo}' no existe`);
    if(!(rareza in Rareza))
    /**@throws lanzamos el error si el tipo no es el adecuado */
    throw new Error(`La rareza '${rareza}' no existe`);
  }
  /**@public trasforma los atributos de la clase en formato JSON */
  toJSON()
  {
    return{
      id: this.ID,
      nombre: this.nombre,
      coste: this.coste,
      color: this.color,
      tipo: this.tipo,
      rareza: this.rareza,
      texto: this.texto,
      valor: this.valor
    }
  }
}


export{Carta,Carta_interface,Color,Tipo,Rareza}