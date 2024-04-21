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

en este caso mostrará el todos los archivos de la colecion del usuario para ello comprobamos que existe el directorio y usamos 