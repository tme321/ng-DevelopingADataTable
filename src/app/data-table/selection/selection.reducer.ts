import { SelectionActions } from "./selection.actions";
import { SelectionActionTypes } from "./selection.action-types";

export function selectionReducer(selections:Array<boolean>, action: SelectionActions) {
    switch(action.type) {
        case SelectionActionTypes.InitSelections: {
            return [];
        }
        case SelectionActionTypes.SetSelections: { 
            return action.payload.selections;
        }
        case SelectionActionTypes.ToggleSelection: {
            const index = action.payload.index;
            const newSelections = [...selections]; 
            newSelections[index] = !newSelections[index];
            return newSelections;
        }
        case SelectionActionTypes.SetContiguous: {
            const min = Math.min(action.payload.prevIndex,action.payload.toIndex);
            const max = Math.max(action.payload.prevIndex,action.payload.toIndex);
            const newSelections = [...selections]; 
            for(let i=min;i<=max;i++) {
                newSelections[i] = true;
            }
            return newSelections;
        }
        default: {
            return selections;
        }
    }
}
