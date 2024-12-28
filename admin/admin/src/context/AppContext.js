import { createContext } from 'react';
export const AppContext=createContext()

const Appcontextprovide=({children})=>{
    const value={

    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default Appcontextprovide;