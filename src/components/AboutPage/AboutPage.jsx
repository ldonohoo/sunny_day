import React from 'react';
import '../AboutPage/AboutPage.css'
// import listImage from '../../../public/images/IMG_7709_messy_lists.jpg'

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function AboutPage() {
  return (
    <div className="about-page">
      <h2 className="about-title lg-font">About Sunny Day</h2>
      <h3 className='about-text lg-font font-weight-med'>I <em>love</em> lists!</h3>
      <div className='list-img-box'>
        <img className='list-img'
            src={`../../../public/images/IMG_7709_messy_lists.jpg`} 
            alt="Messy pile of different lists jotted on different things" />
      </div>
      <p className='about-text med-lg-font'>I'm constantly jotting them down on everything.<br></br><br></br>  I use them to plan,
          to keep on track, to organize.<br></br><br></br>  I use them to offload worrying about
          all the things I need and want to do, and lets me focus on what's most 
          important!
      </p>
      <p className='about-text med-lg-font'>One thing I have noticed is that many things I would like to do or 
        really need to do depend on the weather:</p>
      <p className='about-last-qs med-lg-font'><span className='italic'>Wouldn't it be nice if: </span> I could see the weather forecast right where 
        I was planning my week?<br></br><br></br>
        <span className='italic'>Wouldn't it be even nice if: </span>  I had some help looking through my lists
        and deciding what to do and when to do it?
      </p>
      <h3 className='about-ending lg-font font-weight-med'>This was my inspiration for Sunny Day!</h3>
      <section className='tech-section lg-font font-weight-med'>
        <h3>Technologies Used:</h3>
        <h4 className='font-weight-med'>Dnd-kit drag-and-drop library</h4>
        <h4 className='font-weight-med'>Visual Crossing Weather API</h4>
        <h4 className='font-weight-med'>OpenAI completions endpoint API</h4>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </section>
    </div>
  );
}

export default AboutPage;
