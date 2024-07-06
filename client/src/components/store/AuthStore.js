import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const initialState = {
    user: null,
    token: "",
    refreshToken: "",
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthStore(state, action) {
            if (action.payload.user) state.user = action.payload.user;
            if (action.payload.token) state.token = action.payload.token;
            if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken;
        },
        setDefault(state,action) {
            state.user = null;
            state.token = "";
            state.refreshToken = "";
        }
    }
})
const store = configureStore({
    reducer: authSlice.reducer
})
export const {setAuthStore,setDefault} = authSlice.actions;
export default function AuthStore(props) {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
};
