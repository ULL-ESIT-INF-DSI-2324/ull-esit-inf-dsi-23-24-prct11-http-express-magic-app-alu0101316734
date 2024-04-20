import "mocha"
import {expect} from "chai"
import { Carta_Criatura } from '../../src/Cartas/Carta_Criatura.js';


describe('Cartas de Criatura', () => {
    const cartaCriatura = new Carta_Criatura(1, 'Criatura de Prueba', 4, 'verde', 'Criatura', 'comun', 'Texto de prueba', 8, [3, 3]);


    it('Crea sus inistacias y sus gets correctamnete', () => {
        expect(cartaCriatura).to.be.instanceOf(Carta_Criatura);
        expect(cartaCriatura.ID).to.equal(1);
        expect(cartaCriatura.nombre).to.equal('Criatura de Prueba');
        expect(cartaCriatura.coste).to.equal(4);
        expect(cartaCriatura.color).to.equal('verde');
        expect(cartaCriatura.tipo).to.equal('Criatura');
        expect(cartaCriatura.rareza).to.equal('comun');
        expect(cartaCriatura.texto).to.equal('Texto de prueba');
        expect(cartaCriatura.valor).to.equal(8);
        expect(cartaCriatura.estadistica).to.deep.equal([3, 3]);
    });

    it('Convierte a JSON la clase', () => {
        const cartaCriaturaJSON = cartaCriatura.toJSON();
        expect(cartaCriaturaJSON).to.deep.equal({
            id: 1,
            nombre: 'Criatura de Prueba',
            coste: 4,
            color: 'verde',
            tipo: 'Criatura',
            rareza: 'comun',
            texto: 'Texto de prueba',
            valor: 8,
            fuerza: 3,
            vida: 3
        });
    });
});