import { selectionReducer } from './selection.reducer';
import { InitSelections, SetSelections, ToggleSelection, SetContiguous } from './selection.actions';

describe('selectionReducer', () => {
    let selection: boolean[];

    beforeEach(() => {
        selection = selectionReducer(null,new InitSelections());
    });

    it('initializes to an empty array', ()=>{
        expect(selection).toEqual([]);
    });

    it('can be set', ()=>{
        selection = selectionReducer(selection,new SetSelections({selections: [true,false]}));
        expect(selection).toEqual([true,false]);
    });

    it('can be toggled', ()=>{
        selection = selectionReducer(selection,new SetSelections({selections: [true,false]}));

        selection = selectionReducer(selection,new ToggleSelection({index: 0}));
        expect(selection).toEqual([false,false]);

        selection = selectionReducer(selection,new ToggleSelection({index: 1}));
        expect(selection).toEqual([false,true]);
    });

    it('can set a slice', ()=>{
        selection = selectionReducer(selection,new SetSelections({selections: [false,false,false,true,false,false]}));

        selection = selectionReducer(selection,new SetContiguous({ toIndex: 4, prevIndex: 2 }));
        expect(selection).toEqual([false,false,true,true,true,false]);
    });

});
