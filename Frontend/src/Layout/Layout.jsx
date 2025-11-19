
import { Outlet } from 'react-router-dom'
import Header from '../componentes/header'

export default function Layout() {
  return (
    <>
    <Header/>
        <main className="mx-auto py-16">
            <Outlet/>
        </main>
    </>
  )
}