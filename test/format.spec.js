import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';

import format, {
    capitalize,
    presentation,
    stringifyRecipe,
    dropExtension
} from '../app/js/format';

describe('Capitalize', () => {
    it('should take in a word and return the same word capitalized', () => {
        const word = 'natac';
        const capWord = capitalize(word);
        expect(capWord).to.equal('Natac');
    });
});

describe('Main format function', () => {
    describe('Directions', () => {
        it('should provide a function that will split a string on a semicolon and return an Immutable-List', () => {
        const property = 'directions';
        const value = 'peel potatoes; wash them; cut; boil in water';
        const formatter = format(property);

        expect(formatter).to.be.ok;
        const directionsList = formatter(value);
        expect(List.isList(directionsList)).to.be.true;
        expect(directionsList.size).to.equal(4);

    });

        it('should capitalize the first letter of the word', () => {
            const property = 'directions';
            const value = 'peel potatoes; wash them; cut; boil in water';
            const formatter = format(property);
            const directionsList = formatter(value);

            expect(directionsList).to.equal(fromJS(['Peel potatoes', 'Wash them', 'Cut', 'Boil in water']))
        });

        it('should keep any F or C capitalized; when it follows a number.', () => {
            const property = 'directions';
            const value = 'peel potatoes; set oven to 375F; mash; enjoy!';
            const directionsList = format(property)(value);

            expect(directionsList).to.equal(List.of('Peel potatoes', 'Set oven to 375\u00B0F', 'Mash', 'Enjoy!'));
        });

        it('should take any version of the temperature letter following a number to be converted to a degree symbol and capital letter', () => {
            const value = 'create vegan pizza; turn oven to 350f; enjoy!';
            const directionsList = format('directions')(value);

            expect(directionsList).to.equal(List.of('Create vegan pizza', 'Turn oven to 350\u00B0F', 'Enjoy!'));
        })
    });

    describe('The ingredients', () => {
        it('should provide a function that will split on semicolon first then colon to build a List of Maps', () => {
            const property = 'ingredients';
            const value = 'bananas: 2; oatmeal: 3 scoops';
            const formatter = format(property);
            const ingredientsList = formatter(value);


            expect(formatter).to.be.ok;
            // expect(List.isList(ingredientsList)).to.be.true;
            expect(ingredientsList.size).to.equal(2);
        });

        it('should make ingredient items immutable Maps', () => {
            const property = 'ingredients';
            const value = 'bananas: 2; oatmeal: 3 scoops';
            const formatter = format(property);
            const ingredientsList = formatter(value);
            const [ itemA, itemB ] = ingredientsList;

            expect(Map.isMap(itemA)).to.be.true;
            expect(itemA.has('item')).to.be.true;
        });

        it('should capitalize the item name', () => {
            const property = 'ingredients';
            const value = 'bananas: 2; oatmeal: 3 scoops';
            const formatter = format(property);
            const ingredientsList = formatter(value);
            const [ itemA, itemB ] = ingredientsList;

            expect(itemA.get('item')).to.equal('Bananas')

        });

        it('should take in this avocado: 2; lemon juice: 1.5 tablespoon; Maple syrup: 1 tablespoon and return  and immutable List of Maps', () => {
            const property = 'ingredients';
            const value = 'avocado: 2; lemon juice: 1.5 tablespoon; Maple syrup: 1 tablespoon';
            const state = format(property)(value);
            expect(state).to.be.instanceof(List);
        })

    });

    describe('Edge cases', () => {
        it('should be giving the property, directions, and the string to format and return an List of directions', () => {
            const property = 'directions';
            const value = 'peel; boil them; enjoy';
            const directions = format(property)(value);
            expect(directions).to.be.instanceof(List);
            expect(directions.size).to.equal(3);
        });

        it('should have an tailing semicolon and not add an extra item to the the directions list', () => {
            const property = 'directions';
            const value = 'peel; boil them; enjoy;';
            const directions = format(property)(value);
            expect(directions.size).to.equal(3);
            expect(directions).to.equal(List.of('Peel', 'Boil them', 'Enjoy'));
        });

        it('should ignore any blank direction. Meaning a semicolon and nothing and semicolon', () => {
            const property = 'directions';
            const value = 'peel; ; enjoy;  ;';
            const directions = format(property)(value);
            expect(directions.size).to.equal(2);
        });

        it('should have an tailing semicolon and not add an extra item to the the directions list', () => {
            const property = 'ingredients';
            const value = 'bananas: 2; oatmeal: 3 scoops; apples: 4;'
            const ingredients = format(property)(value);
            expect(ingredients.size).to.equal(3);
        });
    });


});


describe('presentation function', () => {
    it('should take in a string and make presentable by trimming, capitalizing and normalizing the temp', () => {
        const state = 'turn oven to 350f';
        const nextState = presentation(state);
        expect(nextState).to.equal('Turn oven to 350\u00B0F')
    });
});



describe('Drop extension', () => {
    it('should drop the extension of test.js', () => {
        const state = 'test.js';
        const nextState = dropExtension(state);
        expect(nextState).to.equal('test');
    });

    it('should handle a file name with words separated by a \'.\'', () => {
        const state = 'core.test.js';
        const nextState = dropExtension(state);
        expect(nextState).to.equal('core.test');
    });

    it('should handle an extreme test of \'core.test.and.ONCE.again.scss\'', () => {
        const state = 'core.test.and.ONCE.again.scss';
        const nextState = dropExtension(state);
        expect(nextState).to.equal('core.test.and.ONCE.again');
    });
});
