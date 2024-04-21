# Practica 11 Cartas Magic con express

## Funcionamiento

En el servidor: `node dist/index.js` o si se prefiere hacer en una terminal `node dist/index.js &`

Para el cliente: `http://localhost:3000/cards?[argumentos del query] + body  si fuera necesario`

## Introducción

En esta práctica el objetivo es familializarse con la aplicación llamada `express` la cual nos permite hacer una petición.Nosotros usaremos el protocolo `http`.Para ello haremos una aplicación en la cual gestionaremos una colección de cartas magic.Además haremos uso de la API asincrono de nodejs para gestionar los archivos.Las cartas se guarndan en el directorios del nombre del usuario.que estos directorios son subdirectorios de un directorio `/usuarios`.

## Objetivos

* __Uso de express__

* __Api asincrona de ficheros de nodejs usando callbacks__

* __El uso del paquete request__

## Clases y código

### Servidor

Esta es la clase principal en la cual creamos el app expresss además usamos la linea __this.app.use(express.json())__ para suponer que nos llega un json del body de la petición.El unico método publico que tiene esta clase es `start` el cual llama al método listen  de __app__,el cual contiene el método `express()` para llamar a sus funciones,además llamamos al método del servidor llamodos `verbs` que contiene los vebos de las peticiones y sus implementaciones correspondiente.

```ts

class Server{

    private app:Application;

 constructor( private port:number)
 {
    this.app=express()
    this.configure()
 }

  private configure():void
  {
    this.app.use(express.json())
  }

  private verbos():void
  {
    //Codigo espesifico de cada verbo 
  }
 public start():void
 {
    this.verbos();
    this.app.listen(this.port,()=>{
        console.log('Servidor conectado')
    })
 }
}

```

Si en el query no se especifica un error devolvera un _error400_.

### Gestor de Fichero

Esta clase es igual que la práctica anterior.Ultliza la api asincrona de `node.js` basada en callbacks.Para empezar el constructor tiene un _string_ que lo usaremos para los usuarios.Los métodos son los siguientes.

#### escribir fichero

En este método comprobamos si el directorio del usuario existe en su defecto lo creamos.Y entonces la carta pasada por parametro la introducimos para leer.Si hay algun error se devielve el error en caso contrario se devuelve _undefined_ en el callback

```ts
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
        })
```

#### mostrar archivo

en este caso mostrará el todos los archivos de la colecion del usuario para ello comprobamos que existe el directorio y usamos la fucnion `readdir` que nos devuelve un vector de todos los nombres de los archivos el directorio. una vez hecho esto usamos un `foreach` y luego más tarde leemos el archivo el cual lo almacenamos en un vector y lo devolvemos.En caso de dar error devolvemos el error.Por ultimo usamos una variable llamada __archivos leidos__ en la cual contamos el numero de archivos para asegurar que se han termiando de leer todos los archivos.

```ts
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
                            let carta:Carta_Planeswalker | Carta | Carta_Criatura;
    
    
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
```

#### search archivos

Es muy similar al anterior la diferencia es que en vez de devolver un vector de cartas devolvemos una carta que sera con la que el id coincida.

```ts
                              if (carta.ID === id_buscar) {
                                  carta_encontrada = true;
                                  callback(undefined, carta);
                              }
```

#### borrar archivo

Nuevamente este método es muy similar al anterior con la diferencia que tenenemos que usar `unlink` para poder borrar el archivo además de buscarlo como haciamos en la anterior.

```ts
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
```

#### Modificar archivo

Por ultimo método el modifcar archivo,este es el más complejo de todos porque aparte de buscar tenemos que hacer operaciones como `for (const [nombreAtributo, valorNuevo] of Object.entries(atributos)) {` esto hace que itera sobre un objeto interface llamado atributos que posee atribuots opcionales sobre los  atributos que elk usuario desa modificar.Si el atributo es _undefined_ no se cambiara poero si no lo es modifcaleremos corespondientemente.Por último escribimos el archivo con los atributos modficados

```ts
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
                      if(carta instanceof Carta_Criatura)
                      {
                        if(nombreAtributo === 'fuerza' && valorNuevo !== undefined)
                          carta.estadistica[0]=valorNuevo
                        else if(nombreAtributo === 'vida')
                          carta.estadistica[1]=valorNuevo
                      }
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
```

### Carta

hablaremos de la clase principal que es `Carta`

```ts
class Carta implements Carta_interface
{
  constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number)
  {
    //Construye la carta con los atributos correspondientes
  }
  toJSON()
  {
    //Pasa la clase a formato JSON 
  }
}
```

La clase su principalfuncion es almacenar los atributos pasados por constructor y una vez hecho esto definir un `toJSON` para pasar el formato _JSON_.

### Criatura

En cuanto a otras clases tenesos esta:

```ts
class Carta_Criatura extends Carta
{
    constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number,public estadistica:stats)
    {
       // construimos a base de la clase heredada
    }    
    toJSON()
    {
      // añadimos los atributos extras
    }
}
```

Esta clase es una clase particular del tipo de carta porque necesita un atributo necesario como es estadistica.Luego el nuevo atributo lo añadimos en el toJSON para poder pasarlo a _JSON_ también.

### Planeswalker

La otra clase es muy parecida a la anterior dado que el tipo de carta tiene un atributo el cual no tiene el tipo de carta genérico.

```ts
class Cartas_Planeswalker extends Carta
{
    constructor(public ID:number,public nombre:string,public coste:number,public color:string,public tipo:string,public rareza:string,public texto:string,public valor:number,public lealtad:number)
    {
        // construimos a base de la clase heredada
    }       
    toJSON() {
         // añadimos los atributos extras
    }
}
```

## Peticiones

### Add

Se gestiona usando el verbo `post` y pasando en el query el usuario y el body un json con la carta a añadir ejemplo:

`http://localhost:3000/cards?user=emilio`

```JSON
{
  "id": 4,
  "nombre" : "Planeswalker",
  "color": "negro",
  "coste": 4,
  "tipo": "Planeswalker",
  "rareza": "mitica",
  "texto": "Una carta de Planeswalker",
  "valor": 10,
  "lealtad": 3
}
```

### List

Se gestiona usando el verbo `get` y pasando en el query el usuario ejemplo:

`http://localhost:3000/cards?user=emilio`

### Search 

Se gestiona usando el verbo `get` y pasando en el query el usuario y el id de la carta a buscar ejemplo:

`http://localhost:3000/cards?user=emilio&id=1`

### Delete

Se gestiona usando el verbo `delete` y pasando en el query el usuario y el id de la carta a eliminar ejemplo:

`http://localhost:3000/cards?user=emilio&id=1`

### Modify

Se gestiona usando el verbo `patch` y pasando en el query el usuario y el id de la carta a modifcar.Además de pasarle en el bodu un json cn los atributos a modicar ejemplo:

`http://localhost:3000/cards?user=emilio&id=1`

```JSON
{
  "texto": "texto modifcado"
}
```

## Test

Para esta practica hemos hecho los test usando el paquete `request` este paquete nos permite gestionar las peticiones mucho más fácil y además nos ha permitido hacer más facil los test.Lo unico que cambiamos y fue diferente los action para poder ejecutar el servidor en la maquina donde se ejecuta los actions.

## Conclusines

En esta práctica nos hemos centrado en uso de express y ultlizar tambien `request`.También usamos thunder client para comprobar el funcioanmiento de la misma.Si bien el uso de express y el uso de thunder client no fue muy complicado si fue un poco más díficil usar el paquete `request` porque cuando enviaba un error de status request no lo interpretaba como error si no como una respuesta.El gestor de ficheros lo reultlice de la práctica pasada, en general no ha sido una practica díficil