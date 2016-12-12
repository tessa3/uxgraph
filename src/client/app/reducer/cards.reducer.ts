import { ActionReducer, Action } from '@ngrx/store';



export const ADD_CARDS = 'ADD_CARDS';


export interface CardsAction extends Action {
  payload: Card[];
}

export const cardsReducer:
    ActionReducer<Card[]> = (state: Card[] = [], action: CardsAction) => {
  switch (action.type) {
    case ADD_CARDS:
      return state.concat(action.payload);
    default:
      return state;
  }
};
