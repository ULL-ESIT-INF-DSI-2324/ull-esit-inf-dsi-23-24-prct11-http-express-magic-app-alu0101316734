import "mocha"
import {expect} from "chai"
import { Carta_Planeswalker } from '../../src/Cartas/Carta_Planeswalker.js';


describe('Cartas de Planeswalker Class', () => {
    const cartaPlaneswalker = new Carta_Planeswalker(1, 'Planeswalker de Prueba', 5, 'azul', 'Planeswalker', 'rara', 'Texto de prueba', 15, 4);


    it('Crea sus inistacias y sus gets correctamnete', () => {
        expect(cartaPlaneswalker).to.be.instanceOf(Carta_Planeswalker);
        expect(cartaPlaneswalker.ID).to.equal(1);
        expect(cartaPlaneswalker.nombre).to.equal('Planeswalker de Prueba');
        expect(cartaPlaneswalker.coste).to.equal(5);
        expect(cartaPlaneswalker.color).to.equal('azul');
        expect(cartaPlaneswalker.tipo).to.equal('Planeswalker');
        expect(cartaPlaneswalker.rareza).to.equal('rara');
        expect(cartaPlaneswalker.texto).to.equal('Texto de prueba');
        expect(cartaPlaneswalker.valor).to.equal(15);
        expect(cartaPlaneswalker.lealtad).to.equal(4);
    });


    it('Convierte a JSON la clase', () => {
        const cartaPlaneswalkerJSON = cartaPlaneswalker.toJSON();
        expect(cartaPlaneswalkerJSON).to.deep.equal({
            id: 1,
            nombre: 'Planeswalker de Prueba',
            coste: 5,
            color: 'azul',
            tipo: 'Planeswalker',
            rareza: 'rara',
            texto: 'Texto de prueba',
            valor: 15,
            lealtad: 4
        });
    });
});