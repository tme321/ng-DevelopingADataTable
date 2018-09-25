import { SelectionActionTypes } from "./selection.action-types";

export interface SelectionAction {
    payload?: any;
    readonly type: SelectionActionTypes;
}

export class InitSelections implements SelectionAction {
    readonly type = SelectionActionTypes.InitSelections;
}

export class SetSelections implements SelectionAction {
    readonly type = SelectionActionTypes.SetSelections;
    constructor(public payload: { selections: Array<boolean>}) {}
}

export class ToggleSelection implements SelectionAction {
    readonly type = SelectionActionTypes.ToggleSelection;
    constructor(public payload: { index: number }) {}
}

export class SetContiguous implements SelectionAction {
    readonly type = SelectionActionTypes.SetContiguous;
    constructor(public payload: { toIndex: number, prevIndex: number }) {}
}

export type SelectionActions = InitSelections | SetSelections | ToggleSelection | SetContiguous;
