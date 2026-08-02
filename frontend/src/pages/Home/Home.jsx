import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import PopularProjects from '../../components/PopularProjects/PopularProjects'
const Home = () => {
  return (
    <div>
      <Header/>
      <PopularProjects/>
    </div>
  )
}

export default Home
