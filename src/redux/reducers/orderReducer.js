import { SET_ORDER, SET_SALE_RETURN,RESET_ORDER,RESET_RETURN,SET_MSD_ACTIVITY,RESET_MSD_ACTIVITY } from '../actiontypes/orderActionType';
import { lightTheme, darkTheme } from '../../utils';



const initialState = {
    orderData: [],
    saleReturnData: [],
    msdActivityData: [],
    rejectedLeaves: [],
  };


  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ORDER:
        return {
          ...state,
          orderData: action.payload,  // Store the order data
        };

        case SET_SALE_RETURN: // New case for Sale Return
      return {
        ...state,
        saleReturnData: action.payload, // Store the sale return data
      };

      case SET_MSD_ACTIVITY: // New case for Sale Return
      return {
        ...state,
        msdActivityData: action.payload, // Store the MSD  data
      };

      case RESET_ORDER:
        return {
          ...state,
          orderData: [],  // Store the order data
        };
  
        case RESET_RETURN:
            return {
              ...state,
              saleReturnData: [],  // Store the order data
            };

            case RESET_MSD_ACTIVITY:
            return {
              ...state,
              msdActivityData: [],  // Store the order data
            };

            case "REJECT_LEAVE":
      return {
        ...state,
        rejectedLeaves: [...state.rejectedLeaves, ...action.payload], // Add rejected leave
      };
      
      default:
        return state;
    }
  };


