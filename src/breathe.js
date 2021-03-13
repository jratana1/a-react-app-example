import React from 'react'
import styled, { keyframes } from 'styled-components'
const Breathe = () => {
 return (
  <Container>
   <Circle />
   <Rotate>&lt; 💅🏾 &gt;</Rotate>
  </Container>
 )
}
export default Breathe

const breatheAnimation = keyframes`
 0% { height: 100px; width: 100px; }
 30% { height: 400px; width: 400px; opacity: 1 }
 40% { height: 405px; width: 405px; opacity: 0.3; }
 100% { height: 100px; width: 100px; opacity: 0.6; }
`
const Circle = styled.div`
 height: 100px;
 width: 100px;
 border-style: solid;
 border-width: 5px;
 border-radius: 50%;
 border-color: black;
 animation-name: ${breatheAnimation};
 animation-duration: 8s;
 animation-iteration-count: infinite;
`
const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 height: 450px;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

// Here we create a component that will rotate everything we pass in over two seconds
const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;
const Heading = keyframes`
  0% { top: -3.125em; }
  10% { top: 3em;}
  100% { top: -6.125em; }
  `;

const HomeDiv = styled.div`
  min-height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
`;

const HomeHeader = styled.div`
  h1 {
    font-weight: lighter;
  }
  position: relative;
  top: 0;
  animation: ${Heading};
  animation-duration: 3s;
  animation-fill-mode: forwards;
`;

export const Home = () => (
  <HomeDiv>
    <HomeHeader>
      <h1>Welcome to Freight Mule</h1>
    </HomeHeader>
  </HomeDiv>
);



