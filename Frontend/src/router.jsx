import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inicio from './componentes/Inicio'
import Contacto from './componentes/Contacto'
import Convocatorias from './componentes/Convocatorias'   
import Layout from './Layout/Layout'


export default function AppRouter() {
  return (
    <BrowserRouter>
    <Routes>
             <Route element={<Layout/>}>
                <Route path="/" element={<Inicio/>} index/>
                <Route path="/Contacto" element={<Contacto/>} index/>
                <Route path="/Convocatorias" element={<Convocatorias/>} index/>
             </Route>
        </Routes>
    </BrowserRouter>
  )
}