import { createContext, useContext, useReducer, useEffect } from 'react';

const InvoiceContext = createContext();

const initialState = {
  invoices: JSON.parse(localStorage.getItem('invoices')) || [],
  currentInvoice: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_INVOICE':
      return {
        ...state,
        invoices: [...state.invoices, action.payload]
      };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        )
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload)
      };
    case 'SET_CURRENT_INVOICE':
      return {
        ...state,
        currentInvoice: action.payload
      };
    case 'CLEAR_CURRENT_INVOICE':
      return {
        ...state,
        currentInvoice: null
      };
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
}

export const InvoiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('invoices', JSON.stringify(state.invoices));
    } catch (error) {
      console.error('Failed to save invoices to localStorage:', error);
    }
  }, [state.invoices]);

  const createInvoice = (invoice) => {
    try {
      const newInvoice = {
        ...invoice,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const updateInvoice = (invoice) => {
    try {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const deleteInvoice = (id) => {
    try {
      dispatch({ type: 'DELETE_INVOICE', payload: id });
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const setCurrentInvoice = (invoice) => {
    dispatch({ type: 'SET_CURRENT_INVOICE', payload: invoice });
  };

  const clearCurrentInvoice = () => {
    dispatch({ type: 'CLEAR_CURRENT_INVOICE' });
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices: state.invoices,
        currentInvoice: state.currentInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        setCurrentInvoice,
        clearCurrentInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
