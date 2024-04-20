import "mocha"
import {expect} from "chai"
import {Carta} from "../../src/Cartas/Carta.js"

describe('Carta generica', () => {
    const carta = new Carta(1, 'Carta de Prueba', 3, 'azul', 'Encantamiento', 'comun', 'Texto de prueba', 10);

    it('Crear Carta y instancia correctamente', () => {
        expect(carta).to.be.instanceOf(Carta);
        expect(carta.ID).to.equal(1);
        expect(carta.nombre).to.equal('Carta de Prueba');
        expect(carta.coste).to.equal(3);
        expect(carta.color).to.equal('azul');
        expect(carta.tipo).to.equal('Encantamiento');
        expect(carta.rareza).to.equal('comun');
        expect(carta.texto).to.equal('Texto de prueba');
        expect(carta.valor).to.equal(10);
    });

    it('deberia soltar error porque no existe el color amarillo', () => {
        expect(() => new Carta(1, 'Carta con Color Inválido', 3, 'amarillo', 'Encantamiento', 'comun', 'Texto de prueba', 10)).to.throw(Error, "El color 'amarillo' no existe");
    });

    it('Deberia soltar un error porque la criatura voladora no existe', () => {
        expect(() => new Carta(1, 'Carta con Tipo Inválido', 3, 'azul', 'Criatura Voladora', 'comun', 'Texto de prueba', 10)).to.throw(Error, "El tipo 'Criatura Voladora' no existe");
    });

    it('Comprobamos si la rareza falla por una rareza erronea', () => {
        expect(() => new Carta(1, 'Carta con Rareza Inválida', 3, 'azul', 'Encantamiento', 'epica', 'Texto de prueba', 10)).to.throw(Error, "La rareza 'epica' no existe");
    });

    it('Convierte en objeto json correctamnete', () => {
        const cartaJSON = carta.toJSON();
        expect(cartaJSON).to.deep.equal({
            id: 1,
            nombre: 'Carta de Prueba',
            coste: 3,
            color: 'azul',
            tipo: 'Encantamiento',
            rareza: 'comun',
            texto: 'Texto de prueba',
            valor: 10
        });
    });
});