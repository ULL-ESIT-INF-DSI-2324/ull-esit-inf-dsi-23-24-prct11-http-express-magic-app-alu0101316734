import { expect } from 'chai';
import fs from 'fs';
import { Carta_Criatura} from '../../src/Cartas/Carta_Criatura.js';
import { Carta_Planeswalker } from '../../src/Cartas/Carta_Planeswalker.js';
import { Carta } from '../../src/Cartas/Carta.js';
import { GestorFichero, Union } from '../../src/GestorFicheros/GestorFichero.js';


describe('GestorFichero', () => {
    const gestor = new GestorFichero('usuariotest');


    describe('escribir_archivo', () => {
        it('Debería escribir un archivo correctamente', (done) => {
            const carta: Union = new Carta(1, 'Ejemplo', 2, 'azul', 'Criatura', 'comun', 'Texto de prueba', 3);
            gestor.escribir_archivo(carta, (err) => {
                expect(err).to.be.undefined;
                // Comprobar si el archivo se creó correctamente
                fs.readFile(`./usuarios/usuariotest/${carta.nombre}.json`, (err, data) => {
                    expect(err).to.be.null;
                    const dataJSON = JSON.parse(data.toString())
                    const cartaLeida: Carta = new Carta (dataJSON.id,dataJSON.nombre,dataJSON.coste,dataJSON.color,dataJSON.tipo,dataJSON.rareza,dataJSON.texto,dataJSON.valor);
                    expect(cartaLeida).to.deep.equal(carta);
                    done();
                });
            });
        });
    });


    describe('mostrar_archivo', () => {
        it('Debería mostrar los archivos correctamente', (done) => {
            gestor.mostrar_archivo(`./usuarios/usuariotest`, (err, cartas) => {
                expect(err).to.be.undefined;
                expect(cartas).to.be.an('array');
                done();
            });
        });
    });


    describe('search_archivo', () => {
        
        it('Debería encontrar una carta correctamente', (done) => {
            const id_buscar = 1;
            gestor.search_archivo(`./usuarios/usuariotest`, id_buscar, (err, carta) => {
                expect(err).to.be.undefined;
                expect(carta).to.not.be.undefined;
                expect(carta?.ID).to.equal(id_buscar);
                done();
            });
        });
    });


    describe('borrar_archivo', () => {
        it('Debería borrar un archivo correctamente', (done) => {
            const id_borrar = 1;
            gestor.borrar_archivo(`./usuarios/usuariotest`, id_borrar, (err) => {
                expect(err).to.be.undefined;
                // Comprobar si el archivo se borró correctamente
                fs.access(`./usuarios/usuariotest/${id_borrar}.json`, fs.constants.F_OK, (err) => {
                    expect(err).to.not.be.null;
                    done();
                });
            });
        });
    });


    describe('modificar_archivo', () => {
        it('Debería modificar un archivo correctamente', (done) => {
            const id_modificar = 4;
            const atributos = {
                id:4,
                nombre: 'Planeswalker',
                tipo: "Planeswalker",
                rareza: "mitica",
                coste: 5,
                color: 'azul',
                texto: 'Nuevo texto',
                valor: 10,
                lealtad: 2
            };
            gestor.modificar_archivo(`./usuarios/usuariotest`, id_modificar, atributos, (err) => {
                expect(err).to.be.undefined;
                // Comprobar si los cambios se aplicaron correctamente
                fs.readFile(`./usuarios/usuariotest/Planeswalker.json`, (err, data) => {
                    expect(err).to.be.null;
                    const cartaModificada: Carta = JSON.parse(data.toString());
                    expect(cartaModificada.nombre).to.equal(atributos.nombre);
                    expect(cartaModificada.coste).to.equal(atributos.coste);
                    expect(cartaModificada.color).to.equal(atributos.color);
                    expect(cartaModificada.texto).to.equal(atributos.texto);
                    done();
                });
            });
        });
    });
    const adminArchivo = new GestorFichero('errror');


    describe('mostrar_archivo', () => {
        it('Debería devolver un error si la carpeta del usuario no existe', (done) => {
            adminArchivo.mostrar_archivo(`./usuarios/errror`, (err, cartas) => {
                expect(err).to.not.be.undefined;
                expect(cartas).to.be.undefined;
                done();
            });
        });
    });

    describe('search_archivo', () => {
        it('Debería devolver un error si la carpeta del usuario no existe', (done) => {
            adminArchivo.search_archivo(`./usuarios/errror`, 1, (err, carta) => {
                expect(err).to.not.be.undefined;
                expect(carta).to.be.undefined;
                done();
            });
        });
    });

    describe('borrar_archivo', () => {
        it('Debería devolver un error si la carpeta del usuario no existe', (done) => {
            adminArchivo.borrar_archivo(`./usuarios/errror`, 1, (err) => {
                expect(err).to.not.be.undefined;
                done();
            });
        });

        it('Debería devolver un error si el archivo no existe', (done) => {
            adminArchivo.borrar_archivo(`./usuarios/errror`, 999, (err) => {
                expect(err).to.not.be.undefined;
                done();
            });
        });
    });

    describe('modificar_archivo', () => {
        it('Debería devolver un error si la carpeta del usuario no existe', (done) => {
            adminArchivo.modificar_archivo(`./usuarios/error`, 1, {}, (err) => {
                expect(err).to.not.be.undefined;
                done();
            });
        });
    })
});
