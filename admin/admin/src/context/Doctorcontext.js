import { createContext } from 'react';

export const DoctorContext=createContext()

const Doctorcontextprovide=({children})=>{
    const value={

    }
    return(
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
}

export default Doctorcontextprovide;